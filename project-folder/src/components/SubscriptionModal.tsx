import { IonModal, IonHeader, IonToolbar, IonButtons, IonButton, IonIcon, IonTitle, IonContent, IonCard, IonItem } from "@ionic/react"
import { closeCircleOutline, removeCircleOutline } from "ionicons/icons"
import React, { useState } from "react"
import { article } from "./ArticleTypes"
import ChildrenComponent from "./SubscriptionChildren"
import FeedList from '../components/FeedList';


function SubscriptionModal(props: {unsubButton: any, subscriptions: string[], articles:any[]}) {
      
{/* <IonHeader>
  <IonToolbar class='feedToolbar2'>
    <IonButtons slot='start'>
      <IonButton onClick={props.closeButton} fill='clear'>
        <IonIcon id='addFriendModalCloseIcon' icon={closeCircleOutline}/>
      </IonButton>
    </IonButtons>

  <IonTitle class='feedTitle2'>Subscriptions</IonTitle>
  </IonToolbar>
</IonHeader> */}
return ( <IonCard>
          {<ChildrenComponent subs={props.subscriptions} func={props.unsubButton} articles={ props.articles}></ChildrenComponent>}
          {/* <IonModal isOpen={showModal}>
            <IonHeader>
              <IonToolbar class='feedToolbar2'>
                <IonButtons slot='start'>
                  <IonButton onClick={props.closeButton} fill='clear'>
                    <IonIcon id='addFriendModalCloseIcon' icon={closeCircleOutline}/>
                  </IonButton>
                </IonButtons>
                <IonButtons slot='end'>
                  <IonButton onClick={props.unsubButton} fill='clear'>
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
          </IonModal> */}
        </IonCard>
);

}
export default SubscriptionModal;