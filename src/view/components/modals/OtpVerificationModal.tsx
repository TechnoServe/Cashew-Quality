import i18n from "i18n-js";
import React, {useState} from "react";
import {Keyboard, ScrollView, Text, TextInput, View} from "react-native";
import {colors} from "react-native-elements";
import {Button} from "react-native-paper";
import {OTP_LENGTH} from "../../../core/utils/constants";
import {OTP_SEND_REQUEST, OTP_VERIFY_REQUEST,} from "../../../model/user/actions";
import {Colors} from "../../styles";
import {ErrorMessage} from "../ErrorMessage";
import {useAppDispatch, useAppSelector} from "../../../core/hooks";


export default function OtpVerificationModal({navigation}) {

    const {otp_verify_error, in_progress: otp_in_progress} = useAppSelector(state => state.otp)
    const {in_progress, modal_visible, user_info} = useAppSelector(state => state.user)
    const {isConnected} = useAppSelector(state => state.reachable);

    const [otpCode, setOtpCode] = useState("")
    const [otpInvalid, setOtpInvalid] = useState(false)

    const dispatch = useAppDispatch();


    return (

        <ScrollView contentContainerStyle={{padding: 16}}>
            <View>
                {otp_verify_error && <ErrorMessage error={otp_verify_error}/>}

                {/*<ErrorMessage error={i18n.t("isNotConnected")}/>*/}

                <Text style={{
                    lineHeight: 22,
                    marginTop: 10,
                    marginBottom: 25,
                    fontSize: 16,
                    textAlign: "center"
                }}>
                    {`${i18n.t("enterOTPNote")} ${user_info.telephone}`}
                </Text>

                <View style={{
                    marginBottom: 25,
                    marginTop: 16
                }}>
                    <TextInput
                        placeholder={i18n.t("otpInputPlaceholder")}
                        value={otpCode}
                        onChangeText={(otp) => {
                            setOtpCode(otp);
                            (otp.length === OTP_LENGTH) && Keyboard.dismiss();
                        }}
                        keyboardType='numeric'
                        maxLength={OTP_LENGTH}
                        textAlign="center"
                        placeholderTextColor={colors.grey2}
                        style={{fontSize: 40, letterSpacing: 16}}
                    />
                    {otpCode.length !== OTP_LENGTH &&
                        <Text style={{
                            paddingTop: 32,
                            fontSize: 12,
                            color: Colors.ALERT,
                            textAlign: "center",
                        }}>
                            {i18n.t("invalidOTPInput")}
                        </Text>
                    }
                </View>

                <View style={{flex: 1, flexDirection: 'column'}}>
                    <Button
                        mode="contained"
                        style={{marginTop: 12}}
                        contentStyle={{paddingVertical: 8}}
                        onPress={() => {
                            dispatch({
                                type: OTP_VERIFY_REQUEST,
                                payload: {
                                    telephone: user_info.telephone,
                                    otpCode
                                }
                            });
                        }}
                        loading={in_progress}
                        disabled={!isConnected || otpInvalid || in_progress || otp_in_progress || otpCode.length !== OTP_LENGTH}
                    >
                        {i18n.t("codeVerify")}
                    </Button>

                    <Button
                        mode="text"
                        style={{marginTop: 18}}
                        contentStyle={{paddingVertical: 8}}
                        color={Colors.PRIMARY}
                        onPress={() => {
                            dispatch({
                                type: OTP_SEND_REQUEST,
                                phoneNumber: user_info.telephone
                            })
                        }}
                    >
                        {i18n.t("codeResend")}
                    </Button>
                </View>
            </View>
        </ScrollView>
    )
}
