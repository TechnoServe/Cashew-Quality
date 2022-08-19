import {
    CREATE_QAR_RESULT_REQUEST,
    CREATE_QAR_RESULT_REQUEST_FAILURE,
    CREATE_QAR_RESULT_REQUEST_SUCCESS,
    GET_ALL_RESULTS_REQUEST,
    GET_ALL_RESULTS_REQUEST_FAILURE,
    GET_ALL_RESULTS_REQUEST_SUCCESS,
    RESULT_SLOW_OR_OFFLINE,
    RESULTS_SYNCHED
} from "./actions";
import {compact, uniqBy} from "lodash";

const initialResultsState = {
    all_results: [],
    results_to_sync: [],
    in_progress: false,
    error: null
}

const qarResultReducer = (state = initialResultsState, action) => {
    switch (action.type) {
        //get result information
        case GET_ALL_RESULTS_REQUEST:
            return {
                ...state,
                in_progress: true,
                error: null,
            }
        case GET_ALL_RESULTS_REQUEST_SUCCESS:
            return {
                ...state,
                in_progress: false,
                all_results: action.payload,
                error: null,
            }
        case GET_ALL_RESULTS_REQUEST_FAILURE:
            return {
                ...state,
                in_progress: false,
                error: action.error
            }


        case CREATE_QAR_RESULT_REQUEST:
            return {
                ...state,
                in_progress: true,
                error: null,
            }
        case CREATE_QAR_RESULT_REQUEST_SUCCESS:
            return {
                ...state,
                in_progress: false,
                all_results: uniqBy([action.payload, ...state.all_results], 'request_id'),
            }
        case CREATE_QAR_RESULT_REQUEST_FAILURE:
            return {
                ...state,
                in_progress: false,
                error: action.error
            }
        case RESULT_SLOW_OR_OFFLINE:
            return {
                ...state,
                in_progress: false,
                all_results: uniqBy(compact([action.payload, ...state.all_results]), 'request_id'),
                results_to_sync: uniqBy(compact([action.payload, ...state.results_to_sync]), 'request_id'),
            }
        case RESULTS_SYNCHED:
            return {
                ...state,
                results_to_sync: []
            }
        default:
            return state
    }
}

export {qarResultReducer}