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

import moment from 'moment'
import firebase, {db, auth, signInWithGoogle} from '../firebase'
import { arrowBackOutline } from 'ionicons/icons'

var isProfileModalOpen=false;



interface readReceipt {
  readBy: string;
  readAt: string;
}


interface MessageProps {
  photo: string;
  content: string;
  sender: string;
  read: readReceipt[];
  openProfile: (sender: string) => void;
  closeProfile: () => void;
}

 function Message(props: MessageProps) {
   const [readReceiptViewable, setReadReceiptViewable] = useState(false)
    return (
      <div>
        <IonLabel class='messageLabel text-wrap' position='stacked'>{props.sender}</IonLabel>
        <IonItem class='messageItem' onClick={() => {setReadReceiptViewable(!readReceiptViewable)}}>
          <IonAvatar slot="start" onClick={() => {console.log('This is me clicking the avatar')}}>
            <img src={props.photo !== '' ? props.photo : Placeholder} />
          </IonAvatar>

          <IonLabel class='messageContent ion-text-wrap'>{props.content}</IonLabel>
        </IonItem>
        {readReceiptViewable ?
          <div className='readReceipt'>
            {props.read.map((readObj : readReceipt) => {
              return <IonLabel className='readLabel' key={readObj.readBy}>{readObj.readBy} - {moment(Number(readObj.readAt)).format('HH:mm, D MMM YYYY')}</IonLabel>
            })}
          </div> : undefined}
      </div>

    );
}
export default Message;
