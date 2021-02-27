
import firebase from 'firebase';

var firebaseConfig = {
  apiKey: "AIzaSyCAmbJVaYRk_N6RBcg_VnH865_9FzstE_I",
  authDomain: "worldwatchlist.firebaseapp.com",
  databaseURL: "https://worldwatchlist.firebaseio.com",
  projectId: "worldwatchlist",
  storageBucket: "worldwatchlist.appspot.com",
  messagingSenderId: "106343909885",
  appId: "1:106343909885:web:5cd924b3087d5e5b483194"
};

firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();
export const db = firebase.firestore();
export default firebase;
