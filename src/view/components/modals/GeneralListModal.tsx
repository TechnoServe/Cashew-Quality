import {FlatList, Text, View} from "react-native";
import {SearchBar} from "react-native-elements";
import i18n from "i18n-js";
import {Colors} from "../../styles";
import React, {useState} from "react";
import {Button, Divider, List} from "react-native-paper";

const GeneralListModal = ({navigation, route}) => {


    const list: any[] = route.params?.data
    const type = route.params?.type

    const [listData, setListData] = useState(list);
    const [searchVal, setSearchVal] = useState('');


    return (
        <View style={{flex: 1}}>
            <View style={{flex: 7}}>
                <SearchBar
                    placeholder="Search"
                    onChangeText={(searchVal) => {
                        setSearchVal(searchVal)
                        if (searchVal.length > 0) {
                            setListData(
                                list.filter(item => {
                                    if (type === "regions") {
                                        return item.name.toLowerCase().includes(searchVal.toLowerCase())
                                    }
                                    return item.toLowerCase().includes(searchVal.toLowerCase())
                                }))
                        } else {
                            setListData(list)
                        }
                    }}
                    value={searchVal}
                    platform="android"
                    inputStyle={{color: "black"}}
                    inputContainerStyle={{backgroundColor: "white", borderRadius: 50}}
                    // containerStyle={{backgroundColor: Colors.PRIMARY}}
                />

                {route.params?.data.length === 0 &&
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
                    data={listData}
                    keyExtractor={(item, index) => index.toString()}
                    initialNumToRender={10}
                    removeClippedSubviews
                    renderItem={
                        ({item}) =>
                            <View>
                                <List.Item
                                    title={type === "regions" ? item.name : item}
                                    onPress={() => {
                                        navigation.navigate({
                                            name: route.params?.origin,
                                            params: type === "regions" ? {
                                                region: item,
                                                subregion: null
                                            } : {subregion: item},
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

export default GeneralListModal