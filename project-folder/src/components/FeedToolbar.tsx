import { IonButton, IonButtons, IonIcon, IonTitle, IonToolbar } from '@ionic/react';
import { cloud, bookmarks, search } from 'ionicons/icons';
import React from 'react';

import './FeedToolbar.css'

function FeedToolbar (props: { openWeather: any, showSubs: any, showModal: any}) {
    
    // let openWeather = () => props.openWeather();
    // let showSubs = () => props.showSubs();
    // let showModal = () => props.showModal();
    return (<IonToolbar class ='feedToolbar'>
    <IonTitle class='feedTitle'>
      Feed
    </IonTitle>
    
<IonButtons slot="start">
    <IonButton id="feedButton" onClick={props.openWeather}  fill='clear'>
        <IonIcon icon={cloud} />
    </IonButton>
    </IonButtons>
    <IonButtons slot="end">
    <IonButton id="feedButton" onClick={props.showSubs}  fill='clear'>
        <IonIcon icon={bookmarks} />
    </IonButton>
    </IonButtons>
    <IonButtons slot="end">
    <IonButton id="feedButton" onClick={props.showModal}  fill='clear'>
        <IonIcon icon={search} />
    </IonButton>
    </IonButtons>
  </IonToolbar>);
}

export default FeedToolbar;