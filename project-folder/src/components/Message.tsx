import React from 'react';
import Placeholder from '../images/placeholder.png'

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
      <IonItem>
        <IonAvatar slot="start">
          <img src={props.photo !== '' ? props.photo : Placeholder} />
        </IonAvatar>
        <IonLabel>{props.sender}</IonLabel>
        <IonLabel>{props.content}</IonLabel>
      </IonItem>
    );
}
export default Message;
