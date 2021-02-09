import firebase from 'firebase';
var config = {
  apiKey: "AIzaSyCiQa3wPMFOp_PidtF-8arljaCT3XFMLhc",
  authDomain: "world-watchlist-server-8f86e.firebaseapp.com",
  databaseURL: "https://world-watchlist-server-8f862.firebaseio.com",
  projectId: "world-watchlist-server-8f86e",
  storageBucket: "world-watchlist-server-8f86e.appspot.com",
  messagingSenderId: "252689618671",
  appId: "1:252689618671:web:3ac355cc3bbad710d02d1a",
};

var secondaryApp = firebase.initializeApp(config, "Secondary");
export const NewsDB = secondaryApp.firestore();
export default secondaryApp;