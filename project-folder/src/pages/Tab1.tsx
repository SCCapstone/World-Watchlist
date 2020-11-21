import React, { useEffect } from 'react';
import { useHistory } from "react-router-dom";
import { IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Tab1.css';
import articleItem from '../components/articleItem';
// import {app, auth, firestore} from 'firebase-admin'
import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

app.initializeApp({
  apiKey: "AIzaSyCFtfeFfLznFRx2WFb43X_DFvfjmYphxIw",
  appId: "1:354505895223:android:8fa9445b09a2f085be7eb2",
  projectId: "world-watchlist-server-fa5a3",
  authDomain: "354505895223-o1sbbpm304svceu6eut425pkhqrph3fk.apps.googleusercontent.com",
  databaseURL: "https://world-watchlist-server-fa5a3.firebaseio.com",
  storageBucket: "world-watchlist-server-fa5a3.appspot.com"
})
const db = app.database();
const BBCNews = db.ref('BBCNews');
  // async function getData() {

const snapshot = BBCNews.get();
console.log(snapshot);
  // }
// getData();

const Tab1: React.FC = () => {

  let history = useHistory();
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle id="title">
            WW
          </IonTitle>
        <IonButton id='sub' color="light" onClick={(e) => {
            e.preventDefault();
            history.push('/Subscription')}}>+</IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {/* <!--<articleItem entry={snapshot}></articleItem>--> */}
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
