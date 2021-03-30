import { IonModal, IonHeader, IonToolbar, IonButtons, IonButton, IonIcon, IonTitle, IonContent, IonSearchbar, IonAlert, IonLoading } from "@ionic/react";
import { closeCircleOutline, addCircle, removeCircleOutline } from "ionicons/icons";
import React from "react";
import FeedList from "./FeedList";
function CollectionModal(props: {showModal: any, closeModal: any, articles:any, func:any, subscription:any, index:any }) {

  function unsubClick() {
    props.func(props.subscription, props.index);
  }
        return (
            <IonModal isOpen={props.showModal} onDidDismiss={props.closeModal}>
            <IonHeader>
              <IonToolbar class='feedToolbar2'>
                <IonButtons slot='start'>
                  <IonButton onClick={props.closeModal} fill='clear'>
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
          </IonModal>);

}
export default CollectionModal;