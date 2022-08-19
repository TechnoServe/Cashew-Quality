import React from 'react'
import {StyleSheet, View} from 'react-native'


function moveToBottom(component) {
    return (
        <View style={styles.container}>
            {component}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
        //marginBottom: 16
    }
})
export default moveToBottom

/**
 * to use it
 * import it and then moveToBottom(<view_you_want_to_move_to_bottom/>)
 */
