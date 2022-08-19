import React, {useEffect, useRef, useState} from "react";
import {ActivityIndicator, Text, TouchableOpacity, TouchableWithoutFeedback, View} from "react-native";
import {TextInput} from "react-native-paper";
import {Colors, styles} from "../styles";
import {telephoneInput} from "../styles/countryModal";
import {MAX_PHONE_LENGTH} from "../../core/utils/constants";
import {FormFieldError} from "./ErrorMessage";
import {useNavigation, useRoute} from "@react-navigation/native";
import {CountryInfo, User} from "../../model/user/UserModel";
import country_code_data from "../../core/utils/countries";
import {useAppSelector} from "../../core/hooks";
import i18n from "i18n-js";
import {validatePhone} from "../../core/utils";
import {getUserByPhoneAndUserTypeFb} from "../../model/user/firebase_calls";
import {isEmpty} from "lodash";


export const InputFormView = ({onPress, inputData}) => {
    return (
        <TouchableWithoutFeedback onPress={onPress}>
            <View style={[styles.formBox, {justifyContent: "center"}]}>
                <Text style={{fontSize: 18}}>{inputData}</Text>
            </View>
        </TouchableWithoutFeedback>
    )
};

/**
 * A Component for phone input with flag icon appended to it.
 * @param passPhone - a function that gets current state params and passes them to parent
 * @param origin - the screen of origin. this is used by the country modal
 * @param editable - make it editable or not
 */

interface phoneProps {
    passPhone: any,
    origin: string, //<- screen name used by navigation
    editable?: boolean,
    getUser?: boolean
}

export const PhoneInput = ({passPhone, origin, editable, getUser}: phoneProps) => {
    const {device_location} = useAppSelector(state => state.user_location);
    const {user_info: loggedUser} = useAppSelector(state => state.user);
    const country = device_location ? device_location.address.country : "Rwanda";

    const currentCountry: CountryInfo[] = country_code_data.filter(obj => obj.name === country);
    /* Local state variables */
    const [countryInfo, setCountryInfo] = useState<CountryInfo>(currentCountry[0])
    const [phone, setPhone] = useState({tel: '', dirty: false})
    const [phoneError, setPhoneError] = useState('')
    const [userNames, setUserNames] = useState('')
    const [loading, setLoading] = useState(false)
    const phoneRef = useRef(null)

    const navigation = useNavigation()
    const route = useRoute() // this will come from the modal component

    useEffect(() => {
        if (route.params?.country_info && route.params?.phone_input) {
            setCountryInfo(route.params.country_info)
        }
        phone.dirty && setPhoneError(validatePhone(phone.tel))
        passPhone(countryInfo.dial_code + phone.tel) //<- pass phone to the parent component
        setUserNames('')

    }, [route.params?.country_info, phone])

    const getUserNames = async () => {
        //find user with entered
        setLoading(true)
        const user: User = await getUserByPhoneAndUserTypeFb({
            telephone: countryInfo.dial_code + phone.tel,
            user_type: loggedUser.user_type === 2 ? 1 : 2
        })
        if (!isEmpty(user)) {
            setUserNames(user.names)
        } else {
            alert("User not found, please use an existing Field Tech!")
            phoneRef.current.focus()
        }
        setLoading(false)
    }

    return (
        <View style={!phoneError && {marginBottom: 16}}>
            <View style={{
                flexDirection: "row",
                borderWidth: 0,
                borderColor: "#AAA",
                borderRadius: 8,
                alignItems: "center",
                paddingEnd: 0
            }}>
                <TouchableOpacity style={{paddingTop: 7.5}} onPress={() => {
                    navigation.navigate({
                        name: "countryModal",
                        params: {origin, countries: country_code_data, phone_input: true}
                    } as never)
                }}>
                    <View style={telephoneInput.flagIcon}>
                        <Text style={{fontSize: 28}}>
                            {countryInfo.flag}
                        </Text>
                        <Text style={{marginStart: 8, fontSize: 16}}>{countryInfo.dial_code} </Text>
                    </View>
                </TouchableOpacity>


                <TextInput
                    placeholder={i18n.t('enterPhone')}
                    ref={phoneRef}
                    mode="outlined"
                    value={phone.tel}
                    maxLength={MAX_PHONE_LENGTH}
                    contextMenuHidden
                    onChangeText={(tel) => {
                        setPhone({tel, dirty: true})
                    }}
                    style={{
                        flex: 1,
                        paddingStart: 75,
                        backgroundColor: "transparent",
                        marginStart: countryInfo.dial_code.length > 4 ? -90 : (countryInfo.dial_code.length > 3 ? -82 : -75)
                    }}
                    underlineColor="transparent"
                    activeUnderlineColor="transparent"
                    activeOutlineColor={Colors.TERTIARY}
                    keyboardType="phone-pad"
                    autoCapitalize="none"
                    returnKeyType='done'
                    editable={editable}
                    onBlur={() => getUser ? getUserNames() : null}
                />
                {loading && loggedUser.user_type === 2 &&
                    <ActivityIndicator animating={loading} color={Colors.PRIMARY}/>}

            </View>
            <FormFieldError message={phoneError}/>
            {!isEmpty(userNames) && <Text style={{fontWeight: "bold"}}> Names: {userNames}</Text>}
        </View>
    )
}

export const InputForm = (props) => (
    <View style={{flexDirection: "row", alignItems: "center"}}>
        <View style={[props.metrics ? {flex: 6, marginEnd: 16} : {flex: 1}, {marginBottom: props.mgBtn,}]}
              removeClippedSubviews={true}>
            <TextInput
                label={props.label ? (props.required ? "* " + props.label : props.label) : ""}
                mode="outlined"
                contextMenuHidden
                error={props.isValid !== undefined && !props.isValid}
                // theme={{ colors: { primary: Colors.PRIMARY, underlineColor:'transparent',}}}
                activeOutlineColor={Colors.TERTIARY}
                style={[{
                    flex: 1,
                    backgroundColor: Colors.WHITE,
                }, props.placeholderStyle]}
                right={<TextInput.Icon name={props.icon} color={(active) => active ? Colors.TERTIARY : "gray"}/>}
                {...props}
            />
            {!props.isValid && (
                <Text style={{fontSize: 10, color: Colors.ALERT, fontWeight: "bold"}}>{props.errorMessage}</Text>)}
        </View>

        {props.metrics && <Text style={{fontSize: 16, fontWeight: "bold", flex: 1}}>{props.metrics}</Text>}
    </View>
)
