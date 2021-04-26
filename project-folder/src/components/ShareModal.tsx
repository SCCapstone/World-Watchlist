import React from 'react';
import {
  IonModal,
  IonContent,
  IonHeader,
  IonButtons,
  IonButton,
  IonToolbar,
  IonIcon,
  IonTitle,
  IonAvatar,
  IonPopover,
  IonList,
  IonListHeader,
  IonLabel,
  IonItem,
  IonInput,
  IonAlert
} from '@ionic/react'

import './ShareModal.css'

import firebase, {db, auth} from '../firebase'
import Placeholder from '../images/placeholder.png'
import {
  closeCircleOutline,
  addCircleOutline,
  checkmarkOutline,
  sendOutline
} from 'ionicons/icons'

import { article } from './ArticleTypes';

type Group = {
  nickname: string;
  members: string[];
  id: string;
  profilePicture: string;
  owner: string;
  lastMessage: string;
  lastMessageSender: string;
}

type MyState = {
  sentArray: boolean[],
  shareAlert:boolean
}

type MyProps = {
  history: any;
  location: any;
  myArticle: article;
  isShareModalOpen: boolean;
  openShareModal: (theArticle: article, shouldOpen: boolean) => void;
  groupArray: Group[];
  ourUsername: string;
}


class ShareModal extends React.Component<MyProps, MyState> {
  realtime_db = firebase.database();
  state: MyState = {
    shareAlert:false,
    sentArray: []
  };

  constructor(props: MyProps) {
    super(props)
  }


  componentDidMount() {

  }

  componentWillUnmount() {

  }

  sendArticle(displayGroup: Group, index: number) {
    
    let tempArray = this.state.sentArray
    tempArray[index] = true
    this.setState({shareAlert:true,sentArray: tempArray})
    let timestamp = Date.now()

    this.realtime_db.ref(displayGroup.id).child(timestamp.toString()).set(
      {
        content: '',
        sender: auth.currentUser?.uid,
        read: [{readBy: auth.currentUser?.email, readAt: timestamp.toString()}],
        time: timestamp.toString(),
        isArticle: true,
        article: this.props.myArticle
      }
    )
    db.collection('groups').doc(displayGroup.id).update({
      lastMessage: this.props.myArticle.title,
      lastMessageSender: this.props.ourUsername,
      time: timestamp.toString()
    })
  }



  render() {
    return (
      <IonModal isOpen={this.props.isShareModalOpen} onDidDismiss={() => {this.props.openShareModal(this.props.myArticle, false)}}>
        <IonHeader>
          <IonToolbar class='shareModalToolbar'>
            <IonButtons slot='start'>
              <IonButton onClick={() => {this.props.openShareModal(this.props.myArticle, false)}} id='shareModalCloseButton' fill='clear'>
                <IonIcon id='shareModalCloseIcon' icon={closeCircleOutline}/>
              </IonButton>
            </IonButtons>
            <IonTitle class='shareModalTitle'>
              Share Article
            </IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
        <IonAlert
          isOpen={this.state.shareAlert}
          onDidDismiss={() => this.setState({shareAlert:false})}
          message="sent!"
       />
        <div>
          {
            this.props.groupArray.map((displayGroup : Group, index: number) => {
              return (
                <IonItem lines='none' button={true} className='socialGroupItem' key={displayGroup.id}>
                  <IonAvatar slot='start' className='socialGroupAvatar'>
                    <img src = {displayGroup.profilePicture ? displayGroup.profilePicture : Placeholder}/>
                  </IonAvatar>
                  <IonLabel className='socialGroupLabel'>
                    {displayGroup.nickname}
                  </IonLabel>
                  <IonButton onClick={()=>{this.sendArticle(displayGroup, index)}}>
                    <IonIcon icon={sendOutline}> </IonIcon>
                  </IonButton>
                </IonItem>
              )
            })
          }
        </div>
        </IonContent>
      </IonModal>
    )
  }

}

export default ShareModal;
