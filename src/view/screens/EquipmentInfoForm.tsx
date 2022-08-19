import React, {useEffect, useState} from 'react'
import {Colors, styles} from "../styles";
import {KeyboardAvoidingView, ScrollView} from "react-native";
import {Button} from "react-native-paper";
import AlertConfirmBox from "../../core/utils/alertBox";
import i18n from 'i18n-js';
import {Equipment} from '../../controller/user_controller/user_controller';
import {EquipEditCard} from "../components/EquipEditCard";
import {useAppDispatch, useAppSelector} from "../../core/hooks";
import {SET_EQUIPMENT_REQUEST} from "../../model/user/actions";


const EquipmentInfoForm = ({navigation}) => {

    const {user_info: loggedUser, in_progress} = useAppSelector(state => state.user)

    const {isConnected} = useAppSelector(state => state.reachable);
    const dispatch = useAppDispatch()

    // State variables
    const [scaleModelNo, setScaleModelNo] = useState();
    const [scaleManDate, setScaleManDate] = useState();
    const [meterModelNo, setMeterModelNo] = useState();
    const [meterManDate, setMeterManDate] = useState();
    const [scaleImageUri, setScaleImageUri] = useState();
    const [meterImageUri, setMeterImageUri] = useState();

    const addEquipment = async () => {
        const localEquipObj: Equipment = {
            scale: {
                image_url: scaleImageUri || null,
                manufacture_date: scaleManDate || null,
                model_no: scaleModelNo || null,
                type: 'Weight Scale'
            },
            meter: {
                image_url: meterImageUri || null,
                manufacture_date: meterManDate || null,
                model_no: meterModelNo || null,
                type: 'Moisture Meter'
            }
        }
        dispatch({
            type: SET_EQUIPMENT_REQUEST,
            payload: localEquipObj,
            loggedUser,
            navigation
        })
    }


    const onConfirm = () => {
        AlertConfirmBox(i18n.t("Are you sure to update?"), addEquipment)
    }


    /* If current user has equipment info (weigh scale & moisture meter) already uploaded, use it to set the respective states & fields of the form. */
    useEffect(() => {

        if (
            loggedUser.equipment != null
            && loggedUser.equipment.meter) {
            setMeterModelNo(loggedUser.equipment.meter.model_no || '');
            setMeterImageUri(loggedUser.equipment.meter.image_url || '');
            setMeterManDate(loggedUser.equipment.meter.manufacture_date || '');
        }

        if (
            loggedUser.equipment != null
            && loggedUser.equipment.scale) {
            setScaleModelNo(loggedUser.equipment.scale.model_no || '');
            setScaleImageUri(loggedUser.equipment.scale.image_url || '');
            setScaleManDate(loggedUser.equipment.scale.manufacture_date || '');
        }
    }, [])

    return (
        <KeyboardAvoidingView style={{flex: 1, backgroundColor: Colors.WHITE}}>
            <ScrollView contentContainerStyle={{padding: 16}} keyboardShouldPersistTaps="handled">
                <EquipEditCard
                    title={i18n.t("HEADER_WEIGHING_SCALE")}
                    setModelNumber={(val) => setScaleModelNo(val)}
                    modelNumber={scaleModelNo}
                    setManDate={(val) => setScaleManDate(val)}
                    manDate={scaleManDate}
                    type="weight_scale"
                    loggedUser={loggedUser}
                    setImageUrl={(image) => setScaleImageUri(image)}
                    image_url={scaleImageUri}/>

                <EquipEditCard
                    title={i18n.t("HEADER_MOISTURE_METER")}
                    setModelNumber={(val) => setMeterModelNo(val)}
                    modelNumber={meterModelNo}
                    setManDate={(val) => setMeterManDate(val)}
                    manDate={meterManDate}
                    type="moisture_meter"
                    loggedUser={loggedUser}
                    setImageUrl={(image) => setMeterImageUri(image)}
                    image_url={meterImageUri}/>

                <Button
                    mode={"contained"}
                    disabled={!isConnected || in_progress}
                    loading={in_progress}
                    contentStyle={styles.buttonStyle}
                    onPress={() => onConfirm()}
                >
                    {i18n.t("BTN_SAVE_EQUIPMENTINFO")}
                </Button>

            </ScrollView>
        </KeyboardAvoidingView>

    )
        ;
}

export default EquipmentInfoForm;
