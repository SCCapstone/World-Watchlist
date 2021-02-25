import { IonButton, IonButtons, IonIcon, IonTitle, IonToolbar } from '@ionic/react';
import { notificationsCircleOutline, cloud, bookmarks, search } from 'ionicons/icons';
import React from 'react';


function FeedToolbar (props: {clear: any, openWeather: any, showSubs: any, showModal: any}) {
    let clearFunc = () => props.clear();
    // let openWeather = () => props.openWeather();
    // let showSubs = () => props.showSubs();
    // let showModal = () => props.showModal();
    return (<IonToolbar class ='feedToolbar'>
    <IonTitle class='feedTitle'>
      Feed
    </IonTitle>
    <IonButtons slot="start">
    <IonButton onClick={props.clear}>
    <IonIcon icon={notificationsCircleOutline} />
    </IonButton>
    </IonButtons>
<IonButtons slot="start">
    <IonButton onClick={props.openWeather}  fill='clear'>
        <IonIcon icon={cloud} />
    </IonButton>
    </IonButtons>
    <IonButtons slot="end">
    <IonButton onClick={props.showSubs}  fill='clear'>
        <IonIcon icon={bookmarks} />
    </IonButton>
    </IonButtons>
    <IonButtons slot="end">
    <IonButton onClick={props.showModal}  fill='clear'>
        <IonIcon icon={search} />
    </IonButton>
    </IonButtons>
  </IonToolbar>);
}

export default FeedToolbar;