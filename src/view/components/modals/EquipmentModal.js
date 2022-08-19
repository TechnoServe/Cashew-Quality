import {Image, Modal as RNModal, View} from "react-native";
import {Colors, styles} from "../../styles";
import {Icon} from "react-native-elements";
import React from "react";


export default function EquipmentModal({visibility, equipment_list, image_id, close_modal}) {
    return (
        <RNModal
            animationType="none"
            visible={visibility}
            transparent={false}
            presentationStyle="overFullScreen">

            <View style={[{
                flex: 1,
                flexDirection: 'column',
                justifyContent: "center", alignItems: "center",
                padding: 20
            }]}>

                <Image
                    source={
                        equipment_list[image_id] && equipment_list[image_id].image_url
                            ?
                            {uri: equipment_list[image_id].image_url} : require('../../../../assets/images/noImage.png')
                    }
                    style={
                        [
                            styles.imageStyle, {
                            width: 250,
                            height: 250, backgroundColor: Colors.GRAY_DARK,
                            borderColor: Colors.BLACK,
                            borderWidth: 1,
                        }
                        ]
                    }
                />

                <Icon
                    name="close"
                    reverse
                    type="material"
                    size={25}
                    onPress={close_modal}
                    color={Colors.PRIMARY}
                />
            </View>
        </RNModal>
    )
}