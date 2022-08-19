import React from "react";
import {Image, ScrollView, Text, View} from "react-native";
import {Colors, styles} from "../styles";
import {ItemList} from "../../core/utils/listItem";
import {isEmpty} from 'lodash'
import {Button, Divider, Icon, ListItem} from "react-native-elements";
import i18n from "i18n-js";
import moment from "moment";
import {TouchableOpacity} from "react-native-gesture-handler";
import EquipmentModal from "./modals/EquipmentModal";
import {QarSite} from "../../model/qar_listing/QarModel";
import {useAppSelector} from "../../core/hooks";


export const UserInfoCard = ({user, userType}) => {
    return (
        <View>
            <Text style={{fontSize: 16, fontWeight: "bold", marginBottom: 8}}>
                {userType === "Buyer" ? i18n.t("Buyer Information") : i18n.t("Field tech Info")}</Text>

            <View style={styles.groupedList}>
                {user.names && ItemList(user.names, 'person', true)}
                {ItemList(user.telephone, 'phone', !isEmpty(user.email))}
                {!isEmpty(user.email) && ItemList(user.email, 'email', false)}
            </View>
        </View>
    )
}

export const SiteInfoCard = ({site}: { site: QarSite }) => {

    return (
        <View>
            <Text style={{fontSize: 16, fontWeight: "bold", marginBottom: 8}}>{i18n.t("Site Information")}</Text>
            {site &&
                <View style={styles.groupedList}>
                    {site.name && ItemList(site.name, 'location-city', true)}
                    {(!isEmpty(site.subRegion) && !isEmpty(site.region))
                        ? ItemList(site.subRegion + ", " + site.region, 'location-on', !isEmpty(site.owner))
                        : ItemList(site.location, 'location-on', !isEmpty(site.owner))
                    }
                    {!isEmpty(site.owner) && ItemList(site.owner, 'person', false)}
                </View>
            }

        </View>
    )
}

export const LotInfoCard = (props) => {
    return (
        <View>
            <Text style={{fontSize: 16, fontWeight: "bold", marginBottom: 8}}>{i18n.t("Lot Information")}</Text>
            <View style={styles.groupedList}>
                <ListItem bottomDivider>
                    <ListItem.Content>
                        <ListItem.Title style={{color: Colors.BLACK}}>
                            {i18n.t("Number of Bags")}
                        </ListItem.Title>
                    </ListItem.Content>
                    <ListItem.Content right>
                        <ListItem.Title right style={{color: Colors.PRIMARY, fontSize: 18, fontWeight: "bold"}}>
                            {props.lot_info.count_bags + " " + i18n.t("Bags")}
                        </ListItem.Title>
                    </ListItem.Content>
                </ListItem>

                <ListItem bottomDivider containerStyle={{flexDirection: "row", justifyContent: "space-between"}}>
                    <ListItem.Content>
                        <ListItem.Title style={{color: Colors.BLACK}}>
                            {i18n.t("Stock Volume")}
                        </ListItem.Title>
                    </ListItem.Content>
                    <ListItem.Content>
                        <ListItem.Title
                            style={{color: Colors.PRIMARY, fontSize: 18, fontWeight: "bold", alignSelf: "flex-end"}}>
                            {props.lot_info.stock_volume + " " + i18n.t("MT")}
                        </ListItem.Title>
                    </ListItem.Content>
                </ListItem>

                <ListItem>
                    <ListItem.Content>
                        <ListItem.Title style={{color: Colors.BLACK}}>
                            {i18n.t("Bags Sampled")}
                        </ListItem.Title>
                    </ListItem.Content>
                    <ListItem.Content right>
                        <ListItem.Title right style={{color: Colors.PRIMARY, fontSize: 18, fontWeight: "bold"}}>
                            {props.lot_info.count_sampled_bags + " " + i18n.t("Bags")}
                        </ListItem.Title>
                    </ListItem.Content>
                </ListItem>
            </View>
        </View>
    )
}

export function EquipmentCard({navigation, visibility, equipment_list, close_modal, image_id, set_eq_id}) {
    const {isConnected} = useAppSelector(state => state.reachable)
    return (
        <View style={{marginStart: -16, marginEnd: -16}}>

            {equipment_list.length < 2 &&
                <Button
                    title={i18n.t("BTN_ADD_EQUIPMENT")}
                    buttonStyle={[
                        {
                            backgroundColor: Colors.PRIMARY,
                            marginTop: 10,
                            marginHorizontal: 16,
                            borderRadius: 8
                        }]}
                    icon={
                        <Icon
                            type="material-community"
                            name="plus-circle"
                            size={30}
                            color="white"
                            iconStyle={{marginRight: 20}}
                        />
                    }
                    disabled={!isConnected}
                    onPress={() => navigation.navigate("EquipmentInfoForm")}
                />
            }
            {equipment_list.length > 0 &&
                <View style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 8,
                    marginStart: 16,
                    marginEnd: 16
                }}>
                    <Text style={{
                        fontWeight: "bold",
                        fontSize: 17,
                        letterSpacing: 0.5
                    }}
                    >
                        {i18n.t("HEADER_EQUIPMENT_INFO")}
                    </Text>

                    <TouchableOpacity
                        disabled={!isConnected}
                        onPress={() => navigation.navigate("EquipmentInfoForm")}>
                        <Text style={{
                            fontWeight: "bold",
                            fontSize: 15,
                            letterSpacing: 0.5,
                            color: isConnected ? 'royalblue' : 'grey'
                        }}
                        >
                            {i18n.t("TEXT_EQUIPMENT_INFO_EDIT")}
                        </Text>


                    </TouchableOpacity>

                </View>
            }

            <ScrollView horizontal contentContainerStyle={{
                flexDirection: "row",
                marginBottom: 16,
                paddingStart: 16,
                paddingEnd: 16,
            }}>
                {
                    equipment_list.map((l, i) => (

                        <View key={i} style={{
                            borderRadius: 16,
                            marginEnd: i === 0 ? 16 : 0,
                            overflow: "hidden",
                            backgroundColor: 'white',
                            width: 200
                        }}>
                            <TouchableOpacity onPress={() => set_eq_id(l)}>
                                <Image
                                    resizeMode="cover"
                                    style={{height: 200, width: undefined}}
                                    source={l && l.image_url !== '' ? {uri: l.image_url} : require('../../../assets/images/noImage.png')}
                                />
                            </TouchableOpacity>

                            <View style={{margin: 8,}}>
                                <Text style={{fontSize: 18, fontWeight: "bold"}}>
                                    {l && l.type === 'Weight Scale' ? i18n.t("TEXT_WEIGHING_SCALE") : i18n.t("TEXT_MOISTURE_METER")}
                                </Text>
                                <Divider style={{marginVertical: 8}}/>
                                <Text style={{
                                    fontSize: 10,
                                    color: Colors.GRAY_MEDIUM
                                }}>{i18n.t("modelNum")}</Text>
                                <Text>{l.model_no || i18n.t("Not Set")}</Text>
                                <Divider style={{marginVertical: 8}}/>
                                <Text style={{
                                    fontSize: 10,
                                    color: Colors.GRAY_MEDIUM
                                }}>{i18n.t("manDate")}</Text>
                                <Text>{l.manufacture_date ? moment(l.manufacture_date).format('LL') : "Not Set"}</Text>
                            </View>
                        </View>

                    ))
                }
            </ScrollView>


            <EquipmentModal
                visibility={visibility}
                close_modal={close_modal}
                equipment_list={equipment_list}
                image_id={image_id}/>
        </View>
    )
}
