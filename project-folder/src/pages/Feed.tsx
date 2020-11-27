import React from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonContent,
  IonTitle,

} from '@ionic/react'

import './Feed.css'

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
