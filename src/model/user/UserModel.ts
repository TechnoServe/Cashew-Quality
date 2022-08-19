export interface CountryInfo {
    name: string,
    flag?: string,
    code?: string,
    dial_code?: string,
    region?: string,
    subregion?: string
}

export interface LocalityInfo extends CountryInfo {
    regions: {
        name: string,
        subregions: string[]
    }[],
}

export interface FirebaseWriteResponse {
    message: string,
    success: boolean
}

interface EquipmentDetail {
    image_url: string,
    manufacture_date: string
    model_no: string,
    type: string
}

interface Equipment {
    meter?: EquipmentDetail,
    scale?: EquipmentDetail
}

export interface User {
    _id: string,
    names?: string,
    telephone: string,
    email?: string,
    expo_token?: string,
    fcm_token?: string,
    user_type: number,
    created_at?: string,
    verified: boolean
    updated_at?: string,
    equipment?: Equipment
}

export interface UserState {
    user_info?: User,
    error?: string,
    modal_visible: boolean,
    in_progress: boolean,
    field_techs: User[]
}
