import AsyncStorage from '@react-native-async-storage/async-storage';

export async function getLocalObjData(key) {
    try {
        return JSON.parse(await AsyncStorage.getItem(key))
    } catch (err) {
        console.log("error getting data => ", err)
    }
}

export async function removeLocalData(key) {
    try {
        return await AsyncStorage.removeItem(key)
    } catch (err) {
        console.log("error removing data data => ", err)
    }
}
