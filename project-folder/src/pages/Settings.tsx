import React from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonContent,
  IonTitle,

} from '@ionic/react'

import './Settings.css'

type MyState = {

}

type MyProps = {
  history: any;
  location: any;
}

class Settings extends React.Component<MyProps, MyState> {

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
              Settings
            </IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>

        </IonContent>
      </IonPage>
      )
    }

}

export default Settings
