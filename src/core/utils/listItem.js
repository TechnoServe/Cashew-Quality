import React from 'react';
import {Icon, ListItem} from "react-native-elements";


export const ItemList = (title, icon, bottomDividerVal) => {
    return (
        <ListItem bottomDivider={bottomDividerVal}>
            <Icon type="material" name={icon}/>
            <ListItem.Content>
                <ListItem.Title>
                    {title ? title : 'Not Set'}
                </ListItem.Title>
            </ListItem.Content>
        </ListItem>
    )
}
