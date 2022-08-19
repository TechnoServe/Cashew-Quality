import {all, call, delay, put, race, select, take, takeEvery} from 'redux-saga/effects';
import {
    CREATE_QAR_SITE_REQUEST_FAILURE,
    CREATE_QAR_SITE_REQUEST_SUCCESS,
    GET_SITE_BY_ID_REQUEST,
    GET_SITE_BY_ID_REQUEST_FAILURE,
    GET_SITE_BY_ID_REQUEST_SUCCESS,
    SITE_SLOW_OR_OFFLINE,
    SITES_SYNCED,
} from "./actions";
import {getRemoteSitesByIds, upsertRemoteSite,} from "./site_firabase_queries";
import {TIMEOUT_SECONDS} from "../../core/utils/constants";
import {OFFLINE} from "../user/actions";


/**
 * Saga to fetch multiple sites by their ids.
 * @param action with the payload
 * @returns a dispatch function to trigger and action.
 */
function* getSiteByIdsSaga(action) {
    try {
        const {qar_sites, reachable} = yield select();

        if ((qar_sites !== undefined)
            && (qar_sites.sites_to_sync !== undefined)
            && (qar_sites.sites_to_sync.length > 0)) {
            const [response, timeout, offline] = yield race([
                reachable.isConnected && all(qar_sites.sites_to_sync.map((site) => {
                    return call(upsertRemoteSite, site)
                })),
                delay(TIMEOUT_SECONDS),
                take(OFFLINE)
            ])

            if (response) {
                yield put({type: SITES_SYNCED})
            }
        }

        //
        const [sites, timeout, offline] = yield race([
            call(getRemoteSitesByIds, action.site_ids),
            delay(TIMEOUT_SECONDS),
            take(OFFLINE)
        ])

        /* Sites based on the current QARs assigned to the user. */
        if (sites) {
            yield put({
                type: GET_SITE_BY_ID_REQUEST_SUCCESS,
                payload: sites
            })
        } else {
            yield put({
                type: SITE_SLOW_OR_OFFLINE,
                payload: undefined
            })
        }
    } catch (e) {
        console.log(e)
        yield put({
            type: GET_SITE_BY_ID_REQUEST_FAILURE,
            error: e
        })
    }
}


/**
 * Saga to create a qar site.
 * @param action with the payload
 * @returns a dispatch function to trigger and action.
 */

function* createSiteSaga(action) {

    try {
        const {reachable} = yield select();

        /* sites based on the current qars assigned to the user */
        const [response, timeout, offline] = yield race([
            reachable.isConnected && call(upsertRemoteSite, action),
            delay(TIMEOUT_SECONDS),
            take(OFFLINE)
        ])

        if (offline || timeout || !response) {
            yield put({
                type: SITE_SLOW_OR_OFFLINE,
                payload: action
            })
        }

        yield put({
            type: CREATE_QAR_SITE_REQUEST_SUCCESS,
            payload: action
        })
    } catch (e) {
        console.log("site creation error ==>", e)
        yield put({
            type: CREATE_QAR_SITE_REQUEST_FAILURE,
            error: e
        })
    }
}

function* getAllSitesSaga() {
    try {

    } catch (e) {

    }
}


function* handler() {
    yield all([
        takeEvery(GET_SITE_BY_ID_REQUEST, getSiteByIdsSaga),
        // takeEvery(GET_ALL_SITES_REQUEST, getAllSitesSaga)
    ])
}


export {handler, createSiteSaga, getSiteByIdsSaga}
