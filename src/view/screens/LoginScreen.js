import React, {useEffect} from 'react'
import {Colors, styles} from "../styles";
import {Text, TouchableOpacity, View} from "react-native";
import {Icon} from "react-native-elements";
import i18n from 'i18n-js';
import {DEVICE_LOCATION_REQUEST} from "../../model/user/actions";
import {useDispatch, useSelector} from "react-redux";
import {useNetInfo} from "@react-native-community/netinfo";


function SwitchButton(props) {
    return (
        <TouchableOpacity onPress={props.onPress}>
            <View
                style={{
                    paddingVertical: 16,
                    alignItems: 'center',
                    borderRadius: 16,
                    backgroundColor: Colors.WHITE,
                }}
            >
                <Icon
                    type="font-awesome-5"
                    reverse
                    name={props.userType === 1 ? "tools" : "briefcase"}
                    color={props.userType === 1 ? Colors.TERTIARY : Colors.PRIMARY}/>
                <Text style={{color: Colors.PRIMARY, fontWeight: "bold", fontSize: 18}}>
                    {props.title}
                </Text>
            </View>
        </TouchableOpacity>
    );
}

const LoginScreen = ({navigation}) => {
    const net_info = useNetInfo()
    const dispatch = useDispatch()
    const {user_location, reachable} = useSelector(state => state)

    useEffect(() => {

        dispatch({type: "CONNECTION_STATUS", status: (net_info.isConnected && net_info.isInternetReachable)})
        dispatch({type: DEVICE_LOCATION_REQUEST})
    }, [dispatch, net_info])

    return (
        <View
            style={[styles.container, {justifyContent: "center", backgroundColor: Colors.TERTIARY}]}
        >

            <View style={{marginBottom: 8, alignItems: "center"}}>
            </View>
            <View style={{marginVertical: 24, marginHorizontal: 32}}>
                <SwitchButton
                    title={i18n.t('fieldtech')}
                    userType={1}
                    onPress={() => navigation.navigate("signIn", {
                        userType: 1,
                        country: ((user_location !== null)
                            && (user_location.device_location !== null))
                            ? user_location.device_location.address.country
                            : "United States"
                    })}
                />
            </View>
            <View style={{marginHorizontal: 32}}>
                <SwitchButton
                    title={i18n.t('buyer')}
                    userType={2}
                    onPress={() => navigation.navigate("signIn", {
                        userType: 2,
                        country: ((user_location !== null)
                            && (user_location.device_location !== null))
                            ? user_location.device_location.address.country
                            : "United States"
                    })}
                />
            </View>
            <Text style={{
                textAlign: "center",
                position: "absolute",
                bottom: 20,
                left: 20,
                right: 16,
                color: Colors.WHITE
            }}>
                {user_location.requesting_location
                    ? i18n.t("fetchloc")
                    : (user_location.error
                        ? user_location.error
                        : i18n.t("curentloc") + ((user_location.device_location !== null)
                        ? user_location.device_location.address.country
                        : i18n.t("Undefined")))
                }

            </Text>
        </View>

    );

}

export default LoginScreen;
