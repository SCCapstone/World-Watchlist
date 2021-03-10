import { IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonContent, IonHeader, IonIcon, IonItem, IonModal, IonTitle, IonToolbar } from '@ionic/react';
import { closeCircleOutline, removeCircleOutline } from 'ionicons/icons';
import React, { useState } from 'react';
import FeedList from './FeedList';


function ChildComponent (props: {subscription:any, index:any, func: any, articles:any[] }) {
    const [showModal, setShowModal] = useState(false);
    function unsubClick() {
        props.func(props.subscription, props.index);
    }
    return (
        <IonItem button onClick={() => { setShowModal(!showModal)} }>
    <IonCard>
      <IonCardHeader >
        <IonCardTitle>{props.subscription}</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
            <IonModal isOpen={showModal}>
            <IonHeader>
              <IonToolbar class='feedToolbar2'>
                <IonButtons slot='start'>
                  <IonButton onClick={()=>{setShowModal(false)}} fill='clear'>
                    <IonIcon id='addFriendModalCloseIcon' icon={closeCircleOutline}/>
                  </IonButton>
                </IonButtons>
                <IonButtons slot='end'>
                  <IonButton onClick={unsubClick} fill='clear'>
                    <IonIcon id='addFriendModalCloseIcon' icon={removeCircleOutline}/>
                  </IonButton>
                </IonButtons>
                <IonTitle class='feedTitle2'>
                  Subscription News
                </IonTitle>
              </IonToolbar>
            </IonHeader>
            <IonContent>
              <FeedList headerName={"Recent News"} articleList={props.articles}></FeedList>
            </IonContent>
          </IonModal>
        </IonCardContent>
    </IonCard>
    </IonItem>);}

export default ChildComponent;