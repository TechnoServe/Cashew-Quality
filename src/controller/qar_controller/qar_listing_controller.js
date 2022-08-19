import {filter, includes, isEmpty, orderBy} from 'lodash'
import moment from "moment";


//refactored filtering of the qars array
export function searchQarArray(arr, search_term, logged_user) {
    return arr.filter(qar => {

        let itemData = "";
        if (logged_user.user_type === 1) {
            itemData = `
                ${qar.site_name} 
                ${qar.request_code} 
                ${qar.site_obj.location} 
                ${((qar && qar.buyer_obj && qar.buyer_obj.names) ? qar.buyer_obj.names : '')} 
                ${((qar && qar.buyer_obj && qar.buyer_obj.telephone) ? qar.buyer_obj.telephone : '')}`;
        } else {
            itemData = `
                ${qar.site_obj.name} 
                ${qar.request_code} 
                ${qar.site_obj.location} 
                ${qar.field_tech_obj.names} 
                ${qar.field_tech_obj.telephone}`;
        }

        const textData = search_term.toLowerCase();

        return itemData.toLowerCase().indexOf(textData) > -1;
    });
}

export function filterQARs(filterObj, qarList, user_type) {

    if (isEmpty(filterObj.arrayToFilter)) {
        if (filterObj.asc) {
            return orderBy(qarList, [(o) => user_type === 1 ? [o.status, moment(o.due_date).unix()] : [o.status, moment(o.created_at).unix()]], ['asc', "asc"])
        }

        if (filterObj.desc) {
            return orderBy(qarList, [(o) => user_type === 1 ? [o.status, moment(o.due_date).unix()] : [o.status, moment(o.created_at).unix()]], ['desc', "desc"])
        }
    }

    const filtered = filter(qarList, (o) => includes(filterObj.arrayToFilter, o.status))


    if (filterObj.desc) {
        return orderBy(filtered, [(o) => user_type === 1 ? [o.status, moment(o.due_date).unix()] : [o.status, moment(o.created_at).unix()]], ['asc', "asc"])
    }

    return orderBy(filtered, [(o) => user_type === 1 ? [o.status, moment(o.due_date).unix()] : [o.status, moment(o.created_at).unix()]], ['desc', "desc"])
}
