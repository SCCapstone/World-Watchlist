import firebase from 'firebase';
var config = {
    apiKey: "AIzaSyC1GXN_GO6R657eQgX7URmYD5Ywd_X0oo8",
    authDomain: "world-watchlist-server-fa5a3.firebaseapp.com",
    databaseURL: "https://world-watchlist-server-fa5a3.firebaseio.com",
    projectId: "world-watchlist-server-fa5a3",
    storageBucket: "world-watchlist-server-fa5a3.appspot.com",
    messagingSenderId: "354505895223",
    appId: "1:354505895223:web:3eb1d4a5850a9cabbe7eb2",
};
var secondaryApp = firebase.initializeApp(config, "Secondary");
export const NewsDB = secondaryApp.firestore();
export default secondaryApp;