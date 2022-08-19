import {all, call, delay, put, race, select, take, takeEvery} from 'redux-saga/effects';
import {
    CREATE_QAR_RESULT_REQUEST,
    CREATE_QAR_RESULT_REQUEST_FAILURE,
    CREATE_QAR_RESULT_REQUEST_SUCCESS,
    GET_ALL_RESULTS_REQUEST,
    GET_ALL_RESULTS_REQUEST_FAILURE,
    GET_ALL_RESULTS_REQUEST_SUCCESS,
    RESULT_SLOW_OR_OFFLINE,
    RESULTS_SYNCHED,
} from "./actions";
import {getRemoteResultByRequestIds, upsertQarResultsRemotelyFb} from "./result_firebase_queries";
import {COMPLETED_QAR, TIMEOUT_SECONDS} from "../../core/utils/constants";
import {OFFLINE, SEND_NOTIFICATION} from "../user/actions";
import {QAR_UPDATE_STATUS_REQUEST, UPSERT_QAR_REQUEST_SUCCESS} from "../qar_listing/actions";
import {UPLOAD_QAP_DATA_REQUEST} from "../qap-data/actions";
import {Strings} from "../../core/utils";


/**
 * Saga to fetch multiple results by request ids.
 * @param action with the payload
 * @returns a dispatch function to trigger and action.
 */
function* getResultByRequestIdsSaga(action) {

    try {
        const {qar_results, reachable} = yield select();

        if ((qar_results !== undefined)
            && (qar_results.results_to_sync !== undefined)
            && (qar_results.results_to_sync.length > 0)) {
            const [response, timeout, offline] = yield race([
                reachable.isConnected && all(qar_results.results_to_sync.map((result) => {
                    return call(upsertQarResultsRemotelyFb, result);
                })),
                delay(TIMEOUT_SECONDS),
                take(OFFLINE)
            ])

            if (response) {
                yield put({type: RESULTS_SYNCHED})
            }
        }

        const [fetched_results, timeout, offline] = yield race([
            call(getRemoteResultByRequestIds, action.request_ids),
            delay(TIMEOUT_SECONDS),
            take(OFFLINE)
        ])

        //results based on the current qars assigned to the user
        if (fetched_results) {
            yield put({
                type: GET_ALL_RESULTS_REQUEST_SUCCESS,
                payload: fetched_results
            })
        } else {
            yield put({
                type: RESULT_SLOW_OR_OFFLINE,
                payload: undefined
            })
        }
    } catch (e) {
        console.log(e)
        yield put({
            type: GET_ALL_RESULTS_REQUEST_FAILURE,
            error: e
        })
    }
}

/**
 * Saga to create a qar result.
 * @param action with the payload
 * @returns a dispatch function to trigger and action.
 */
function* createResultSaga(action) {
    /*
    * 1. save the result to server
    * 2. save the data to the server
    * 3. update the qar status to 2 (completed)
    * 4. send notification to buyer
    * 5. redirect to home
    * */
    try {
        const {reachable} = yield select();

        // 1. save the result to server
        const [response, timeout, offline] = yield race([
            reachable.isConnected && call(upsertQarResultsRemotelyFb, action.payload),
            delay(TIMEOUT_SECONDS),
            take(OFFLINE)
        ])

        if (offline || timeout || !response) {
            yield put({
                type: RESULT_SLOW_OR_OFFLINE,
                payload: action.payload
            })
        }

        //2. save the data to the server
        yield put({
            type: UPLOAD_QAP_DATA_REQUEST,
            payload: action.dataset
        })

        //3. update the qar status to 2 (completed)
        yield put({
            type: QAR_UPDATE_STATUS_REQUEST,
            payload: {
                request_id: action.payload.request_id,
                status: COMPLETED_QAR,
                progress: 1, //completed
                remote_update: true,
            }
        })

        //4. send notification to buyer
        yield put({
            type: SEND_NOTIFICATION,
            payload: action.notification_data
        })

        //wait for the UPSERT_QAR_REQUEST_SUCCESS action
        yield take(UPSERT_QAR_REQUEST_SUCCESS)

        // save result to the redux store.
        yield put({
            type: CREATE_QAR_RESULT_REQUEST_SUCCESS,
            payload: action.payload
        })

        //5. redirect to home
        yield action.navigation.reset({
            index: 0,
            routes: [{name: Strings.HOME_SCREEN_NAME}],
        });

    } catch (e) {
        console.log(e)
        yield put({
            type: CREATE_QAR_RESULT_REQUEST_FAILURE,
            error: e
        })
    }
}

function* handler() {
    yield all([
        takeEvery(GET_ALL_RESULTS_REQUEST, getResultByRequestIdsSaga),
        takeEvery(CREATE_QAR_RESULT_REQUEST, createResultSaga),
    ])
}

export {handler}
