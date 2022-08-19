import {chunk, flattenDeep, isEmpty, uniq} from "lodash";
import {db} from "../../../core/utils/config";
import {FirebaseWriteResponse, User} from "../UserModel";
import {crypticPassword} from "../../../core/utils";


const userCollRef = db.collection('users');

/**
 * service to get user info from firebase
 * @param user_id to get a specific user
 * @returns {Promise<*>} of user object
 */

export async function getRemoteUserById(user_id) {

    try {
        const user = await userCollRef.doc(user_id).get()

        if (!user.exists) {
            return null;
        }

        return user.data() as User;
    } catch (err) {
        throw err.message
    }
}

/**
 * Get all users of the specific type from firebase
 * @param user_type to get a specific user category - field-techs or buyers
 * @returns {Promise<User[]>} arr of users
 */

export async function fetchAllUsersByType(user_type: number): Promise<User[]> {

    try {
        const usersQuery = await userCollRef.where('user_type', '==', user_type).get()
        let users: User[] = []
        usersQuery.forEach((userDoc) => {
            users.push(userDoc.data() as User)
        })
        return users

    } catch (err) {
        throw err.message
    }
}


/**
 * service to get user info from firebase
 * @returns {Promise<*>} of user object
 * @param user_ids Array of user ids
 */

export async function getRemoteUsersByIds(user_ids) {
    try {
        //firebase only a limit of 10
        const user_chunks = chunk(uniq(user_ids), 10)
        const userRelatedSites = Promise.all(user_chunks.map(async chunk => {
            let userObjArr = []
            const users = await userCollRef.where('_id', 'in', chunk).get()
            users.forEach(docs => {
                userObjArr.push(docs.data())
            })
            return userObjArr
        }))
        return flattenDeep(await userRelatedSites)
    } catch (err) {
        throw err.message
    }
}

/**
 * function to get User By Phone And UserType.
 * @param phone for the user
 * @param user_type for the user 1, 2 or 3
 * @returns {Promise<null|*>} object of the user or null when not found
 */

export async function getUserByPhoneAndUserTypeFb({telephone, user_type}) {

    try {
        const getData = await userCollRef
            .where('telephone', '==', telephone)
            .where('user_type', '==', user_type)
            .limit(1)
            .get();

        if (getData.empty) {
            return null
        } else {
            let userArr = [];
            getData.forEach(doc => {
                // if the buyer/field-tech exits, get the doc id and data
                let userSnap = doc.data()

                let userModel: User = {
                    _id: userSnap._id === undefined ? doc.id : userSnap._id,
                    names: userSnap.names,
                    telephone: userSnap.telephone,
                    email: userSnap.email,
                    user_type: userSnap.user_type,
                    created_at: userSnap.created_at,
                    updated_at: userSnap.updated_at,
                    equipment: userSnap.equipment,
                    verified: userSnap.verified,
                    expo_token: userSnap.expo_token,
                    fcm_token: userSnap.fcm_token
                }

                userArr.push(userModel)
            });

            return userArr[0]
        }
    } catch (err) {
        console.log("something went wrong fetching user info", err)
    }
}


/**
 * Function retrieves a User using their Phone Number, Password & User type
 * @param telephone for the user
 * @param password for the user
 * @param user_type for the user
 * @returns {Promise<null|*>} Object of the user or Null when not found
 *
 * TODO: Refactor function name as it now uses a phone & the user type.
 */

interface LoginParams {
    telephone: string,
    password: string,
    user_type: number,
    expo_token: string,
}

export async function getUserByPhoneNumberAndPasswordFb({telephone, password, user_type, expo_token}: LoginParams) {

    try {
        const getData = await userCollRef
            .where('telephone', '==', telephone)
            .where('user_type', '==', user_type)
            .limit(1)
            .get();

        if (getData.empty) {
            return null
        } else {
            let userArr = []
            getData.forEach(doc => {
                // if the buyer/field-tech exits, get the doc id and data
                let userSnap = doc.data();
                // let userSnap = updateUserExpoPushToken({user_id: doc.id, expo_token})
                //check if decrypted remote pw and local encrypted pw are equal
                if (crypticPassword(userSnap.password) === password) {
                    delete userSnap.password //<- do not send password to client
                    userArr.push(userSnap as User)
                }
            });

            //add expo_token to the user
            let userInfo = userArr[0]
            userInfo.expo_token = expo_token
            //this will update and the op
            return updateUserExpoPushTokenFb({user_id: userInfo._id, expo_token});
        }
    } catch (err) {
        console.log("something went wrong fetching user info (phone number & pass)", err)
    }
}

export async function createUserFb({
                                       userModel,
                                       password
                                   }: { userModel: User, password?: string }): Promise<{ userInfo?: User, resp: FirebaseWriteResponse }> {
    try {
        const getUser = await userCollRef
            .where("telephone", "==", userModel.telephone)
            .where("user_type", "==", userModel.user_type)
            .limit(1)
            .get()

        if (getUser.empty) {
            //create user
            if (isEmpty(password)) {
                await userCollRef.doc(userModel._id).set(userModel); // creating a user via new QAR
            } else {
                await userCollRef.doc(userModel._id).set({...userModel, password});
            }

            return {
                userInfo: userModel,
                resp: {
                    message: "Account created successfully",
                    success: true
                }
            }
        } else {
            const foundUser = getUser.docs[0].data()
            //check if found user's email is empty
            if (!isEmpty(foundUser["email"])) {
                //throw duplicate error
                return {
                    userInfo: null,
                    resp: {
                        message: "User already exists!",
                        success: false
                    }
                }
            }

            //update user => these users are normally created when adding a QAR by a field-tech
            const userRef = getUser.docs[0].ref
            userModel._id = userRef.id
            userModel.created_at = foundUser["created_at"] // use the already existing date - no update
            await getUser.docs[0].ref.set({...userModel, password}, {merge: true})

            return {
                userInfo: userModel,
                resp: {
                    message: "User info updated",
                    success: true
                }
            }
        }

    } catch (error) {
        console.error("Unable to create new user", error.message)
    }
}

/**
 * Function to update or save a new user to Firebase.
 * @returns {Promise<boolean>}
 * @param updateObj
 */

export async function updateRemoteUserFb(updateObj) {
    try {
        await userCollRef.doc(updateObj._id).update(updateObj)
        return true
    } catch (error) {
        console.error("Unable to update new user", error.message)
    }
}

export async function addEquipmentToRemoteFBUser(equipmentObj, userID) {

    try {
        const userRef = db.collection('users').doc(userID);
        await userRef.set(
            {equipment: equipmentObj},
            {merge: true}
        );
    } catch (e) {
        console.error("User update with equipment failed *** ", e);
    }
}


/**
 * function to update user UserExpoPushToken to Firebase.
 * @param user_id
 * @param expo_token
 * @returns User object with updated token
 */

export async function updateUserExpoPushTokenFb({user_id, expo_token = null}): Promise<User> {
    const updated_at = (new Date()).toISOString()
    try {
        await db.collection('users').doc(user_id).update({expo_token, updated_at})
        const user = await userCollRef.doc(user_id).get()
        return user.data() as User;
    } catch (err) {
        console.log("something went wrong updating user token ", err)
        throw err
    }
}

/**
 * function to update user status - (verified = true) to Firebase.
 * @returns {String<token>}
 * @param userModel
 */

export async function updateUserStatus(userModel) {

    try {
        await db.collection('users').doc(userModel.user_id).update({
            verified: userModel.verified,
            updated_at: userModel.updated_at
        })
        return userModel;
    } catch (err) {
        console.log("something went wrong updating user status ", err)
        throw err
    }
}


/**
 * function to get expo_token.
 * @param user_id
 * @returns {String<token>}
 */

export async function getUserExpoPushTokenFb(user_id) {
    try {
        const getToken = await db.collection('users').doc(user_id).get()
        return getToken.data()['expo_token']
    } catch (err) {
        console.log("something went wrong getting user token", err)
        return null
    }
}

/**
 * function to get check if the input password match the remote password.
 * @param user_id - current user id
 * @param input_password - password provided by the user
 * @returns boolean by comparing the passwords
 */
export async function checkUserPassword(user_id, input_password) {
    try {
        const user_query = await db.collection('users').doc(user_id).get()
        let remote_password = user_query.data()['password']
        return remote_password === input_password
    } catch (err) {
        console.log("something went wrong getting user password", err)
        return false
    }
}
