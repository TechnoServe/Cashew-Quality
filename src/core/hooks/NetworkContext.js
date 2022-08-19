import React, {createContext, useEffect, useMemo, useState} from "react";
import {useNetInfo} from "@react-native-community/netinfo";
import {useDispatch} from "react-redux";
import {OFFLINE, ONLINE} from "../../model/user/actions";

export const NetworkContext = createContext(true);

const NetworkProvider = (props) => {
    const [isConnected, setIsConnected] = useState(true);
    const netInfo = useNetInfo();
    const value = useMemo(() => ({isConnected, setIsConnected}), [isConnected, setIsConnected]);
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch({type: isConnected ? ONLINE : OFFLINE})
        setIsConnected(netInfo.isConnected && netInfo.isInternetReachable)
    }, [netInfo])

    return (
        <NetworkContext.Provider value={value}>
            {props.children}
        </NetworkContext.Provider>
    );
}

export default NetworkProvider;
