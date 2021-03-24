import { IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonListHeader, IonModal, IonTitle, IonToolbar } from '@ionic/react';
import { addCircle, closeCircleOutline, removeCircle, removeCircleOutline } from 'ionicons/icons';
import React, { useState } from 'react';
import './WeatherSubChild.css'


function WeatherSubChild (props: {weather_code:any, temp:any, location: any, index:any, func: any, weeklyForecast:any[]}) {
  const [showModal, setShowModal] = useState(false);
    function unsubClick(e: any) {
        props.func(props.index);
    }
    return (
      <>
        <IonItem button onClick={() => { setShowModal(!showModal)} }>
        <IonModal isOpen={showModal} onDidDismiss={() => { setShowModal(false)}} >
        <IonHeader>
      <IonToolbar className="weatherToolbar">
      <IonButtons slot='start'>
                <IonButton onClick={() => setShowModal(false) } fill='clear'>
                  <IonIcon id='addFriendModalCloseIcon' icon={closeCircleOutline}/>
                </IonButton>
        </IonButtons>
        <IonButtons slot='end'>
            <IonButton fill='clear' type="submit" onClick={unsubClick}>
            <IonIcon id='addFriendModalCloseIcon' icon={removeCircleOutline}/>
            </IonButton>
        </IonButtons>
      <IonTitle>
          Weather Information
        </IonTitle>
      </IonToolbar>
      </IonHeader>
        <IonContent>
          <IonCard>
            <IonCardHeader>
              <IonCardSubtitle>Currently in {props.location}</IonCardSubtitle>
              <IonCardTitle>{props.temp}</IonCardTitle>
              {props.weather_code}
            </IonCardHeader>
            <IonCardContent>
              <IonList>
                <IonListHeader>
                  <IonLabel>Weekly Forecast</IonLabel>
                </IonListHeader>
                {props.weeklyForecast.map(day => (
                  <IonItem key={day.dt}>
                    <IonLabel>
                      <h1>{day.date}</h1>
                      <h2>{day.temp} F</h2>
                      <p>Expecting {day.forecast}.</p>
                    </IonLabel>
                  </IonItem>
                ))}
              </IonList>
            </IonCardContent>
          </IonCard>
        </IonContent>
      </IonModal>
      <IonCard>
          <IonCardHeader>
            <IonCardSubtitle>{props.location}</IonCardSubtitle>
            <IonCardTitle>{props.temp}</IonCardTitle>
            {props.weather_code}
          </IonCardHeader>
          </IonCard>
        </IonItem>
        </>
      );}

export default WeatherSubChild;