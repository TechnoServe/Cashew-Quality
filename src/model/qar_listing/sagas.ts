import {find} from "lodash";
import {all, call, delay, put, race, select, take, takeEvery} from 'redux-saga/effects';
import {Strings} from "../../core/utils";
import {TIMEOUT_SECONDS} from "../../core/utils/constants";
import {GET_QAP_DATA_BY_QAR_ID_REQUEST, GET_QAP_DATA_BY_QAR_ID_REQUEST_SUCCESS} from "../qap-data/actions";
import {GET_ALL_RESULTS_REQUEST, GET_ALL_RESULTS_REQUEST_SUCCESS} from "../result/actions";
import {GET_SITE_BY_ID_REQUEST, GET_SITE_BY_ID_REQUEST_SUCCESS} from "../site/actions";
import {createSiteSaga} from "../site/sagas";
import {GET_USER_BY_ID_REQUEST, GET_USER_BY_ID_REQUEST_SUCCESS, OFFLINE, SEND_NOTIFICATION} from "../user/actions";
import {
    GET_QARS_REQUEST,
    GET_QARS_REQUEST_FAILURE,
    GET_QARS_REQUEST_SUCCESS,
    QAR_SLOW_OR_OFFLINE,
    QAR_UPDATE_STATUS_REQUEST,
    QARS_SYNCHED,
    UPSERT_NEW_QAR_REQUEST,
    UPSERT_QAR_REQUEST_FAILURE,
    UPSERT_QAR_REQUEST_SUCCESS
} from "./actions";
import {getQarListingByUserIdAndTypeFb, updateQarStatusFb, upsertQarListingRemotelyFb} from "./qar_firebase_queries";
import {createQarDisplay} from "./QarModel";
import {createUserFb} from "../user/firebase_calls";


/* TODO: make a synchronisation saga */
function* getQarsSaga(action) {

    try {
        const logged_user = action.payload

        const user_id = logged_user._id;
        const user_type = logged_user.user_type;
        const filter_user = user_type === 1 ? "field_tech" : "buyer";

        const {qar_listing, reachable} = yield select(); // get qar store state

        /* If some QARs were not updated to server. */
        if (qar_listing.qars_to_sync.length > 0) {
            const [response, offline, timeout] = yield race([
                reachable.isConnected && all(qar_listing.qars_to_sync.map((qar) => {
                    return call(upsertQarListingRemotelyFb, qar)
                })),
                delay(TIMEOUT_SECONDS),
                take(OFFLINE)
            ])

            if (response) {
                yield put({type: QARS_SYNCHED})
            }
        }

        /* Race to display QARs. */
        const [raw_qars_array, timeout, offline] = yield race([
            reachable.isConnected && call(getQarListingByUserIdAndTypeFb, {user_id, filter_user}),
            delay(TIMEOUT_SECONDS),
            take(OFFLINE)
        ])

        /* If online... */
        if (raw_qars_array) {
            let display_qars_array = []
            //get other user info
            if (raw_qars_array.length > 0) {
                let site_ids = []
                let user_ids = []
                let request_ids = []

                for (const qar in raw_qars_array) {
                    if (raw_qars_array.hasOwnProperty(qar)) {
                        filter_user === "field_tech" ? user_ids.push(raw_qars_array[qar].buyer) : user_ids.push(raw_qars_array[qar].field_tech)
                        site_ids.push(raw_qars_array[qar].site)
                        request_ids.push(raw_qars_array[qar]._id)
                    }
                }

                //sync users, sites, results and qap_data
                yield all([
                    put({type: GET_USER_BY_ID_REQUEST, user_ids}),
                    put({type: GET_SITE_BY_ID_REQUEST, site_ids}),
                    put({type: GET_QAP_DATA_BY_QAR_ID_REQUEST, request_ids}),
                    put({type: GET_ALL_RESULTS_REQUEST, request_ids}),
                ])

                yield all([
                    take(GET_SITE_BY_ID_REQUEST_SUCCESS),
                    take(GET_USER_BY_ID_REQUEST_SUCCESS),
                    take(GET_QAP_DATA_BY_QAR_ID_REQUEST_SUCCESS),
                    take(GET_ALL_RESULTS_REQUEST_SUCCESS),
                ])

                const {qar_users, qar_sites, qap_data} = yield select();

                raw_qars_array.forEach(qar => {

                    display_qars_array.push(createQarDisplay({
                        qar_users,
                        qar_sites,
                        qar,
                        logged_user,
                        qap_data,
                        qars_to_sync: qar_listing.qars_to_sync
                    }));
                })
            }

            /* When everything went well. */
            yield put({
                type: GET_QARS_REQUEST_SUCCESS,
                display_qars: display_qars_array,
                raw_qars: raw_qars_array
            })
        } else {
            yield call(saveOfflineQar, undefined, undefined, undefined)
        }

    } catch (e) {
        console.log("Saga error getting qar_listing =>", e);
        yield put({
            type: GET_QARS_REQUEST_FAILURE,
            error: e,
        })
    }
}

function* createNewQarSaga(action) {

    /* TODO: Smooth dispatching of actions is not done well... a quick tweak is used. */
    try {
        const {reachable} = yield select()
        const {qar, logged_user, navigation} = action.payload
        const user_type = logged_user.user_type

        let new_qar_display = {
            _id: qar._id,
            request_code: qar.request_code,
            field_tech_obj: user_type === 1 ? logged_user : action.fetchedUser,
            buyer_obj: user_type === 2 ? logged_user : action.fetchedUser,
            site_obj: action.siteInfo,
            status: qar.status,
            due_date: qar.due_date,
            created_at: qar.created_at,
            progress: 0,
        }

        /* Race to get the winner... connectivity issue will be handled */
        const [response, timeout, offline] = yield race([
            reachable.isConnected && call(upsertQarListingRemotelyFb, qar),
            delay(TIMEOUT_SECONDS),
            take(OFFLINE)
        ])

        if (response) {
            new_qar_display['to_be_synced'] = false;

            yield put({
                type: UPSERT_QAR_REQUEST_SUCCESS,
                display_qar: new_qar_display,
                raw_qar: qar
            })

            /* Send notification to the field-tech */
            if (user_type === 2) {
                yield put({
                    type: SEND_NOTIFICATION,
                    payload: action.notification_data
                })
            }
        } else {
            yield call(saveOfflineQar, new_qar_display, qar)
        }

        yield navigation.reset({
            index: 0,
            routes: [{name: Strings.HOME_SCREEN_NAME}],
        });
    } catch (e) {
        console.log("something is wrong => ", e)
        yield put({
            type: UPSERT_QAR_REQUEST_FAILURE,
            error: "Something went wrong creating QAR, Please try again"
        })
    }
}


/**
 * Saga to update QAR status.
 * @param action dispatched from addStepDataSaga
 */

function* updateQarStatus(action) {

    const {qar_listing, reachable} = yield select()
    const now = (new Date()).toISOString()

    let display_qar_to_update = find(qar_listing.display_qars, {'_id': action.payload.request_id})
    let raw_qar_to_update = find(qar_listing.raw_qars, {'_id': action.payload.request_id})

    /* Updating the status. */
    display_qar_to_update.status = action.payload.status
    display_qar_to_update.progress = action.payload.progress
    display_qar_to_update.updated_at = now

    raw_qar_to_update.status = action.payload.status
    raw_qar_to_update.updated_at = now

    /* If is from initial page => make a remote call. */
    if (action.payload.remote_update) {
        const [response, timeout, offline] = yield race([
            reachable.isConnected && call(updateQarStatusFb, {
                qar_id: raw_qar_to_update._id,
                status_code: raw_qar_to_update.status,
                updated_at: raw_qar_to_update.updated_at
            }),
            delay(TIMEOUT_SECONDS),
            take(OFFLINE)
        ])

        if (!response || timeout || offline) {
            //save to the sync queue
            yield call(saveOfflineQar, display_qar_to_update, raw_qar_to_update)
        }
    }
    yield put({
        type: UPSERT_QAR_REQUEST_SUCCESS,
        display_qar: display_qar_to_update,
        raw_qar: raw_qar_to_update
    })
}


/**
 * Saga to save offline QAR for later synchronization
 * @param display_qar - for display
 * @param raw_qar - to be added to sync queue
 * @returns put effect to alter the store according.
 */

function* saveOfflineQar(display_qar, raw_qar) {
    if (display_qar) {
        display_qar.to_be_synced = true
    }
    yield put({
        type: QAR_SLOW_OR_OFFLINE,
        new_offline_raw_qar: raw_qar,
        new_offline_display_qar: display_qar,
        new_to_be_synced_qar: raw_qar,
    })
}


function* saveUserAndSite(action) {

    /* First, save the site and user */
    if (action.payload.qar.buyer === null) {
        /* Buyer object is null. Scenario where no phone number for buyer was provided (only country code), when
        * filling in form for New QAR. skip creating a partial user*/
        yield call(createSiteSaga, action.siteInfo)
    } else {
        yield all([
            call(createUserFb, {userModel: action.fetchedUser}),
            call(createSiteSaga, action.siteInfo)
        ])
    }

    yield call(createNewQarSaga, action) // Then call the creating of the new qar.
}


function* handler() {
    yield all([
        takeEvery(GET_QARS_REQUEST, getQarsSaga),
        takeEvery(UPSERT_NEW_QAR_REQUEST, saveUserAndSite),
        takeEvery(QAR_UPDATE_STATUS_REQUEST, updateQarStatus)
    ])
}

export {handler}
