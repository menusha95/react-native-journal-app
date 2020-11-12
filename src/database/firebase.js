import * as firebase from 'firebase';
import firestore from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyBREwOhDFs5z_yw00p3l5_bDYK6wl2yQ0o",
    authDomain: "reactnativefirebase-a846a.firebaseapp.com",
    databaseURL: "https://reactnativefirebase-a846a.firebaseio.com",
    projectId: "reactnativefirebase-a846a",
    storageBucket: "reactnativefirebase-a846a.appspot.com",
    messagingSenderId: "139311336114",
    appId: "1:139311336114:web:a25e306dcf0828191b57ab",
    measurementId: "G-YJPK59S8SL"
};

firebase.initializeApp(firebaseConfig);
firebase.firestore();

export default firebase;