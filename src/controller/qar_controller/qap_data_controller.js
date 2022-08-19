import {firebaseUploader, getImageName} from "../../core/utils/data";


//save step data
export function prepareStepData({step_name, request, qar, image_uri, device_location}) {
    let outGoingData = {}

    outGoingData.request_id = request.id

    /* Trimming the location object */
    if (device_location !== undefined) {
        outGoingData[step_name] = {
            has_image: !!image_uri,
            with_shell: Number(qar[step_name]) || Number(qar[step_name + "_with_shell"]) || 0,
            without_shell: Number(qar[step_name + "_without_shell"]) || 0,
            location: device_location || null
        }
    } else {
        outGoingData[step_name] = {
            image_url: !!image_uri,
            with_shell: Number(qar[step_name]) || Number(qar[step_name + "_with_shell"]) || 0,
            without_shell: Number(qar[step_name + "_without_shell"]) || 0,
            location: null
        }
    }

    return outGoingData
}


export function uploadImages(request_id, uri_arr) {
    try {
        uri_arr.map(async uri => {
            //remove the timestamp part
            const image_name = getImageName(uri).replace(/[0-9]/g, '')
            await firebaseUploader(uri, image_name, request_id + "/")
        })
        return true
    } catch (error) {
        console.log("Issue on Image" + JSON.stringify(error))
    }
}
