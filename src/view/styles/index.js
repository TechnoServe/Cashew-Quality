import {StyleSheet} from "react-native";
import {DefaultTheme} from '@react-navigation/native';
import * as Colors from "./colors";
import React from "react";

export const MyTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: Colors.PRIMARY
    },
};
export {Colors}

//Stylesheet
export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16
    },

    topBox: {
        alignItems: 'center',
    },
    imageBox: {
        borderRadius: 16,
        backgroundColor: "white",
        overflow: "hidden"
    },
    formBox: {
        borderColor: Colors.GRAY_MEDIUM,
        borderWidth: 1,
        borderRadius: 8,
        height: 44,
        paddingStart: 12
    },
    bottomBox: {
        flexDirection: 'row',
        justifyContent: "space-between",
    },
    groupedList: {
        backgroundColor: "white",
        borderRadius: 8,
        overflow: "hidden",
        marginBottom: 16,
    },
    infoBox: {
        marginLeft: 10,
    },
    buttonStyle: {
        minHeight: 34, //material ui spec
        padding: 8,
        borderRadius: 8,
        // backgroundColor: Colors.PRIMARY

    },
    imageStyle: {
        width: 200,
        height: 200,
        alignSelf: "center",
    },
    imageStyleEmpty: {
        height: 200,
        borderStyle: "dashed",
        borderWidth: 3,
        borderRadius: 1, // required for dash style to appear
        borderColor: Colors.GRAY_MEDIUM,
        justifyContent: "center",
        alignItems: "center"
    },

    imageStyleEmptySmall: {
        height: 80,
        borderStyle: "dashed",
        width: 80,
        borderWidth: 1.5,
        borderRadius: 1, // required for dash style to appear
        borderColor: Colors.GRAY_MEDIUM,
        justifyContent: "center",
        alignItems: "center"
    },
    inputStyle: {
        borderWidth: 1,
        borderRadius: 8,
        borderColor: Colors.GRAY_MEDIUM,
        fontSize: 16,
        padding: 8,
        marginHorizontal: 0,
        marginVertical: 8
    },
    titleStyle: {
        fontSize: 20,
        fontWeight: "bold",
        alignSelf: 'center',
    },
    badgeStyle: {
        backgroundColor: Colors.PRIMARY,
        borderWidth: 0,
        width: 70,
        height: 30
    },
    modalWrapper: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)"
    },
    modalContent: {
        borderRadius: 16,
        padding: 16,
        width: "90%",
        backgroundColor: "white",
    },
    openButton: {
        backgroundColor: "#F194FF",
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    },
    smallGrayTextCentered: {
        fontSize: 10,
        color: Colors.GRAY_MEDIUM,
        marginBottom: 10,
        alignSelf: 'center',
    },

    iconStyle: {
        color: '#5a52a5',
        fontSize: 28,
        marginLeft: 15
    },
})
