import * as Location from "expo-location";
import i18n from "i18n-js";
import {all, call, delay, put, race, select, take, takeEvery} from 'redux-saga/effects';
import {GOOGLE_API_KEY, TIMEOUT_SECONDS} from "../../core/utils/constants";
import {sendPushNotification} from "../services/PushNotificationUtils";
import {sendOTPWithTNS, verifyOTPWithTNS} from "../services/verify_phone_number";
import {
    CLOSE_MODAL,
    CREATE_QAR_USER_REQUEST_FAILURE,
    CREATE_QAR_USER_REQUEST_SUCCESS,
    DEVICE_LOCATION_REQUEST,
    DEVICE_LOCATION_REQUEST_FAILURE,
    DEVICE_LOCATION_REQUEST_SUCCESS,
    FETCH_FIELD_TECHS_REQUEST,
    FETCH_FIELD_TECHS_REQUEST_FAILURE,
    FETCH_FIELD_TECHS_REQUEST_SUCCESS,
    GET_USER_BY_ID_REQUEST,
    GET_USER_BY_ID_REQUEST_FAILURE,
    GET_USER_BY_ID_REQUEST_SUCCESS,
    INVALID_CREDENTIALS,
    LOGIN_REQUEST,
    LOGIN_REQUEST_FAILURE,
    LOGIN_REQUEST_SUCCESS,
    OFFLINE,
    OTP_SEND_ERROR,
    OTP_SEND_FAILURE,
    OTP_SEND_REQUEST,
    OTP_SEND_SUCCESS,
    OTP_VERIFY_ERROR,
    OTP_VERIFY_FAILURE,
    OTP_VERIFY_REQUEST,
    OTP_VERIFY_STATUS_RESET,
    OTP_VERIFY_SUCCESS,
    SEND_NOTIFICATION,
    SET_EQUIPMENT_REQUEST,
    SET_EQUIPMENT_REQUEST_FAILURE,
    SHOW_MODAL,
    SIGNUP_REQUEST,
    SIGNUP_REQUEST_FAILURE,
    SIGNUP_REQUEST_SUCCESS,
    UPDATE_USER_INFO_REQUEST,
    UPDATE_USER_INFO_REQUEST_FAILURE,
    UPDATE_USER_INFO_REQUEST_SUCCESS,
    UPDATE_USER_TOKEN_REQUEST,
    UPSERT_USER_PASSWORD_REQUEST,
    UPSERT_USER_PASSWORD_REQUEST_FAILURE,
    UPSERT_USER_PASSWORD_REQUEST_SUCCESS,
    USER_SLOW_OR_OFFLINE,
    USER_SYNCHED
} from "./actions";
import {
    createUserFb,
    fetchAllUsersByType,
    getRemoteUsersByIds,
    getUserByPhoneNumberAndPasswordFb,
    getUserExpoPushTokenFb,
    updateRemoteUserFb,
    updateUserExpoPushTokenFb,
} from "./firebase_calls";
import {upsertPassword} from "./firebase_calls/UpsertPassword";
import {isEmpty} from "lodash";
import {firebaseUploader} from "../../core/utils/data";
import {Equipment} from "../../controller/user_controller/user_controller";


function* loginUser(action) {
    try {
        const {reachable} = yield select();
        const [user, offline, timeout] = yield race([
            reachable.isConnected && call(getUserByPhoneNumberAndPasswordFb, action.payload),
            take(OFFLINE),
            delay(TIMEOUT_SECONDS)
        ])

        if (offline || timeout || user === false) {
            throw new Error(i18n.t("internetError")) // Internet issue
        } else {
            if (user === null || user === undefined) {
                //console.log("PW =>", crypticPassword("U2FsdGVkX1+YgT/5nOIUvwcw3X+Y4yHelY9DDR3LBp0="))
                yield put({
                    type: INVALID_CREDENTIALS,
                    payload: i18n.t("invalidCredentials")
                })
            } else {
                //1. check if verified
                if (user && user.verified) {
                    //2. user verified -> login.
                    yield put({
                        type: LOGIN_REQUEST_SUCCESS,
                        payload: user
                    })
                } else {
                    //3. if not verified -> go through the otp process
                    user.verified = false
                    yield all([
                        put({
                            type: OTP_SEND_REQUEST, //<- request otp
                            phoneNumber: user.telephone
                        }),
                        put({
                            type: LOGIN_REQUEST_FAILURE,
                            payload: {
                                error: null, // no need to show error to the user
                                user_info: user, // failed login - successful partially
                            }

                        }),
                    ]);
                }
            }
        }
    } catch (e) {
        yield put({
            type: LOGIN_REQUEST_FAILURE,
            payload: e.message,
        })
    }
}

function* signupUser(action) {
    try {
        const {userInfo, resp} = yield call(createUserFb, action.payload)

        if (resp.success) {
            yield all([
                put({
                    type: SIGNUP_REQUEST_SUCCESS,
                    payload: userInfo
                }),
                //trigger OTP
                put({
                    type: OTP_SEND_REQUEST,
                    phoneNumber: userInfo.telephone
                })
            ])
        } else {
            //duplicate user error
            yield put({
                type: SIGNUP_REQUEST_FAILURE,
                payload: resp.message
            })
        }

    } catch (e) {
        //something else happened - error
        yield put({
            type: SIGNUP_REQUEST_SUCCESS,
            payload: e.message
        })
    }
}

/**
 * Saga to handle OTP request calls...
 * @param action - contains the request data.
 * @returns null
 */
function* oTPSendSaga(action) {

    console.log("OTP to sent to => ", action.phoneNumber)
    try {
        const {reachable} = yield select();
        const [response, timeout, offline] = yield race([
            reachable.isConnected && call(sendOTPWithTNS, action.phoneNumber),
            delay(TIMEOUT_SECONDS),
            take(OFFLINE)
        ])

        if (response.ok) {
            yield all([
                put({
                    type: OTP_SEND_SUCCESS,
                    success: true
                }),
                put({type: SHOW_MODAL})
            ])
        } else {
            yield put({
                type: OTP_SEND_FAILURE,
                error: i18n.t("otpSendError"),
            });
        }
    } catch (e) {

        yield put({
            type: OTP_SEND_ERROR,
            error: i18n.t("otpSendError")
        });
    }
}

/**
 * Saga to handle OTP verification calls.
 * @param action - contains the verification data....
 * @returns null
 */
function* oTPVerificationSaga(action) {

    console.log("PAYLOAD =>", action.payload)
    try {
        const {reachable} = yield select();
        const [response, timeout, offline] = yield race([
            reachable.isConnected && call(verifyOTPWithTNS, action.payload),
            delay(TIMEOUT_SECONDS),
            take(OFFLINE)
        ])

        if (response.ok) {
            /* Verifying a new user. Process is complete. */
            //OTP is verified, update verified field in the user object.
            console.log("OTP Verified!")

            yield all([
                put({
                    type: OTP_VERIFY_SUCCESS,
                    otp_verify_success: true
                }),
                put({
                    type: UPDATE_USER_INFO_REQUEST,
                    // payload: user,
                    otp_verified: true
                })
            ])
        } else {
            yield put({
                type: OTP_VERIFY_FAILURE,
                error: i18n.t("phoneNumberVerificationFailure"),
            })
        }
    } catch (e) {

        yield put({
            type: OTP_VERIFY_ERROR,
            error: i18n.t("phoneNumberVerificationError")
        })
    }
}


function* updateUserInfoSaga(action) {

    try {
        const {reachable, user} = yield select();

        const {user_info} = user
        const today = new Date()
        let updateObj = {}

        //remove un-required keys based on the origin of the update.

        // verification status update
        if (action.otp_verified) {
            updateObj = {
                _id: user_info._id,
                updated_at: today.toISOString(),
                verified: true,
            }
        }

        //name and/or email update
        if (!isEmpty(action.names) || !isEmpty(action.email)) {

            updateObj = {
                _id: user_info._id,
                updated_at: today.toISOString(),
                names: action.names,
                email: action.email,
            }
        }

        //equipment update
        if (action.equipment) {
            updateObj = {
                _id: user_info._id,
                updated_at: today.toISOString(),
                equipment: action.equipment
            }
        }

        const [response, timeout, offline, userData] = yield race([
            reachable.isConnected && call(updateRemoteUserFb, updateObj),
            delay(TIMEOUT_SECONDS),
            take(OFFLINE)
        ])

        if (response) {
            //both otp verification and user update were a success
            if (action.otp_verified) { //<- this comes from oTPVerificationSaga
                yield all([
                    put({
                        type: LOGIN_REQUEST_SUCCESS,
                        payload: {...user_info, ...updateObj},
                    }),

                    put({type: OTP_VERIFY_STATUS_RESET}),
                    put({type: CLOSE_MODAL})

                ])
            }

            console.log("the updated user => ", {...user_info, ...updateObj})
            //continue with the normal update.
            yield put({
                type: UPDATE_USER_INFO_REQUEST_SUCCESS,
                payload: {...user_info, ...updateObj} //<- updated user_info
            })

            //navigate to the previous screen
            if (action.navigation) {
                action.navigation.goBack()
            }

        } else {
            yield put({
                type: UPDATE_USER_INFO_REQUEST_FAILURE,
                payload: i18n.t("userNameNotAvailable")
            })
        }
    } catch (e) {
        yield put({
            type: UPDATE_USER_INFO_REQUEST_FAILURE,
            payload: e.message
        })
    } finally {
        yield put({type: CLOSE_MODAL})
    }
}

function* upsertUserPasswordSaga(action) {

    try {
        const {reachable, user} = yield select();
        const userModel = user.user_info

        const [response, timeout, offline] = yield race([
            reachable.isConnected && call(upsertPassword, action.payload),
            delay(TIMEOUT_SECONDS),
            take(OFFLINE)
        ])

        if (response.success) {
            //update was success
            if (userModel.verified === undefined) {
                userModel.verified = false // add verified key if missing.
            }

            yield all([
                put({
                    type: UPSERT_USER_PASSWORD_REQUEST_SUCCESS,
                    payload: userModel
                }),
                put({
                    type: CLOSE_MODAL
                })
            ])

        } else {
            yield put({
                type: UPSERT_USER_PASSWORD_REQUEST_FAILURE,
                payload: response.message
            })
        }
    } catch (err) {
        yield put({
            type: UPSERT_USER_PASSWORD_REQUEST_FAILURE,
            payload: err.message
        })
    }


}

function* setUserEquipment(action) {
    try {
        //upload images to firebase storage
        let {meter, scale} = action.payload

        const [meterUri, scaleUri] = yield (all([
                call(firebaseUploader, meter.image_url, "moisture_meter.jpg", "equipment/" + action.loggedUser._id + "/"),
                call(firebaseUploader, scale.image_url, "weight_scale.jpg", "equipment/" + action.loggedUser._id + "/"),
            ])
        )

        if (meterUri || scaleUri) {
            console.log("scaleUri =>", scaleUri)
            let equipObj: Equipment = {
                scale: {
                    ...scale,
                    image_url: scaleUri || '',
                },
                meter: {
                    ...meter,
                    image_url: meterUri || '',
                }
            }

            yield put({
                type: UPDATE_USER_INFO_REQUEST,
                equipment: equipObj,
                navigation: action.navigation
            })

        } else {
            yield put({
                type: SET_EQUIPMENT_REQUEST_FAILURE,
                payload: "Something wrong with network, try again later."
            })
        }


    } catch (e) {
        yield put({
            type: SET_EQUIPMENT_REQUEST_FAILURE,
            payload: e.message
        })
    }
}

/**
 * Generator function to get the location of the device/user
 */
function* getDeviceLocationSaga() {
    try {
        yield Location.setGoogleApiKey(GOOGLE_API_KEY)
        const {status} = yield Location.requestForegroundPermissionsAsync()

        if (status === 'granted') {
            const location = yield Location.getCurrentPositionAsync({});
            const locationCoord = {latitude: location.coords.latitude, longitude: location.coords.longitude}
            const geo_code = yield Location.reverseGeocodeAsync(locationCoord, {useGoogleMaps: true})

            yield put({
                type: DEVICE_LOCATION_REQUEST_SUCCESS,
                payload: {address: geo_code[0], ...location}
            })
        }
    } catch (e) {
        yield put({
            type: DEVICE_LOCATION_REQUEST_FAILURE,
            error: e.message
        })
    }
}

function* getUserByIdsSaga(action) {

    try {
        const {qar_users, reachable} = yield select();

        //check if there are users_to_sync and push them to server.
        if ((qar_users !== undefined)
            && (qar_users.users_to_sync !== undefined)
            && (qar_users.users_to_sync.length > 0)) {
            const [response, timeout, offline] = yield race([
                reachable.isConnected && all(qar_users.users_to_sync.map((user) => {
                    return call(updateRemoteUserFb, user)
                })),
                delay(TIMEOUT_SECONDS),
                take(OFFLINE)
            ])

            if (response) {
                yield put({type: USER_SYNCHED})
            }
        }

        //race with timeout
        const [users, timeout, offline] = yield race([
            call(getRemoteUsersByIds, action.user_ids),
            delay(TIMEOUT_SECONDS),
            take(OFFLINE)
        ])

        if (users) {
            yield put({
                type: GET_USER_BY_ID_REQUEST_SUCCESS,
                payload: users
            })
        } else {
            yield put({
                type: USER_SLOW_OR_OFFLINE,
                payload: undefined
            })
        }
    } catch (e) {
        yield put({
            type: GET_USER_BY_ID_REQUEST_FAILURE,
            error: e
        })
    }
}


function* createQarUserSaga(action) {

    const {reachable} = yield select()

    try {
        const [response, timeout, offline] = yield race([
            reachable.isConnected && call(updateRemoteUserFb, action),
            delay(TIMEOUT_SECONDS),
            take(OFFLINE)
        ])

        if (timeout || offline || !response) {
            yield put({
                type: USER_SLOW_OR_OFFLINE,
                payload: action
            })
        }

        yield put({
            type: CREATE_QAR_USER_REQUEST_SUCCESS,
            payload: action
        })
    } catch (e) {
        console.log("error =>", e)
        yield put({
            type: CREATE_QAR_USER_REQUEST_FAILURE,
            error: e
        })
    }
}

/**
 * Saga to push notification to the user.
 * @param action - contains the notification data.
 * @returns nothing
 */
function* sendNotificationSaga(action) {
    const {reachable} = yield select()
    try {
        const [expoPushToken, timeout, offline] = yield race([
            reachable.isConnected && call(getUserExpoPushTokenFb, action.payload.user_id),
            delay(TIMEOUT_SECONDS),
            take(OFFLINE)
        ])

        //check if token string is not empty
        if (!isEmpty(expoPushToken)) {
            yield call(sendPushNotification, {expoPushToken, ...action.payload})
        }

    } catch (e) {
        console.log("error while trying to send the notification.")
    }
}


function* fetchFieldTechs() {
    try {
        const {reachable} = yield select();
        const [fieldTechs, timeout, offline] = yield race([
            reachable.isConnected && call(fetchAllUsersByType, 1),
            delay(TIMEOUT_SECONDS),
            take(OFFLINE)
        ])

        if (timeout || offline || !fieldTechs) {
            yield put({
                type: FETCH_FIELD_TECHS_REQUEST_FAILURE,
                payload: "Please check your internet connection and try again!"
            })
        } else {
            yield put({
                type: FETCH_FIELD_TECHS_REQUEST_SUCCESS,
                payload: fieldTechs
            })
        }
    } catch (e) {
        yield put({
            type: FETCH_FIELD_TECHS_REQUEST_FAILURE,
            error: e.message
        })
    }
}

function* updateUserExpoPushTokenSaga(action) {
    try {
        const updatedUser = yield call(updateUserExpoPushTokenFb, action)
        if (!isEmpty(updatedUser)) {
            yield put({
                type: UPDATE_USER_INFO_REQUEST_SUCCESS,
                payload: updatedUser
            })
        }
    } catch (e) {
        yield put({
            type: UPDATE_USER_INFO_REQUEST_FAILURE,
            payload: "Unable to update the push token"
        })
    }
}


function* handler() {
    yield all([
        takeEvery(DEVICE_LOCATION_REQUEST, getDeviceLocationSaga),
        takeEvery(LOGIN_REQUEST, loginUser),
        takeEvery(SIGNUP_REQUEST, signupUser),
        takeEvery(UPDATE_USER_INFO_REQUEST, updateUserInfoSaga),
        takeEvery(UPSERT_USER_PASSWORD_REQUEST, upsertUserPasswordSaga),
        takeEvery(GET_USER_BY_ID_REQUEST, getUserByIdsSaga),
        takeEvery(OTP_SEND_REQUEST, oTPSendSaga),
        takeEvery(OTP_VERIFY_REQUEST, oTPVerificationSaga),
        takeEvery(FETCH_FIELD_TECHS_REQUEST, fetchFieldTechs),
        takeEvery(SET_EQUIPMENT_REQUEST, setUserEquipment),
        takeEvery(SEND_NOTIFICATION, sendNotificationSaga),
        takeEvery(UPDATE_USER_TOKEN_REQUEST, updateUserExpoPushTokenSaga),
    ])
}

export {handler, createQarUserSaga, getUserByIdsSaga}
