import {Button, Card, Chip, Divider, Text} from "react-native-paper";
import i18n from "i18n-js";
import {View} from "react-native";
import React from "react";
import {
    CLEAR_FILTER,
    FILTER_ASC,
    FILTER_DESC,
    TOGGLE_COMPLETED,
    TOGGLE_FILTER_CARD,
    TOGGLE_IN_PROGRESS,
    TOGGLE_TOBE_DONE
} from "../../../model/qar_listing/actions";


/**
 * A component for filtering qar_listings. it uses redux store
 * @param props - these are passed from the parent component HomeScreen.js
 * @returns {JSX.Element}
 * @constructor
 */

function FilterCard(props) {

    const loggedUser = props.user
    return (
        <Card style={{borderRadius: 0}}>
            <Card.Title title={i18n.t("Filter By")}/>
            <Card.Content>
                <View>
                    <Text style={{marginBottom: 2}}>{i18n.t("Status")}</Text>
                    <View style={{flexDirection: "row"}}>

                        <Chip
                            onPress={() => {
                                props.dispatch({type: TOGGLE_TOBE_DONE})
                            }}
                            selected={props.filter_params.tobe_done}
                            style={{width: 110}}>{i18n.t("To Be Done")}</Chip>

                        <Chip onPress={() => props.dispatch({type: TOGGLE_IN_PROGRESS})}
                              selected={props.filter_params.in_progress}
                              style={{marginHorizontal: 2, width: 110}}>{i18n.t("In Progress")}</Chip>

                        <Chip onPress={() => props.dispatch({type: TOGGLE_COMPLETED})}
                              selected={props.filter_params.completed}
                              style={{width: 110}}>{i18n.t("Completed")}</Chip>
                    </View>
                </View>

                <Divider style={{marginVertical: 8, marginBottom: 2}}/>

                <Text style={{marginBottom: 2}}>
                    {i18n.t("Order by") + " " + (loggedUser.user_type === 1 ? i18n.t("dueDate") : i18n.t("Created at"))}</Text>
                <View style={{flexDirection: "row"}}>
                    <Chip onPress={() => props.dispatch({type: FILTER_ASC})}
                          style={{marginHorizontal: 8}}
                          selected={props.filter_params.asc}>{i18n.t("Asc")}</Chip>
                    <Chip onPress={() => props.dispatch({type: FILTER_DESC})}
                          selected={props.filter_params.desc}>{i18n.t("Desc")}</Chip>

                </View>

                <Divider style={{marginVertical: 8, marginBottom: 0}}/>
            </Card.Content>
            <Card.Actions style={{alignSelf: "flex-end"}}>
                <Button mode="outlined" onPress={() => {
                    props.dispatch({
                        type: CLEAR_FILTER,
                        asc: loggedUser.user_type === 1,
                        desc: loggedUser.user_type === 2
                    })
                }}>{i18n.t("Clear")}</Button>

                <Button
                    mode="contained"
                    compact style={{marginHorizontal: 16}}
                    onPress={() => props.dispatch({type: TOGGLE_FILTER_CARD})}>
                    {i18n.t("Close")}
                </Button>
            </Card.Actions>
        </Card>
    )
}

export default FilterCard