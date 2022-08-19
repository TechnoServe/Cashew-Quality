import {eventChannel} from "redux-saga"
import {call, put, take} from "redux-saga/effects"
import NetInfo from "@react-native-community/netinfo";
import {OFFLINE, ONLINE} from "../user/actions";


function* startChannel(syncActionName) {

    const channel = eventChannel(emitter => {
        const handleConnectivityChange = (state) => {
            emitter(state.isConnected && state.isInternetReachable);
        }
        // Initialise the connectivity listener
        const unsubscribe = NetInfo.addEventListener((state) => handleConnectivityChange(state));

        // Return the unregister event listener.
        return () => unsubscribe();
    });

    while (true) {
        const connectionInfo = yield take(channel);
        if (!connectionInfo) {
            yield put({type: OFFLINE})
        } else {
            yield put({type: ONLINE})
        }

        yield put({type: "CONNECTION_STATUS_CHANGED", status: connectionInfo});
    }
}

export default function* netInfoSaga() {
    try {
        const {isConnected, isInternetReachable} = yield NetInfo.fetch()
        yield put({type: "CONNECTION_STATUS", status: isConnected && isInternetReachable});

        yield call(startChannel);
    } catch (e) {
        console.log(e);
    }
}