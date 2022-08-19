import React, {useEffect, useRef, useState} from "react";
import Navigation from "./src/view";
import {Provider as PaperProvider} from 'react-native-paper';
import theme from "./src/view/styles/DefaultTheme";
import NetworkProvider from "./src/core/hooks/NetworkContext";
import * as Localization from 'expo-localization';
import i18n from 'i18n-js';
import moment from "moment";
import 'moment/locale/fr';
import 'moment/locale/pt';
import 'moment/locale/en-gb';
import {Provider} from "react-redux";
import {persistor, store} from "./src/core/store";
import {LogBox} from 'react-native';
import {PersistGate} from "redux-persist/integration/react";
import * as Notifications from 'expo-notifications';
import {Subscription} from "expo-modules-core";

const transGetters = {
    'en-US': require('./src/core/utils/locales/en.json'),
    'fr-FR': require('./src/core/utils/locales/fr.json'),
    'pt-PT': require('./src/core/utils/locales/pt.json'),
};

i18n.translations = {
    en: transGetters['en-US'],
    fr: transGetters['fr-FR'],
    pt: transGetters['pt-PT']
}

// Set the locale once at the beginning of your app.
i18n.locale = Localization.locale;//

moment.locale(Localization.locale);
// When a value is missing from a language it'll fallback to another language with the key present.
i18n.fallbacks = true;


function App() {
    LogBox.ignoreLogs([
        "Cannot update a component from inside the function body of a different component."
    ])


    const [notification, setNotification] = useState<Notifications.Notification>();
    const notificationListener = useRef<Subscription>();
    const responseListener = useRef<Subscription>();

    useEffect(() => {

        // This listener is fired whenever a notification is received while the app is foregrounded
        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            return setNotification(notification);
        });

        // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            //console.log(response);
        });

        return () => {
            Notifications.removeNotificationSubscription(notificationListener.current);
            Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, []);

    return (
        <Provider store={store}>
            <PersistGate persistor={persistor} loading={null}>
                <NetworkProvider>
                    <PaperProvider theme={theme}>
                        <Navigation/>
                    </PaperProvider>
                </NetworkProvider>
            </PersistGate>
        </Provider>
    );
}

export default App;
