import {combineReducers} from 'redux'
import {qarSiteReducer} from "./site/reducers";
import {filter, qarListingReducer} from "./qar_listing/reducers";
import {qarResultReducer} from "./result/reducers";
import {qapDataReducer} from "./qap-data/reducers";
import {
    deviceLocationReducer,
    emailReducer,
    fullnameReducer,
    newQARReducer,
    otpReducer,
    passwordConfirmationReducer,
    passwordReducer,
    qarUserReducer,
    telephoneReducer
} from "./user/reducers";
import {persistReducer} from "redux-persist";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {reducer as reachabilityReducer} from "./reachability/reducers";
import {user} from "./user/user_reducers";

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    whitelist: [
        'qar_listing',
        'qar_users',
        'qar_sites',
        'qar_results',
        'qar_qap_data',
        'user_location',
        'qap_data',
        'user',
    ]
}

const appReducer = combineReducers({
    reachable: reachabilityReducer,
    qar_listing: qarListingReducer,
    user: user.reducer,
    filter_params: filter,
    telephone: telephoneReducer,
    newQAR: newQARReducer,
    pass: passwordReducer,
    passConfirm: passwordConfirmationReducer,
    mail: emailReducer,
    fName: fullnameReducer,
    user_location: deviceLocationReducer,
    qar_users: qarUserReducer,
    qar_sites: qarSiteReducer,
    qar_results: qarResultReducer,
    qap_data: qapDataReducer,
    otp: otpReducer
})

const rootReducer = (state, action) => {
    if (action.type === 'USER_LOGOUT') {
        state = undefined
    }
    return appReducer(state, action)
}

export default persistReducer(persistConfig, rootReducer)
