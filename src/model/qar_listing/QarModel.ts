import {find, isEmpty} from "lodash";
import {QAP_STEPS} from "../../core/utils/constants";


export default function QarDisplayModel(_id, request_code, site_obj, buyer_obj, field_tech_obj, status, due_date, created_at, qar_result, qap_data, created_by) {
    this._id = _id;
    this.request_code = request_code;
    this.site_obj = site_obj;
    this.buyer_obj = buyer_obj;
    this.field_tech_obj = field_tech_obj;
    this.status = status;
    this.due_date = due_date;
    this.created_at = created_at;
    this.qar_result = qar_result;
    this.qap_data = qap_data;
    this.created_by = created_by;

}

export function QarModel(_id, request_code, buyer, field_tech, site, status, due_date, created_at, updated_at, created_by) {
    this._id = _id;
    this.request_code = request_code;
    this.buyer = buyer || null;
    this.field_tech = field_tech;
    this.site = site;
    this.status = status;
    this.due_date = due_date;
    this.created_at = created_at;
    this.updated_at = updated_at;
    this.created_by = created_by;
}

export function QarResult(id, request_id, nut_count, moisture_content, foreign_mat_rate, kor, defective_rate, created_at) {
    this.id = id;
    this.request_id = request_id;
    this.nut_count = nut_count;
    this.moisture_content = moisture_content;
    this.foreign_mat_rate = foreign_mat_rate;
    this.kor = kor;
    this.defective_rate = defective_rate;
    this.created_at = created_at;
}

//interfaces
export interface QarRequest {
    due_date: string,
    site_name: string,
    site_owner: string,
    site_location: string,
    site_region: string,
    site_sub_region: string,
    enteredTelephone: string,
}

export interface QarSite {
    _id?: string,
    name: string,
    location: string,
    region?: string,
    subRegion?: string,
    owner?: string,
    created_at?: string,
    updated_at?: string
}

export interface Qar {
    _id: string
    request_code: string
    buyer: string
    field_tech: string
    site: string
    status: number
    due_date: string
    created_at: string
    updated_at: string
    created_by: string
}

//helper function to get QAR progress value
export const getProgress = (data_set) => (Object.keys(data_set).length) / QAP_STEPS

//helper function to
export function createQarDisplay(payload) {
    const {qar_users, qar_sites, qar, logged_user, qars_to_sync, qap_data} = payload

    const user_type = logged_user.user_type;
    const current_data_set = find(qap_data.all_data, ['request_id', qar._id])

    return {
        _id: qar._id,
        request_code: qar.request_code,
        field_tech_obj: user_type === 1 ? logged_user : find(qar_users.users, ['_id', qar.field_tech]),
        buyer_obj: user_type === 2 ? logged_user : find(qar_users.users, ['_id', qar.buyer]),
        site_obj: find(qar_sites.sites, ['_id', qar.site]),
        status: qar.status,
        due_date: qar.due_date,
        created_at: qar.created_at,
        progress: (current_data_set && getProgress(current_data_set)) || 0,
        to_be_synced: !isEmpty(find(qars_to_sync, ['_id', qar._id])),
        created_by: qar.created_by
    }
}
