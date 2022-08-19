import * as Strings from './strings';
import * as Data from './data';
import CryptoES from "crypto-es";
import {isEmpty} from "lodash";
import i18n from "i18n-js";

/**
 * Encrypt or decrypt the password
 * Decryption using crypto-js: Library different from the encryption library - crypto-es
 * because crypto-es doesn't seem to support decryption. The version however is specifically
 * crypto-js@3.1. Beyond that crypto is required by this package, which is a Node.js standard
 * library that doesn't come with React Native.
 *
 * Ref: 1. https://stackoverflow.com/a/61133939/4549112
 *      2. https://github.com/brix/crypto-js/issues/303#issuecomment-646247568
 */
const crypticPassword = (password, decrypt = true) => {
    const secret_enc_key = "Secret Passphrase" //needs to be kept somewhere safe
    if (decrypt) {
        const bytes = CryptoES.AES.decrypt(password, secret_enc_key);
        return bytes.toString(CryptoES.enc.Utf8);
    }
    return CryptoES.AES.encrypt(password, secret_enc_key).toString();
}


// validates a given password and returns error message if any.
export function validatePassword(password: string, cPassword: string): string {

    const check = !isEmpty(password) && password.length >= 7
    const check2 = !isEmpty(cPassword) && check

    if (!check) {
        return isEmpty(password) ? "" : "Password is too short"
    } else {
        if (check2) {
            const match = password === cPassword
            return !match ? "Password don't match" : ""
        }

    }
    return ""
}

/**
 * Simple phone validation
 * @param phone - the phone number to validate
 * @return @string - an error message if available else empty string
 */
export const validatePhone = (phone: string): string => {
    const phone_regex = phone.replace(/[^0-9+]/g, '');
    if (!((phone_regex.length >= 9) && (phone_regex.length < 16))) {
        if (phone_regex.length < 11 || phone_regex.length > 16) {
            return i18n.t('phoneInvalid')
        }
    }
    return ""
}

/**
 * Simple email validation - uses regex.
 * @param email - email to validate
 */
export const validEmail = (email: string): boolean => {
    if (isEmpty(email)) return true
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export {Strings, Data, crypticPassword};
