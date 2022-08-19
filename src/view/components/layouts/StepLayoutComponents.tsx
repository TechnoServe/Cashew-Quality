import React, {useState} from 'react';
import {Alert, Dimensions, Image, Modal, Text, View} from 'react-native';
import {Colors, styles} from "../../styles";
import {useNavigation, useRoute} from "@react-navigation/native";
import {Button, IconButton, ProgressBar} from "react-native-paper";
import {Strings} from "../../../core/utils";
import {prepareStepData} from "../../../controller/qar_controller/qap_data_controller";
import i18n from 'i18n-js';
import {UPSERT_QAP_DATA_REQUEST} from "../../../model/qap-data/actions";
import {useAppDispatch, useAppSelector} from "../../../core/hooks";


/* ########################################################################################
* Layout Components
* */
export const TopBoxComponent = ({screenTitle, progress}) => {
    return (
        <View style={styles.topBox}>
            <Text>{`${screenTitle}`}</Text>
            <ProgressBar
                color={Colors.TERTIARY}
                style={{marginVertical: 16, height: 8, width: Dimensions.get("window").width - 32, borderRadius: 16}}
                progress={progress}/>
        </View>
    )
}

/* Instructions modal view Component */
export const InstructionsModalComponent = ({instructions}) => {

    const [modalVisible, setModalVisible] = useState(false);
    const route = useRoute();
    let imgURI

    // Switching images for each step screen.
    if (route.name === Strings.STEP_ONE_SCREEN_NAME) {
        imgURI = require('../../../../assets/images/weight.jpg')
    } else if (route.name === Strings.INITIAL_STEP_SCREEN_NAME) {
        imgURI = require('../../../../assets/images/bags.jpg')
    } else if (route.name === Strings.STEP_TWO_SCREEN_NAME) {
        imgURI = require('../../../../assets/images/count.jpg')
    } else if (route.name === Strings.STEP_THREE_SCREEN_NAME) {
        imgURI = require('../../../../assets/images/step_1.jpg')
    } else if (route.name === Strings.STEP_FOUR_SCREEN_NAME) {
        imgURI = require('../../../../assets/images/foreign.jpg')
    } else if (route.name === Strings.STEP_FIVE_SCREEN_NAME) {
        imgURI = require('../../../../assets/images/good.jpg')
    } else if (route.name === Strings.STEP_SIX_SCREEN_NAME) {
        imgURI = require('../../../../assets/images/spotted.jpg')
    } else if (route.name === Strings.STEP_SEVEN_SCREEN_NAME) {
        imgURI = require('../../../../assets/images/immature_kernels.jpg')
    } else if (route.name === Strings.STEP_EIGHT_SCREEN_NAME) {
        imgURI = require('../../../../assets/images/oily.jpg')
    } else if (route.name === Strings.STEP_NINE_SCREEN_NAME) {
        imgURI = require('../../../../assets/images/bad.jpg')
    } else {
        imgURI = require('../../../../assets/images/void.jpg')
    }

    return (
        <View style={{marginHorizontal: 16}}>
            <Modal
                animationType="slide"
                visible={modalVisible}
                transparent={true}
                presentationStyle="overFullScreen"
            >
                <View style={styles.modalWrapper}>
                    <View style={{
                        alignItems: "center",
                        borderRadius: 16,
                        width: "90%",
                        backgroundColor: "white",
                        overflow: "hidden"
                    }}>
                        <Image
                            source={imgURI}
                            resizeMode="contain"
                            style={{height: 250, marginBottom: 16}}
                        />
                        {instructions && <Text style={{...styles.modalText, padding: 5}}>{instructions}</Text>}

                        <IconButton
                            icon="close-circle"
                            color={Colors.PRIMARY}
                            size={44}
                            onPress={() => setModalVisible(!modalVisible)}
                        />

                    </View>
                </View>
            </Modal>

            <IconButton
                icon="information"
                size={28}
                color={Colors.PRIMARY}
                onPress={() => {
                    setModalVisible(true);
                }}
            />
        </View>
    );
}

/**
 * Component that contains next and clear buttons
 * @param props that are inherited from StepComponent.js
 * @returns Button components
 */
export const BottomButtonsComponent = (props) => {
    const navigation = useNavigation();
    const dispatch = useAppDispatch()
    const {is_uploading, in_progress} = useAppSelector(state => state.qap_data)

    const save_step_data = () => {

        return dispatch({
            type: UPSERT_QAP_DATA_REQUEST,
            payload: prepareStepData(props),
            in_progress: true,
            is_uploading: false,
            next_button: props.nextButton,
            navigation,
            request: props.request,
            image_uri: props.image_uri,
            step_name: props.step_name
        })
    }

    //when go home is pressed
    const goToHome = () => {
        Alert.alert(
            null,
            i18n.t("saveAsDraftDialog"),
            [
                {
                    text: i18n.t("No"),
                    style: "cancel",
                },
                {
                    text: i18n.t("Yes"),
                    onPress: () => {
                        //set sync status to 0 to push to server
                        //save the progress
                        if (props.qar[props.step_name] && !isNaN(props.qar[props.step_name])) {

                            dispatch({
                                type: UPSERT_QAP_DATA_REQUEST,
                                in_progress: false,
                                is_uploading: true,
                                payload: prepareStepData(props),
                                navigation,
                                request: props.request,
                                image_uri: props.image_uri,
                                step_name: props.step_name,
                                resume_later: true //to know when to update the QAR status
                            })
                        }
                    },
                    style: "destructive",
                },
            ],
            {cancelable: false}
        );
    }

    return (
        <View style={{marginTop: 32, marginBottom: 16}}>

            <Button
                mode="contained"
                loading={in_progress}
                contentStyle={styles.buttonStyle}
                disabled={props.disabled || in_progress || is_uploading}
                onPress={() => save_step_data()}
            >
                {i18n.t('Next')}
            </Button>

            <Button
                loading={is_uploading}
                style={{marginVertical: 8}}
                contentStyle={styles.buttonStyle}
                disabled={props.disabled || is_uploading || in_progress}
                onPress={() => goToHome()}
            >
                {i18n.t("saveAsDraft")}
            </Button>


        </View>

    )
}

