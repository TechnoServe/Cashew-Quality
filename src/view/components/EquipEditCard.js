import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import i18n from "i18n-js";
import moment from "moment";
import React, {createRef, useState} from "react";
import {Image, Text, TouchableOpacity, View} from "react-native";
import ActionSheet from "react-native-actions-sheet";
import {Divider, Icon} from "react-native-elements";
import {Colors, styles} from "../styles";
import {InputForm, InputFormView} from "./InputComponents";


export const EquipEditCard = (props) => {
    const [show, setShow] = useState(false);

    const actionSheetRef = createRef();

    const onChange = (event, selectedDate) => {
        setShow(false)
        const currentDate = selectedDate.toISOString() || props.manDate;
        props.setManDate(currentDate);
    };

    // launch camera
    const takeImage = async (source) => {
        actionSheetRef.current?.setModalVisible(false);
        const {status} = await ImagePicker.getCameraPermissionsAsync();
        if (!status) alert(i18n.t("ALERT_CAMERA_PERMISSION"))

        let result
        if (source === "camera") {
            result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.3,

            });
        } else {
            result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.3,
            });
        }

        if (!result.cancelled) {
            props.setImageUrl(result.uri)
        }
    };

    return (
        <View style={{
            backgroundColor: Colors.WHITESMOKE,
            marginBottom: 16,
            padding: 10,
            borderRadius: 8,
        }}>
            <View style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center"
            }}>
                <Text style={{
                    fontWeight: "bold",
                    marginBottom: 10,
                    fontSize: 17
                }}>{props.title}</Text>
            </View>

            <View>
                <InputForm
                    label={i18n.t("TEXT_MODEL_NO")}
                    placeholder={i18n.t("INPUT_PLACEHOLDER_TEXT_MODEL_NO")}
                    value={props.modelNumber}
                    onChangeText={scaleModelNo => props.setModelNumber(scaleModelNo)}
                    keyboardType="email-address"
                />
                <View style={{flexDirection: "row", alignItems: "center"}}>
                    <TouchableOpacity
                        style={{marginEnd: 16}}
                        onPress={() => {
                            actionSheetRef.current?.setModalVisible(true);
                        }}>
                        {props.image_url ?
                            <Image
                                source={{uri: props.image_url}}
                                style={[styles.imageStyle, {width: 80, height: 80, borderRadius: 8}]}
                            />

                            :

                            <View style={styles.imageStyleEmptySmall}>
                                <Icon
                                    type="material-community"
                                    color={Colors.GRAY_DARK}
                                    name="camera-plus"/>
                            </View>
                        }
                    </TouchableOpacity>

                    <View style={{flex: 1, backgroundColor: "#FFF", padding: 8, borderRadius: 8}}>
                        <View>
                            <Text style={{fontWeight: "normal", marginBottom: 8}}>
                                {i18n.t("manDate")}
                            </Text>

                            <InputFormView testId="dateText"
                                           inputData={props.manDate ? moment(props.manDate).format('LL') : "Select Date"}
                                           onPress={() => setShow(true)}/>

                        </View>
                    </View>
                </View>
            </View>

            {/*responsible for showing calendar modal*/}
            {show && (
                <DateTimePicker
                    testID="dateText"
                    value={props.manDate ? new Date(props.manDate) : new Date()}
                    mode="date"
                    maximumDate={new Date()}
                    display="default"
                    onChange={onChange}
                />
            )}

            {/*action sheet to select from gallery or take a photo*/}
            <ActionSheet ref={actionSheetRef}>
                <View style={{padding: 20}}>
                    <TouchableOpacity
                        onPress={() => takeImage("camera")}
                        style={{flexDirection: 'row', alignItems: 'center', paddingVertical: 8}}
                    >
                        <Icon type="material-community"
                              color={Colors.PRIMARY}
                              name="camera-plus"
                              size={24}/>
                        <Text style={{fontSize: 16, marginStart: 16}}>Take Photo</Text>
                    </TouchableOpacity>

                    <Divider style={{marginVertical: 8}}/>
                    <TouchableOpacity
                        onPress={() => takeImage("gallery")}
                        style={{flexDirection: 'row', alignItems: 'center', paddingVertical: 8}}
                    >
                        <Icon
                            type="material-community"
                            color={Colors.PRIMARY}
                            name="image-multiple"
                            size={24}/>
                        <Text style={{fontSize: 16, marginStart: 16}}>Choose from Gallery</Text>
                    </TouchableOpacity>
                </View>
            </ActionSheet>

        </View>
    )
}
