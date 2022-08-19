import React, {useEffect, useState} from 'react';
import {ActivityIndicator, ScrollView, Text, ToastAndroid, View} from 'react-native';
import {Colors, styles} from "../../styles";
import {FontAwesome5, Ionicons, Zocial} from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import * as SMS from "expo-sms";
import {stylesLoading} from "../../styles/loading";
import ResultsCard from "../ResultsCard";
import moment from "moment";
import {getImageFromFirebase, qarImagesData} from "../../../controller/qar_controller/qar_images_controller"
import {LotInfoCard, SiteInfoCard, UserInfoCard} from "../InfoCards";
import i18n from 'i18n-js';
import {Button} from "react-native-paper";
import {find} from "lodash";
import {getImageDir} from "../../../core/utils/data";
import * as FileSystem from "expo-file-system";
import {useAppSelector} from '../../../core/hooks';


const RequestViewScreen = ({navigation, requestData, title}) => {

    const [smsAvailable, setSmsAvailable] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [userInfo, setUserInfo] = useState();

    const [downloadingImage, setDownloadingImage] = useState(false);
    const [getImages, setGetImages] = useState(false);

    // react-redux hooks
    const {qar_results, qap_data, user, reachable} = useAppSelector(state => state)

    const {isConnected} = reachable
    const {user_info: loggedUser} = user

    const current_result = find(qar_results.all_results, {request_id: requestData._id})
    const current_qap_data = find(qap_data.all_data, {request_id: requestData._id})

    async function renderOnImageSlider() {
        setGetImages(true)
        let imageData = await qarImagesData(current_qap_data)

        navigation.navigate("imageSlider", {
            title: title,
            imageValue: imageData.imageValueObjectTemp,
            imageSource: imageData.imageUrlsObjectTemp
        })
        setGetImages(false)
    }

    //get local data
    useEffect(() => {
        let isActive = true
        if (isActive) {
            async function setUpView() {
                setIsLoading(true)
                //same buyer from the initial screen
                if (loggedUser.user_type === 1) {
                    setUserInfo(requestData.buyer_obj)
                } else {
                    setUserInfo(requestData.field_tech_obj)
                }

                //check for device sms app
                const isAvailable = await SMS.isAvailableAsync();
                setSmsAvailable(isAvailable);

                //get remote images if locally not available
                const image_folder = await getImageDir(requestData._id)
                let dir = await FileSystem.readDirectoryAsync(image_folder);

                if (dir.length === 0 && isConnected) {
                    setDownloadingImage(true)
                    current_qap_data && (await getImageFromFirebase(requestData._id))
                    setDownloadingImage(false)
                }

                setIsLoading(false)
            }

            setUpView();

        }
        return () => {
            isActive = false;
        }
    }, []);

    if (isLoading) {
        return (
            <View style={stylesLoading.preloader}>
                <ActivityIndicator size="large" color={Colors.PRIMARY}/>
            </View>
        )

    }
    return (

        <ScrollView
            scrollIndicatorInsets={{top: 1, bottom: 1}}
            contentInsetAdjustmentBehavior="always"
            contentContainerStyle={{
                padding: 16,
                flexGrow: 1
            }}>

            {requestData.status === 2 &&
                <View>
                    <ResultsCard results={current_result}/>
                    <LotInfoCard lot_info={current_qap_data.lot_info}/>
                    <SiteInfoCard site={requestData.site_obj}/>
                    {(userInfo && userInfo.telephone.length > 4) &&
                        <UserInfoCard user={userInfo} userType={loggedUser.user_type === 1 ? 'Buyer' : 'Field Tech'}/>
                    }
                    <Button
                        mode="contained"
                        style={[styles.groupedList, {paddingVertical: 10, alignItems: "center"}]}
                        //color={Colors.PRIMARY}
                        onPress={() => renderOnImageSlider()}
                        loading={downloadingImage || getImages}
                        disabled={(downloadingImage || getImages)}
                    >
                        <Text style={{
                            fontSize: 15,
                            fontWeight: "bold",
                            color: Colors.TERTIARY
                        }}>{!downloadingImage && i18n.t("View Images & Values")}</Text>
                    </Button>


                    {loggedUser.user_type === 1 &&
                        <View style={{backgroundColor: 'white', borderRadius: 8, padding: 16, overflow: 'hidden'}}>
                            <Text style={{textAlign: "center", color: Colors.BLACK}}>
                                {i18n.t("Click on below icons to resend via other channels")}
                            </Text>
                            <View style={{
                                marginVertical: 16,
                                flexDirection: 'row',
                                justifyContent: 'space-around',
                            }}>

                                <View style={{alignItems: "center"}}>
                                    <Ionicons name="logo-whatsapp" size={40} color="#4FCE5D" onPress={() => {
                                        Linking.openURL('http://api.whatsapp.com/send?phone='
                                            + (userInfo && userInfo.telephone ? userInfo.telephone : "")
                                            + '&text=' +
                                            requestData.request_code + " " + i18n.t("Results") + "\n\n" +

                                            i18n.t("Nut count") + ": *" + current_result.nut_count + "*\n" +
                                            i18n.t("step3Name") + ": *" + current_result.moisture_content + "* %25\n" +
                                            i18n.t("Foreign materials") + ": *" + current_result.foreign_mat_rate + "* %25\n" +
                                            i18n.t("KOR") + ": *" + current_result.kor + "* LBS\n" +
                                            i18n.t("Defective Rate") + ": *" + current_result.defective_rate + "* %25\n\n" +

                                            i18n.t("Number of Bags") + ": *" + current_qap_data.lot_info.count_bags + "* " + i18n.t("Bags") + "\n" +
                                            i18n.t("Stock Volume") + ": *" + current_qap_data.lot_info.stock_volume + "* " + i18n.t("MT") + "\n" +
                                            i18n.t("Bags Sampled") + ": *" + current_qap_data.lot_info.count_sampled_bags + "*  " + i18n.t("Bags") + "\n\n" +

                                            i18n.t("Site Name") + ": *" + requestData.site_obj.name + "*\n" +
                                            i18n.t("Site Location") + ": *" + requestData.site_obj.location + "*\n\n" +

                                            i18n.t("Done by") + ": *" + requestData.field_tech_obj.names + " (" + requestData.field_tech_obj.telephone + ")*\n" +
                                            i18n.t("Date Processed") + ": \n*" + moment(current_result.created_at).format("ll") + "*\n"
                                        );
                                    }}/>
                                    <Text>WhatsApp</Text>
                                </View>

                                <View style={{alignItems: "center"}}>
                                    <FontAwesome5 name="sms" size={40} color="#0c4da2" onPress={async () => {
                                        if (!smsAvailable) {
                                            ToastAndroid.show("No SMS APP installed, please install and try again.", 5)
                                            return; //stop from here.
                                        }
                                        await SMS.sendSMSAsync(
                                            (userInfo && userInfo.telephone) ? userInfo.telephone : "",
                                            requestData.request_code + " " + i18n.t("Results") + "\n\n\n" +

                                            i18n.t("Nut count") + ": \t" + current_result.nut_count + "\n" +
                                            i18n.t("step3Name") + ": \t\t" + current_result.moisture_content + " %\n" +
                                            i18n.t("Foreign materials") + ": \t\t" + current_result.foreign_mat_rate + " %\n" +
                                            i18n.t("KOR") + ": \t\t" + current_result.kor + " " + i18n.t("lbs") + "\n" +
                                            i18n.t("Defective Rate") + ": \t\t" + current_result.defective_rate + " %\n\n" +

                                            i18n.t("Number of Bags") + ": \t\t" + current_qap_data.lot_info.count_bags + " " + i18n.t("Bags") + "\n" +
                                            i18n.t("Stock Volume") + ": \t\t" + current_qap_data.lot_info.stock_volume + " " + i18n.t("MT") + "\n" +
                                            i18n.t("Bags Sampled") + ": \t\t" + current_qap_data.lot_info.count_sampled_bags + i18n.t("Bags") + "\n\n" +

                                            i18n.t("Site Name") + ": \t\t" + requestData.site_obj.name + "\n" +
                                            i18n.t("Site Location") + ": \t\t" + requestData.site_obj.location + "\n\n" +

                                            i18n.t("Done by") + ": \t" + requestData.field_tech_obj.names + " (" + requestData.field_tech_obj.telephone + ")\n" +
                                            i18n.t("Date Processed") + ": \n" + moment(current_result.created_at).format("ll") + "\n"
                                        ).catch(e => {
                                            console.log("SMS send error => ", e.message)
                                        })

                                    }}/>
                                    <Text>SMS</Text>
                                </View>

                                <View style={{alignItems: "center"}}>
                                    <Zocial name="email" size={40} color={Colors.ALERT} onPress={() => {
                                        Linking.openURL("mailto:" + ((userInfo && userInfo.email) ? userInfo.email : "") +
                                            "?subject=" + requestData.request_code + " " + i18n.t("Results") +
                                            "&body=" +
                                            "Hello \n\n" +
                                            `${i18n.t("Nut count")}: ${current_result.nut_count}\n` +
                                            `${i18n.t("step3Name")}: ${current_result.moisture_content}\n` +
                                            `${i18n.t("Foreign materials")}: ${current_result.foreign_mat_rate}\n` +
                                            `${i18n.t("KOR")}: ${current_result.kor + " " + i18n.t("lbs")} \n` +
                                            `${i18n.t("Defective Rate")}: ${current_result.defective_rate}%25 \n\n` +
                                            `${i18n.t("Number of Bags")}: ${current_qap_data.lot_info.count_bags + " " + i18n.t("Bags")} \n` +
                                            `${i18n.t("Stock Volume")}: ${current_qap_data.lot_info.stock_volume + " " + i18n.t("MT")} \n` +
                                            `${i18n.t("Bags Sampled")}: ${current_qap_data.lot_info.count_sampled_bags + " " + i18n.t("Bags")} \n\n` +
                                            `${i18n.t("Site Name")}: ${requestData.site_obj.name} \n` +
                                            `${i18n.t("Site Location")}: ${requestData.site_obj.location} \n\n` +
                                            `${i18n.t("Done by")}: ${requestData.field_tech_obj.names} (${requestData.field_tech_obj.telephone})\n` +
                                            `${i18n.t("Date Processed")}: ${moment(current_result.created_at).format("ll")}\n`
                                        );
                                    }}/>
                                    <Text>Email</Text>
                                </View>
                            </View>
                        </View>
                    }

                </View>
            }
        </ScrollView>
    )
}

export default RequestViewScreen
