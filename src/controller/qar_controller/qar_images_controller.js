import React from 'react';
import * as FileSystem from "expo-file-system";
import i18n from 'i18n-js';
import {getImageDir} from "../../core/utils/data";
import storage from '@react-native-firebase/storage';


let imageValueObjectTemp = [];
let imageUrlsObjectTemp = [];

async function downloadImageToLocal(request_id) {
    try {
        const image_folder = await getImageDir(request_id)
        const storageRef = storage().ref(request_id);
        const result = await storageRef.listAll();
        result.items.map(async image => {
            const image_uri = await image.getDownloadURL()
            await FileSystem.downloadAsync(image_uri, image_folder + image.name)
        })
    } catch (e) {

        throw new Error(e.message)
    }

}


function pushValue(title, value, value1, shell) {
    if (value !== "") {
        imageValueObjectTemp.push(
            {title: title, value: value, value1: value1, shell: shell},
        );
    }
}

export const getStepImage = async (request_id, step_name) => {
    let imageArr = [];
    let dir = await FileSystem.readDirectoryAsync(await getImageDir(request_id));
    dir.forEach(file => {
        if (file.includes(step_name)) {
            imageArr.push(file)
        }
    })
    return (await getImageDir(request_id)) + imageArr[0];
}
/**
 * get all image uris from the directory
 *
 * @param request_id - folder name
 * @returns {Promise<[]>} - an array of image URIs
 */
export const getDirImages = async (request_id) => {
    let imageArr = [];
    const image_dir = await getImageDir(request_id)
    let dir = await FileSystem.readDirectoryAsync(image_dir);
    if (dir.length > 0) {
        dir.map(async file => {
            imageArr.push(image_dir + file)
        })
    }

    return imageArr
}

async function pushUrls(has_image, request_id, step_name) {
    if (has_image) {
        const localImageBasePath = await getStepImage(request_id, step_name)
        imageUrlsObjectTemp.push(localImageBasePath,);
    } else {
        imageUrlsObjectTemp.push(require('../../../assets/images/noImage.png'),);

    }
}

export async function qarImagesData(image_data) {
    imageValueObjectTemp = []
    imageUrlsObjectTemp = []

    await pushUrls(image_data.nut_count.has_image, image_data.request_id, 'nut_count')
    pushValue(i18n.t("Nut count"), image_data.nut_count.with_shell + " nuts", null, false)
    await pushUrls(image_data.foreign_materials.has_image, image_data.request_id, 'foreign_materials')
    pushValue(i18n.t("Foreign materials"), image_data.foreign_materials.with_shell + " g", null, false)
    await pushUrls(image_data.good_kernel.has_image, image_data.request_id, 'good_kernel')
    pushValue(i18n.t("Good Kernel"), image_data.good_kernel.with_shell + " g", null, false)
    await pushUrls(image_data.spotted_kernel.has_image, image_data.request_id, 'spotted_kernel')
    pushValue(i18n.t("Spotted Kernel"), image_data.spotted_kernel.with_shell + " g", image_data.spotted_kernel.without_shell + " g", true)
    await pushUrls(image_data.immature_kernel.has_image, image_data.request_id, 'immature_kernel')
    pushValue(i18n.t("Immature Kernel"), image_data.immature_kernel.with_shell + " g", image_data.immature_kernel.without_shell + " g", true)
    await pushUrls(image_data.oily_kernel.has_image, image_data.request_id, 'oily_kernel')
    pushValue(i18n.t("Oily Kernel"), image_data.oily_kernel.with_shell + " g", image_data.oily_kernel.without_shell + " g", true)
    await pushUrls(image_data.bad_kernel.has_image, image_data.request_id, 'bad_kernel')
    pushValue(i18n.t("Bad Kernel"), image_data.bad_kernel.with_shell + " g", image_data.bad_kernel.without_shell + " g", true)
    await pushUrls(image_data.void_kernel.has_image, image_data.request_id, 'void_kernel')
    pushValue(i18n.t("Void Kernel"), image_data.void_kernel.with_shell + " g", image_data.void_kernel.without_shell + " g", true)

    let imageData = {imageValueObjectTemp, imageUrlsObjectTemp}

    return (imageData)
}

export async function getImageFromFirebase(request_id) {
    try {
        await downloadImageToLocal(request_id)
        return true
    } catch (e) {
        console.log(e.message)
    }
}



