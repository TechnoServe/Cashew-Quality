import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import {Platform} from "react-native";

/**
 * Helper function to send notification from the client
 * @param expoPushToken - token of the receiver
 * @param title - title of the notification
 * @param body - body of the notification
 * @returns {Promise<void>}
 */

export async function sendPushNotification({expoPushToken, title, body}) {
    const message = {
        to: expoPushToken,
        sound: 'default',
        title: title,
        body: body,
        data: {data: null},
    };

    await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Accept-encoding': 'gzip, deflate',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
    });
}

//get expo push notification token. this needs to be saved somewhere in the remoted database.
export async function registerForPushNotificationsAsync() {
    if (!Device.isDevice) {
        alert("Push notifications are only supported by physical devices")
        return null
    }

    const {status} = await Notifications.requestPermissionsAsync();

    if (status !== 'granted') {
        alert("Failed to get push token for push notification")
        return null
    }

    //specific to android platform
    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync("default", {
            name: "default",
            importance: Notifications.AndroidImportance.MAX,
        })
    }

    try {
        const expoToken = await Notifications.getExpoPushTokenAsync({
            experienceId: '@wiredin_expo/caju-tns'
        })

        return expoToken.data

    } catch (e) {
        console.log("Error =>", e.message)
    }

}
