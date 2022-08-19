import {StyleSheet} from "react-native";
import * as Colors from "./colors";

export const cameraStyles = StyleSheet.create({
    flipCircleButton: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,

    },
    flipButton: {
        flex: 0.5,
        height: 40,
        marginHorizontal: 2,
        marginBottom: 10,
        marginTop: 30,
        borderRadius: 8,
        borderColor: 'white',
        borderWidth: 2,
        padding: 5,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.PRIMARY
    },
    flipText: {
        color: 'white',
        fontSize: 15,
    },
    cirleButton: {
        padding: 5,
        height: 85,
        width: 85,  //The Width must be the same as the height
        borderRadius: 200, //Then Make the Border Radius twice the size of width or Height
        backgroundColor: Colors.PRIMARY,
        borderWidth: 6,
        borderColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',

    }
});