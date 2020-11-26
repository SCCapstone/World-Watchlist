import React, { useEffect } from 'react';
import { IonButton, IonContent, IonHeader, IonPage, IonRouterOutlet, IonSearchbar, IonTitle, IonToolbar } from '@ionic/react';
import './Tab1.css';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router';
import Subscription from './Subscription';
const Tab1: React.FC = () => {
  return (
    <IonPage>
      <IonReactRouter>
      <IonHeader>
        <IonToolbar>
        <IonRouterOutlet>
          <Route path="/Subscription" component={Subscription} exact={true} />
        </IonRouterOutlet>
        <IonButton id="sub" color="light" href="/Subscription">add sub</IonButton>
        </IonToolbar>
      </IonHeader>
      </IonReactRouter>
    </IonPage>
  );
};

export default Tab1;
