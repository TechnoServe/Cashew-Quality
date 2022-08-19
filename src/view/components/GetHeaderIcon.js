import {Appbar} from "react-native-paper";
import {Colors} from "../styles";
import {TOGGLE_FILTER_CARD} from "../../model/qar_listing/actions";
import {useDispatch} from "react-redux";
import {useNavigation} from "@react-navigation/native";

export const GetHeaderIcon = (iconName, destScreen = null, otherProps = null) => {
    const dispatch = useDispatch()
    const navigation = useNavigation()

    return (
        <Appbar.Action
            icon={iconName}
            color={Colors.WHITE}
            size={32}
            onPress={destScreen ?
                () => navigation.navigate(destScreen, otherProps) :
                () => dispatch({type: TOGGLE_FILTER_CARD})}/>
    )
}