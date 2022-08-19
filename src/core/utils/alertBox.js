import React from "react"
import {Alert} from "react-native"
import i18n from 'i18n-js';

export default function AlertConfirmBox(message, action) {
    // Works on both Android and iOS
    Alert.alert(
        i18n.t("Alert"),
        message,
        [
            {
                text: i18n.t("No"),
                style: "cancel",
            },
            {
                text: i18n.t("Yes"),
                onPress: action,
                style: "destructive",
            },
        ],
        {cancelable: false}
    );
}

export const AlertMessageBox = (message, action) => {
    // Works on both Android and iOS
    Alert.alert(
        "Action Needed",
        message,
        [
            {
                text: "Okay",
                onPress: action,
            },
        ],
        {cancelable: false}
    );
}
