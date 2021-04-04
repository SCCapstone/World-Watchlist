import { IonButton, IonButtons, IonContent, IonIcon, IonItem, IonLabel, IonList, IonListHeader, IonPopover, IonTitle, IonToolbar } from '@ionic/react';
import { cloud, bookmarks, search, albums, listOutline } from 'ionicons/icons';
import React, { useState } from 'react';

import './FeedToolbar.css'
import { sortTypes } from './FeedTypes';

function FeedToolbar (props: { openWeather: any, showModal: any, toggleMode: () => void, toggleSort: (option: sortTypes) => void}) {
  const [showPopover, setShowPopover] = useState(false);
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
    <IonButton id="feedButton"  fill='clear' onClick={props.toggleMode}>
        <IonIcon icon={listOutline} />
    </IonButton>
    </IonButtons>
    <IonButtons slot="end">
    <IonButton id="feedButton" onClick={()=>setShowPopover(true)}   fill='clear'>
        <IonIcon icon={albums} />
    </IonButton>
    </IonButtons>
    <IonButtons slot="end">
    <IonButton id="feedButton" onClick={props.showModal}  fill='clear'>
        <IonIcon icon={search} />
    </IonButton>
    </IonButtons>
    <IonPopover
        isOpen={showPopover}
        onDidDismiss={()=>setShowPopover(false)}
      >
                  <IonContent>
            <IonList>
              <IonListHeader id='socialPopoverListHeader'><b>Sort Filter</b></IonListHeader>
              <IonItem button={true} onClick={() => props.toggleSort('title')}>Sort by Title</IonItem>
              <IonItem button={true} onClick={() => props.toggleSort("pubDate")}>Sort by Date</IonItem>
              {/* <IonItem button={true}><IonLabel>New Message</IonLabel><IonIcon className='socialPopoverIcon' slot='end' icon={sendOutline}/></IonItem> */}
            </IonList>
          </IonContent>
      </IonPopover>
  </IonToolbar>);
}

export default FeedToolbar;