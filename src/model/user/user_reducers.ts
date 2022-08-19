//user reducer reducers
import {User, UserState} from "./UserModel";
import {createSlice, PayloadAction} from '@reduxjs/toolkit'

const initialState: UserState = {
    user_info: null,
    error: null,
    modal_visible: false,
    in_progress: false,
    field_techs: []
}

export const user = createSlice({
    name: 'user',
    initialState,
    reducers: {
        //login related
        LOGIN_REQUEST: (state, action) => {
            state.in_progress = true
            state.error = null
        },
        INVALID_CREDENTIALS: (state, action: PayloadAction<string>) => {
            state.in_progress = false
            state.error = action.payload
        },
        LOGIN_REQUEST_FAILURE: (state, action) => {
            state.in_progress = false
            state.error = action.payload.error
            state.user_info = action.payload.user_info as User
        },
        LOGIN_REQUEST_SUCCESS: (state, action: PayloadAction<User>) => {
            state.in_progress = false
            state.user_info = action.payload
        },

        //signup related...
        SIGNUP_REQUEST: (state, action) => {
            state.in_progress = true
            state.error = null
        },
        SIGNUP_REQUEST_FAILURE: (state, action) => {
            state.in_progress = false
            state.error = action.payload
        },
        SIGNUP_REQUEST_SUCCESS: (state, action: PayloadAction<User>) => {
            state.in_progress = false
            state.user_info = action.payload
            state.error = null
        },

        //update related...
        UPDATE_USER_INFO_REQUEST: (state, action: PayloadAction<User>) => {
            state.in_progress = true
            state.error = null
        },
        UPDATE_USER_INFO_REQUEST_FAILURE: (state, action) => {
            state.in_progress = false
            state.error = action.payload
        },
        UPDATE_USER_INFO_REQUEST_SUCCESS: (state, action: PayloadAction<User>) => {
            state.in_progress = false
            state.error = null
            state.user_info = action.payload
        },

        SET_EQUIPMENT_REQUEST: (state, action: PayloadAction<User>) => {
            state.in_progress = true
            state.error = null
        },
        SET_EQUIPMENT_REQUEST_FAILURE: (state, action) => {
            state.in_progress = false
            state.error = action.payload
        },


        //fetch all field-techs
        FETCH_FIELD_TECHS_REQUEST: (state) => {
            state.in_progress = true
            state.error = null
        },
        FETCH_FIELD_TECHS_REQUEST_FAILURE: (state, action) => {
            state.in_progress = false
            state.error = action.payload
        },
        FETCH_FIELD_TECHS_REQUEST_SUCCESS: (state, action: PayloadAction<User[]>) => {
            state.in_progress = false
            state.error = null
            state.field_techs = action.payload
        },

        //upsert password
        UPSERT_USER_PASSWORD_REQUEST: (state) => {
            state.in_progress = true
            state.error = null
        },
        UPSERT_USER_PASSWORD_REQUEST_FAILURE: (state, action) => {
            state.in_progress = false
            state.error = action.payload
        },
        UPSERT_USER_PASSWORD_REQUEST_SUCCESS: (state, action: PayloadAction<User>) => {
            state.in_progress = false
            state.error = null
            state.user_info = action.payload
        },
        CLOSE_MODAL: (state: UserState) => {
            state.modal_visible = false
        },
        SHOW_MODAL: (state: UserState) => {
            state.modal_visible = true
        },
        RESET_ERROR: (state) => {
            state.error = null
        },
        RESET_USER_STATE: (state) => initialState
    }
})