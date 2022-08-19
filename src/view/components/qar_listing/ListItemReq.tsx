import {useNavigation} from '@react-navigation/native';
import i18n from 'i18n-js';
import {filter} from "lodash"
import moment from "moment";
import React, {useEffect, useRef, useState} from "react";
import {Text, TouchableOpacity, View} from "react-native";
import ActionSheet from "react-native-actions-sheet";
import {Badge} from "react-native-elements";
import {Colors as pColors, Divider, ProgressBar} from 'react-native-paper';
import {Strings} from "../../../core/utils";
import {Colors, styles} from "../../styles";
import RequestDetailModal from "../modals/RequestDetailModal";
import {useAppSelector} from "../../../core/hooks";


export default function ListItemReq({item}) {

    const navigation = useNavigation();
    const {user_info: loggedUser} = useAppSelector(state => state.user)
    const [synced, setSynced] = useState(false)

    const [scrollEnabled, setScrollEnabled] = useState(false);
    const actionSheetRef = useRef<ActionSheet>();

    const _onHasReachedTop = (hasReachedTop) => {

        setScrollEnabled(hasReachedTop);
    };

    /* react-redux hooks */
    const {qars_to_sync} = useAppSelector(state => state.qar_listing)
    const {data_to_sync} = useAppSelector(state => state.qap_data)
    const {results_to_sync} = useAppSelector(state => state.qar_results)

    const getStatus = (status) => {
        switch (status) {
            case 0:
                return {text: i18n.t("To Be Done"), color: Colors.GRAY_MEDIUM}
            case 1:
                return {text: i18n.t("In Progress"), color: Colors.IN_PROGRESS}
            case 2:
                return {text: i18n.t("Completed"), color: Colors.COMPLETED}
            default:
                break;
        }
    }

    /* Handle on press action. */
    function handleOnPress() {

        if (item.status < 2 && loggedUser.user_type === 2) {
            actionSheetRef.current?.setModalVisible(true)
        } else if (item.status === 2) {
            navigation.navigate(Strings.REQUEST_VIEW_SCREEN_NAME as never, {
                    title: item.request_code,
                    requestData: item
                } as never
            )
        } else {
            navigation.navigate(Strings.INITIAL_STEP_SCREEN_NAME as never, {
                    title: item.request_code,
                    requestData: {
                        id: item._id,
                        buyer: {...item.buyer_obj},
                        request_code: item.request_code
                    }
                } as never
            )
        }
    }

    useEffect(() => {

        /* Check if needs to be synced */
        function toBeSynced(request_id) {

            if (request_id !== undefined) {
                const q = filter(qars_to_sync, {_id: request_id}).length > 0
                const qd = filter(data_to_sync, {request_id: request_id}).length > 0
                const qr = filter(results_to_sync, {request_id: request_id}).length > 0

                setSynced(!q && !qd && !qr);
            }
        }

        toBeSynced(item._id)

    }, [synced])

    /* If user is field-tech */
    if (loggedUser.user_type === 1) {

        return (
            <TouchableOpacity onPress={() => handleOnPress()}>
                <View style={[styles.groupedList, {flexDirection: "row", justifyContent: "space-between"}]}>
                    <View style={{
                        flex: 1,
                        margin: 4,
                        padding: 4,
                        borderRightWidth: .5,
                        borderColor: Colors.GRAY_MEDIUM
                    }}>
                        <Text style={{marginBottom: 4, fontWeight: "bold"}}>{item.request_code}</Text>
                        <Text style={{fontSize: 10, color: Colors.GRAY_MEDIUM}}>{i18n.t('Site Location')}</Text>
                        <Text style={{marginBottom: 4, marginTop: -2, fontSize: 16}} numberOfLines={1}>
                            {(item.site_obj
                                    && item.site_obj.region !== ""
                                    && item.site_obj.subRegion !== "")
                                && item.site_obj.subRegion + ", " + item.site_obj.region}
                            {(item.site_obj
                                && item.site_obj.location) && item.site_obj.location}
                            {(!item.site_obj) && "Not set!"}
                        </Text>
                        <Text>
                            <Text style={{fontSize: 10, color: Colors.GRAY_MEDIUM}}>{i18n.t('buyer')}{"\n"}</Text>
                            {((item.buyer_obj !== undefined)
                                && (item.buyer_obj.telephone !== undefined)
                                && item.buyer_obj.telephone.length > 4)
                                ? (item.buyer_obj.names || item.buyer_obj.telephone)
                                : i18n.t('buyerPhoneMissing')}
                        </Text>
                    </View>

                    <View style={{flex: 1, padding: 4, marginVertical: 2, marginEnd: 4}}>
                        <Badge
                            status={synced ? "success" : "warning"}
                            containerStyle={{position: 'absolute', top: 4, right: 4}}
                        />

                        <Text style={{marginBottom: 2, fontSize: 16}}>
                            {(item.created_by && item.created_by === 2) &&
                                <Text style={{fontSize: 10, color: Colors.GRAY_MEDIUM}}>{i18n.t('dueDate')}{"\n"}</Text>
                            }
                            {moment(item.due_date.toString()).format('ll')}
                        </Text>
                        <Text style={{marginBottom: 4, fontSize: 10, color: Colors.GRAY_MEDIUM, fontWeight: "bold"}}>
                            {moment(item.due_date.toString()).fromNow()}
                        </Text>
                        <Divider/>
                        {(item.status === 1) &&
                            <View>
                                <Text style={{marginBottom: 4, fontSize: 10, color: Colors.GRAY_MEDIUM}}>
                                    {i18n.t('Progress')}
                                </Text>
                                <ProgressBar
                                    style={{height: 23, borderRadius: 16}}
                                    progress={item.progress}
                                    color={pColors.orange800}/>
                            </View>
                        }

                        {((item.status === 0 || item.status === 2)) &&
                            <View>
                                <Text style={{marginBottom: 4, fontSize: 10, color: Colors.GRAY_MEDIUM}}>
                                    {i18n.t('Status')}
                                </Text>
                                <Badge
                                    value={getStatus(item.status).text}
                                    badgeStyle={{
                                        height: 'auto',
                                        borderRadius: 50,
                                        paddingVertical: 4,
                                        alignSelf: "stretch",
                                        backgroundColor: getStatus(item.status).color
                                    }}/>
                            </View>
                        }

                    </View>
                </View>
            </TouchableOpacity>
        )

    } else {

        return (
            <TouchableOpacity onPress={() => handleOnPress()}>
                <View style={[styles.groupedList, {flexDirection: "row", justifyContent: "space-between"}]}>
                    <View style={{
                        flex: 1,
                        margin: 4,
                        padding: 4,
                        borderRightWidth: .5,
                        borderColor: Colors.GRAY_MEDIUM
                    }}>
                        <Text style={{marginBottom: 4, fontWeight: "bold"}}>{item.request_code}</Text>
                        <Text style={{marginBottom: 4, fontSize: 16}}>
                            <Text style={{fontSize: 10, color: Colors.GRAY_MEDIUM}}>{i18n.t('Site Name')}{"\n"}</Text>
                            {item.site_obj.name}
                        </Text>
                        <Text style={{fontSize: 10, color: Colors.GRAY_MEDIUM}}>{i18n.t('Site Location')}</Text>
                        <Text style={{marginBottom: 4, marginTop: -2, fontSize: 16}} numberOfLines={1}>
                            {(item.site_obj
                                    && item.site_obj.region !== ""
                                    && item.site_obj.subRegion !== "")
                                && item.site_obj.subRegion + ", " + item.site_obj.region}
                            {(item.site_obj
                                    && item.site_obj.location)
                                && item.site_obj.location}
                            {(!item.site_obj) && "Not set!"}
                        </Text>
                    </View>

                    <View style={{flex: 1, padding: 4, marginVertical: 4, marginEnd: 4}}>
                        <Badge
                            status={synced ? "success" : "warning"}
                            containerStyle={{position: 'absolute', top: 4, right: 4}}
                        />
                        <Text style={{marginBottom: 2, fontSize: 16}}>
                            <Text style={{fontSize: 10, color: Colors.GRAY_MEDIUM}}>{i18n.t('Created at')}{"\n"}</Text>
                            {moment(item.created_at).format("ll")}
                        </Text>
                        <Text style={{marginBottom: 4}}>
                            <Text style={{fontSize: 10, color: Colors.GRAY_MEDIUM}}>{i18n.t('fieldtech')}{"\n"}</Text>
                            {item.field_tech_obj.names || item.field_tech_obj.telephone || "<Not Set>"}
                        </Text>
                        <Badge
                            value={getStatus(item.status).text}
                            badgeStyle={{
                                borderRadius: 50,
                                padding: 4,
                                height: 'auto',
                                alignSelf: "stretch",
                                backgroundColor: getStatus(item.status).color
                            }}/>
                    </View>
                </View>

                {/*modal component*/}
                <ActionSheet
                    bounceOnOpen={true}
                    onClose={() => setScrollEnabled(false)}
                    ref={actionSheetRef}
                    containerStyle={{backgroundColor: Colors.GRAY_LIGHT}}>
                    <View>
                        <RequestDetailModal
                            item={item}
                            onPress={() => actionSheetRef.current?.setModalVisible(false)}
                            scrollEnabled={scrollEnabled}
                            statusColor={getStatus(item.status).color}
                            statusText={getStatus(item.status).text}
                        />
                    </View>

                </ActionSheet>

            </TouchableOpacity>
        )
    }
}
