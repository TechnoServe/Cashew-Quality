import React from "react";
import {Text, View} from "react-native";
import {Colors} from "../styles";

// Component for required input forms
const RequiredComponent = (props) => (
    <View style={{alignItems: "flex-start"}}>
        <Text style={{color: Colors.ALERT, fontSize: 10, marginBottom: 8,}}>{props.text}</Text>
    </View>
);
export default RequiredComponent;
