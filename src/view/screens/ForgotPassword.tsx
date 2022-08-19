import React, {useState} from 'react'
import {Colors} from "../styles";
import {CommonActions} from '@react-navigation/native';
import {Alert, KeyboardAvoidingView, ScrollView, Text, View} from "react-native";
import i18n from 'i18n-js';
import {Button} from "react-native-paper";
import {useDispatch} from "react-redux"
import {EMAIL_NOT_FOUND, EMAIL_VALID} from "../../model/user/actions";
import {SuccessMessage} from "../components/ErrorMessage";
import {InputForm} from "../components/InputComponents";
import {db} from "../../core/utils/config";
import api from '../../core/utils/api';
import {crypticPassword} from "../../core/utils";
import {useAppSelector} from "../../core/hooks";


const ResetPassword = (props) => {

    /** react-redux hooks */
    const dispatch = useDispatch()
    const {
        user,
        mail
    } = useAppSelector(state => state)

    /** contexts */
    const {isConnected} = useAppSelector(state => state.reachable)

    /** constant variables */
    const userType = props.route.params?.userType;


    /** State variables */

    const [email, setEmail] = useState('');
    const [error, setError] = useState(false);
    const [errMessage, setErrMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);


    /** store states from props */
    const {in_progress} = user
    const {email_valid, email_error} = mail;

    const onConfirm = async () => {
        Alert.alert(
            i18n.t("Alert"),
            i18n.t("resetpasswordConfirm"),
            [
                {
                    text: i18n.t("No"),
                    style: "cancel",
                },
                {
                    text: i18n.t("Yes"),
                    onPress: () => {
                        setIsLoading(true)
                        forgotPassword(email);
                    },
                    style: "destructive",
                },
            ],
            {cancelable: false})
    }

    // Email
    const sendEmail = async (Email, genPass, fullName) => {

        const myHeaders = new Headers();
        myHeaders.append("x-key", api.apiKey);
        myHeaders.append("Content-Type", "application/json");
        const emailBody = `
    ${i18n.t("grettings")} ` + fullName + `, \n
    ${i18n.t("passwordMsg1")}: ` + genPass + ` \n
    ${i18n.t("passwordMsg2")}\n
    ${i18n.t("closing")}`;

        const raw = JSON.stringify({"subject": i18n.t("passwordReset"), "body": emailBody, "recipients": [Email]});

        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw
        };

        fetch(api.baseUrl + "send-email", requestOptions)
            .then(response => response.text())
            .then(result => console.log(result))
            .catch(error => console.log('error', error));
    }

    /** Generate Password String */
    const generatePassword = (length) => {
        let result = "";
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    // setPassword()

    const forgotPassword = async (Email) => {
        const col = db.collection("users")
        const getUserByEmail = await col
            .where("email", "==", Email)
            .where("user_type", "==", userType)
            .limit(1)
            .get()

        if (getUserByEmail.empty) {
            dispatch({
                type: EMAIL_NOT_FOUND,
                errorMessage: i18n.t("emailNotFound"),

            })
            setIsLoading(false);
            return
        }

        getUserByEmail.forEach(async doc => {
            const userData = doc.data();
            if (doc.id) {
                const genPass = generatePassword(8);
                const cipherText = crypticPassword(genPass, false)

                await col.doc(doc.id).set({"password": cipherText}, {merge: true});
                setErrMessage(i18n.t("successfulResetMsg"))
                setEmail("");
                setError(true);
                sendEmail(email, genPass, userData.names);

                setIsLoading(false);
            } else {
                console.log("no id");
            }
        })

    }
    /* Select country in modal */

    return (
        <KeyboardAvoidingView
            style={{
                flex: 1,
                backgroundColor: Colors.WHITE,
            }}
        >
            <ScrollView
                contentContainerStyle={{
                    padding: 16,
                    marginVertical: 16
                }}
                keyboardShouldPersistTaps="handled"
            >
                {error && <SuccessMessage message={errMessage}/>}
                <View style={{
                    marginTop: 16,
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
                    <Text style={{color: Colors.BLACK}}>
                        <Text style={{
                            fontWeight: 'bold',
                            color: Colors.ALERT
                        }}>
                        </Text>
                        {i18n.t('enterEmailMsg')}
                    </Text>

                    <InputForm
                        label={i18n.t("email")}
                        placeholder={i18n.t("enterEmail")}
                        value={email}
                        onChangeText={(mail) => {

                            /** TODO: Email validation regex */

                            dispatch({
                                type: EMAIL_VALID,
                                validate: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail),
                                errorMessage: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail) ? i18n.t("emailInvalid") : undefined
                            })
                            setEmail(mail);

                        }}
                        keyboardType="email-address"
                        isValid={true}
                        autoCapitalize="none"
                    />
                    {email_error &&
                        <Text style={{
                            marginVertical: 10,
                            fontSize: 12,
                            color: Colors.ALERT,
                            textAlign: "left"
                        }}>
                            {email_error}
                        </Text>
                    }
                    <Button
                        mode="contained"
                        style={{marginTop: 16}}
                        contentStyle={{paddingVertical: 8}}
                        color={Colors.PRIMARY}
                        onPress={() => {
                            onConfirm()
                        }}
                        // forgotPassword(email)
                        loading={in_progress || isLoading}
                        disabled={
                            !email_valid
                            || !isConnected
                            || in_progress
                            || isLoading
                            || !email
                        }
                    >
                        {in_progress ? '' : i18n.t('Submit')}
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
                        props.navigation.dispatch(CommonActions.goBack())
                    }}
                >
                    {i18n.t("login")}
                </Button>
            </View>


        </KeyboardAvoidingView>
    );
}

export default ResetPassword;
