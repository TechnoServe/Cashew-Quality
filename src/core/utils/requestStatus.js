import React from 'react';
import {Text} from 'react-native';
import {Badge} from "react-native-elements";
import {Colors} from "../../view/styles";


export const getStatusBadge = (status) => {
    switch (status) {
        case 0:
            return (<Badge
                badgeStyle={{padding: 14, width: 200}}
                value={<Text style={{color: Colors.WHITE, fontWeight: "bold"}}>To Be Done</Text>}
                status="primary"/>)
        case 1:
            return (<Badge
                badgeStyle={{padding: 14, width: 200}}
                value={<Text style={{color: Colors.WHITE, fontWeight: "bold"}}>In Progress</Text>}
                status="warning"/>)
        case 2:
            return (<Badge
                badgeStyle={{padding: 14, width: 200}}
                value={<Text style={{color: Colors.WHITE, fontWeight: "bold"}}>Completed</Text>}
                status="success"/>)
        default:
            break;
    }
}
