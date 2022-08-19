import React from 'react'
import RequestViewScreen from '../components/layouts/RequestViewComponent';

export function RequestView({route, navigation}) {
    const {requestData, title} = route.params;
    return (
        <RequestViewScreen
            modal={false}
            navigation={navigation}
            title={title}
            requestData={requestData}
        />
    );
}