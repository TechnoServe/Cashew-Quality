import {Text, View} from "react-native";
import React from "react";
import {Colors} from "react-native-paper";
import {Icon} from "react-native-elements";
import {isEmpty} from "lodash";

const ErrorMessage = ({error}) => {

    if (isEmpty(error)) {
        return null
    }
    return (
        <View style={{
            alignItems: "flex-start",
            flexDirection: "row",
            backgroundColor: Colors.red50,
            borderRadius: 8,
            paddingVertical: 8,
            paddingHorizontal: 8,
            marginBottom: 8
        }}>
            <Icon name="shield-alert" color={Colors.red800} type="material-community" size={18}
                  style={{marginEnd: 8}}/>
            <Text style={{color: Colors.red800, flexShrink: 1}}>
                {error}
            </Text>
        </View>
    )
}

export {ErrorMessage}


export const SuccessMessage = ({message}) => {
    return (
        <View style={{
            alignItems: "flex-start",
            flexDirection: "row",
            backgroundColor: Colors.greenA700,
            borderRadius: 8,
            paddingVertical: 8,
            paddingHorizontal: 8,
            marginBottom: 8
        }}>
            <Icon name="shield-check" color={Colors.lightGreen50} type="material-community" size={18}
                  style={{marginEnd: 8}}/>
            <Text style={{color: Colors.lightGreen50, flexShrink: 1}}>
                {message}
            </Text>
        </View>
    )
}

/**
 * Component for showing Form validation errors
 * @param message
 * @returns {JSX.Element}
 * @constructor
 */
export const FormFieldError = ({message}) => {

    if (isEmpty(message)) return null

    return (
        <Text style={{
            marginBottom: 8,
            fontSize: 10,
            color: Colors.red800,
            fontWeight: "bold",
            textAlign: "left"
        }}>
            {message}
        </Text>
    )
}