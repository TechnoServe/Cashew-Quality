import React from "react";
import {Text, View} from "react-native";
import {Colors, styles} from "../styles";
import {ListItem} from "react-native-elements";
import moment from "moment";
import i18n from 'i18n-js';

const ResultsCard = (props) => {

    return (
        <View>
            <Text style={{fontSize: 18, fontWeight: "bold", marginBottom: 8}}>{i18n.t("Results")}</Text>
            <View style={styles.groupedList}>
                <ListItem bottomDivider>
                    <ListItem.Content>
                        <ListItem.Title style={{color: Colors.BLACK}}>
                            {i18n.t("Nut count")}
                        </ListItem.Title>
                    </ListItem.Content>
                    <ListItem.Content right>
                        <ListItem.Title right style={{
                            color: Colors.PRIMARY,
                            fontSize: 18,
                            fontWeight: "bold",
                            width: 200,
                            textAlign: "right"
                        }}>
                            {props.results.nut_count}
                        </ListItem.Title>
                    </ListItem.Content>
                </ListItem>

                <ListItem bottomDivider>
                    <ListItem.Content>
                        <ListItem.Title style={{color: Colors.BLACK}}>
                            {i18n.t("Foreign materials")}
                        </ListItem.Title>
                    </ListItem.Content>
                    <ListItem.Content right>
                        <ListItem.Title right style={{
                            color: Colors.PRIMARY,
                            fontSize: 18,
                            fontWeight: "bold",
                            width: 200,
                            textAlign: "right"
                        }}>
                            {props.results.foreign_mat_rate + " %"}
                        </ListItem.Title>
                    </ListItem.Content>
                </ListItem>

                <ListItem bottomDivider>
                    <ListItem.Content>
                        <ListItem.Title style={{color: Colors.BLACK}}>
                            {i18n.t("KOR")}
                        </ListItem.Title>
                    </ListItem.Content>
                    <ListItem.Content right>
                        <ListItem.Title right style={{
                            color: Colors.PRIMARY,
                            fontSize: 18,
                            fontWeight: "bold",
                            width: 200,
                            textAlign: "right"
                        }}>
                            {props.results.kor + " " + i18n.t("lbs")}
                        </ListItem.Title>
                    </ListItem.Content>
                </ListItem>

                <ListItem bottomDivider>
                    <ListItem.Content>
                        <ListItem.Title style={{color: Colors.BLACK}}>
                            {i18n.t("Defective Rate")}
                        </ListItem.Title>
                    </ListItem.Content>
                    <ListItem.Content right>
                        <ListItem.Title right style={{
                            color: Colors.PRIMARY,
                            fontSize: 18,
                            fontWeight: "bold",
                            width: 200,
                            textAlign: "right"
                        }}>
                            {props.results.defective_rate + " %"}
                        </ListItem.Title>
                    </ListItem.Content>
                </ListItem>

                <ListItem>
                    <ListItem.Content>
                        <ListItem.Title style={{color: Colors.BLACK}}>
                            {i18n.t("Date Processed")}
                        </ListItem.Title>
                    </ListItem.Content>
                    <ListItem.Content right>
                        <ListItem.Title right style={{
                            color: Colors.PRIMARY,
                            fontSize: 16,
                            fontWeight: "bold",
                            width: 200,
                            textAlign: "right"
                        }}>
                            {moment(props.results.created_at).format("ll")}
                        </ListItem.Title>
                    </ListItem.Content>
                </ListItem>
            </View>
        </View>
    )
}

export default ResultsCard;
