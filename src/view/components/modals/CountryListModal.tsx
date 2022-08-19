import {FlatList, Text, View} from "react-native";
import {SearchBar} from "react-native-elements";
import i18n from "i18n-js";
import {Colors} from "../../styles";
import React, {useState} from "react";
import {CountryInfo} from "../../../model/user/UserModel";
import {Button, Divider, List} from "react-native-paper";

const CountryListModal = ({navigation, route}) => {

    const countries = route.params?.countries
    const [countryListData, setCountryListData] = useState(countries);
    const [searchVal, setSearchVal] = useState('');

    return (
        <View style={{flex: 1}}>
            <View style={{flex: 7}}>
                <SearchBar
                    placeholder={i18n.t("countrySearch")}
                    onChangeText={(searchVal) => {
                        setSearchVal(searchVal)
                        if (searchVal.length > 0) {
                            setCountryListData(
                                countries.filter(item => item.name.toLowerCase().includes(searchVal.toLowerCase()))
                            )
                        } else {
                            setCountryListData(countries)
                        }
                    }}
                    value={searchVal}
                    platform="android"
                    inputStyle={{color: "black"}}
                    inputContainerStyle={{backgroundColor: "white", borderRadius: 50}}
                    // containerStyle={{backgroundColor: Colors.PRIMARY}}
                />

                {countryListData.length === 0 &&
                    <Text style={{
                        color: Colors.ALERT,
                        textAlign: "center",
                        marginTop: 16
                    }}>
                        {i18n.t('noCountrySearch')}
                    </Text>
                }

                {/* Render the list of countries ({item.dial_code})*/}
                <FlatList
                    data={countryListData}
                    keyExtractor={(item, index) => index.toString()}
                    initialNumToRender={10}
                    removeClippedSubviews
                    renderItem={
                        ({item}) =>
                            <View>
                                <List.Item
                                    title={item.name}
                                    description={`${item.dial_code} (${item.code})`}
                                    left={() => (
                                        <View style={{justifyContent: "center", padding: 4}}>
                                            <Text style={{fontSize: 28}}>{item.flag}</Text>
                                        </View>
                                    )}
                                    onPress={() => {
                                        navigation.navigate({
                                            name: route.params?.origin,
                                            params: {
                                                region: null, subregion: null, //for newQAR
                                                country_info: item as CountryInfo,
                                                phone_input: route.params?.phone_input || false,
                                            },
                                            merge: true
                                        })

                                    }}
                                />
                                <Divider style={{marginHorizontal: 16}}/>
                            </View>
                    }
                />
            </View>
            <View style={{margin: 8, backgroundColor: "transparent"}}>
                <Button
                    onPress={() => navigation.goBack()}
                    mode="contained"
                    contentStyle={{
                        height: 54,
                        alignItems: 'center',
                    }}
                >
                    {i18n.t("Cancel")}
                </Button>
            </View>

        </View>
    )
}

export default CountryListModal