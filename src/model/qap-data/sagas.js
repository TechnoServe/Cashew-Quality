import {all, call, delay, put, race, select, take, takeLatest} from 'redux-saga/effects';
import {
    CREATE_QAP_DATA_REQUEST_FAILURE,
    CREATE_QAP_DATA_REQUEST_SUCCESS,
    GET_QAP_DATA_BY_QAR_ID_REQUEST,
    GET_QAP_DATA_BY_QAR_ID_REQUEST_FAILURE,
    GET_QAP_DATA_BY_QAR_ID_REQUEST_SUCCESS,
    QAP_DATA_SLOW_OR_OFFLINE,
    QAP_DATA_SYNCED,
    UPLOAD_QAP_DATA_REQUEST,
    UPSERT_QAP_DATA_REQUEST,
    UPSERT_QAP_DATA_REQUEST_SUCCESS,
} from "./actions";
import {find} from "lodash";
import {uploadImages} from "../../controller/qar_controller/qap_data_controller";
import {IN_PROGRESS_QAR, TIMEOUT_SECONDS, TIMEOUT_SECONDS_LONG} from "../../core/utils/constants";
import {QAR_UPDATE_STATUS_REQUEST} from "../qar_listing/actions";
import {getProgress} from "../qar_listing/QarModel";
import {getRemoteQapDataByRequestIds, upsertRemoteQapDataFb} from "./qap_service_firebase_queries";
import {Strings} from "../../core/utils";
import {OFFLINE} from "../user/actions";
import {getImageDir, getImageName, makeImagePath} from "../../core/utils/data";
import * as FileSystem from "expo-file-system";
import {getDirImages} from "../../controller/qar_controller/qar_images_controller";


/**
 * Saga to fetch multiple qap_data by their ids.
 * @param action with the payload
 * @returns a dispatch function to trigger and action.
 */
function* getQapDataByRequestIdsSaga(action) {
    try {
        const {qap_data, reachable} = yield select();

        if (qap_data.data_to_sync.length > 0) {
            const [response, timeout, offline] = yield race([
                reachable.isConnected && all(qap_data.data_to_sync.map((qap_data) => {
                    //upload related images as well
                    return call(pushDataToServer, {payload: qap_data})
                })),
                delay(TIMEOUT_SECONDS_LONG),
                take(OFFLINE)
            ])

            if (response) {
                yield put({type: QAP_DATA_SYNCED})
            }
        }

        //
        const [fetched_qap_data, timeout, offline] = yield race([
            call(getRemoteQapDataByRequestIds, action.request_ids),
            delay(TIMEOUT_SECONDS),
            take(OFFLINE)
        ])

        //qap_data based on the current qars assigned to the user
        if (fetched_qap_data) {
            yield put({
                type: GET_QAP_DATA_BY_QAR_ID_REQUEST_SUCCESS,
                payload: fetched_qap_data
            })
        } else {
            yield put({
                type: QAP_DATA_SLOW_OR_OFFLINE,
                payload: undefined
            })
        }
    } catch (e) {
        console.log(e)
        yield put({
            type: GET_QAP_DATA_BY_QAR_ID_REQUEST_FAILURE,
            error: e
        })
    }
}

/**
 * Saga to create a qar qap_data.
 * @param action with the payload
 * @returns a dispatch function to trigger and action.
 */
function* addStepDataSaga(action) {
    try {
        const {all_data} = yield select((state) => state.qap_data)
        let current_dataset = find(all_data, ['request_id', action.payload.request_id])
        const new_dataset = current_dataset ? Object.assign(current_dataset, action.payload) : action.payload;

        //start saving qap data and update the qar status
        yield put({
            type: QAR_UPDATE_STATUS_REQUEST,
            payload: {
                request_id: action.payload.request_id,
                status: IN_PROGRESS_QAR,
                progress: getProgress(new_dataset),
                remote_update: action.is_initial,
            }
        })

        //check if the step has an image, then save it locally.
        if (action.image_uri) {
            //add image to local
            yield call(saveToLocal, action.image_uri, action.payload.request_id, action.step_name)
        }

        //for the next button
        if (action.next_button) {
            yield action.navigation.navigate(action.next_button, {
                request: action.request
            })
        }

        //for resume late button and pushing together with the result
        if (action.resume_later) {
            yield call(pushDataToServer, {payload: new_dataset})
            // navigate to home
            yield action.navigation.reset({
                index: 0,
                routes: [{name: Strings.HOME_SCREEN_NAME}],
            });
        }

        //when everything is done... save data to store
        yield put({
            type: UPSERT_QAP_DATA_REQUEST_SUCCESS,
            payload: new_dataset
        })

    } catch (e) {
        console.log(e.message)
        yield put({
            type: CREATE_QAP_DATA_REQUEST_FAILURE,
            error: "Something went wrong creating QAP Data"
        })
    }
}

/**
 * Save a captured image to a local file uri
 * */
function* saveToLocal(uri, request_id, step_name) {

    const folder = yield getImageDir(request_id)

    let timestamp = new Date().valueOf();
    let cached_image = yield FileSystem.getInfoAsync(uri)

    if (cached_image.exists) {
        //delete a file
        let image_arr = []
        let img_dir = yield FileSystem.readDirectoryAsync(folder);
        for (let file of img_dir) {
            if (file.includes(step_name)) {
                image_arr.push(file)
            }
        }

        if (image_arr[0] !== getImageName(uri)) {
            yield FileSystem.deleteAsync(folder + image_arr[0], {idempotent: true})

            //we add time_stamp to avoid images returned by caches
            const new_image = yield makeImagePath(folder, step_name + timestamp)

            yield FileSystem.moveAsync({from: uri, to: new_image});

            return new_image
        }
    }

    return null
}


function* pushDataToServer(action) {
    const reachable = yield select((state) => state.reachable)
    try {
        //upload data to server
        const [response, offline, timeout] = yield race([
            reachable.isConnected && call(upsertRemoteQapDataFb, action.payload),
            take(OFFLINE),
            delay(TIMEOUT_SECONDS)
        ])

        if (!response || offline || timeout) {
            //save to data_to_be_synced
            yield put({
                type: QAP_DATA_SLOW_OR_OFFLINE,
                payload: action.payload
            })
        }

        //start uploading images if the folder is not empty
        if (response) {
            const localImages = yield call(getDirImages, action.payload.request_id)
            if (localImages.length > 0) {
                // start a race for uploading images
                const [response, offline, timeout] = yield race([
                    reachable.isConnected && call(uploadImages, action.payload.request_id, localImages),
                    take(OFFLINE),
                    delay(TIMEOUT_SECONDS_LONG)
                ])

                if (!response || offline || timeout) {
                    //throw an error for failed upload
                    throw new Error("Images Could not be successfully uploaded to the server")
                }
            }
        }

        yield put({type: CREATE_QAP_DATA_REQUEST_SUCCESS})
    } catch (e) {
        console.log(e)
        yield put({
            type: CREATE_QAP_DATA_REQUEST_FAILURE,
            error: e.message
        })
    }
}


function* handler() {
    yield all([
        takeLatest(GET_QAP_DATA_BY_QAR_ID_REQUEST, getQapDataByRequestIdsSaga),
        takeLatest(UPSERT_QAP_DATA_REQUEST, addStepDataSaga),
        takeLatest(UPLOAD_QAP_DATA_REQUEST, pushDataToServer),
        // takeEvery("UPLOAD_IMAGES_REQUEST", uploadImagesSaga),
    ])
}

export {handler}