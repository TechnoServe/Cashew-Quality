import React, {useEffect, useState} from 'react';
import {ScrollView, View} from 'react-native';
import {Colors, styles} from "../styles";
import {Button} from "react-native-elements";
import AlertConfirmBox from '../../core/utils/alertBox';
import FadeInView from "../components/FadeInView";
import {ResultModel} from "../../model/result/ResultModel";
import {Snackbar} from "react-native-paper";
import ResultsCard from "../components/ResultsCard";
import {getCalculatedQarResults} from "../../controller/qar_controller/qar_results_controller";
import {LotInfoCard, UserInfoCard} from "../components/InfoCards";
import i18n from 'i18n-js';
import {find} from "lodash";
import {CREATE_QAR_RESULT_REQUEST} from "../../model/result/actions";
import {useAppDispatch, useAppSelector} from "../../core/hooks";
import {User} from "../../model/user/UserModel";


const ReviewScreen = ({route, navigation}) => {

    const [buyer, setBuyer] = useState<User>()
    const [results, setResults] = useState(new ResultModel())
    const [visibleSnack, setVisibleSnack] = useState({msg: '', bool: false})
    const current_qar_id = route.params?.request.id;

    const dispatch = useAppDispatch()
    const {user, qap_data, qar_listing, qar_results} = useAppSelector(state => state)

    const {user_info: loggedUser} = user

    const current_dataset = find(qap_data.all_data, {request_id: current_qar_id})
    const current_qar = find(qar_listing.display_qars, {_id: current_qar_id})

    //get local data
    useEffect(() => {
        let isActive = true
        if (isActive) {
            //same buyer from the initial screen
            setBuyer(current_qar.buyer_obj)

            //await saveResults(current_qar.id)
            setResults(getCalculatedQarResults(current_dataset))
        }
        return () => {
            isActive = false;
        }
    }, []);

    //this is needed to prevent continuous reading.
    const onConfirm = () => {
        AlertConfirmBox(i18n.t("Are you sure you want to save your results?"), () => saveToFB())
    }

    const saveToFB = async () => {

        dispatch({
            type: CREATE_QAR_RESULT_REQUEST,
            payload: results,
            dataset: current_dataset,
            notification_data: {
                user_id: buyer ? buyer._id : null,
                title: "Audit Request Completed",
                body: "Audit request " + current_qar.request_code + " results are ready for you. \nRecorded by " + loggedUser.names
            },
            navigation
        })
    }

    return (
        <ScrollView style={[styles.container, {backgroundColor: Colors.GRAY_LIGHT}]}>
            <ResultsCard results={results}/>
            <LotInfoCard lot_info={current_dataset['lot_info']}/>
            {(buyer && buyer.telephone.length > 4) &&
                (<FadeInView>
                    <UserInfoCard user={buyer} userType="Buyer"/>
                </FadeInView>)
            }

            <View style={{marginBottom: 32}}>
                <Button
                    title={i18n.t("Confirm")}
                    disabled={qar_results.in_progress}
                    loading={qar_results.in_progress}
                    type="solid"
                    buttonStyle={[styles.buttonStyle, {backgroundColor: Colors.TERTIARY}]}
                    onPress={() => onConfirm()}
                />
            </View>
            <Snackbar
                visible={visibleSnack.bool}
                duration={3000}
                onDismiss={() => setVisibleSnack({msg: '', bool: false})}>
                Hey there! I'm a Snackbar.
            </Snackbar>
        </ScrollView>
    )
}

export default ReviewScreen;
