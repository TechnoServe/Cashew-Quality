import React from "react";
import {ListItem} from "react-native-elements";

const ListItemComponent = (props) => {
    return (
        <ListItem bottomDivider={props.bottomDivider} containerStyle={{paddingVertical: 8}}>
            <ListItem.Content>
                <ListItem.Title>{props.title}</ListItem.Title>
            </ListItem.Content>
            <ListItem.Content right>
                <ListItem.Title style={{width: 200, textAlign: "right"}}>{props.rightTitle}</ListItem.Title>
            </ListItem.Content>
        </ListItem>
    )
};
export default ListItemComponent;
