import {
    CLEAR_FILTER,
    FILTER_ASC,
    FILTER_DESC,
    GET_QARS_REQUEST,
    GET_QARS_REQUEST_FAILURE,
    GET_QARS_REQUEST_SUCCESS,
    QAR_SLOW_OR_OFFLINE,
    QARS_SYNCHED,
    TOGGLE_COMPLETED,
    TOGGLE_FILTER_CARD,
    TOGGLE_IN_PROGRESS,
    TOGGLE_TOBE_DONE,
    UPSERT_NEW_QAR_REQUEST,
    UPSERT_QAR_REQUEST,
    UPSERT_QAR_REQUEST_FAILURE,
    UPSERT_QAR_REQUEST_SUCCESS
} from "./actions";

import {compact, remove, uniqBy} from "lodash"

const filterInitialState = {
    tobe_done: false,
    in_progress: false,
    completed: false,
    desc: true,
    asc: false,
    show_filter: false,
    status_filter_array: []
}

const qarListingInitialState = {
    in_progress: false,
    display_qars: [],
    raw_qars: [],
    qars_to_sync: [],
    error_msg: null,
}

const filterStatArr = (tbd, pr, cp) => {
    let arr = []
    tbd ? arr.push(0) : remove(arr, 0)
    pr ? arr.push(1) : remove(arr, 1)
    cp ? arr.push(2) : remove(arr, 2)

    return arr
}

const filter = (state = filterInitialState, action) => {
    switch (action.type) {
        case TOGGLE_FILTER_CARD:
            return {
                ...state,
                show_filter: !state.show_filter
            }
        case TOGGLE_TOBE_DONE:

            return {
                ...state,
                tobe_done: !state.tobe_done,
                status_filter_array: filterStatArr(!state.tobe_done, state.in_progress, state.completed)
            }

        case TOGGLE_IN_PROGRESS:
            return {
                ...state,
                in_progress: !state.in_progress,
                status_filter_array: filterStatArr(state.tobe_done, !state.in_progress, state.completed)
            }

        case TOGGLE_COMPLETED:
            return {
                ...state,
                completed: !state.completed,
                status_filter_array: filterStatArr(state.tobe_done, state.in_progress, !state.completed)
            }
        case FILTER_ASC:
            return {
                ...state,
                asc: true,
                desc: false,
            }
        case FILTER_DESC:
            return {
                ...state,
                asc: false,
                desc: true,
            }
        case CLEAR_FILTER:
            return {
                ...filterInitialState,
                asc: action.asc,
                desc: action.desc
            }

        default:
            return state
    }
}

const qarListingReducer = (state = qarListingInitialState, action) => {
    switch (action.type) {
        case GET_QARS_REQUEST:
            return {
                ...state,
                in_progress: true,
                error_msg: null
            }
        case GET_QARS_REQUEST_SUCCESS:
            return {
                ...state,
                in_progress: false,
                display_qars: action.display_qars,
                raw_qars: action.raw_qars,
                error_msg: null
            }
        case GET_QARS_REQUEST_FAILURE:
            return {
                ...state,
                in_progress: false,
                error_msg: action.error
            }

        case UPSERT_NEW_QAR_REQUEST || UPSERT_QAR_REQUEST:
            return {
                ...state,
                in_progress: true,
                error_msg: null
            }
        case UPSERT_QAR_REQUEST:
            return {
                ...state,
                // in_progress: true,
                in_progress: true,
            }
        case "REQUEST_CANCELED":
            return {
                ...state,
                in_progress: false,
            }

        case UPSERT_QAR_REQUEST_SUCCESS:
            return {
                ...state,
                in_progress: false,
                raw_qars: uniqBy(compact([action.raw_qar, ...state.raw_qars]), '_id'),
                display_qars: uniqBy(compact([action.display_qar, ...state.display_qars]), '_id'),
                error_msg: null
            }

        case UPSERT_QAR_REQUEST_FAILURE:
            return {
                ...state,
                in_progress: false,
                error_msg: action.error
            }
        case QARS_SYNCHED:
            return {
                ...state,
                in_progress: false,
                qars_to_sync: []
            }
        case QAR_SLOW_OR_OFFLINE:
            return {
                ...state,
                in_progress: false,
                qars_to_sync: uniqBy(compact([action.new_to_be_synced_qar, ...state.qars_to_sync]), '_id'),
                raw_qars: uniqBy(compact([action.new_offline_raw_qar, ...state.raw_qars]), '_id'),
                display_qars: uniqBy(compact([action.new_offline_display_qar, ...state.display_qars]), '_id'),
            }
        default:
            return state
    }
}


export {filter, qarListingReducer}