import React from "react";
import {Dimensions, ScrollView, StatusBar, Text, View} from "react-native";
import {Badge, Icon} from "react-native-elements";
import {Colors, styles} from "../../styles";
import ListItemComponent from "../ListItemComponent";
import moment from "moment";
import i18n from 'i18n-js';
import {SiteInfoCard, UserInfoCard} from "../InfoCards";
import {ANDROID_ACTIONBAR_SIZE} from "../../../core/utils/constants";


const RequestDetailModal = (props) => {

    return (

        <ScrollView
            scrollEnabled={props.scrollEnabled}
            style={{
                paddingHorizontal: 16,
                maxHeight: Dimensions.get("window").height - StatusBar.currentHeight - ANDROID_ACTIONBAR_SIZE
            }}>

            <View style={{flexDirection: "row", alignItems: "center", marginVertical: 16}}>
                <Text style={{padding: 8, fontSize: 18, fontWeight: "bold",}}>{props.item.request_code}</Text>
                <View>
                    <Badge
                        value={props.statusText}
                        badgeStyle={{
                            borderRadius: 50,
                            paddingHorizontal: 24,
                            paddingVertical: 4,
                            height: 'auto',
                            alignSelf: "stretch",
                            backgroundColor: props.statusColor
                        }}/>
                </View>

            </View>
            <Icon
                type="material"
                name="cancel"
                size={38}
                color={Colors.ALERT}
                onPress={props.onPress}
                containerStyle={{position: 'absolute', top: 8, right: 0}}/>

            <View style={styles.groupedList}>
                <ListItemComponent title={i18n.t("Created at") + ": "}
                                   rightTitle={moment(props.item.created_at).format("ll")}/>
                <ListItemComponent title={i18n.t("dueDate") + ": "}
                                   rightTitle={moment(props.item.due_date).format("ll")}/>
            </View>
            <UserInfoCard user={props.item.field_tech_obj} userType={'Field Tech'}/>
            <SiteInfoCard site={props.item.site_obj}/>
        </ScrollView>
    )
};
export default RequestDetailModal;
