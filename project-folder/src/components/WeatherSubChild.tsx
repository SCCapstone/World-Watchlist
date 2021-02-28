import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle } from '@ionic/react';
import React from 'react';

import './WeatherSubChild.css'


function WeatherSubChild (props: {weather_code:any, temp:any, location: any, index:any, func: any}) {
    function unsubClick(e: any) {
        props.func(props.index);
    }
    return (
    <IonCard>
        <IonCardHeader >
          <IonCardSubtitle>{props.location}</IonCardSubtitle>
          <IonCardTitle >{props.temp}</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
        {props.weather_code}
        <IonButton id="unsubButton" expand="block" fill="outline" type="submit" shape="round" onClick={unsubClick}>Unsubscribe</IonButton>
        </IonCardContent>
      </IonCard>);}

export default WeatherSubChild;