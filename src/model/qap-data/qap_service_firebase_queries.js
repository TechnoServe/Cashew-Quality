import {db} from "../../core/utils/config";
import {chunk, flattenDeep, uniq} from "lodash";

const qapDataCollRef = db.collection('qap_data')

/**
 * function to save a new qa request to Firebase.
 * @returns {Promise<boolean>}
 * @param qapDataModel
 */
export async function upsertRemoteQapDataFb(qapDataModel) {
    try {
        await qapDataCollRef.doc(qapDataModel.request_id).set(qapDataModel, {merge: true})
        return true
    } catch (err) {
        console.error("something went wrong ===> qap_data", err)
    }
}

/**
 * function to get all user related QAP Data by pass request_id.
 * @returns {Promise<firebase.firestore.DocumentData>}
 * @param request_ids
 */
export async function getRemoteQapDataByRequestIds(request_ids) {
    try {

        //firebase only a limit of 10
        const qap_data_chunks = chunk(uniq(request_ids), 10)

        const userRelatedQapData = Promise.all(qap_data_chunks.map(async chunk => {
            let dataObjArr = []
            const results = await qapDataCollRef.where('request_id', 'in', chunk).get()
            results.forEach(docs => {
                dataObjArr.push(docs.data())
            })
            return dataObjArr
        }))

        return flattenDeep(await userRelatedQapData)

    } catch (err) {
        throw "something went wrong fetching user related results [code - " + err.code + "]"
    }
}

//todo: to be removed after redux implementation
export async function getRemoteQapDataByRequestId(request_id) {
    try {
        const qapData = await qapDataCollRef.where("request_id", "==", request_id).limit(1).get()
        //data manipulation will be handled in the controller
        if (qapData.empty) {
            return {}
        }
        return qapData.docs[0].data()
    } catch (err) {
        console.log("something went wrong ===> getting qap data", err)
    }
}
