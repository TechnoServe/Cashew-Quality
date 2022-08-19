import {FlatList, Text, View} from "react-native";
import {SearchBar} from "react-native-elements";
import i18n from "i18n-js";
import {Colors} from "../../styles";
import React, {useEffect, useState} from "react";
import {User} from "../../../model/user/UserModel";
import {Button, Divider, List} from "react-native-paper";
import {isEmpty} from "lodash";

const UserListModal = ({navigation, route}) => {
    //clean the users... remove users with no name
    const field_techs = route.params?.field_techs.filter(item => item.names !== null)

    const [data, setData] = useState<User[]>([]);
    const [searchTerm, setSearchTerm] = useState("")

    useEffect(() => {

        if (searchTerm.length > 0) {
            setData(field_techs.filter(item => item.names.toLowerCase().includes(searchTerm.toLowerCase())))
        } else {
            setData(field_techs)
        }
    }, [searchTerm])


    return (
        <View style={{flex: 1}}>
            <View style={{flex: 7}}>
                <SearchBar
                    placeholder="Search for Field-Tech"
                    onChangeText={(searchVal) => setSearchTerm(searchVal)}
                    value={searchTerm}
                    platform="android"
                    inputStyle={{color: "black"}}
                    inputContainerStyle={{backgroundColor: "white", borderRadius: 50}}
                    // containerStyle={{backgroundColor: Colors.PRIMARY}}
                />

                {isEmpty(data) &&
                    <Text style={{
                        color: Colors.ALERT,
                        textAlign: "center",
                        marginTop: 16
                    }}>
                        No Field Tech Found
                    </Text>
                }

                {/* Render the list of countries ({item.dial_code})*/}
                <FlatList
                    data={data}
                    keyExtractor={(item, index) => index.toString()}
                    initialNumToRender={10}
                    removeClippedSubviews
                    renderItem={
                        ({item}: { item: User }) =>
                            <View>
                                <List.Item
                                    title={item.names}
                                    description={item.telephone}
                                    onPress={() => {
                                        navigation.navigate({
                                            name: "NewQAR",
                                            params: {
                                                selected_user: item
                                            },
                                            merge: true,
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

export default UserListModal