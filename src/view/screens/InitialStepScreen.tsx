import React, {useEffect, useState} from 'react';
import {ScrollView, Text, View,} from 'react-native';
import {styles} from "../styles";
import {Button} from "react-native-paper";
import {Strings} from "../../core/utils";
import FadeInView from "../components/FadeInView";
import {InputForm} from "../components/InputComponents";
import i18n from 'i18n-js';
import {InstructionsModalComponent} from '../components/layouts/StepLayoutComponents';
import {find, isEmpty} from "lodash";
import {UserInfoCard} from "../components/InfoCards";
import {useDispatch} from "react-redux";
import {UPSERT_QAP_DATA_REQUEST} from "../../model/qap-data/actions";
import {useAppSelector} from "../../core/hooks";


const InitialStepScreen = ({route, navigation}) => {

    const [countBags, setCountBags] = useState('');
    const [volOneBag, setVolumeBag] = useState('');
    const [stockVolume, setStockVolume] = useState('');
    const [countSampledBags, setCountSampledBags] = useState('');
    const [isValid, setIsValid] = useState(true);

    const buyer = route.params?.requestData.buyer

    const dispatch = useDispatch()
    const {all_data, in_progress} = useAppSelector(state => state.qap_data)

    //load local data
    useEffect(() => {
        let isActive = true;
        (function () {
            const current_data = find(all_data, {request_id: route.params?.requestData.id})
            const lot_info = current_data && current_data["lot_info"]

            setCountBags((lot_info && lot_info.count_bags.toString()) || '');
            setStockVolume((lot_info && lot_info.stock_volume.toString()) || '');
            setCountSampledBags((lot_info && lot_info.count_sampled_bags.toString()) || '');

            //set the bag_volume when the view loads.
            setVolumeBag(lot_info && (lot_info.stock_volume / lot_info.count_sampled_bags).toString() || '')
        })()
        return () => {
            isActive = false;
        };
    }, [])

    //save the the initial progress on click on the Start QA button
    const saveProgress = () => {
        let outGoingData = {
            request_id: route.params?.requestData.id,
            lot_info: {
                count_bags: Number(countBags),
                stock_volume: Number(stockVolume),
                count_sampled_bags: Number(countSampledBags),
                volume_bag: Number(volOneBag)

            }
        }

        return dispatch({
            type: UPSERT_QAP_DATA_REQUEST,
            payload: outGoingData,
            in_progress: true,
            next_button: Strings.STEP_ONE_SCREEN_NAME,
            request: route.params?.requestData,
            navigation,
            image_props: null,
            is_initial: true, //to know when to update the QAR status
        })

    }

    return (
        <ScrollView contentContainerStyle={{
            padding: 16,
            flexGrow: 1,
            justifyContent: 'space-between'
        }}>

            <View>
                {((buyer) && (buyer.telephone) && (buyer.telephone.length > 4))
                    &&
                    (<FadeInView>
                        <UserInfoCard user={buyer} userType="Buyer"/>
                    </FadeInView>)
                }

                <View>
                    <View style={{flexDirection: "row", alignItems: "center", marginBottom: 8}}>
                        <Text style={{
                            fontWeight: "bold",
                            fontSize: 17,
                            textAlignVertical: "center"
                        }}>{i18n.t('Lot Information')} </Text>

                        <InstructionsModalComponent instructions={null}/>
                    </View>
                    <View style={[styles.groupedList, {marginVertical: 8, padding: 16}]}>
                        <InputForm
                            label={i18n.t("Total Number of Bags")}
                            placeholder={i18n.t("Enter Number of Bags")}
                            value={countBags}
                            mgBtn={8}
                            metrics={i18n.t("Bags")}
                            keyboardType="decimal-pad"
                            isValid={true}
                            required={true}
                            onChangeText={count_bags => {
                                Number(count_bags) < Number(countSampledBags) ? setIsValid(false) : setIsValid(true)
                                setCountBags(count_bags.replace(/[^0-9]/g, ''))
                                setStockVolume((Number(count_bags.replace(/[^0-9]/g, '')) * Number(volOneBag)).toString())
                            }}
                        />

                        <InputForm
                            label={i18n.t("volOneBag")}
                            placeholder={i18n.t("volOneBagPlaceholder")}
                            value={volOneBag.toString()}
                            mgBtn={8}
                            metrics={i18n.t("MT")}
                            keyboardType="decimal-pad"
                            required={true}
                            onChangeText={volume_bag => {
                                setVolumeBag(volume_bag.replace(/^(\d{0,4}\.\d{0,5}|\d{0,9}|\.\d{0,8}\.*).*/, '$1'));
                                setStockVolume((Number(countBags) * Number(volume_bag.replace(/^(\d{0,4}\.\d{0,5}|\d{0,9}|\.\d{0,8}\.*).*/, '$1'))).toString())
                            }}
                        />

                        <InputForm
                            label={i18n.t("volStock")}
                            placeholder={i18n.t("Enter Bags Sampled")}
                            value={stockVolume.toString()}
                            mgBtn={0}
                            metrics={i18n.t("MT")}
                            keyboardType="decimal-pad"
                            required={true}
                            onChangeText={stockVol => {
                                setStockVolume(stockVol.replace(/^(\d{0,4}\.\d{0,5}|\d{0,9}|\.\d{0,8}\.*).*/, '$1'))
                                setVolumeBag(Math.floor(Number(stockVol.replace(/^(\d{0,4}\.\d{0,5}|\d{0,9}|\.\d{0,8}\.*).*/, '$1')) / Number(countBags)).toString())
                            }}
                        />

                        <InputForm
                            label={i18n.t("Number of Bags Sampled")}
                            placeholder={i18n.t("Enter Bags Sampled")}
                            value={countSampledBags}
                            mgBtn={8}
                            metrics={i18n.t("Bags")}
                            isValid={isValid}
                            errorMessage={i18n.t("Number of Bags Sampled must be at least 8% of Total Number of Bags")}
                            keyboardType="decimal-pad"
                            required={true}
                            onChangeText={count_sampled_bags => {
                                if (Number(count_sampled_bags) > 0) {
                                    const minsample = Number(countBags) * 0.08
                                    if ((Number(count_sampled_bags) >= minsample) && (Number(count_sampled_bags) <= Number(countBags))) {
                                        setIsValid(true)
                                    } else {
                                        setIsValid(false)
                                    }
                                } else {
                                    setIsValid(false)
                                }
                                setCountSampledBags(count_sampled_bags.replace(/[^0-9]/g, ''));
                            }}
                        />

                    </View>
                </View>
            </View>
            <Button
                mode="contained"
                disabled={
                    in_progress
                    || isEmpty(countBags)
                    || isEmpty(volOneBag)
                    || isEmpty(countSampledBags)
                    || !isValid
                }
                loading={in_progress}
                contentStyle={styles.buttonStyle}
                onPress={() => saveProgress()}
            >
                {i18n.t("Continue")}
            </Button>
        </ScrollView>
    )
}

export default InitialStepScreen
