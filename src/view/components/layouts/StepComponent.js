import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import i18n from 'i18n-js';
import {find, inRange, isEmpty, zipObject} from 'lodash'
import React, {useEffect, useState} from 'react';
import {ActivityIndicator, ScrollView, Text, View} from 'react-native';
import {Divider} from "react-native-elements";
import {useSelector} from "react-redux";
import {getStepImage} from "../../../controller/qar_controller/qar_images_controller";
import {firebaseDownloader} from "../../../core/utils/data";
import {Colors} from "../../styles";
import {InputForm} from "../InputComponents";
import {CaptureQarImage} from "../qar_listing/CaptureQarImage";
import {BottomButtonsComponent, InstructionsModalComponent, TopBoxComponent} from './StepLayoutComponents';

export const StepComponent = (props) => {
    const [inputData_WithoutShell, setInputData_WithoutShell] = useState('');
    const [inputData_WithShell, setInputData_WithShell] = useState('');
    const [isValid, setIsValid] = useState(true);
    const [errorMessage, setErrorMessage] = useState(i18n.t("This is a required field"));
    const [errorMessage2, setErrorMessage2] = useState(i18n.t("This is a required field"));
    const [validImage, setIsValidImage] = useState(true);
    const [captured_image, setCapturedImage] = useState();
    const [pullingImage, setPullingImage] = useState(false)

    const to_exclude = ['lot_info', 'nuts_weight', 'nut_count', 'moisture_content', 'foreign_materials'];
    const two_values_steps = ['spotted_kernel', 'immature_kernel', 'oily_kernel', 'bad_kernel', 'void_kernel']

    const {all_data} = useSelector(state => state.qap_data)
    const {device_location} = useSelector(state => state.user_location)
    const current_data = all_data && find(all_data, {request_id: props.request.id})
    const nut_weight = current_data && current_data['nuts_weight'] ? Number(current_data['nuts_weight'].with_shell) : 0

    // Concatenate the input name from step 6 with _without_shell and add the new second input
    let without_shell_key = props.step_name + '_without_shell'

    // Build each step's data (Quality Audit Process)
    let qap_data = zipObject(
        [props.step_name, (props.entries) ? without_shell_key : ""],
        [inputData_WithShell, (props.entries) ? inputData_WithoutShell : null]
    );

    // validation on each step
    const validate = (step_data) => {

        // From step 1 to 5
        setIsValid(!isEmpty(inputData_WithShell.toString()) || !isEmpty(inputData_WithoutShell.toString()))

        if (step_data) {
            step_data.with_shell.toString() && checkStepValue(step_data.with_shell.toString())
            step_data.without_shell.toString() && checkStepValue(step_data.with_shell.toString(), step_data.without_shell.toString())
        }

        // Mandatory Photo Capture for Step 5
        if (props.step_name === 'good_kernel') {
            setIsValidImage(!isEmpty(captured_image))
        }
    }

    //const audit_data = getQarData(props.request.id)

    //load local data
    useEffect(() => {
        let isActive = true;
        const auditData = async () => {

            const step_data = current_data[props.step_name]

            validate(step_data)
            if (isActive && step_data) {
                try {
                    if (step_data.with_shell.toString() && !inputData_WithShell) {
                        setInputData_WithShell(step_data.with_shell.toString())
                    }

                    if (step_data.without_shell.toString() && !inputData_WithoutShell) {
                        setInputData_WithoutShell(step_data.without_shell.toString())
                    }

                    if (step_data.has_image && !captured_image) {

                        // let image_path = getImageDir(props.request.id) + props.step_name + ".jpg"
                        let image_path = await getStepImage(props.request.id, props.step_name)

                        // let image_name = getImageName(image_path)
                        let isImageExists = await FileSystem.getInfoAsync(image_path)

                        if (isImageExists.exists) {
                            // Set image to display
                            setCapturedImage(image_path)
                            setIsValidImage(true)
                        } else {
                            // firebase image_name will always be equal to step_name
                            setPullingImage(true)
                            const downloaded_image = await firebaseDownloader(props.request.id, props.step_name + ".jpg")
                            setCapturedImage(downloaded_image)
                            setIsValidImage(true)
                            setPullingImage(false)
                        }
                    }
                } catch (error) {
                    setPullingImage(false)
                    console.log(error)
                }
            }
        }
        auditData()

        return () => {
            // setInputData_WithShell('')
            isActive = false;
        };
    }, [captured_image]);

    // launch camera
    const launchCamera = async () => {
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [16, 9],
            quality: 0.3,

        });

        if (!result.cancelled) {
            setCapturedImage(result.uri);
        }
    };

    const checkStepValue = (val, val2 = inputData_WithoutShell) => {

        if (Number(val) >= 0 && !to_exclude.includes(props.step_name)) {
            if (two_values_steps.includes(props.step_name)) {
                setErrorMessage(null)
                setErrorMessage2(null)
                //1. check if val < nut v
                if (Number(val) < nut_weight) {
                    if (val2 && Number(val) >= Number(val2)) {
                        setIsValid(true)
                        setErrorMessage(null)
                        setErrorMessage2(null)
                    } else {
                        setIsValid(false)
                        setErrorMessage2(i18n.t("Value without shell must be less than the value with shell above"))
                    }
                } else {
                    setIsValid(false)
                    setErrorMessage(i18n.t("Value must be less than total nut weight") + nut_weight)
                    setErrorMessage2(null)
                }

            } else if (Number(val) < nut_weight) {
                if (props.step_name === 'good_kernel') {
                    setIsValidImage(!isEmpty(captured_image))
                    setErrorMessage(null)
                }
                setIsValid(Number(val) > 0)
            } else {
                setIsValid(false)
                setErrorMessage(i18n.t("Value must be less than total nut weight") + nut_weight)
            }
        } else {
            switch (props.step_name) {
                case 'nuts_weight':
                    setIsValid(inRange(Number(val), 990, 1010))
                    setErrorMessage(i18n.t("Total nut weight must be between 999 and 1001"))
                    break;
                case 'moisture_content':
                    setIsValid(inRange(Number(val), 0, 101) && val !== '')
                    setErrorMessage(i18n.t("step3val"))
                    break;
                case 'nut_count':
                    setIsValid(Number.isInteger(Number(val)) && Number(val) > 0)
                    setErrorMessage(i18n.t("step2val"))
                    break;
                case 'foreign_materials':
                    setIsValid(Number.isInteger(Number(val)) && Number(val) >= 0 && val !== '')
                    setErrorMessage(i18n.t("step4val"))
                    break;
                default:
                    setIsValid(val > 0)
                    setErrorMessage(i18n.t("This is a required field"))
            }
        }

    }

    return (
        <ScrollView keyboardShouldPersistTaps={"handled"} contentContainerStyle={{
            backgroundColor: Colors.WHITE,
            flexGrow: 1,
            padding: 16,
            justifyContent: 'space-between',
        }}>
            <View>
                <TopBoxComponent screenTitle={props.title} progress={props.progress}/>

                {pullingImage ? <ActivityIndicator/> :
                    <CaptureQarImage
                        {...props}
                        isValidImage={!!captured_image}
                        captured_image={captured_image}
                        pulling_image={pullingImage}
                        launchCamera={() => launchCamera}
                    />
                }

                <Divider style={{marginVertical: 16}}/>

                <View style={{flexDirection: "row", alignItems: "center", marginBottom: 8}}>
                    <Text style={{
                        fontWeight: "bold",
                        fontSize: 17,
                        textAlignVertical: "center"
                    }}>
                        {props.placeholder}
                    </Text>
                    <InstructionsModalComponent instructions={props.infoText}/>
                </View>

                <View>
                    {props.entries === true &&
                        <Text
                            style={{fontSize: 12, fontWeight: "bold", textAlign: 'left'}}>{i18n.t("With shell")}</Text>
                    }
                    <InputForm
                        metrics={props.metrics}
                        value={inputData_WithShell}
                        keyboardType="decimal-pad"
                        required={true}
                        errorMessage={!isValid && errorMessage}
                        isValid={isValid}
                        onChangeText={value => {
                            setInputData_WithShell(value)
                            checkStepValue(value)
                        }}
                    />
                </View>

                {props.entries === true &&
                    <View>
                        <Text style={{
                            fontSize: 12,
                            fontWeight: "bold",
                            textAlign: 'left'
                        }}>{i18n.t("Without shell")}</Text>
                        <InputForm
                            metrics={props.metrics}
                            value={inputData_WithoutShell}
                            keyboardType="decimal-pad"
                            required={true}
                            errorMessage={!isValid && errorMessage2}
                            isValid={isValid}
                            onChangeText={value => {
                                setInputData_WithoutShell(value)
                                checkStepValue(inputData_WithShell, value)
                            }}
                        />
                    </View>
                }
            </View>

            <BottomButtonsComponent
                disabled={!isValid || !validImage}
                qar={qap_data}
                device_location={device_location}
                {...props}
                image_uri={captured_image}
            />
        </ScrollView>
    )
}