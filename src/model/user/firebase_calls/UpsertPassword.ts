import {crypticPassword} from "../../../core/utils";
import {FirebaseWriteResponse} from "../UserModel";
import {db} from "../../../core/utils/config";

/**
 * function to update or create existing user password.
 * @returns {String<token>}
 * @param userId - user id
 * @param newPw - new password
 * @param oldPw - the old password to be updated
 */
const userCollRef = db.collection('users');

export interface pwUpdateParams {
    readonly userId: string,
    newPw: string,
    oldPw?: string
}

interface updateObj {
    readonly password: string,
    verified: boolean
}

export async function upsertPassword(args: pwUpdateParams) {

    try {
        const userDoc = await userCollRef.doc(args.userId)
        //encrypt the incoming password
        const encryptedNewPassword = crypticPassword(args.newPw, false)

        let updateObject: updateObj = {
            "password": encryptedNewPassword,
            "verified": false // it will be false for newly added password, the user will have to verify the phone on the next login.
        }

        if (args.oldPw !== null) {
            const user = await userDoc.get()
            //check if the doc still exist
            if (user.exists) {
                const userData = user.data()
                if (crypticPassword(userData['password']) !== args.oldPw) {
                    return {
                        message: "Wrong Password! Try again",
                        success: false
                    } as FirebaseWriteResponse
                }
                delete updateObject.verified // delete the verified key since the existing user has id
            } else {
                return {
                    message: "User does not exist.",
                    success: false
                } as FirebaseWriteResponse
            }
        }


        //update or insert encrypted password
        await userDoc.set(updateObject, {merge: true})

        return {
            message: "Password updated successfully.",
            success: true
        } as FirebaseWriteResponse

    } catch (err) {
        console.log("something went wrong updating user password ", err)
        throw err
    }
}