import React from 'react';
import Placeholder from '../images/placeholder.png'
import './Message.css'
import {
  IonAvatar,
  IonItem,
  IonLabel
} from '@ionic/react'

interface MessageProps {
  photo: string;
  content: string;
  sender: string;
}

function Message(props: MessageProps) {
    return (
      <div>
      <IonLabel class='messageLabel' position='stacked'>{props.sender}</IonLabel>
      <IonItem class='messageItem'>
        <IonAvatar slot="start">
          <img src={props.photo !== '' ? props.photo : Placeholder} />
        </IonAvatar>

        <IonLabel className='messageContent'>{props.content}</IonLabel>
      </IonItem>
      </div>
    );
}
export default Message;
