import i18n from 'i18n-js';
import {isEmpty} from "lodash";
import React, {useEffect, useState} from 'react'
import {KeyboardAvoidingView, ScrollView, Text, ToastAndroid, View} from "react-native";
import {Divider} from "react-native-elements";
import {Button, List} from 'react-native-paper';
import {useDispatch, useSelector} from "react-redux";
import getNotificationToken from "../../core/hooks/getNotificationToken";
import AlertConfirmBox from "../../core/utils/alertBox";
import {EMAIL_EDIT_VALID, FULLNAME_EDIT_VALID, SHOW_MODAL, UPDATE_USER_INFO_REQUEST,} from "../../model/user/actions";
import {InputForm} from "../components/InputComponents";
import {Colors} from "../styles";
import {useNavigation} from "@react-navigation/native";
import {useAppSelector} from "../../core/hooks";


const EditProfileScreen = () => {

    /* react-redux hooks */
    const dispatch = useDispatch();
    const {isConnected} = useSelector(state => state.reachable);
    const {
        user,
        pass,
        passConfirm,
        fName,
        mail,
    } = useAppSelector(state => state);

    /*navigation hooks*/
    const navigation = useNavigation()

    /** Store states from props */
    const {old_password_valid, old_password_error, password_edit_valid, password_edit_error} = pass;
    const {password_edit_confirmation_valid, password_edit_confirmation_error} = passConfirm;
    const {fullname_edit_valid, fullname_error} = fName;
    const {email_edit_valid, email_error} = mail;
    const {user_info: loggedUser, in_progress, error} = user

    /* Constant variables */
    const expoPushToken = getNotificationToken();

    /* State variables */
    const [onSubmit, setOnSubmit] = useState(false);
    const [names, setNames] = useState(loggedUser.names);
    const [email, setEmail] = useState(loggedUser.email);
    const [telephone, setTelephone] = useState(loggedUser.telephone);
    const [isValidated, setIsValidated] = useState(true);
    const [userUpdated, setUserUpdated] = useState(false);

    let update_info = {
        _id: loggedUser._id,
        names: names,
        email: email,
    }

    useEffect(() => {

        /* Checking if the current info has been modified, otherwise disabling the save button */
        if ((telephone && names !== null)
            && (telephone !== loggedUser.telephone
                || names !== loggedUser.names
                || email !== loggedUser.email)
        ) {
            setIsValidated(true)
        } else {
            setIsValidated(false)
        }
    }, [telephone, names]);

    const onConfirm = () => {
        AlertConfirmBox(i18n.t("Are you sure to update?"), updateUser)
    }

    const updateUser = async () => {
        console.log("TODO: UPDATE USER info...")
        // setOnSubmit(true);
        //
        dispatch({
            type: UPDATE_USER_INFO_REQUEST,
            names,
            email,
            navigation
        })
    }

    const isEnabled = () => {
        return fullname_edit_valid && email_edit_valid && !in_progress
    }

    // used to handle the CreatePasswordModal.tsx
    const gotoUpsertPassword = () => {
        navigation.navigate("NewPassword", {isNew: !loggedUser.verified})
        dispatch({
            type: SHOW_MODAL // <- will be used to auto close modal when successful update.
        })
    }

    if (userUpdated) {
        ToastAndroid.show(i18n.t("User info updated successfully"), 5);
    }

    return (
        <KeyboardAvoidingView style={{flex: 1, backgroundColor: Colors.WHITE}}>
            <ScrollView contentContainerStyle={{padding: 16}}>
                <View style={{backgroundColor: Colors.WHITE}}>
                    <InputForm
                        label={i18n.t("fullName")}
                        placeholder={i18n.t("enterFullName")}
                        value={names}
                        onChangeText={names => {

                            dispatch({
                                type: FULLNAME_EDIT_VALID,
                                validate: !isEmpty(names),
                                errorMessage: isEmpty(names) ? i18n.t("fullNameProvided") : undefined
                            });

                            setNames(names)
                        }}
                    />

                    {fullname_error &&
                        <Text style={{
                            fontSize: 12,
                            color: Colors.ALERT,
                            textAlign: "left",
                            marginBottom: 20
                        }}>
                            {fullname_error}
                        </Text>
                    }

                    <InputForm
                        label={i18n.t("email")}
                        placeholder={i18n.t("enterEmail")}
                        value={email}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        onChangeText={email => {

                            dispatch({
                                type: EMAIL_EDIT_VALID,
                                validate: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
                                errorMessage: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? i18n.t("emailInvalid") : undefined
                            });

                            setEmail(email);
                        }}
                    />

                    {email_error &&
                        <Text style={{
                            fontSize: 12,
                            color: Colors.ALERT,
                            textAlign: "left",
                            marginBottom: 20
                        }}>
                            {email_error}
                        </Text>
                    }

                    <InputForm
                        label={i18n.t("telephone")}
                        placeholder={i18n.t("Enter Telephone")}
                        value={telephone}
                        onChangeText={telephone => setTelephone(telephone)}
                        keyboardType="phone-pad"
                        disabled={true}
                    />
                </View>

                <Divider style={{marginVertical: 16}}/>

                <List.Item
                    title="Change Password"
                    left={props => <List.Icon {...props} icon="key"/>}
                    right={props => <List.Icon {...props} icon="arrow-right"/>}
                    onPress={() => gotoUpsertPassword()}
                />
            </ScrollView>

            <Button
                contentStyle={{height: 55}}
                style={{margin: 16}}
                mode="contained"
                onPress={() => onConfirm()}
                loading={in_progress}
                disabled={!isEnabled()}
            >
                {i18n.t("Save")}
            </Button>

        </KeyboardAvoidingView>
    );
}

export default EditProfileScreen;
