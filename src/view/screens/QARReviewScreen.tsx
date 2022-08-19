import i18n from 'i18n-js';
import {isEmpty, random, startCase} from "lodash";
import React, {useEffect, useState} from 'react'
import {Alert, ScrollView, View} from "react-native";
// import {Button} from "react-native-elements";
import {fetchSiteByNameAndLocation} from "../../controller/site_controller/site_controller";
import {fetchUserByTelephoneAndType} from "../../controller/user_controller/user_controller";
import {generatePushID} from "../../core/utils/id_generator";
import {UPSERT_NEW_QAR_REQUEST, UPSERT_QAR_REQUEST} from "../../model/qar_listing/actions";
import {Qar, QarSite} from "../../model/qar_listing/QarModel";
import {ErrorMessage} from "../components/ErrorMessage";
import {SiteInfoCard, UserInfoCard} from "../components/InfoCards";
import {Colors, styles} from "../styles";
import {useAppDispatch, useAppSelector} from "../../core/hooks";
import {User} from "../../model/user/UserModel";
import {Button, List} from 'react-native-paper';
import moment from "moment";


/**
 *
 * @param route
 * @param navigation
 * @returns {JSX.Element}
 * @constructor
 */


const QARReviewScreen = ({route, navigation}) => {

    /* Step 1: Get params from the previous screen. */
    const new_qar = route.params?.new_qar;

    /* State variables */
    const [isLoading, setIsLoading] = useState(true)
    const [siteInfo, setSiteInfo] = useState<QarSite>()
    const [fetchedUser, setFetchedUser] = useState<User>()

    /* Constants */
    let random_number = random(1, 1000);
    let generated_id = generatePushID()

    /* Context variables */

    /* Redux-related */
    const dispatch = useAppDispatch()
    const {isConnected} = useAppSelector(state => state.reachable);
    const {user, qar_listing, qar_users, qar_sites} = useAppSelector(state => state)
    const {user_info: loggedUser} = user

    const today = new Date();

    const onConfirm = () => {
        dispatch({type: UPSERT_QAR_REQUEST});
        Alert.alert(
            i18n.t("Alert"),
            i18n.t("confirmRequestAlert"),
            [
                {
                    text: i18n.t("No"),
                    onPress: () => dispatch({type: 'REQUEST_CANCELED'}),
                    style: "cancel"
                },
                {
                    text: i18n.t("Yes"),
                    onPress: () => saveToFB(),
                    style: "destructive",
                }
            ],
            {cancelable: false}
        );
    }

    /* Step 2: If the telephone number already exist, display the info else,
    show phone number and little info to show not */

    /* Step 3: Check if site name and location exist in the db, else insert
     it and get the id. */
    async function getSiteInfoAndUserInfo() {

        setIsLoading(true);

        const newSiteInfo: QarSite = {
            _id: generatePushID(),
            name: startCase(new_qar.site_name),
            location: startCase(new_qar.site_location),
            region: startCase(new_qar.site_region),
            subRegion: startCase(new_qar.site_sub_region),
            owner: startCase(new_qar.site_owner),
            created_at: (new Date()).toISOString(),
            updated_at: (new Date()).toISOString()
        }

        if (!isEmpty(new_qar.enteredTelephone)) {
            /* Find local */
            const newUserData: User = {
                _id: generated_id,
                names: null,
                telephone: new_qar.enteredTelephone,
                verified: false,
                user_type: loggedUser.user_type === 2 ? 1 : 2,
                equipment: null,
                email: null,
                expo_token: null,
                fcm_token: null,
                created_at: (new Date()).toISOString(),
                updated_at: (new Date()).toISOString()
            }
            setFetchedUser(await fetchUserByTelephoneAndType(newUserData, isConnected, qar_users.users));
        }

        setSiteInfo(await fetchSiteByNameAndLocation(newSiteInfo, isConnected, qar_sites.sites))

        setIsLoading(false)
    }

    useEffect(() => {
        getSiteInfoAndUserInfo();
    }, [qar_listing.in_progress])

    /* Step 4: Save the new request. */
    const saveToFB = () => {


        const qarModel: Qar = {
            _id: generated_id,
            request_code: "QAR-" + random_number, // TODO: Better generation number probably done by server.
            buyer: loggedUser.user_type === 2 ? loggedUser._id : fetchedUser.telephone.length > 4 ? fetchedUser._id : null, // TODO: fetchedUser null should assign undefined.
            field_tech: loggedUser.user_type === 1 ? loggedUser._id : fetchedUser._id,
            site: siteInfo._id,
            status: 0,
            due_date: new_qar.due_date,
            created_at: today.toISOString(),
            updated_at: today.toISOString(),
            created_by: loggedUser.user_type
        }

        // console.log("QAR => ", qarModel)
        // console.log("BUYER => ", fetchedUser)
        // console.log("SITE => ", siteInfo)

        dispatch({
            type: UPSERT_NEW_QAR_REQUEST,
            payload: {
                qar: qarModel,
                logged_user: loggedUser,
                navigation
            },
            siteInfo,
            fetchedUser,
            notification_data: {
                user_id: fetchedUser._id,
                title: "New Audit Request",
                body: "Audit request " + qarModel.request_code + " for you. \nRequested by " + loggedUser.names
            },
        })
    }

    return (
        <ScrollView
            contentContainerStyle={[styles.container, {
                backgroundColor: Colors.GRAY_LIGHT,
                justifyContent: 'space-between',
                flexGrow: 1,
            }]}>

            <View>
                {qar_listing.error_msg && <ErrorMessage error={qar_listing.error_msg}/>}

                {new_qar && new_qar.due_date &&
                    <List.Item
                        title={moment(new Date(new_qar.due_date)).format('ll')}
                        titleStyle={{fontWeight: "bold"}}
                        description={loggedUser.user_type === 2 ? i18n.t("dueDate") : i18n.t("Date")}
                        left={props => <List.Icon {...props} icon="calendar"/>}
                        style={{backgroundColor: "white", borderRadius: 8, marginBottom: 16}}
                    />
                }

                {(fetchedUser &&
                        fetchedUser.telephone &&
                        fetchedUser.telephone.length > 4) &&
                    <UserInfoCard
                        user={fetchedUser}
                        userType={loggedUser.user_type === 1 ? "Buyer" : "Field Tech"}/>
                }
                <SiteInfoCard site={siteInfo}/>
            </View>

            <Button
                mode="contained"
                contentStyle={styles.buttonStyle}
                disabled={qar_listing.in_progress || isLoading}
                loading={qar_listing.in_progress}
                onPress={() => onConfirm()}
            >
                {i18n.t("Submit")}
            </Button>
        </ScrollView>
    );
}

export default QARReviewScreen;
