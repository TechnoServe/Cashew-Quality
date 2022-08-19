import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {
    StepEightScreen,
    StepFiveScreen,
    StepFourScreen,
    StepNineScreen,
    StepOneScreen,
    StepSevenScreen,
    StepSixScreen,
    StepTenScreen,
    StepThreeScreen,
    StepTwoScreen,
} from "./screens";
import {Colors} from "./styles";
import {Strings} from "../core/utils";
import HomeScreen from './screens/HomeScreen';
import ReviewScreen from './screens/ReviewScreen';
import LoginScreen from './screens/LoginScreen';
import NewQARScreen from './screens/NewQARScreen';
import QARReviewScreen from './screens/QARReviewScreen';
import {RequestView} from './screens/RequestViewScreen'
import {SliderImages} from './screens/SliderImagesScreen'
import SignInScreen from './screens/SignInScreen';
import ProfileViewScreen from './screens/ProfileView'
import useCachedResources from "../core/hooks/useCachedResources";
import {MaterialCommunityIcons} from '@expo/vector-icons';
import EditProfileScreen from './screens/EditProfile'
import InitialStepScreen from "./screens/InitialStepScreen";
import EquipmentInfoForm from "./screens/EquipmentInfoForm";
import {Text, View} from "react-native";
import i18n from 'i18n-js';
import SignUpScreen from "./screens/SignUpScreen";
import ResetPassword from "./screens/ForgotPassword";
import {GetHeaderIcon} from "./components/GetHeaderIcon";
import {Appbar} from "react-native-paper";
import * as Linking from "expo-linking";
import {CreatePasswordModal} from "./components/modals/CreatePasswordModal";
import {isEmpty, isEqual} from "lodash";
import {User} from "../model/user/UserModel";
import {useAppDispatch, useAppSelector} from "../core/hooks";
import OtpVerificationModal from "./components/modals/OtpVerificationModal";
import CountryListModal from "./components/modals/CountryListModal";
import UserListModal from "./components/modals/UserListModal";
import GeneralListModal from "./components/modals/GeneralListModal";
import {registerForPushNotificationsAsync} from "../model/services/PushNotificationUtils";
import {UPDATE_USER_TOKEN_REQUEST} from "../model/user/actions";

function Navigation() {
    const isLoadingComplete = useCachedResources();
    const {isConnected} = useAppSelector(state => state.reachable);
    const {user_info}: { user_info: User } = useAppSelector(state => state.user);
    const dispatch = useAppDispatch()

    // console.log("USER =>", loggedUser)

    useEffect(() => {
        //console.log("CURRENT USER => ", user_info)
        if (isEmpty(user_info)) {
            dispatch({type: "USER_LOGOUT"});
        } else {
            //this means the user is logged in get device token
            //1. check the equity for the expo_token on the user object
            //2. if not the same on null, make a remote request and update the
            registerForPushNotificationsAsync().then(token => {
                if (isEmpty(user_info.expo_token) || !isEqual(token, user_info.expo_token)) {
                    console.log("Make remote call and update the token", token, user_info)

                    // dispatch saga action
                    dispatch({
                        type: UPDATE_USER_TOKEN_REQUEST,
                        payload: {user_id: user_info._id, expo_token: token}
                    })
                }
            })

        }
    }, [user_info])

    if (!isLoadingComplete) {
        return null;
    } else {
        return (
            <NavigationContainer>
                <RootNavigator isConnected={isConnected} currentUser={user_info}/>

                {!isConnected &&
                    <View style={{paddingVertical: 8, backgroundColor: "#010101"}}>
                        <Text style={{textAlign: "center", color: "white"}}>
                            {i18n.t('No Internet Connection')}
                        </Text>
                    </View>
                }

            </NavigationContainer>
        );
    }
}


const RootStack = createStackNavigator();

function RootNavigator({isConnected, currentUser}: { isConnected: boolean, currentUser: User }) {

    //get the header icon
    const getHeaderIcon = (iconName, navigation, destScreen, otherProps = null) => {
        return (
            <MaterialCommunityIcons
                name={iconName}
                size={32}
                color={Colors.WHITE} style={{marginEnd: 16}}
                onPress={navigation && isConnected ? () => navigation.navigate(destScreen, otherProps) : null}
            />)
    }

    return (
        <RootStack.Navigator
            initialRouteName={Strings.LOGIN_SCREEN_NAME}
            screenOptions={{
                headerStyle: {backgroundColor: Colors.PRIMARY},
                headerTintColor: Colors.WHITE,
            }}
        >
            {!currentUser || !currentUser.verified ?
                <>
                    <RootStack.Group>
                        <RootStack.Screen
                            name={Strings.LOGIN_SCREEN_NAME}
                            component={LoginScreen}
                            options={{headerShown: false}}
                        />
                        <RootStack.Screen
                            name={"signIn"}
                            component={SignInScreen}
                            options={{title: i18n.t('SIGNIN_SCREEN_NAME')}}
                        />
                        <RootStack.Screen
                            name={"signUp"}
                            component={SignUpScreen}
                            options={{title: i18n.t('SIGNUP_SCREEN_NAME'), headerLeft: null}}
                        />
                        <RootStack.Screen
                            name={"resetPassword"}
                            component={ResetPassword}
                            options={{title: i18n.t('RESET_PASSWORD_SCREEN_NAME')}}
                        />
                    </RootStack.Group>

                    {/*Logged out Modals*/}
                    <RootStack.Group screenOptions={{presentation: "modal"}}>
                        <RootStack.Screen
                            name="verifyOtpModal"
                            component={OtpVerificationModal}
                            options={{title: 'Verify OTP'}}
                        />
                        <RootStack.Screen
                            name="countryModal"
                            component={CountryListModal}
                            options={{headerShown: false}}
                        />
                    </RootStack.Group>
                </>
                :
                <>
                    <RootStack.Group>
                        <RootStack.Screen
                            name={Strings.HOME_SCREEN_NAME}
                            options={{
                                title: i18n.t('myHome'),
                                headerRight: () =>
                                    <View style={{flexDirection: "row"}}>
                                        {GetHeaderIcon("filter-variant")}
                                        {GetHeaderIcon("account-circle", "userProfile")}
                                        <Appbar.Action
                                            icon="help-circle"
                                            color={Colors.WHITE}
                                            size={32}
                                            onPress={() => {
                                                Linking.openURL("mailto:" + ('cajusupport@tnslabs.org' || ''));
                                            }
                                            }
                                        />

                                    </View>
                            }}
                            component={HomeScreen}
                        />

                        <RootStack.Screen
                            name={Strings.INITIAL_STEP_SCREEN_NAME}
                            component={InitialStepScreen}
                            options={{title: i18n.t('Lot Information')}}
                        />
                        <RootStack.Screen
                            name={Strings.STEP_ONE_SCREEN_NAME}
                            component={StepOneScreen}
                            options={{title: i18n.t('nutsWeight')}}
                        />
                        <RootStack.Screen
                            name={Strings.STEP_TWO_SCREEN_NAME}
                            component={StepTwoScreen}
                            options={{title: i18n.t('Nut count')}}
                        />
                        <RootStack.Screen
                            name={Strings.STEP_THREE_SCREEN_NAME}
                            component={StepThreeScreen}
                            options={{title: i18n.t('step3Name')}}
                        />
                        <RootStack.Screen
                            name={Strings.STEP_FOUR_SCREEN_NAME}
                            component={StepFourScreen}
                            options={{title: i18n.t('Foreign materials')}}
                        />
                        <RootStack.Screen
                            name={Strings.STEP_FIVE_SCREEN_NAME}
                            component={StepFiveScreen}
                            options={{title: i18n.t('Good Kernel')}}
                        />
                        <RootStack.Screen
                            name={Strings.STEP_SIX_SCREEN_NAME}
                            component={StepSixScreen}
                            options={{title: i18n.t('Spotted Kernel')}}
                        />
                        <RootStack.Screen
                            name={Strings.STEP_SEVEN_SCREEN_NAME}
                            component={StepSevenScreen}
                            options={{title: i18n.t('Immature Kernel')}}
                        />
                        <RootStack.Screen
                            name={Strings.STEP_EIGHT_SCREEN_NAME}
                            component={StepEightScreen}
                            options={{title: i18n.t('Oily Kernel')}}
                        />
                        <RootStack.Screen
                            name={Strings.STEP_NINE_SCREEN_NAME}
                            component={StepNineScreen}
                            options={{title: i18n.t('Bad Kernel')}}
                        />
                        <RootStack.Screen
                            name={Strings.STEP_TEN_SCREEN_NAME}
                            component={StepTenScreen}
                            options={{title: i18n.t('Void Kernel')}}
                        />
                        <RootStack.Screen
                            name={Strings.REVIEW_SCREEN_NAME}
                            component={ReviewScreen}
                            options={{title: i18n.t('Review')}}
                        />
                        <RootStack.Screen
                            name={Strings.NEW_QAR_SCREEN_NAME}
                            component={NewQARScreen}
                            options={{title: i18n.t("New QAR")}}
                        />
                        <RootStack.Screen
                            name={Strings.QAR_REVIEW_SCREEN_NAME}
                            component={QARReviewScreen}
                            options={{title: i18n.t("QAR Review")}}
                        />
                        <RootStack.Screen
                            name={Strings.REQUEST_VIEW_SCREEN_NAME}
                            component={RequestView}
                            options={({route}) => ({title: route.params['title']})}
                        />
                        <RootStack.Screen
                            name={"imageSlider"}
                            component={SliderImages}
                            options={({route}) => ({title: route.params['title'] + ": " + i18n.t("Images")})}
                        />
                        <RootStack.Screen
                            name={"editProfile"}
                            component={EditProfileScreen}
                            options={() => ({title: i18n.t('Edit Profile')})}
                        />
                        <RootStack.Screen
                            name={"userProfile"}
                            component={ProfileViewScreen}
                            options={({navigation}) => ({
                                title: i18n.t('Profile'),
                                headerRight: () => getHeaderIcon("account-edit", navigation, "editProfile")
                            })}
                        />
                        <RootStack.Screen
                            name={"EquipmentInfoForm"}
                            component={EquipmentInfoForm}
                            options={() => ({title: i18n.t('EQUIPMENT_INFO_FORM_TITLE')})}
                        />
                    </RootStack.Group>

                    <RootStack.Group screenOptions={{presentation: "modal"}}>
                        <RootStack.Screen name="userListModal" component={UserListModal}
                                          options={{headerShown: false}}/>
                        <RootStack.Screen name="NewPassword" component={CreatePasswordModal}/>
                        <RootStack.Screen
                            name="countryModal"
                            component={CountryListModal}
                            options={{headerShown: false}}
                        />
                        <RootStack.Screen
                            name="generalModal"
                            component={GeneralListModal}
                            options={{headerShown: false}}
                        />
                    </RootStack.Group>
                </>
            }
        </RootStack.Navigator>
    )
}

export default Navigation;
