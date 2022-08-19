import React, {useEffect, useRef} from "react"
import {Animated} from "react-native";

const FadeInView = (props) => {
    const fadeAnim = useRef(new Animated.Value(0)).current  // Initial value for opacity: 0

    useEffect(() => {
        //Animated.useNative(true)
        Animated.timing(
            fadeAnim,
            {
                toValue: 1,
                duration: 400,
                useNativeDriver: true
            }
        ).start();
    }, [fadeAnim])

    return (
        <Animated.View
            style={{
                ...props.style,
                opacity: fadeAnim,         // Bind opacity to animated value
            }}
        >
            {props.children}
        </Animated.View>
    );
}
export default FadeInView
