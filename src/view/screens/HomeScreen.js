import React, {useEffect} from 'react'
import {SafeAreaView} from "react-native";
import {FAB} from "react-native-paper";
import {Strings} from "../../core/utils";
import {FILTER_ASC, FILTER_DESC, GET_QARS_REQUEST} from "../../model/qar_listing/actions";
import {DEVICE_LOCATION_REQUEST} from "../../model/user/actions";
import FilterCard from "../components/qar_listing/FilterCard";
import ListRequestsComponent from '../components/qar_listing/ListRequestsComponent';
import {Colors} from "../styles";
import {useNavigation} from "@react-navigation/native";
import {useAppDispatch, useAppSelector} from "../../core/hooks";


function HomeScreen() {

    //contexts
    //const {loggedUser} = useContext(UserContext)
    const dispatch = useAppDispatch();
    const navigation = useNavigation()

    const {display_qars, in_progress} = useAppSelector(state => state.qar_listing);
    const {user_info: loggedUser} = useAppSelector(state => state.user)
    const filter_params = useAppSelector(state => state.filter_params);

    useEffect(() => {
        // dispatch location request when this component mounts
        loggedUser.user_type === 1 ? dispatch({type: FILTER_ASC}) : dispatch({type: FILTER_DESC})
        dispatch({type: DEVICE_LOCATION_REQUEST})
        dispatch({type: GET_QARS_REQUEST, payload: loggedUser});
        // }
    }, [dispatch])


    //filter view - WIP
    const filterView = () => {

        return (
            <FilterCard dispatch={dispatch} filter_params={filter_params} user={loggedUser}/>
        )
    }

    return (
        <SafeAreaView style={[{backgroundColor: Colors.GRAY_LIGHT, flex: 1}]}>
            {filter_params.show_filter && filterView()}
            <ListRequestsComponent
                qarList={display_qars}
                refreshing={in_progress}
                getRemoteQARs={() => dispatch({type: GET_QARS_REQUEST, payload: loggedUser})}
                loggedUser={loggedUser}
                filterObj={{
                    arrayToFilter: filter_params.status_filter_array,
                    // apply: statusToFilter,
                    asc: filter_params.asc,
                    desc: filter_params.desc
                }}
            />

            <FAB
                icon="plus"
                color={Colors.SECONDARY}
                style={{
                    position: 'absolute',
                    margin: 16,
                    right: 0,
                    bottom: 0,
                    backgroundColor: Colors.TERTIARY
                }}
                onPress={() => navigation.navigate(Strings.NEW_QAR_SCREEN_NAME)}
            />
        </SafeAreaView>

    );
}

export default HomeScreen;
