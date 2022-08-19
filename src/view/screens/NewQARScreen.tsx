import React, {useEffect, useState} from 'react'
import {Colors} from "../styles";
import {KeyboardAvoidingView, ScrollView, Text, TouchableOpacity, View} from "react-native";
import {Divider} from "react-native-elements";
import {Strings} from "../../core/utils";
import {InputForm, PhoneInput} from "../components/InputComponents";
import DateTimePicker from '@react-native-community/datetimepicker';
import {Button, TextInput} from "react-native-paper";
import {isEmpty} from "lodash";
import i18n from 'i18n-js';
import moment from "moment";
import localities from "../../core/utils/localities";
import all_countries from "../../core/utils/countries";
import {FETCH_FIELD_TECHS_REQUEST} from "../../model/user/actions";
import {LocalityInfo, User} from "../../model/user/UserModel";
import {useAppDispatch, useAppSelector} from "../../core/hooks";
import {NEW_QAR_SCREEN_NAME} from "../../core/utils/strings";
import {QarRequest} from "../../model/qar_listing/QarModel";


const NewQARScreen = ({navigation, user_location, route}) => {

    /** react-redux hooks */
    const dispatch = useAppDispatch();
    const {user} = useAppSelector(state => state);

    /* State variables */
    const [show, setShow] = useState(false);
    const [isValidated, setIsValidated] = useState(false);

    const [newRequest, setNewRequest] = useState<QarRequest>({
        due_date: '',
        site_name: '',
        site_owner: '',
        site_location: '',
        site_region: '',
        site_sub_region: '',
        enteredTelephone: '',
    })

    const [selectedFieldTech, setSelectedFieldTech] = useState<User>(null)
    const [selectedCountry, setSelectedCountry,] = useState<LocalityInfo>(null)
    const [selectedRegion, setSelectedRegion,] = useState<{ name: string, subregions: string[] }>(null)

    /* Context variables */
    const {user_info: loggedUser, field_techs} = user;


    useEffect(() => {
        if (loggedUser.user_type === 2) {
            dispatch({type: FETCH_FIELD_TECHS_REQUEST})
        }
    }, [])

    useEffect(() => {
        if (route.params?.country_info) {
            let currentCountry = route.params.country_info

            if (currentCountry.code === "MZ" || currentCountry.code === "BJ") {
                let locality = localities.filter(item => item.name == currentCountry.name)[0]
                let fCountry: LocalityInfo = {
                    ...locality,
                    flag: currentCountry.flag,
                    code: currentCountry.code,
                }
                setSelectedCountry(fCountry)

                //reset regions and subregions
                setSelectedRegion(null)
                setNewRequest(newReq => ({...newReq, site_region: '', site_sub_region: ''}))

                if (route.params?.region) {
                    let region = route.params.region
                    setSelectedRegion(region)
                    //setSelectedSubRegion(null)

                    setNewRequest(newReq => ({...newReq, site_region: region.name, site_sub_region: ''}))
                }

                if (route.params?.subregion) {
                    //setSelectedSubRegion(route.params.subregion)
                    setNewRequest(newReq => ({...newReq, site_sub_region: route.params.subregion}))
                }
            } else {
                setSelectedCountry(currentCountry)
            }
        }

        if (loggedUser.user_type === 1) {
            setIsValidated(
                !isEmpty(newRequest.enteredTelephone)
                && !isEmpty(newRequest.site_location)
                && !isEmpty(newRequest.due_date)
                && !isEmpty(newRequest.site_name)
            )
        } else {
            setIsValidated(
                !isEmpty(newRequest.enteredTelephone)
                // && !isEmpty(newRequest.site_location)
                && !isEmpty(newRequest.due_date)
                && !isEmpty(newRequest.site_name)
                && !isEmpty(newRequest.site_region)
                && !isEmpty(newRequest.site_sub_region)
            )
        }

    }, [
        route,
        newRequest.enteredTelephone,
        newRequest.site_location,
        newRequest.due_date,
        newRequest.site_name,
        newRequest.site_region,
        newRequest.site_sub_region,
    ])

    return (
        <KeyboardAvoidingView style={{flex: 1, backgroundColor: Colors.WHITE}}>
            <ScrollView
                contentContainerStyle={{
                    padding: 16,
                    justifyContent: 'space-between',
                    flexGrow: 1
                }}
                keyboardShouldPersistTaps="handled"
            >
                <View style={{backgroundColor: Colors.WHITE}}>

                    {loggedUser &&
                        <>
                            <Text style={{color: Colors.BLACK, paddingBottom: 8}}>
                                {loggedUser.user_type === 1 ? "Buyer's Phone Number" : "Field Tech's Phone Number"}
                            </Text>
                            <PhoneInput
                                passPhone={(tel) => {
                                    if (tel.length > 5) {
                                        setNewRequest({...newRequest, enteredTelephone: tel})
                                    }
                                }}
                                getUser={true}
                                origin={NEW_QAR_SCREEN_NAME}/>

                            <Divider style={{marginBottom: 8}}/>
                        </>
                    }

                    {loggedUser && loggedUser.user_type === 2 &&
                        <>
                            <InputForm
                                label="Select Country"
                                icon='menu-down'
                                value={selectedCountry && selectedCountry.name}
                                render={() => (
                                    <TouchableOpacity
                                        onPress={() => {
                                            navigation.navigate({
                                                name: "countryModal",
                                                params: {
                                                    countries: all_countries,
                                                    origin: NEW_QAR_SCREEN_NAME
                                                }
                                            })
                                        }}
                                        style={{paddingVertical: 8, paddingHorizontal: 16}}
                                    >
                                        <Text
                                            style={{fontWeight: "bold"}}>{selectedCountry && selectedCountry.name}</Text>
                                        <Text
                                            style={{color: "gray"}}>{selectedCountry && selectedCountry.flag + " " + selectedCountry.code}</Text>
                                    </TouchableOpacity>

                                )}
                            />

                            {!isEmpty(selectedCountry) &&
                                <View style={{flexDirection: "row"}}>

                                    {selectedCountry.code !== "BJ" && selectedCountry.code !== "MZ" &&
                                        <>
                                            <View style={{flex: 1, marginEnd: 8}}>
                                                <InputForm
                                                    label="Region"
                                                    value={newRequest.site_region}
                                                    onChangeText={(val) => {
                                                        setNewRequest(prevState => ({...prevState, site_region: val}))
                                                    }}
                                                />
                                            </View>

                                            <View style={{flex: 1, marginStart: 8}}>
                                                <InputForm
                                                    label="Sub Region"
                                                    value={newRequest.site_sub_region}
                                                    onChangeText={(val) => {
                                                        setNewRequest(prevState => ({
                                                            ...prevState,
                                                            site_sub_region: val
                                                        }))
                                                    }}
                                                />
                                            </View>
                                        </>

                                    }
                                    {(selectedCountry.code === "BJ" || selectedCountry.code === "MZ") &&
                                        <>
                                            <View style={{flex: 1, marginEnd: 8}}>
                                                <InputForm
                                                    label={selectedCountry.code === "BJ" ? "Select Department" : "Select Province"}
                                                    icon='menu-down'
                                                    value={selectedRegion && newRequest.site_region}
                                                    render={() => (
                                                        <TouchableOpacity
                                                            onPress={() => {
                                                                navigation.navigate({
                                                                    name: "generalModal",
                                                                    params: {
                                                                        type: "regions",
                                                                        data: selectedCountry.regions,
                                                                        origin: NEW_QAR_SCREEN_NAME
                                                                    }
                                                                })
                                                            }}
                                                            style={{paddingVertical: 8, paddingHorizontal: 16}}
                                                        >
                                                            <Text
                                                                style={{fontWeight: "bold"}}>{selectedRegion && newRequest.site_region}</Text>
                                                            <Text
                                                                style={{color: "gray"}}>{selectedRegion && selectedCountry.name + " - " + selectedCountry.code}</Text>
                                                        </TouchableOpacity>

                                                    )}
                                                />
                                            </View>

                                            {!isEmpty(newRequest.site_region) &&
                                                <View style={{flex: 1, marginStart: 8}}>
                                                    {(selectedCountry.code === "BJ" || selectedCountry.code === "MZ") &&
                                                        <InputForm
                                                            label={selectedCountry.code === "BJ" ? "Select Commune" : "Select District"}
                                                            icon='menu-down'
                                                            value={newRequest.site_sub_region}
                                                            render={() => (
                                                                <TouchableOpacity
                                                                    onPress={() => {
                                                                        //let region = selectedCountry['regions'].filter(val => val.name == selectedRegion)[0]
                                                                        navigation.navigate({
                                                                            name: "generalModal",
                                                                            params: {
                                                                                type: "subregions",
                                                                                data: selectedRegion.subregions,
                                                                                origin: NEW_QAR_SCREEN_NAME
                                                                            }
                                                                        })
                                                                    }}
                                                                    style={{paddingVertical: 8, paddingHorizontal: 16}}
                                                                >
                                                                    <Text
                                                                        style={{fontWeight: "bold"}}>{newRequest.site_sub_region}</Text>
                                                                    <Text style={{color: "gray"}}>
                                                                        {newRequest.site_sub_region && newRequest.site_region + " - " + selectedCountry.code}
                                                                    </Text>
                                                                </TouchableOpacity>

                                                            )}
                                                        />
                                                    }

                                                </View>
                                            }
                                        </>

                                    }
                                </View>
                            }
                        </>

                    }

                    <InputForm
                        label={i18n.t("Site Name")}
                        placeholder={i18n.t("Enter Site Name")}
                        required
                        mgBtn={8}
                        value={newRequest.site_name}
                        isValid={!isEmpty(newRequest.site_name.trim())}
                        errorMessage={i18n.t("This is a required field")}
                        onChangeText={site_name => setNewRequest({...newRequest, site_name})}
                    />

                    <InputForm
                        label={i18n.t("Site Location")}
                        placeholder={i18n.t("Enter Site Location")}
                        required
                        mgBtn={8}
                        value={newRequest.site_location}
                        isValid={loggedUser.user_type === 1 ? !isEmpty(newRequest.site_location.trim()) : true}
                        errorMessage={i18n.t("This is a required field")}
                        onChangeText={site_location => setNewRequest({...newRequest, site_location})}
                    />

                    <InputForm
                        label={i18n.t("Site Owner")}
                        placeholder={i18n.t("Enter Site Owner")}
                        mgBtn={8}
                        value={newRequest.site_owner}
                        isValid={true}
                        onChangeText={site_owner => setNewRequest({...newRequest, site_owner})}
                    />

                    <InputForm
                        label={loggedUser.user_type === 2 ? i18n.t("dueDate") : i18n.t("Date")}
                        value={newRequest.due_date}
                        left={<TextInput.Icon name="calendar" color="gray" onPress={() => setShow(true)}/>}
                        render={() => (
                            <TouchableOpacity
                                onPress={() => setShow(true)}
                                style={{paddingVertical: 16, paddingStart: 48}}
                            >
                                <Text style={{fontWeight: "bold"}}>
                                    {newRequest.due_date && moment(new Date(newRequest.due_date)).format('ll')}
                                </Text>

                            </TouchableOpacity>
                        )}
                    />

                    {/* Responsible for showing calendar modal. */}
                    {show && (
                        <DateTimePicker
                            testID="dateText"
                            value={isEmpty(newRequest.due_date) ? new Date() : new Date(newRequest.due_date)}
                            mode="date"
                            minimumDate={new Date()}
                            display="default"
                            onChange={(e, selectedDate) => {
                                setShow(false)
                                setNewRequest({...newRequest, due_date: selectedDate.toISOString()})
                            }}
                        />
                    )}

                </View>
                <Button
                    disabled={!isValidated}
                    contentStyle={{height: 54}}
                    mode="contained"
                    style={{marginTop: 32}}
                    onPress={() => {
                        navigation.navigate(Strings.QAR_REVIEW_SCREEN_NAME, {new_qar: newRequest})
                    }}
                >
                    {i18n.t("Review")}
                </Button>
            </ScrollView>
        </KeyboardAvoidingView>

    );
}

export default NewQARScreen
