import NetInfo from "@react-native-community/netinfo";

export async function isNetworkAvailable() {
    const response = await NetInfo.fetch();
    return response.isConnected && response.isInternetReachable;
}

