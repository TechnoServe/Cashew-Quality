import {db} from "../../core/utils/config";
import {ResultModel} from "./ResultModel";
import {chunk, flattenDeep, uniq} from "lodash";

const qarResultCollRef = db.collection('qar_results')

/**
 * service to get qar_result info from firebase
 * @returns {ResultModel} of result
 * @param request_ids
 */
export async function getRemoteResultByRequestIds(request_ids) {
    try {

        //firebase only a limit of 10
        const result_chunks = chunk(uniq(request_ids), 10)

        const userRelatedResults = Promise.all(result_chunks.map(async chunk => {
            let resultObjArr = []
            const results = await qarResultCollRef.where('request_id', 'in', chunk).get()
            results.forEach(docs => {
                resultObjArr.push(docs.data())
            })
            return resultObjArr
        }))

        return flattenDeep(await userRelatedResults)

    } catch (err) {
        throw "something went wrong fetching user related results [code - " + err.code + "]"
    }
}

/**
 * function to save a new site to Firebase.
 * @returns the same resultModel
 * @param resultModel
 */
export async function upsertQarResultsRemotelyFb(resultModel) {
    try {
        let resultsData = {}
        await qarResultCollRef.doc(resultModel._id).set(Object.assign(resultsData, resultModel), {merge: true})
        return true;
    } catch (err) {
        console.error("something went wrong saving new result", err)
    }
}
