import React, {useEffect} from "react";
import {useDispatch} from "react-redux";
import {useRoute} from "@react-navigation/native";
import {DEVICE_LOCATION_REQUEST} from "../../../model/user/actions";
import {Alert, Image, Platform, TouchableOpacity, View} from "react-native";
import * as ImagePicker from "expo-image-picker";
import {Strings} from "../../../core/utils";
import {Colors, styles} from "../../styles";
import i18n from "i18n-js";
import {Icon} from "react-native-elements";
import RequiredComponent from "../RequiredComponent";

export const CaptureQarImage = (props) => {
    //react-redux hooks
    const dispatch = useDispatch()
    const route = useRoute();

    useEffect(() => {
        (async () => {
            dispatch({type: DEVICE_LOCATION_REQUEST})
            if (Platform.OS !== 'web') {
                const {status} = await ImagePicker.requestCameraPermissionsAsync();
                if (status !== 'granted') {
                    alert('Sorry, we need camera permissions to make this work!');
                }
            }

        })();
    }, [props.captured_image]);

    const checkStep = () => {
        if (route.name === Strings.STEP_ONE_SCREEN_NAME) {
            return {
                image: require("../../../../assets/images/weight.jpg"),
                isDefault: true
            }
        } else if (route.name === Strings.STEP_THREE_SCREEN_NAME) {
            return {
                image: require("../../../../assets/images/step_1.jpg"),
                isDefault: true
            }
        } else {
            return {
                image: props.captured_image && {uri: props.captured_image},
                isDefault: false
            }
        }
    }

    return (
        <View>
            <View style={styles.imageBox}>

                <TouchableOpacity disabled={checkStep().isDefault} onPress={() => Alert.alert(
                    i18n.t('photoInstructionTitle'),
                    i18n.t('photoIntructionText'),
                    [
                        {text: i18n.t('Cancel'), style: 'cancel'},
                        {
                            text: i18n.t('Continue'),
                            onPress: props.launchCamera()
                        },
                    ],
                )}>

                    {checkStep().image &&
                        <View style={checkStep().isDefault ? {alignItems: 'center'} : ''}>
                            <Image
                                source={checkStep().image}
                                resizeMode="cover"
                                style={{height: 200}}
                            />
                        </View>
                    }

                    {!checkStep().image &&
                        <View style={styles.imageStyleEmpty}>
                            <Icon
                                type="material-community"
                                reverse
                                color={Colors.GRAY_DARK}
                                name="camera-plus"
                                size={34}/>
                        </View>
                    }
                </TouchableOpacity>
            </View>

            {props.step_name === "good_kernel" && !props.isValidImage &&
                <RequiredComponent text={i18n.t("This Image is Required")}/>
            }
        </View>
    )
}