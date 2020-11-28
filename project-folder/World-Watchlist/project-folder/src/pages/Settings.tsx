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
              Settings asd
            </IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonItemDiavider>Toggles in a List</IonItemDivider>
          <IonItem>
            <IonLabel>Pepperoni</IonLabel>
            <IonToggle value="pepperoni" />
          </IonItem>
        <IonContent>

        </IonContent>
      </IonPage>
      )
    }

}

export default Settings
