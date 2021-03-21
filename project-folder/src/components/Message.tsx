import React, {useState} from 'react';
import Placeholder from '../images/placeholder.png'
import './Message.css'
import {
  IonAvatar,
  IonItem,
  IonLabel,
  IonModal,
  IonHeader,
  IonToolbar,
  IonButton,
  IonButtons,
  IonTitle,
  IonIcon,
  IonContent
} from '@ionic/react'
import firebase, {db, auth, signInWithGoogle} from '../firebase'
import { arrowBackOutline } from 'ionicons/icons'

var isProfileModalOpen=false; 




interface MessageProps {
  photo: string;
  content: string;
  sender: string;
}

 function Message(props: MessageProps) {
  const [showModal, setShowModal] = useState(false);
  var sources = [""];
  firebase.auth().onAuthStateChanged(() => {
        if(auth.currentUser) { // gets the name of the current user
          db.collection("topicSubscription").doc(auth.currentUser.uid).get().then(doc => {
            if(doc.data()) {
              new Promise(r => setTimeout(r, 2000));
              sources = doc.data()!.sublist;
              
              
               var temp=  db.collection('topicSubscription').doc(firebase.auth().currentUser!.uid).onSnapshot(async (snapshot) => { //blockedSources not in firebase?
                if(snapshot.data()) {
                  sources =  await snapshot.data()!.subList;
                  console.log(sources)
                  
                }
              })
            
            }
          })

        }
        
          
      })
  new Promise(r => setTimeout(r, 2000));
    return (
      <div>
      <IonLabel class='messageLabel' position='stacked'>{props.sender}</IonLabel>
      <IonItem class='messageItem'>
        <IonAvatar onClick = {()=>{setShowModal(true);console.log("here")}} slot="start">
          <img src={props.photo !== '' ? props.photo : Placeholder} />
        </IonAvatar>

        <IonLabel class='messageContent'>{props.content}</IonLabel>
      </IonItem>

      <IonModal isOpen={showModal} onDidDismiss={() => {}}>
        <IonHeader>
          <IonToolbar class='settingsToolbar2'>
            <IonButtons>
              <IonButton onClick={() => {setShowModal(false)}} id='toBlock' fill='clear'>
              <IonIcon id='closeBlockIcon' icon={arrowBackOutline}/>
              </IonButton>
            </IonButtons>

            <IonTitle class='settingsTitle2'>
              {props.sender}

            </IonTitle>
            </IonToolbar>
          </IonHeader>
        <IonContent>
        <IonItem lines='none' id='block'>

        <ul id = "blockedList"></ul>
          {



            sources.map(Blocked =>
              <IonItem key = {Blocked.toString()}>
              <IonItem class = 'blockedListEntry'>{Blocked.toString()}</IonItem>
              </IonItem>
            )}

            {sources[0]}


         
          
        </IonItem>
        </IonContent>
      </IonModal>
      </div>

    );
}
export default Message;
