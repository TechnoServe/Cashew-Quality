import {
    addEquipmentToRemoteFBUser,
    getUserByPhoneAndUserTypeFb,
    updateUserExpoPushTokenFb
} from "../../model/user/firebase_calls";
import {User} from "../../model/user/UserModel";
import {find, isEmpty} from "lodash";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {firebaseUploader} from "../../core/utils/data";
import * as FileSystem from "expo-file-system";


export async function fetchUserByTelephoneAndType(newUserInfo: User, is_connected, store_users) {
    if (is_connected) {
        /* Checking if the remote user exists. */
        const user = await getUserByPhoneAndUserTypeFb({
            telephone: newUserInfo.telephone,
            user_type: newUserInfo.user_type
        })
        if (user !== null) {
            return user;
        }
    }

    /* Checking if the local user exists. */
    const store_user = find(store_users, {'telephone': newUserInfo.telephone, 'user_type': newUserInfo.user_type})

    //save the entered user to local
    if (store_user !== undefined) {
        //if the incoming user model has no name, upsert locally
        if (!isEmpty(store_user.names)) {
            return store_user;
        }
    }

    return newUserInfo;
}


// export async function fetchUserByUsernameAndPassword(newUserInfo, is_connected, store_users) {
//     const today = new Date()
//     const userModel = new UserModel(
//         generatePushID(),
//         newUserInfo.names,
//         newUserInfo.telephone,
//         newUserInfo.email,
//         newUserInfo.user_type,
//         newUserInfo.username,
//         newUserInfo.password,
//         today.toISOString(),
//         today.toISOString(),
//         newUserInfo.equipment
//     )
//
//     if (is_connected) {
//         //check if the remote user exists
//         const user = await getUserByUsernameAndPasswordFb({
//             username: userModel.telephone,
//             password: userModel.password,
//             user_type: userModel.user_type
//         })
//         if (user !== null) {
//
//             return user
//         }
//     }
//
//     //check if the local user exists
//     const store_user = find(store_users, {
//         'telephone': userModel.telephone,
//         'password': userModel.password,
//         'user_type': userModel.user_type
//     })
//
//     //save the entered user to local
//     if (store_user !== undefined) {
//         //if the incoming user model has no name, upsert locally
//         if (!isEmpty(store_user.names)) {
//             return store_user;
//         }
//     }
//
//     return userModel;
// }


// export async function fetchUserByPhoneNumberAndPassword(newUserInfo, is_connected, store_users) {
//     const today = new Date()
//     const userModel = new UserModel(
//         generatePushID(),
//         newUserInfo.names,
//         newUserInfo.telephone,
//         newUserInfo.email,
//         newUserInfo.user_type,
//         newUserInfo.password,
//         today.toISOString(),
//         today.toISOString(),
//         newUserInfo.equipment
//     )
//
//     if (is_connected) {
//         //check if the remote user exists
//         const user = await getUserByPhoneNumberAndPasswordFb({
//             telephone: userModel.telephone,
//             password: userModel.password,
//             user_type: userModel.user_type
//         })
//
//         if (user !== null) {
//
//             return user
//         }
//     }
//
//     //check if the local user exists
//     const store_user = find(store_users, {
//         'telephone': userModel.telephone,
//         'password': userModel.password,
//         'user_type': userModel.user_type
//     })
//
//     //save the entered user to local
//     if (store_user !== undefined) {
//         //if the incoming user model has no name, upsert locally
//         if (!isEmpty(store_user.names)) {
//             return store_user
//         }
//     }
//
//     return userModel;
// }

interface EquipmentInfo {
    image_url?: string
    model_no?: string
    manufacture_date?: string
    type: string
}

export interface Equipment {
    scale?: EquipmentInfo
    meter?: EquipmentInfo
}

/** Function saves a new/updated equipment info object to the user's profile */
export async function saveEquipmentInfo(scale_uri, scale_no, scale_man_date, meter_uri, meter_no, meter_man_date, user_id) {

    const scale_download_url = await firebaseUploader(scale_uri, "weight_scale.jpg", "equipment/" + user_id + "/")
    const meter_download_url = await firebaseUploader(meter_uri, "moisture_meter.jpg", "equipment/" + user_id + "/")

    const equipObj = {
        scale: {
            image_url: scale_download_url || '',
            model_no: scale_no || '',
            manufacture_date: scale_man_date || '',
            type: 'Weight Scale'
        },
        meter: {
            image_url: meter_download_url || '',
            model_no: meter_no || '',
            manufacture_date: meter_man_date || '',
            type: 'Moisture Meter'
        }
    }

    await addEquipmentToRemoteFBUser(equipObj, user_id);

    /* Updating local user info with equipment info. */
    await AsyncStorage.mergeItem("loggedUser", JSON.stringify({equipment: equipObj}));
    const updatedUserInfo = await AsyncStorage.getItem("loggedUser");

    return JSON.parse(updatedUserInfo);
}

/* Logging out configurations. */
export const loggingOutSetUp = async (logged_user, is_connected) => {

    if (is_connected) {
        await updateUserExpoPushTokenFb({
            user_id: logged_user._id,
            expo_token: null
        })
    }

    const keys = await AsyncStorage.getAllKeys();

    /* Deleting QAP Images folder. */
    await FileSystem.deleteAsync(FileSystem.documentDirectory + "QAP_images/", {idempotent: true})

    /* Deleting cache folder contents. */
    let cache_dir_files = await FileSystem.readDirectoryAsync(FileSystem.cacheDirectory);
    if (cache_dir_files.length > 0) {
        cache_dir_files.map(async file => {
            await FileSystem.deleteAsync(FileSystem.cacheDirectory + file, {idempotent: true})
        })
    }

    await AsyncStorage.multiRemove(keys);
}
