import * as SplashScreen from 'expo-splash-screen';
import React, {useState} from 'react';


export default function useCachedResources() {
    const [isLoadingComplete, setLoadingComplete] = useState(false);

    // Load any resources or data that we need prior to rendering the app
    React.useEffect(async () => {
        async function loadResourcesAndDataAsync() {
            try {
                await SplashScreen.preventAutoHideAsync();
            } catch (e) {
                // We might want to provide this error information to an error reporting service
                console.warn(e);
            } finally {
                setLoadingComplete(true);
                await SplashScreen.hideAsync();
            }
        }

        await loadResourcesAndDataAsync();
    }, []);

    return isLoadingComplete;
}
