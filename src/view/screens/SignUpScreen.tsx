import i18n from "i18n-js";
import {isEmpty} from "lodash";
import React, {useEffect, useState} from 'react';
import {Alert, KeyboardAvoidingView, Linking, ScrollView, Text, TouchableOpacity, View} from "react-native";
import {Button, Divider} from "react-native-paper";
// import getNotificationToken from "../../core/hooks/getNotificationToken";
import {generatePushID} from "../../core/utils/id_generator";
import {PASSWORD_CONFIRMATION, PASSWORD_VALID, SIGNUP_REQUEST,} from "../../model/user/actions";
import {User} from "../../model/user/UserModel";
import {ErrorMessage} from "../components/ErrorMessage";
import {InputForm, PhoneInput} from "../components/InputComponents";
import {Colors} from "../styles";
import {crypticPassword, validEmail} from "../../core/utils";
import {useAppDispatch, useAppSelector} from "../../core/hooks";
import {registerForPushNotificationsAsync} from "../../model/services/PushNotificationUtils";


const SignUpScreen = ({navigation, route}) => {

    /** react-redux hooks */
    const dispatch = useAppDispatch();
    const {
        user,
        pass,
        passConfirm,
        otp
    } = useAppSelector(state => state);
    const {isConnected} = useAppSelector(state => state.reachable);

    /** Store states from props */
    const {in_progress, error, modal_visible} = user
    const {password_valid, password_error} = pass;
    const {password_confirmation_valid, password_confirmation_error} = passConfirm;
    const {in_progress: otp_in_progress, otp_send_success, otp_send_error,} = otp;

    /* Constant variables */
    const typeOfUser = route.params?.userType;
    const generated_id = generatePushID();

    //const expoPushToken = getNotificationToken();

    /* Local state variables */
    const [dialCode, setDialCode] = useState<string>('')
    const [phone, setTelephone] = useState('');
    const [fullName, setFullName] = useState({name: '', dirty: false});
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [expoPushToken, setExpoPushToken] = useState('');


    const onSignupConfirm = () => {
        Alert.alert(
            i18n.t("Alert"),
            i18n.t("signupConfirm"),
            [
                {
                    text: i18n.t("No"),
                    style: "cancel",
                },
                {
                    text: i18n.t("Yes"),
                    onPress: () => userSignUp(),
                    style: "destructive",
                },
            ],
            {cancelable: false}
        );
    }

    useEffect(() => {
        //expo push notification
        registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
        //open verify modal when otp is sent successfully
        if (modal_visible && otp_send_success) {
            navigation.navigate("verifyOtpModal")
        }
    }, [modal_visible, otp_send_success])


    //handle sign up button clicked.
    const userSignUp = async () => {

        const userModel: User = {
            _id: generated_id,
            names: fullName.name,
            email: email,
            telephone: phone,
            user_type: typeOfUser,
            equipment: null,
            expo_token: expoPushToken,
            created_at: (new Date()).toISOString(),
            updated_at: (new Date()).toISOString(),
            verified: false,
        };

        dispatch({
            type: SIGNUP_REQUEST,
            payload: {
                userModel,
                password: crypticPassword(password, false)
            }
        })
    }

    //get the link to terms or privacy documents
    const getTermsPrivacyUrl = (type) => {
        if (i18n.currentLocale().includes('fr')) {
            return type === "terms" ? "https://cqna.tnslabs.org/frontend/web/index.php?r=site%2Fterms&locale=fr" :
                "https://cqna.tnslabs.org/frontend/web/index.php?r=site%2Fprivacy&locale=fr"
        } else if (i18n.currentLocale().includes('pt')) {
            return type === "terms" ? "https://cqna.tnslabs.org/frontend/web/index.php?r=site%2Fterms&locale=pt" :
                "https://cqna.tnslabs.org/frontend/web/index.php?r=site%2Fprivacy&locale=pt"
        } else {
            return type === "terms" ? "https://cqna.tnslabs.org/frontend/web/index.php?r=site%2Fterms&locale=en" :
                "https://cqna.tnslabs.org/frontend/web/index.php?r=site%2Fprivacy&locale=en"
        }
    }

    return (
        <KeyboardAvoidingView
            style={{
                flex: 1,
                backgroundColor: Colors.WHITE
            }}
        >
            <ScrollView
                contentContainerStyle={{
                    padding: 16,
                    marginVertical: 16
                }}
                keyboardShouldPersistTaps="handled"
            >
                {error && <ErrorMessage error={error}/>}
                {otp_send_error && <ErrorMessage error={otp_send_error}/>}

                <View>
                    {!isConnected && <ErrorMessage error={i18n.t("isNotConnected")}/>}

                    <Text style={{color: "gray", marginBottom: 8}}>
                        Telephone (without country code)
                    </Text>

                    <PhoneInput
                        passPhone={(tel) => {
                            setTelephone(tel)
                        }}
                        origin="signUp"
                        editable={!in_progress && !otp_in_progress}/>

                    <Divider style={{marginBottom: 8}}/>

                    <InputForm
                        required={true}
                        label={i18n.t("fullName")}
                        placeholder={i18n.t("enterFullName")}
                        value={fullName.name}
                        autoCapitalize="words"
                        onChangeText={(names) => {
                            setFullName({name: names, dirty: true});
                        }}
                        mgBtn={16}
                        isValid={(!isEmpty(fullName.name) || !fullName.dirty)}
                        errorMessage={i18n.t("fullNameProvided")}
                        icon="account"
                        editable={!in_progress && !otp_in_progress}
                    />

                    <InputForm
                        label={i18n.t("email")}
                        placeholder={i18n.t("enterEmail")}
                        value={email}
                        onChangeText={mail => setEmail(mail)}
                        keyboardType="email-address"
                        isValid={validEmail(email)}
                        errorMessage={i18n.t("emailInvalid")}
                        autoCapitalize="none"
                        mgBtn={16}
                        icon="email"
                        editable={!in_progress && !otp_in_progress}
                    />

                    <InputForm
                        label={'* ' + i18n.t("password")}
                        value={password}
                        placeholder={i18n.t('enterPassword')}
                        onChangeText={(password) => {
                            dispatch({
                                type: PASSWORD_VALID,
                                validate: ((password !== undefined) && (password.length >= 8)),
                                errorMessage: ((password !== undefined)
                                    && (password.length < 8))
                                    ? i18n.t("passwordNumCharacters")
                                    : undefined
                            })
                            setPassword(password);
                        }}
                        isValid={isEmpty(password_error)}
                        errorMessage={password_error}
                        autoCapitalize="none"
                        mgBtn={16}
                        secureTextEntry
                        icon="key"
                        editable={!in_progress && !otp_in_progress}
                    />

                    <InputForm
                        label={i18n.t("passwordConfirmation")}
                        placeholder={i18n.t("confirmPassword")}
                        value={passwordConfirmation}
                        onChangeText={(passwordConfirmation) => {

                            dispatch({
                                type: PASSWORD_CONFIRMATION,
                                validate: password === passwordConfirmation,
                                errorMessage: password !== passwordConfirmation ? i18n.t("passwordsMatch") : undefined
                            })
                            setPasswordConfirmation(passwordConfirmation);
                        }}
                        isValid={isEmpty(password_confirmation_error)}
                        errorMessage={password_confirmation_error}
                        autoCapitalize="none"
                        mgBtn={16}
                        secureTextEntry
                        icon="key"
                        editable={!in_progress && !otp_in_progress}
                    />

                    <View style={{
                        display: "flex",
                        flexDirection: "row",
                        flex: 1,
                        flexWrap: 'wrap'
                    }}>
                        <Text>{i18n.t("termAndPrivacyMsg")}
                            <TouchableOpacity onPress={() => Linking.openURL(getTermsPrivacyUrl("terms"))}>
                                <Text style={{color: 'blue', textDecorationLine: 'underline'}}>
                                    {i18n.t("termOfService")}
                                </Text>

                            </TouchableOpacity>

                            {i18n.t("and")}

                            <TouchableOpacity onPress={() => Linking.openURL(getTermsPrivacyUrl("privacy"))}>
                                <Text style={{color: 'blue', textDecorationLine: 'underline'}}>
                                    {i18n.t("privacyPolicy")}
                                </Text>
                            </TouchableOpacity>
                        </Text>
                    </View>

                    <Button
                        mode="contained"
                        style={{marginTop: 16}}
                        contentStyle={{paddingVertical: 8}}
                        onPress={() => {

                            onSignupConfirm()
                        }}
                        loading={in_progress || otp_in_progress}
                        disabled={
                            !isConnected
                            || isEmpty(fullName.name)
                            || isEmpty(email)
                            || !validEmail(email)
                            || !password_valid
                            || !password_confirmation_valid
                            || in_progress
                            || otp_in_progress
                        }
                    >
                        Sign Up
                    </Button>

                    <Button
                        mode="text"
                        style={{marginTop: 16}}
                        contentStyle={{paddingVertical: 8}}
                        color={Colors.PRIMARY}
                        onPress={() => navigation.goBack()}
                        disabled={in_progress || otp_in_progress}
                    >
                        Back to Login
                    </Button>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

export default SignUpScreen;
