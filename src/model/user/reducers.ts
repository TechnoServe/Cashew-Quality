import {
    CHECK_ACCOUNT_VERIFICATION_STATUS,
    CLOSE_COUNTRY_MODAL,
    CLOSE_PHONE_VERIFICATION_MODAL,
    CREATE_QAR_USER_REQUEST,
    CREATE_QAR_USER_REQUEST_FAILURE,
    CREATE_QAR_USER_REQUEST_SUCCESS,
    DEVICE_LOCATION_REQUEST,
    DEVICE_LOCATION_REQUEST_FAILURE,
    DEVICE_LOCATION_REQUEST_SUCCESS,
    EMAIL_EDIT_VALID,
    EMAIL_NOT_FOUND,
    EMAIL_VALID,
    FULLNAME_EDIT_VALID,
    FULLNAME_VALID,
    GET_USER_BY_ID_REQUEST,
    GET_USER_BY_ID_REQUEST_FAILURE,
    GET_USER_BY_ID_REQUEST_SUCCESS,
    NEW_QAR_PHONE_VALID,
    NO_ACCOUNT_WITH_PROVIDED_PHONE_NUMBER,
    OLD_PASSWORD_INCORRECT,
    OTP_SEND_ERROR,
    OTP_SEND_FAILURE,
    OTP_SEND_REQUEST,
    OTP_SEND_STATUS_RESET,
    OTP_SEND_SUCCESS,
    OTP_VALIDATE,
    OTP_VERIFY_ERROR,
    OTP_VERIFY_FAILURE,
    OTP_VERIFY_REQUEST,
    OTP_VERIFY_STATUS_RESET,
    OTP_VERIFY_SUCCESS,
    PASSWORD_CONFIRMATION,
    PASSWORD_EDIT_CONFIRMATION,
    PASSWORD_EDIT_VALID,
    PASSWORD_VALID,
    PHONE_VALID,
    RESET_ACCOUNT_VERIFICATION_STATUS,
    SHOW_COUNTRY_MODAL,
    SHOW_PHONE_VERIFICATION_MODAL,
    USER_ACCOUNT_VERIFICATION_STATUS_CHECK_FAILURE,
    USER_ACCOUNT_VERIFIED,
    USER_SLOW_OR_OFFLINE,
    USER_SYNCHED,
    VERIFY_EXISTING_ACCOUNT
} from "./actions";
import {compact, uniqBy} from "lodash"

const initialQarUsersState = {
    users: [],
    users_to_sync: [],
    in_progress: false,
    error: null
}

const qarUserReducer = (state = initialQarUsersState, action) => {
    switch (action.type) {
        //get user information
        case GET_USER_BY_ID_REQUEST:
            return {
                ...state,
                in_progress: true,
                error: null,
            }
        case GET_USER_BY_ID_REQUEST_SUCCESS:
            return {
                ...state,
                in_progress: false,
                users: action.payload,
                error: null,
            }
        case GET_USER_BY_ID_REQUEST_FAILURE:
            return {
                ...state,
                in_progress: false,
                error: action.error
            }
        case CREATE_QAR_USER_REQUEST:
            return {
                ...state,
                in_progress: true,
                error: null,
            }
        case CREATE_QAR_USER_REQUEST_SUCCESS:
            return {
                ...state,
                users: uniqBy(compact([...state.users, action.payload]), '_id'),
                in_progress: false,
            }
        case CREATE_QAR_USER_REQUEST_FAILURE:
            return {
                ...state,
                in_progress: false,
                error: action.error
            }
        case USER_SLOW_OR_OFFLINE:
            return {
                ...state,
                users_to_sync: uniqBy(compact([
                        ...state.users_to_sync,
                        action.payload]),
                    '_id')
            }
        case USER_SYNCHED:
            return {
                ...state,
                users_to_sync: []
            }
        default:
            return state
    }
}

const telephoneReducer = (state = {
    show_code_modal: false,
    phone_valid: false,
    phone_error: undefined
}, action) => {
    switch (action.type) {
        case SHOW_COUNTRY_MODAL:
            return {
                ...state,
                show_code_modal: true
            }
        case CLOSE_COUNTRY_MODAL:
            return {
                ...state,
                show_code_modal: false
            }
        case PHONE_VALID:
            return {
                ...state,
                phone_valid: action.validate,
                phone_error: action.errorMessage
            }
        default:
            return state
    }
}

const newQARReducer = (state = {
    show_code_modal: false,
    new_qar_phone_valid: true,
    phone_error: undefined
}, action) => {
    switch (action.type) {
        case NEW_QAR_PHONE_VALID:
            return {
                ...state,
                new_qar_phone_valid: action.validate,
                phone_error: action.errorMessage
            }
        default:
            return state
    }
}

const fullnameReducer = (state = {
    fullname_valid: false,
    fullname_error: undefined,
    fullname_edit_valid: true
}, action) => {
    switch (action.type) {
        case FULLNAME_VALID:
            return {
                ...state,
                fullname_valid: action.validate,
                fullname_error: action.errorMessage
            }
        case FULLNAME_EDIT_VALID:
            return {
                ...state,
                fullname_edit_valid: action.validate,
                fullname_error: action.errorMessage
            }
        default:
            return state
    }
}

const passwordReducer = (state = {
    password_valid: false,
    password_edit_valid: true,
    password_error: undefined,
    password_edit_error: undefined,
    old_password_valid: true,
    old_password_error: undefined
}, action) => {
    switch (action.type) {
        case PASSWORD_VALID:
            return {
                ...state,
                password_valid: action.validate,
                password_error: action.errorMessage
            }
        case PASSWORD_EDIT_VALID:
            return {
                ...state,
                password_edit_valid: action.validate,
                password_edit_error: action.errorMessage
            }
        case OLD_PASSWORD_INCORRECT:
            return {
                ...state,
                old_password_valid: action.validate,
                old_password_error: action.errorMessage
            }
        default:
            return state
    }
}

const passwordConfirmationReducer = (state = {
    password_confirmation_valid: false,
    password_confirmation_error: undefined,
    password_edit_confirmation_valid: true,
    password_edit_confirmation_error: undefined
}, action) => {
    switch (action.type) {
        case PASSWORD_CONFIRMATION:
            return {
                ...state,
                password_confirmation_valid: action.validate,
                password_confirmation_error: action.errorMessage
            }
        case PASSWORD_EDIT_CONFIRMATION:
            return {
                ...state,
                password_edit_confirmation_valid: action.validate,
                password_edit_confirmation_error: action.errorMessage
            }
        default:
            return state
    }
}


//OTP Reducer
const otpInit = {
    in_progress: false,
    accountAvailable: false,
    accountVerified: false,
    otp_valid: false,
    otp_error: undefined,
    otp_send_success: false,
    otp_send_failure: false,
    otp_send_error: null,
    otp_verify_success: false,
    otp_verify_failure: false,
    otp_verify_error: null,
    phone_verification_modal_visible: false,
    number_verified: false,
    verification_status_check_error: null,
    verify_existing_account: false,
    unverified_user: null
}
const otpReducer = (state = otpInit, action) => {
    switch (action.type) {

        case CHECK_ACCOUNT_VERIFICATION_STATUS:
            return {
                ...state,
                in_progress: true,
            }
        case VERIFY_EXISTING_ACCOUNT:
            return {
                ...state,
                in_progress: false,
                verify_existing_account: true,
                unverified_user: action.user
            }
        case USER_ACCOUNT_VERIFIED:
            return {
                ...state,
                in_progress: false,
                number_verified: action.verified
            }
        case NO_ACCOUNT_WITH_PROVIDED_PHONE_NUMBER:
            return {
                ...state,
                in_progress: false,
                verification_status_check_error: action.error
            }
        case USER_ACCOUNT_VERIFICATION_STATUS_CHECK_FAILURE:
            return {
                ...state,
                in_progress: false,
                verification_status_check_error: action.error
            }
        case RESET_ACCOUNT_VERIFICATION_STATUS:
            return {
                ...state,
                verify_existing_account: false,
                number_verified: false,
                verification_status_check_error: null,
            }
        case OTP_VALIDATE:
            return {
                ...state,
                otp_valid: action.validate,
                otp_error: action.errorMessage
            }
        case OTP_SEND_REQUEST:
            return {
                ...state,
                in_progress: true,
                otp_send_error: null
            }
        case OTP_SEND_SUCCESS:
            return {
                ...state,
                in_progress: false,
                otp_send_error: null,
                otp_send_success: action.success,
            }
        case OTP_SEND_FAILURE:
            return {
                ...state,
                in_progress: false,
                otp_send_error: action.error,
            }
        case OTP_SEND_STATUS_RESET:
            return {
                ...state,
                otp_send_success: action.success,
            }
        case OTP_SEND_ERROR:
            return {
                ...state,
                in_progress: false,
                otp_send_error: action.error
            }
        case OTP_VERIFY_REQUEST:
            return {
                ...state,
                in_progress: true,
                error: null
            }
        case OTP_VERIFY_SUCCESS:
            return {
                ...state,
                in_progress: false,
                error: null,
                otp_verify_success: action.otp_verify_success,
                number_verified: true
            }
        case OTP_VERIFY_FAILURE:
            return {
                ...state,
                in_progress: false,
                otp_verify_error: action.error,
            }
        case OTP_VERIFY_STATUS_RESET:
            return {
                ...state,
                ...otpInit
            }
        case OTP_VERIFY_ERROR:
            return {
                ...state,
                in_progress: false,
                error: action.error
            }
        case SHOW_PHONE_VERIFICATION_MODAL:
            return {
                ...state,
                phone_verification_modal_visible: true
            }
        case CLOSE_PHONE_VERIFICATION_MODAL:
            return {
                ...state,
                phone_verification_modal_visible: false
            }
        default:
            return state
    }
}

const emailReducer = (state = {
    email_valid: false,
    email_error: undefined,
    email_edit_valid: true,
}, action) => {
    switch (action.type) {
        case EMAIL_VALID:
            return {
                ...state,
                email_valid: action.validate,
                email_error: action.errorMessage
            }
        case EMAIL_EDIT_VALID:
            return {
                ...state,
                email_edit_valid: action.validate,
                email_error: action.errorMessage
            }
        case EMAIL_NOT_FOUND:
            return {
                ...state,
                email_error: action.errorMessage
            }
        default:
            return state
    }
}

const deviceLocationReducer = (state = {device_location: null, requesting_location: false, error: null}, action) => {
    switch (action.type) {
        case DEVICE_LOCATION_REQUEST:
            return {
                ...state,
                requesting_location: true,
                error: null,
            }

        case DEVICE_LOCATION_REQUEST_SUCCESS:
            return {
                ...state,
                requesting_location: false,
                device_location: action.payload,
                error: null,
            }
        case DEVICE_LOCATION_REQUEST_FAILURE:
            return {
                ...state,
                requesting_location: false,
                error: action.error,
            }
        default: {
            return state
        }
    }
}

export {
    telephoneReducer,
    newQARReducer,
    deviceLocationReducer,
    qarUserReducer,
    passwordReducer,
    passwordConfirmationReducer,
    emailReducer,
    fullnameReducer,
    otpReducer
}
