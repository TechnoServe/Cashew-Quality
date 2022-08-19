import React, {useEffect, useState} from 'react';
import {Platform, ScrollView, Text, View} from 'react-native';
import {Colors, styles} from "../styles";
import {Button as NativePaperButton, Snackbar} from "react-native-paper";
import i18n from "i18n-js";
import {EquipmentCard, UserInfoCard} from "../components/InfoCards";
import {isEmpty} from "lodash";
import * as Application from 'expo-application';
import AlertConfirmBox, {AlertMessageBox} from "../../core/utils/alertBox";
import {loggingOutSetUp} from "../../controller/user_controller/user_controller";
import {useAppDispatch, useAppSelector} from "../../core/hooks";


const ProfileViewScreen = ({navigation}) => {

    const {user_info: loggedUser} = useAppSelector(state => state.user)
    const {isConnected} = useAppSelector(state => state.reachable);

    const [isLoading, setIsLoading] = useState(false);
    const [userInfo, setUserInfo] = useState(loggedUser)
    const [modalVisible, setModalVisible] = useState(false);
    const [equipmentList, setEquipmentList] = useState([]);
    const [equipmentImageId, setEquipmentImageId] = useState(0);
    const [error, setError] = useState(null);


    const dispatch = useAppDispatch()

    /* Setting the logged-in user object to a state variable whenever the application first loads. */
    useEffect(() => {
        loggedUser && setUserInfo(loggedUser)

        if (loggedUser && loggedUser.equipment != null) {
            const list = []
            list.push(loggedUser.equipment.scale)
            list.push(loggedUser.equipment.meter)

            setEquipmentList(list)
        }
    }, [loggedUser])

    /* Logging out a user. */
    const logOut = () => {
        checkForAuthentication(loggedUser, isConnected)
    }

    /* Checking if the user has isAuthenticated key in the local user object. */
    const checkForAuthentication = (user_obj, is_connected) => {
        if ('verified' in user_obj) {
            AlertConfirmBox(
                i18n.t('Are you sure you want to logout?'),
                async () => await loggingOut(user_obj, is_connected)
            )
        } else {
            /* Alerting user to add password to their account,
            & redirecting them to the EditProfile page. */

            AlertMessageBox(
                i18n.t("passwordAdditionAlertMessage"),
                () => navigation.navigate("NewPassword", {isNew: true})
            )
        }
    }

    /* This is responsible for logging out a user. */
    const loggingOut = async (current_user, is_connected) => {
        setIsLoading(true);

        /* Removing all documents... */
        await loggingOutSetUp(current_user, is_connected);

        dispatch({type: "USER_LOGOUT"});

        // setLoggedUser(null);
        setIsLoading(false);
    }

    return (
        <ScrollView contentContainerStyle={{
            padding: 16,
            flexGrow: 1,
            justifyContent: 'space-between'
        }}>
            <View>
                {!isEmpty(userInfo) &&
                    <UserInfoCard
                        userType={userInfo.user_type === 2 ? 'Buyer' : 'Field Tech'}
                        user={userInfo}
                    />
                }

                {!isEmpty(userInfo) && userInfo.user_type === 1 &&
                    <EquipmentCard
                        visibility={modalVisible}
                        close_modal={() => setModalVisible(!modalVisible)}
                        equipment_list={equipmentList}
                        image_id={equipmentImageId}
                        navigation={navigation}
                        set_eq_id={(l) => {
                            l && l.type === "Weight Scale" ? setEquipmentImageId(0) : setEquipmentImageId(1)
                            setModalVisible(true);
                        }}
                    />
                }

                <Text style={styles.smallGrayTextCentered}>
                    {i18n.t("userId")} {userInfo != null && userInfo._id}
                </Text>

                <Text style={styles.smallGrayTextCentered}>
                    {Application.applicationName + " - v" + Application.nativeApplicationVersion}
                </Text>

            </View>

            <View>
                <NativePaperButton
                    contentStyle={{paddingVertical: 8}}
                    mode="text"
                    loading={isLoading}
                    color={Colors.ALERT}
                    disabled={isLoading}
                    onPress={() => logOut()}
                >
                    {!isLoading && i18n.t('logout')}
                </NativePaperButton>
                {Platform.OS === "android" && (
                    <Snackbar
                        visible={!isEmpty(error)}
                        onDismiss={() => setError(null)}
                        style={{marginHorizontal: 0}}
                        action={{label: 'Okay', onPress: () => setError(null)}}>
                        {error}
                    </Snackbar>
                )}

            </View>
        </ScrollView>
    )
}

export default ProfileViewScreen;
