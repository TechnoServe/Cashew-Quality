//TODO: this needs to be improved...

import storage from '@react-native-firebase/storage';
import * as FileSystem from "expo-file-system";


export const qarListingDataManipulation = (remote_qar_listing) => {
    return {
        fb_id: remote_qar_listing.id,
        request_code: remote_qar_listing.request_code,
        buyer: remote_qar_listing.buyer.id,
        field_tech: remote_qar_listing.field_tech.id,
        site: remote_qar_listing.site.id,
        status: remote_qar_listing.status,
        due_date: remote_qar_listing.due_date,
        created_at: remote_qar_listing.created_at,
    };
}

/* ToDo: Improve the multiple images upload to Firebase with one call
*   Move to controllers
* */
//Store images firebaseUploader
export const firebaseUploader = async (uri, image_name, root_path) => {
    if (uri) {
        const response = await fetch(uri);
        const blob = await response.blob();
        let ref = storage().ref().child(root_path + image_name);

        //save the file in storage
        await ref.put(blob);
        return await ref.getDownloadURL()
    }
}

//Store images firebaseDownloader
export const firebaseDownloader = async (request_id, image_name) => {
    try {
        const time_stamp = new Date().valueOf()
        const imgRef = storage().ref().child(request_id + "/" + image_name)
        const download_url = await imgRef.getDownloadURL()
        const image_dir = await getImageDir(request_id)

        const image_name_no_ext = image_name.split('.').slice(0, -1).join('.')
        const imageUri = image_dir + image_name_no_ext + time_stamp + '.jpg' //timestamp is added to avoid rn image caching

        //download the image to the folder
        await FileSystem.downloadAsync(download_url, imageUri)

        return imageUri
    } catch (e) {
        throw e.message
    }
}

/**
 * Get QAP Images directory from local uri
 * */
export const getImageDir = async (request_id) => {
    try {
        const folder = FileSystem.documentDirectory + "QAP_images/" + request_id + "/"
        const dir = await FileSystem.getInfoAsync(folder)
        if (!dir.exists && !dir.isDirectory) {
            await FileSystem.makeDirectoryAsync(folder, {intermediates: true})
            return folder
        }
        return folder

    } catch (e) {
        console.log("get image dir error =>", e.message);
    }
}

/**
 * Get Image name from local uri
 * */
export const getImageName = (uri) => {
    let uri_parts = uri.split('QAP_images/')

    if (uri_parts !== undefined) {
        let image_uri = uri_parts[uri_parts.length - 1].split('/')

        return image_uri[image_uri.length - 1]
    }

    return null;
}

/**
 * Create a local file storage for QAP Images
 * */
export const makeImagePath = async (folder, image_name) => {
    return folder + image_name + '.jpg';
}
