import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle } from '@ionic/react';
import React from 'react';


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
        <IonButton expand="block" fill="outline" color="secondary" type="submit" onClick={unsubClick}>unsub</IonButton>
        </IonCardContent>
      </IonCard>);}

export default WeatherSubChild;