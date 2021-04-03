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
import Article from './Article'
import moment from 'moment'
import firebase, {db, auth, signInWithGoogle} from '../firebase'
import { arrowBackOutline } from 'ionicons/icons'
import { article } from './ArticleTypes';

var isProfileModalOpen=false;



interface readReceipt {
  readBy: string;
  readAt: string;
}


interface MessageProps {
  uid: string;
  photo: string;
  content: string;
  sender: string;
  read: readReceipt[];
  openProfile: (sender: string) => void;


setSenderToView: (sender:string)=> void;
  closeProfile: () => void;
  isArticle: boolean;
  article: article | undefined;
  openShareModal: (theArticle: article, shouldOpen: boolean) => void;
}

 function Message(props: MessageProps) {
   const [readReceiptViewable, setReadReceiptViewable] = useState(false)
    return (

      props.article ? <div>
                        <IonLabel class='messageLabel text-wrap' position='stacked'>{props.sender}</IonLabel>
                        <IonItem>
                          <Article theArticle={props.article} openShareModal={props.openShareModal}/>
                        </IonItem>
                      </div> : <div>
            <IonLabel class='messageLabel text-wrap' position='stacked'>{props.sender}</IonLabel>
            <IonItem class='messageItem' onClick={() => {setReadReceiptViewable(!readReceiptViewable)}}>
              <IonAvatar slot="start" onClick={()=>{props.setSenderToView(props.uid)}}>
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
