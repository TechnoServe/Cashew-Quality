// Config file
import * as firebase from "firebase";
import "firebase/firestore"; // to use firestore
import "./TimerFix"

// For Firebase JS SDK v7.20.0 and later, measurementId is optional

//uncomment this block and replace values with your firebase configuration

// const firebaseConfig = {
//     apiKey: 'YOUR_KEY_HERE',
//     authDomain: 'your-auth-domain',
//     databaseURL: 'your-database-name.firebaseio.com',
//     projectId: 'your-project-id',
//     storageBucket: 'your-project-id',
//     messagingSenderId: 'your-messaging-sender-Id',
//     appId: 'your-appid-here',
//     measurementId: "your-measurement-Id"
// };

if (firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig);
}

export const db = firebase.firestore();

export default firebase;
  
 


