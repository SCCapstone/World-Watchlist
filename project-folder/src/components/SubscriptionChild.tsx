import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle } from '@ionic/react';
import React from 'react';


function ChildComponent (props: {subscription:any, index:any, func: any }) {
    function unsubClick(e: any) {
        props.func(props.index);
    }
    return (<IonCard>
      <IonCardHeader >
        <IonCardTitle>{props.subscription}</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
        <IonButton expand="block" fill="outline" color="secondary" type="submit" onClick={unsubClick}>unsubscribe</IonButton>
        </IonCardContent>
    </IonCard>);}

export default ChildComponent;