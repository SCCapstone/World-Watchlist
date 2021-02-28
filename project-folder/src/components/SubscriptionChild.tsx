import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle } from '@ionic/react';
import React from 'react';


function ChildComponent (props: {subscription:any, index:any, func: any }) {
    function unsubClick(e: any) {
        props.func(props.subscription, props.index);
    }
    return (<IonCard>
      <IonCardHeader >
        <IonCardTitle>{props.subscription}</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
        <IonButton id="unsubButton" expand="block" fill="outline" type="submit" shape="round" onClick={unsubClick}>Unsubscribe</IonButton>
        </IonCardContent>
    </IonCard>);}

export default ChildComponent;