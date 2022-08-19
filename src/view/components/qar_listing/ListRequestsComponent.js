import i18n from 'i18n-js';
import {isEmpty} from 'lodash'
import React, {useEffect, useState} from 'react';
import {FlatList, Text, View} from 'react-native';
import {Icon, SearchBar} from "react-native-elements";
import {Colors as pColors} from 'react-native-paper';
import {filterQARs, searchQarArray} from "../../../controller/qar_controller/qar_listing_controller";
import {Colors} from "../../styles";
import ListItemReq from "./ListItemReq";


const ListRequestsComponent = ({qarList, refreshing, getRemoteQARs, loggedUser, filterObj}) => {
    const [qList, setQList] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    /* list item wrapper component */
    const renderItem = ({item}) => {

        return <ListItemReq item={item}/>
    };

    useEffect(() => {
        //setQList(qarList);
        if (searchTerm === "" && (!isEmpty(filterObj.arrayToFilter) || filterObj.asc || filterObj.desc)) {
            setQList(filterQARs(filterObj, qarList, loggedUser.user_type))
        } else if (searchTerm !== "") {
            if (!isEmpty(filterObj.arrayToFilter)) {
                setQList(filterQARs(filterObj, qList, loggedUser.user_type))
            } else {
                setQList(searchQarArray(qarList, searchTerm, loggedUser))
            }
        } else {
            setQList(searchQarArray(qarList, searchTerm, loggedUser))
        }

    }, [refreshing, searchTerm, filterObj])


    const emptyList = () => (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Icon name="box-open" size={40} type="font-awesome-5" color={Colors.GRAY_MEDIUM}/>
            <Text style={{color: Colors.GRAY_MEDIUM, textAlign: 'center', fontSize: 18, fontWeight: "bold"}}>
                {i18n.t("listwillappear")}
            </Text>
        </View>
    );

    return (
        <FlatList
            contentContainerStyle={{flexGrow: 1, marginHorizontal: 16}}
            data={qList}
            renderItem={renderItem}
            refreshing={refreshing}
            onRefresh={() => {
                getRemoteQARs();
                setSearchTerm('')
            }}
            keyExtractor={(item) => item._id}
            ListEmptyComponent={emptyList}
            ListHeaderComponent={<SearchBar
                placeholder={loggedUser.user_type === 1 ? i18n.t("QarSearchPlaceholderF") : i18n.t("QarSearchPlaceholderB")}
                //lightTheme
                platform={Platform.OS}
                value={searchTerm}
                containerStyle={{
                    backgroundColor: "transparent",
                    marginBottom: 8,
                    marginTop: 8
                }}
                inputContainerStyle={{
                    backgroundColor: pColors.grey300,
                    borderRadius: 16,
                }}
                onChangeText={(text) => setSearchTerm(text)}
                autoCorrect={false}
            />}
        />
    )
}

export default ListRequestsComponent