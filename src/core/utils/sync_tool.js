import {differenceWith, isEqual} from "lodash";
import moment from "moment";


let counter = 0;
//custom comparator
const incomingIsLatest = (incoming, otherData) => {
    if (incoming._id === otherData._id) {
        return moment(otherData.updated_at).isSameOrAfter(moment(incoming.updated_at))
    }
}

export function pushSyncData(localData, remoteData, has_date = true) {

    if ((localData !== undefined) && (localData.length > 0)) {

        const toBePushed = differenceWith(localData, remoteData, has_date ? incomingIsLatest : isEqual)

        if ((toBePushed !== undefined) && (toBePushed.length > 0)) {

            return toBePushed;
        }
    }

    return [];
}

export function pullSyncData(localData, remoteData, has_date = true) {

    if ((remoteData !== undefined) && (remoteData.length > 0)) {
        const toBePulled = differenceWith(remoteData, localData, has_date ? incomingIsLatest : isEqual)
        if ((toBePulled !== undefined) && (toBePulled.length > 0)) {

            return toBePulled
        }
    }

    return []
}
