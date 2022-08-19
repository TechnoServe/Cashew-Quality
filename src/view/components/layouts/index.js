import React from 'react';
import {Image, ProgressBarAndroid, Text, View} from 'react-native';
import {Colors, Styles} from "../../styles";
import {useNavigation, useRoute} from "@react-navigation/native";
import {Button, Icon} from "react-native-elements";
import moveToBottom from "../../../core/utils/moveToBottom"
import {TouchableOpacity} from 'react-native-gesture-handler';


/*
* Go To Button function
* */
function GoToButton(props) {
    const navigation = useNavigation();
    return (
        <Button
            title={props.title}
            type={props.type}
            raised
            buttonStyle={{
                padding: 12,
                borderRadius: 8,
                backgroundColor: props.type === "solid" ? Colors.PRIMARY : '',
                borderColor: props.type === "outline" ? Colors.PRIMARY : ''
            }}
            titleStyle={props.textColor}
            onPress={() => navigation.navigate(props.screenName, {
                qar: props.qar,
                request: props.request
            })}
        />
    );
}

/* ########################################################################################
* Layout Components
* */
export const TopBoxComponent = ({screenTitle, progress}) => {
    return (
        <View style={Styles.css.topBox}>
            <Text>{`${screenTitle}`}</Text>
            <ProgressBarAndroid
                styleAttr="Horizontal"
                color="#2196F3"
                width="100%"
                style={{marginVertical: 16}}
                indeterminate={false}
                progress={progress}/>
        </View>
    )
}

/* Image Box Component */
export const ImageBoxComponent = ({sourceImage}) => {
    const cameraShoot = useNavigation();
    const route = useRoute();
    return (
        <View style={Styles.css.imageBox}>
            {sourceImage &&
                <TouchableOpacity onPress={() => cameraShoot.navigate('takePhotos', {
                    screenName: route.name
                })}>
                    <Image
                        //source={require('../../assets/images/cashew.jpg')}
                        source={{uri: `${sourceImage}`}}
                        style={Styles.css.imageStyle}
                    />
                </TouchableOpacity>
            }
            {!sourceImage &&
                <TouchableOpacity onPress={() => cameraShoot.navigate('takePhotos', {
                    screenName: route.name,
                })}>
                    <View style={Styles.css.imageStyleEmpty}>
                        <Icon
                            type="material-community"
                            color={Colors.GRAY_DARK}
                            name="camera-plus"
                            size={72}/>
                    </View>
                </TouchableOpacity>
            }
        </View>
    )
}

export const BottomBoxComponent = (props) => {
    return (
        moveToBottom(
            <View style={Styles.css.bottomBox}>

                {/*<View style={{flex: 2, marginEnd: 16}}>
                    <GoToButton
                        title="Back"
                        screenName={props.onPressBackButton}
                        type="outline"
                        textColor={{color: Colors.PRIMARY}}/>
                </View>*/}

                <View style={{flex: 2, marginStart: 16}}>
                    <GoToButton
                        title="Next"
                        screenName={props.onPressNextButton}
                        qar={props.qar}
                        request={props.request}
                        type="solid"
                        textColor={{color: Colors.WHITE}}/>
                </View>

            </View>
        )
    )
}

