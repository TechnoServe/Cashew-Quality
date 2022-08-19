import * as React from 'react';
import {DefaultTheme} from 'react-native-paper';
import {Colors} from "./index";

const theme = {
    ...DefaultTheme,
    roundness: 8,
    colors: {
        ...DefaultTheme.colors,
        primary: Colors.PRIMARY,
        accent: '#f1c40f',
    },
}

export default theme
