import {SafeAreaView, ScrollView, View} from "react-native";
import {useEffect, useState} from "react";
import {isEmpty} from "lodash";
import {Button, Divider, TextInput} from "react-native-paper";
import {validatePassword} from "../../../core/utils";
import {ErrorMessage} from "../ErrorMessage";
import {useDispatch} from "react-redux";
import {UPSERT_USER_PASSWORD_REQUEST} from "../../../model/user/actions";
import {pwUpdateParams} from "../../../model/user/firebase_calls/UpsertPassword";
import AlertConfirmBox from "../../../core/utils/alertBox";
import {useNavigation, useRoute} from "@react-navigation/native";
import {useAppSelector} from "../../../core/hooks";

/**
 * Component for creating a new password or editing the existing one.
 */
export function CreatePasswordModal() {

    const {in_progress, user_info: loggedUser, error, modal_visible} = useAppSelector(state => state['user']);

    const [message, messageSet] = useState<string>("")
    const [password, passwordSet] = useState<string>("")
    const [cPassword, cPasswordSet] = useState<string>("")
    const [currentPassword, currentPasswordSet] = useState<string>("")

    const route = useRoute()
    const navigation = useNavigation()
    const isNew = route.params["isNew"]

    const dispatch = useDispatch()

    useEffect(() => {
        messageSet(validatePassword(password, cPassword))
        //isDisabled()
        if (!modal_visible) {
            navigation.goBack()
        }
    }, [password, cPassword, modal_visible])

    //upsert password
    const updatePassword = (newPassword: string, oldPassword?: string) => {
        const pwPayload: pwUpdateParams = {
            userId: loggedUser._id,
            newPw: newPassword,
            oldPw: oldPassword
        }
        dispatch({
            type: UPSERT_USER_PASSWORD_REQUEST,
            payload: pwPayload
        })
    }

    //handle button state
    const isDisabled = () => {
        return !isEmpty(message) || isEmpty(password) || isEmpty(cPassword) || in_progress
    }

    return (
        <ScrollView contentInsetAdjustmentBehavior="automatic">
            <SafeAreaView style={{padding: 16, flex: 1}}>
                <ErrorMessage error={message || error}/>
                {!isEmpty(message) && (<Divider style={{marginVertical: 8}}/>)}

                {!isNew && (
                    <>
                        <TextInput
                            label="Current Password"
                            mode="outlined"
                            secureTextEntry
                            onChangeText={pw => currentPasswordSet(pw)}
                            value={currentPassword}
                        />

                        <Divider style={{marginTop: 16, marginBottom: 8}}/>
                    </>
                )}

                <TextInput
                    label="New Password"
                    mode="outlined"
                    secureTextEntry
                    onChangeText={pw => passwordSet(pw)}
                    value={password}
                    style={{marginBottom: 16}}
                />

                <TextInput
                    label="Confirm Password"
                    mode="outlined"
                    secureTextEntry
                    onChangeText={pw => cPasswordSet(pw)}
                    value={cPassword}
                    disabled={isEmpty(password) && password.length < 7}
                    style={{marginBottom: 18}}
                />

                <View style={{
                    flex: 1,
                    justifyContent: 'flex-end',
                    marginBottom: 16
                }}>
                    <Button
                        mode="contained"
                        contentStyle={{height: 56}}
                        disabled={isDisabled()}
                        loading={in_progress}
                        onPress={() => {
                            AlertConfirmBox(
                                "Are you ready to set new password? Please remember it!",
                                () => updatePassword(password, isNew ? null : currentPassword)
                            )
                        }}>
                        {isNew ? " Create Password" : "Update Password"}
                    </Button>
                </View>
            </SafeAreaView>
        </ScrollView>
    )
}