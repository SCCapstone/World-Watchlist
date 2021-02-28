import { IonModal, IonHeader, IonToolbar, IonButtons, IonButton, IonIcon, IonTitle, IonContent, IonCard } from "@ionic/react"
import { closeCircleOutline } from "ionicons/icons"
import React from "react"
import { article } from "./ArticleTypes"
import ChildrenComponent from "./SubscriptionChildren"

function SubscriptionModal(props: {showModal: boolean, closeButton: any, unsubButton: any, subscriptions: string[]}) {
    return (<IonModal isOpen={props.showModal}>
<IonHeader>
  <IonToolbar class='feedToolbar2'>
    <IonButtons slot='start'>
      <IonButton onClick={props.closeButton} fill='clear'>
        <IonIcon id='addFriendModalCloseIcon' icon={closeCircleOutline}/>
      </IonButton>
    </IonButtons>

  <IonTitle class='feedTitle2'>Subscriptions</IonTitle>
  </IonToolbar>
</IonHeader>
<IonContent>
  <IonCard>
{/* <ParentComponent>
{subs}
</ParentComponent> */}
    <ChildrenComponent subs={props.subscriptions} func={props.unsubButton}></ChildrenComponent>
  </IonCard>
</IonContent>
</IonModal>
);

}
export default SubscriptionModal;