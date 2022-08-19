import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import {useContext, useEffect, useState} from "react";
import {NetworkContext} from "./NetworkContext";


const getNotificationToken = () => {

    const [token, setToken] = useState('');
    const {isConnected} = useContext(NetworkContext);
    useEffect(() => {
        async function getToken() {
            if (Constants.isDevice) {
                const {status: existingStatus} = Notifications.getPermissionsAsync();
                let finalStatus = existingStatus;
                if (existingStatus !== 'granted') {
                    const {status} = await Notifications.requestPermissionsAsync();
                    finalStatus = status;
                }
                if (finalStatus !== 'granted') {
                    alert('Failed to get push token for push notification!');
                    return;
                }
                if (isConnected) {
                    const tk = (await Notifications.getExpoPushTokenAsync()).data;
                    setToken(tk)
                }
            } else {
                alert('Must use physical device for Push Notifications');
            }

            if (Platform.OS === 'android') {
                await Notifications.setNotificationChannelAsync('default', {
                    name: 'default',
                    importance: Notifications.AndroidImportance.MAX,
                    vibrationPattern: [0, 250, 250, 250],
                    lightColor: '#FF231F7C',
                });
            }
        }

        getToken()
    }, [isConnected])

    return token
};

export default getNotificationToken
