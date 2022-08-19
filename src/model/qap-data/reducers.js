import {
    CREATE_QAP_DATA_REQUEST,
    CREATE_QAP_DATA_REQUEST_FAILURE,
    CREATE_QAP_DATA_REQUEST_SUCCESS,
    GET_QAP_DATA_BY_QAR_ID_REQUEST,
    GET_QAP_DATA_BY_QAR_ID_REQUEST_FAILURE,
    GET_QAP_DATA_BY_QAR_ID_REQUEST_SUCCESS,
    QAP_DATA_SLOW_OR_OFFLINE,
    QAP_DATA_SYNCED,
    UPSERT_QAP_DATA_REQUEST,
    UPSERT_QAP_DATA_REQUEST_FAILURE,
    UPSERT_QAP_DATA_REQUEST_SUCCESS
} from "./actions";
import {compact, uniqBy} from "lodash";

const initialResultsState = {
    all_data: [],
    data_to_sync: [],
    in_progress: false,
    is_uploading: false,
    error: null
}

const qapDataReducer = (state = initialResultsState, action) => {
    switch (action.type) {
        // create local qap_data - step data
        case UPSERT_QAP_DATA_REQUEST:
            return {
                ...state,
                in_progress: action.in_progress,
                is_uploading: action.is_uploading,
                error: null
            }
        case UPSERT_QAP_DATA_REQUEST_SUCCESS:
            return {
                ...state,
                in_progress: false,
                is_uploading: false,
                all_data: uniqBy([action.payload, ...state.all_data], 'request_id')
            }
        case UPSERT_QAP_DATA_REQUEST_FAILURE:
            return {
                ...state,
                in_progress: false,
                is_uploading: false,
                error: action.payload
            }

        // get remote qap by request_id
        case GET_QAP_DATA_BY_QAR_ID_REQUEST:
            return {
                ...state,
                in_progress: true,
                error: null,
            }
        case GET_QAP_DATA_BY_QAR_ID_REQUEST_SUCCESS:
            return {
                ...state,
                in_progress: false,
                all_data: action.payload,
                error: null,
            }
        case GET_QAP_DATA_BY_QAR_ID_REQUEST_FAILURE:
            return {
                ...state,
                in_progress: false,
                error: action.error
            }

        case CREATE_QAP_DATA_REQUEST:
            return {
                ...state,
                in_progress: true,
                error: null,
            }
        case CREATE_QAP_DATA_REQUEST_SUCCESS:
            return {
                ...state,
                in_progress: false,
            }
        case CREATE_QAP_DATA_REQUEST_FAILURE:
            return {
                ...state,
                in_progress: false,
                error: action.error
            }

        // when there is connectivity issue
        case QAP_DATA_SLOW_OR_OFFLINE:
            return {
                ...state,
                in_progress: false,
                is_uploading: false,
                all_data: uniqBy(compact([action.payload, ...state.all_data]), 'request_id'),
                data_to_sync: uniqBy(compact([action.payload, ...state.data_to_sync]), 'request_id'),
            }
        // when everything is synced
        case QAP_DATA_SYNCED:
            return {
                ...state,
                data_to_sync: []
            }
        default:
            return state
    }
}

export {qapDataReducer}