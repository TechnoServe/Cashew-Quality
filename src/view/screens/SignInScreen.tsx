import i18n from 'i18n-js';
import React, {useEffect, useLayoutEffect, useState} from 'react'
import {ScrollView, Text, View} from "react-native";
import {Button, Checkbox} from "react-native-paper";
import {LOGIN_REQUEST, RESET_ERROR, RESET_USER_STATE} from "../../model/user/actions";
import {ErrorMessage} from "../components/ErrorMessage";
import {InputForm, PhoneInput} from "../components/InputComponents";
import {Colors} from "../styles";
import {useAppDispatch, useAppSelector} from "../../core/hooks";
import {isEmpty} from "lodash";
import {registerForPushNotificationsAsync} from "../../model/services/PushNotificationUtils";

const SignInScreen = ({navigation, route}) => {

    /** react-redux hooks */
    const dispatch = useAppDispatch()
    const {user, otp, reachable} = useAppSelector(state => state)

    /** destruct states from redux store */
    const {in_progress, modal_visible, error} = user
    const {in_progress: otp_in_progress, otp_send_success} = otp;
    const {isConnected} = reachable

    /** constant variables */
    const userType = route.params?.userType; //<- comes from initial screen
    // const expoPushToken = getNotificationToken();

    /** Local state variables */
    const [phone, setTelephone] = useState('');
    const [password, setPassword] = useState({text: '', dirty: false});
    const [showPassword, setShowPassword] = useState(false);
    const [expoPushToken, setExpoPushToken] = useState('');

    /* Hook for validation - to be improved */
    useEffect(() => {
        registerForPushNotificationsAsync().then(token => {
            setExpoPushToken(token)
        });
        if (modal_visible && otp_send_success) {
            // console.log("this should go to modal", modal_visible, otp_send_success)
            navigation.navigate("verifyOtpModal");
        }
    }, [modal_visible, otp_send_success]);

    //to handle the header title
    useLayoutEffect(() => {
        navigation.setOptions({headerTitle: route.params?.userType === 1 ? "Field-Tech Login" : "Buyer Login"});
    }, [navigation, route]);

    return (
        <View style={{flex: 1, backgroundColor: Colors.WHITE}}>
            <ScrollView contentContainerStyle={{padding: 16}} keyboardShouldPersistTaps="handled">
                {error && <ErrorMessage error={error}/>}

                <View style={{
                    marginBottom: 16
                }}>
                    {!isConnected &&
                        <Text style={{
                            marginVertical: 16,
                            fontSize: 12,
                            color: Colors.ALERT,
                            textAlign: "left"
                        }}
                        >
                            {i18n.t("isNotConnected")}
                        </Text>
                    }

                    <Text style={{color: "gray", marginBottom: 8}}>
                        Enter your phone number
                    </Text>
                    <PhoneInput
                        passPhone={(tel) => setTelephone(tel)}
                        origin="signIn"
                        editable={!in_progress && !otp_in_progress}/>

                    <View style={{marginBottom: 16}}>
                        <InputForm
                            required={true}
                            label={i18n.t("password")}
                            placeholder={i18n.t('enterPassword')}
                            value={password.text}
                            onChangeText={(password) => setPassword({text: password, dirty: true})}
                            isValid={!isEmpty(password.text) || !password.dirty}
                            errorMessage="Password is required"
                            autoCapitalize="none"
                            secureTextEntry={!showPassword}
                        />

                    </View>

                    <View
                        style={{
                            flex: 1,
                            flexDirection: 'row',
                            backgroundColor: '#fff',
                        }}>
                        <Checkbox
                            status={showPassword ? 'checked' : 'unchecked'}
                            onPress={() => {
                                setShowPassword(!showPassword);
                            }}
                        />
                        <Text style={{paddingTop: 8}}>{i18n.t("showPassword")}
                        </Text>
                    </View>

                    <Button
                        mode="contained"
                        style={{marginTop: 16}}
                        contentStyle={{paddingVertical: 8}}
                        color={Colors.PRIMARY}
                        onPress={() => {
                            dispatch({
                                type: LOGIN_REQUEST,
                                payload: {
                                    telephone: phone,
                                    user_type: userType,
                                    password: password.text,
                                    expo_token: expoPushToken
                                }
                            })
                        }}
                        loading={in_progress || otp_in_progress}
                        disabled={!isConnected || in_progress || otp_in_progress || isEmpty(password.text) || isEmpty(phone)
                        }
                    >
                        {in_progress || otp_in_progress ? '' : i18n.t('login')}
                    </Button>
                    <Button
                        mode="text"
                        style={{marginTop: 16}}
                        contentStyle={{paddingVertical: 0}}
                        color={Colors.PRIMARY}
                        onPress={() => {
                            navigation.navigate("resetPassword", {
                                userType: userType
                            });
                            setPassword({text: "", dirty: false});
                            if (error) {
                                dispatch({type: RESET_ERROR});
                            }
                        }}
                    >
                        {i18n.t("forgotPass")}
                    </Button>
                    <Button
                        mode="text"
                        style={{marginTop: 0}}
                        contentStyle={{paddingVertical: 8}}
                        color={Colors.PRIMARY}
                        onPress={() => {
                            navigation.navigate("signUp", {userType: userType});
                            if (error) {
                                dispatch({type: RESET_ERROR});
                            }
                        }}
                    >
                        {i18n.t('Sign up')}
                    </Button>

                </View>
            </ScrollView>

            <View>
                <Button
                    style={{
                        marginHorizontal: 16,
                        marginBottom: 16
                    }}
                    contentStyle={{paddingVertical: 8}}
                    onPress={() => {
                        dispatch({type: RESET_USER_STATE});
                        navigation.goBack()
                    }}
                >
                    {i18n.t("startover")}
                </Button>
            </View>
        </View>
    );
}
export default SignInScreen;
