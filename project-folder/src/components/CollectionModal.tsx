import { IonModal, IonHeader, IonToolbar, IonButtons, IonButton, IonIcon, IonTitle, IonContent, IonSearchbar, IonAlert, IonLoading } from "@ionic/react";
import { closeCircleOutline, addCircle, removeCircleOutline, notificationsCircleOutline, notificationsOffCircleOutline } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import FeedList from "./FeedList";
import firebase, {db,auth} from '../firebase'
function CollectionModal(props: {showModal: any, closeModal: any, articles:any, func:any, subscription:any, index:any }) {

  const [isMuted,setIsMuted] = useState(Boolean)
  
  function unsubClick() {
    props.func(props.subscription, props.index);
  }

  // call before rendering to check if it has already been muted
  useEffect(() => {
    checkIfMuted().then(res=>setIsMuted(res))
  },[]);
  
  async function checkIfMuted(){
    const profile = db.collection('profiles').doc(auth.currentUser?.uid)
    let doc = profile.get()
    if (!(await doc).exists) {
      console.log('No such document!');
    } else {
      if ((await doc).data()?.muteNotification===undefined) {
        await profile.update({muteNotification:[]});
      } else {
        if (!(await doc).data()?.muteNotification.includes(props.subscription)) {
          return (false)
        } else {
          return (true)
        }
      }
      
    }
    return false
  }

  async function muteNotification(){
    const profile = db.collection('profiles').doc(auth.currentUser?.uid)
    let doc = profile.get()
    if (!(await doc).exists) {
      console.log('No such document!');
    } else {
      let mutedNotification = (await doc).data()?.muteNotification
      if (mutedNotification.includes(props.subscription)) {
        console.log('unmuting', (await doc).data()?.muteNotification);
        profile.update({muteNotification:firebase.firestore.FieldValue.arrayRemove(props.subscription)});
        setIsMuted(false)
      } else {
        console.log("muting")
        profile.update({muteNotification:firebase.firestore.FieldValue.arrayUnion(props.subscription)});
        setIsMuted(true)
      }
    }
    return false
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
                  <IonButton onClick={muteNotification} fill='clear'>
                    <IonIcon id='addFriendModalCloseIcon' icon={isMuted? notificationsOffCircleOutline:notificationsCircleOutline }/>
                  </IonButton>
                </IonButtons>
                <IonButtons slot='end'>
                  <IonButton onClick={unsubClick} fill='clear'>
                    <IonIcon id='addFriendModalCloseIcon' icon={removeCircleOutline}/>
                  </IonButton>
                </IonButtons>
                <IonTitle>
                  {props.subscription}
                </IonTitle>
              </IonToolbar>
            </IonHeader>
            <IonContent>
              <FeedList headerName={"Recent News"} articleList={props.articles}></FeedList>
            </IonContent>
          </IonModal>);

}
export default CollectionModal;
