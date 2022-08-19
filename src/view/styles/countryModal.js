import {StyleSheet} from "react-native";
import * as Colors from "./colors";

export const telephoneInput = StyleSheet.create({
    flagSection: {
        //flex: 1,
        flexDirection: 'row',
        //justifyContent: 'center',
        //alignItems: 'center',
        //backgroundColor: '#fff',
        // marginLeft: 20,
        //marginRight: 31
    },
    flagIcon: {
        paddingVertical: 8,
        paddingStart: 8,
        flexDirection: "row",
        alignItems: "center"
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 8,
        borderColor: Colors.GRAY_MEDIUM,
        fontSize: 16,
        padding: 8,
        marginHorizontal: 0,
        marginVertical: 8
    }

})

export const loginInput = StyleSheet.create({
    input: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 8,
        borderColor: Colors.GRAY_MEDIUM,
        fontSize: 16,
        padding: 8,
        marginHorizontal: 0,
        marginVertical: 8
    }
})

export const countryList = StyleSheet.create({
    textStyle: {
        padding: 5,
        fontSize: 20,
        color: Colors.BLACK
    },
    countryStyle: {
        backgroundColor: '#d3d3d3',
        borderTopColor: 'white',
        borderTopWidth: 1,
        padding: 5,
    },
    closeButtonStyle: {
        height: 54,
        alignItems: 'center',
    }
})
