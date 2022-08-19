import React from 'react';
import {Colors, styles} from "../../view/styles";
import {Text, TextInput, View} from "react-native";


export const InputForm = (props) => (
    <View>
        <Text style={{color: Colors.BLACK}}>{props.labelText}</Text>
        <TextInput
            placeholder={props.placeholder}
            value={props.value}
            onChangeText={props.onChangeText}
            style={[styles.inputStyle]}
        />
    </View>
)
