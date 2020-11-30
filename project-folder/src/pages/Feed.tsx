import React from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonContent,
  IonTitle,

} from '@ionic/react'

import './Feed.css'
import { db } from '../API/config';

type MyState = {

}

type MyProps = {
  history: any;
  location: any;
}

class Feed extends React.Component<MyProps, MyState> {

  state: MyState = {

  };



  constructor(props: MyProps) {
    super(props)

  }

  getUserData = () => {
  db.collection("BBCNews")
    .doc('51180282')
    .get()
    .then(doc => {
      const data = doc.data();
      console.log(data);
    });
  };

  componentDidMount() {
   this.getUserData()
  }
    render() {
      return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>
              Feed
            </IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>

        </IonContent>
      </IonPage>
      )
    }

}

export default Feed
