/**
 * Module generates a GPS location.
 */


import * as Location from 'expo-location';
import Constants from 'expo-constants';
import {Platform} from 'react-native';
import * as Network from 'expo-network';
import i18n from 'i18n-js';


const getGPSLocation = async () => {

    if (Platform.OS === 'android' && !Constants.isDevice) {
        alert(i18n.t("ALERT_ANDROID_EMULATOR_GPS_EXCEPTION"));
    }

    const {status} = await Location.requestForegroundPermissionsAsync()
        .catch((e) => {
            alert(i18n.t("ALERT_LOCATION_PERMISSION_REQUIREMENT_NOTICE"))
        });

    if (status === 'granted') {
        // ToastAndroid.show(i18n.t("TOAST_PROCEED_TO_IMAGE_CAPTURE"), 8);
        // ToastAndroid.show(status, 8);
        if (onAirplane) {
            /* Getting last known position of the device. Typically received courtesy of location services, (when device was last online). To be used in airplane mode. */
            const location = await Location.getLastKnownPositionAsync()
                .catch(() => console.log("Last known location retrieval error: ", e));

            return {
                location,
                status
            };

            /* Getting current position with quick response and lower accuracy. Doesn't seem to work without enabling location services */
        } else {

            return await Location.getCurrentPositionAsync({})
        }
    } else {
        alert(i18n.t("ALERT_LOCATION_PERMISSION_REQUIREMENT_NOTICE"));
    }

    const onAirplane = await Network.isAirplaneModeEnabledAsync();
}

export default getGPSLocation;