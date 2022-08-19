// import * as React from 'react';
// import {useEffect, useState} from 'react';
// import {ActivityIndicator, StyleSheet, View} from 'react-native';
// import {Colors} from "../styles";
// import PDFReader from "rn-pdf-reader-js";
//
// export default function TermsAndConditionsView({navigation, route}) {
//     const [isLoading, setIsLoading] = useState(true)
//
//     useEffect(() => {
//         //configure dynamic navigation bar title
//         navigation.setOptions({
//             title: route.params.title,
//         });
//     }, [route.params.title, navigation]);
//
//     return (
//         <View style={isLoading ? styles.withSpinner : styles.withoutSpinner}>
//             <PDFReader
//                 onLoadEnd={() => setIsLoading(false)}
//                 source={{uri: route.params.uri}}/>
//
//             {isLoading && (
//                 <ActivityIndicator
//                     style={styles.spinner}
//                     color={Colors.PRIMARY}
//                     size="large"
//                 />
//             )}
//         </View>
//
//     );
// }
//
// const styles = StyleSheet.create({
//     withSpinner: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     withoutSpinner: {
//         flex: 1
//     },
//     spinner: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         position: 'absolute',
//     }
// });
