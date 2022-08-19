// Config file
//import { initializeApp } from "firebase/app";
//import {getFirestore} from "firebase/firestore"; // to use firestore
//import "firebase/firestore";
//import { getStorage } from "firebase/storage";

//import "./TimerFix"
// import firestore from '@react-native-firebase/firestore';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// For TNS testing DB.
// const app = initializeApp({
//     apiKey: "AIzaSyC8B3iWv72bLRtmvutHro6mEzd7pI2S4r8",
//     authDomain: "cnqa-caju-test.firebaseapp.com",
//     projectId: "cnqa-caju-test",
//     storageBucket: "cnqa-caju-test.appspot.com",
//     messagingSenderId: "445976325638",
//     appId: "1:445976325638:web:4635caafbb1a0448599d87",
//     measurementId: "G-W5C38LMCBM"
// });

// For production
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//     apiKey: "AIzaSyBMd16BeDCZW5wm81etmsb-e4evGGwkjTo",
//     authDomain: "cqna-benincaju.firebaseapp.com",
//     databaseURL: "https://cqna-benincaju.firebaseio.com",
//     projectId: "cqna-benincaju",
//     storageBucket: "cqna-benincaju.appspot.com",
//     messagingSenderId: "622297898567",
//     appId: "1:622297898567:web:fc6b48e31a044a6af99b62",
//     measurementId: "G-KED2QG2V4H"
// };


//export const db = firestore();

// Config file
import * as firebase from "firebase";
import "firebase/firestore"; // to use firestore
import "./TimerFix"

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// For TNS testing DB.
const firebaseConfig = {
    apiKey: "AIzaSyC8B3iWv72bLRtmvutHro6mEzd7pI2S4r8",
    authDomain: "cnqa-caju-test.firebaseapp.com",
    projectId: "cnqa-caju-test",
    storageBucket: "cnqa-caju-test.appspot.com",
    messagingSenderId: "445976325638",
    appId: "1:445976325638:web:4635caafbb1a0448599d87",
    measurementId: "G-W5C38LMCBM"
};

// For production
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//     apiKey: "AIzaSyBMd16BeDCZW5wm81etmsb-e4evGGwkjTo",
//     authDomain: "cqna-benincaju.firebaseapp.com",
//     databaseURL: "https://cqna-benincaju.firebaseio.com",
//     projectId: "cqna-benincaju",
//     storageBucket: "cqna-benincaju.appspot.com",
//     messagingSenderId: "622297898567",
//     appId: "1:622297898567:web:fc6b48e31a044a6af99b62",
//     measurementId: "G-KED2QG2V4H"
// };

if (firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig);
}

export const db = firebase.firestore();

export default firebase;


