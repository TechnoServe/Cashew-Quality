import React from "react";
import {KeyboardAvoidingView, Modal, Platform, Text, View} from "react-native";
import {Button, Icon, Input} from "react-native-elements";
import {Colors, styles} from "../styles";

const MyModal = (props) => (
    <Modal
        animationType="none"
        transparent={true}
        visible={props.visible}
        onRequestClose={props.onRequestClose}
    >
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "height" : undefined}
            style={styles.modalWrapper}
        >
            <View
                style={styles.modalContent}
            >
                <Text style={{marginBottom: 16}}>{`${props.placeholder}`}</Text>
                <Icon
                    type="material"
                    name="cancel"
                    size={28}
                    color={Colors.ALERT}
                    onPress={props.onPress}
                    containerStyle={{position: 'absolute', top: 8, right: 8}}/>

                <Input
                    placeholder={"Add " + `${props.placeholder}`}
                    autoFocus
                    value={props.inputData}
                    keyboardType="number-pad"
                    onChangeText={props.onChangeText}
                />

                <Button
                    title="Add Data"
                    buttonStyle={styles.buttonStyle}
                    style={{backgroundColor: "#2196F3"}}
                    onPress={props.onPress}
                />
            </View>
        </KeyboardAvoidingView>
    </Modal>
);
export default MyModal;
