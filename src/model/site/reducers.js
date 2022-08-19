import {
    CREATE_QAR_SITE_REQUEST,
    CREATE_QAR_SITE_REQUEST_FAILURE,
    CREATE_QAR_SITE_REQUEST_SUCCESS,
    GET_SITE_BY_ID_REQUEST,
    GET_SITE_BY_ID_REQUEST_FAILURE,
    GET_SITE_BY_ID_REQUEST_SUCCESS,
    SITE_SLOW_OR_OFFLINE,
    SITES_SYNCED
} from "./actions";
import {compact, uniqBy} from "lodash"

const initialSitesState = {
    sites: [],
    sites_to_sync: [],
    in_progress: false,
    error: null
}

const qarSiteReducer = (state = initialSitesState, action) => {
    switch (action.type) {
        //get site information
        case GET_SITE_BY_ID_REQUEST:
            return {
                ...state,
                in_progress: true,
                error: null,
            }
        case GET_SITE_BY_ID_REQUEST_SUCCESS:
            return {
                ...state,
                in_progress: false,
                sites: action.payload,
                error: null,
            }
        case GET_SITE_BY_ID_REQUEST_FAILURE:
            return {
                ...state,
                in_progress: false,
                error: action.error
            }

        case CREATE_QAR_SITE_REQUEST:
            return {
                ...state,
                in_progress: true,
                error: null,
            }
        case CREATE_QAR_SITE_REQUEST_SUCCESS:
            return {
                ...state,
                sites: uniqBy(compact([...state.sites, action.payload]), '_id'),
                in_progress: false,
            }
        case CREATE_QAR_SITE_REQUEST_FAILURE:
            return {
                ...state,
                in_progress: false,
                error: action.error
            }
        case SITE_SLOW_OR_OFFLINE:
            return {
                ...state,
                sites_to_sync: uniqBy(compact([...state.sites_to_sync, action.payload]), '_id'),
            }
        case SITES_SYNCED:
            return {
                ...state,
                sites_to_sync: []
            }
        default:
            return state
    }
}

export {qarSiteReducer}