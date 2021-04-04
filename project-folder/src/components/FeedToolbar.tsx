import { IonButton, IonButtons, IonContent, IonIcon, IonItem, IonLabel, IonList, IonListHeader, IonPopover, IonRadio, IonRadioGroup, IonTitle, IonToolbar } from '@ionic/react';
import { cloud, bookmarks, search, albums, listOutline, tabletLandscapeOutline, tabletPortraitOutline } from 'ionicons/icons';
import React, { useState } from 'react';

import './FeedToolbar.css'
import { sortTypes } from './FeedTypes';

function FeedToolbar (props: { openWeather: any, toggleMode: () => string, toggleSort: (option: sortTypes) => void}) {
  const [showPopover, setShowPopover] = useState(false);
  const [showType, setShowType] = useState(false);
  const [selected, setSelected] = useState<string>('Sort by Title');
    // let openWeather = () => props.openWeather();
    // let showSubs = () => props.showSubs();
    // let showModal = () => props.showModal();
  async function type(){
    const type = props.toggleMode()
    if (type==='cards')
      setShowType(false)
    else 
      setShowType(true)
  }
    
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
    <IonButton id="feedButton"  fill='clear' onClick={type}>
        <IonIcon icon={showType ? tabletLandscapeOutline: tabletPortraitOutline} />
    </IonButton>
    </IonButtons>
    <IonButtons slot="end">
    <IonButton id="feedButton" onClick={()=>setShowPopover(true)}   fill='clear'>
        <IonIcon icon={albums} />
    </IonButton>
    </IonButtons>
    {/* <IonButtons slot="end">
    <IonButton id="feedButton" onClick={props.showModal}  fill='clear'>
        <IonIcon icon={search} />
    </IonButton>
    </IonButtons> */}
    <IonPopover
        isOpen={showPopover}
        onDidDismiss={()=>setShowPopover(false)}
      >
            <IonList>
            <IonRadioGroup value={selected} onIonChange={e => setSelected(e.detail.value)}>
            <IonListHeader>
              <IonLabel><b>Sort Filter</b></IonLabel>
            </IonListHeader>
            <IonItem onClick={() => props.toggleSort('title')}>
              <IonLabel>Sort by Title</IonLabel>
              <IonRadio value="Sort by Title" />
            </IonItem>
            <IonItem onClick={() => props.toggleSort("pubDate")}>
              <IonLabel>Sort by Date</IonLabel>
              <IonRadio  value="Sort by Date" />
            </IonItem>
          </IonRadioGroup>
              {/* <IonItem button={true}><IonLabel>New Message</IonLabel><IonIcon className='socialPopoverIcon' slot='end' icon={sendOutline}/></IonItem> */}
            </IonList>
          
      </IonPopover>
  </IonToolbar>);
}

export default FeedToolbar;