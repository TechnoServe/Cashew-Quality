/**
 * Module that directly handles the phone verification calls to the backend.
 */


import api from "../../core/utils/api";
import {X_KEY} from "../../core/utils/constants";

/**
 * Service to make an OTP request with the TNS backend.
 * @param phoneNumber to send the OTP to.
 * @returns {Promise<*>} of the verification response.
 */

export async function sendOTPWithTNS(phoneNumber) {
    const OTP_REQUEST_URL = `${api.baseUrl}send-otp`;
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-key': X_KEY
        },
        body: JSON.stringify({phone: phoneNumber})
    };

    try {
        // const resp = await fetch(OTP_REQUEST_URL, options)
        // const data = await resp.json()
        // console.log("OTP REQ RESP => ", resp.ok)
        return await fetch(OTP_REQUEST_URL, options)
    } catch (error) {
        throw error.message;
    }
}


/**
 * Service to make an OTP verification with the TNS backend.
 * @param phone phone number to be verified against the OTP.
 * @param otpCode the OTP to be verified.
 * @returns {Promise<*>} of the verification response.
 */

export async function verifyOTPWithTNS({telephone, otpCode}) {
    const OTP_VERIFY_URL = `${api.baseUrl}verify-otp`;
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-key': X_KEY
        },
        body: JSON.stringify({
            phone: telephone,
            otp: otpCode
        })
    };
    try {
        return await fetch(OTP_VERIFY_URL, options);
    } catch (error) {
        throw error.message;
    }
}
