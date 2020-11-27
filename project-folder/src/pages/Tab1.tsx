import React, { useEffect } from 'react';
import { useHistory } from "react-router-dom";
import { IonButton, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Tab1.css';
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
    </IonPage>
  );
};

export default Tab1;
