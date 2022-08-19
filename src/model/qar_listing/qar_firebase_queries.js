import {db} from "../../core/utils/config";


const qarCollRef = db.collection('qar_listing')

/**
 * function to save a new qa request to Firebase.
 * @returns {Promise<boolean>}
 * @param qarModel
 */
export async function upsertQarListingRemotelyFb(qarModel) {
    try {
        let qarData = {}
        await qarCollRef.doc(qarModel._id).set(Object.assign(qarData, qarModel), {merge: true})
        return true
    } catch (err) {
        throw err;
    }
}

export async function updateQarStatusFb({qar_id, status_code, updated_at}) {
    try {
        await qarCollRef.doc(qar_id).update({status: status_code, updated_at: updated_at})

        return true
    } catch (err) {
        console.log("something went wrong ===> qar_listing", err)
        throw err
    }
}

/**
 * function to save a new qa request to Firebase.
 * @returns {Promise<firebase.firestore.DocumentData>}
 * @param user_id
 * @param filter_user
 */
export const getQarListingByUserIdAndTypeFb = async ({user_id, filter_user}) => {
    try {
        let qarArr = [];
        const qarData = await qarCollRef.where(filter_user, "==", user_id).get()

        qarData.forEach(doc => {
            qarArr.push(doc.data());
        });

        return qarArr;

    } catch (err) {
        throw err
    }
};