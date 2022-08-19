import {spawn} from "redux-saga/effects";
import {handler as userHandler} from "./user/sagas";
import {handler as qarHandler} from "./qar_listing/sagas";
import {handler as siteHandler} from "./site/sagas";
import {handler as qapDataHandler} from "./qap-data/sagas";
import {handler as resultHandler} from "./result/sagas";
import netInfoSaga from "./reachability/connection_saga";


export default function* rootSaga() {
    yield spawn(netInfoSaga)
    yield spawn(userHandler)
    yield spawn(qarHandler)
    yield spawn(siteHandler)
    yield spawn(qapDataHandler)
    yield spawn(resultHandler)
}