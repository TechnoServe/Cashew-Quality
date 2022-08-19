import React, {useState} from 'react';
import {SliderBox} from "react-native-image-slider-box";
import {Colors} from "../../styles";
import {Text, View} from 'react-native';
import i18n from 'i18n-js';


const SliderImagesScreen = (props) => {

    const [imageVal, setImageVal] = useState(0);

    return (

        <View style={{flex: 1, backgroundColor: "black", justifyContent: "center"}}>
            <SliderBox
                images={props.imageSource}
                sliderBoxHeight={250}
                dotColor={Colors.PRIMARY}
                inactiveDotColor="#90A4AE"
                imageLoadingColor={Colors.WHITE}

                dotStyle={{
                    width: 10,
                    height: 10,
                    borderRadius: 10,
                    padding: 0,
                    margin: 0
                }}

                currentImageEmitter={index =>
                    setImageVal(index)}
            />
            {!props.imageValue[imageVal].shell &&
                <Text
                    style={{textAlign: "center", color: Colors.WHITE, fontSize: 15, fontWeight: "bold", marginTop: 10}}>
                    {props.imageValue[imageVal].title} : {props.imageValue[imageVal].value}
                </Text>
            }
            {props.imageValue[imageVal].shell &&
                <View>
                    <Text style={{
                        textAlign: "center",
                        color: Colors.WHITE,
                        fontSize: 15,
                        fontWeight: "bold",
                        marginTop: 10
                    }}>
                        {props.imageValue[imageVal].title}
                    </Text>
                    <Text style={{textAlign: "center", color: Colors.WHITE, fontSize: 15, fontWeight: "bold"}}>
                        {i18n.t("With shell")} : {props.imageValue[imageVal].value}, {i18n.t("Without shell")}: {props.imageValue[imageVal].value1}
                    </Text>
                </View>
            }
        </View>

    )
}

export default SliderImagesScreen
