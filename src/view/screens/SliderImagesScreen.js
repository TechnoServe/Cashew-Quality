import React from 'react'
import SliderImagesScreen from '../components/layouts/SliderImagesComponent';

export function SliderImages({route, navigation}) {
    const {title, imageValue, imageSource} = route.params;
    return (
        <SliderImagesScreen
            navigation={navigation}
            imageSource={imageSource}
            imageValue={imageValue}
            title={title}
        />
    );
}