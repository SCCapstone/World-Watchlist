import React from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonContent,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonModal,
  IonInput,
  IonItem,
  IonLabel
} from '@ionic/react'
import firebase, {db} from '../firebase'
import {personAddOutline, closeCircleOutline, addCircleOutline} from "ionicons/icons"
import './Social.css'

type MyState = {
  isAddFriendModalOpen: boolean;
  ourUsername: string;
  targetUsername: string;
  friendsList: string[];
}

type MyProps = {
  history: any;
  location: any;
}

class Social extends React.Component<MyProps, MyState> {

  state: MyState = {
    isAddFriendModalOpen: false,
    ourUsername: "clay34#0",
    targetUsername: "",
    friendsList: []
  };

  unsubscribeFriendsList: any;


  constructor(props: MyProps) {
    super(props)
    this.addFriend = this.addFriend.bind(this);

    this.unsubscribeFriendsList = db.collection("usernames").doc(this.state.ourUsername).onSnapshot((snapshot) => {
      if(snapshot.data()) {
        this.setState({friendsList: snapshot.data()!.friends})
        console.log(this.state.friendsList)
      }

    })
  }

  componentWillUnmount() {
    this.unsubscribeFriendsList()
  }



  addFriend(username: string) {
    let usernameSplit = username.split("#")
    db.collection("usernames").doc(username).get().then(document => {
      if(document.exists) {
        db.collection("usernames").doc(username).update({
          incomingFriendRequests: firebase.firestore.FieldValue.arrayUnion(this.state.ourUsername)
        })
        db.collection("usernames").doc(this.state.ourUsername).update({
          outgoingFriendRequests: firebase.firestore.FieldValue.arrayUnion(username)
        })
      }
    })
  }

  acceptFriend(username: string) {
    db.collection("usernames").doc(username).update({
      outgoingFriendRequests: firebase.firestore.FieldValue.arrayRemove(this.state.ourUsername),
      friends: firebase.firestore.FieldValue.arrayUnion(this.state.ourUsername)
    })
    db.collection("usernames").doc(this.state.ourUsername).update({
      incomingFriendRequests: firebase.firestore.FieldValue.arrayRemove(username),
      friends: firebase.firestore.FieldValue.arrayUnion(username)
    })
  }

  declineFriend(username: string) {
    db.collection("usernames").doc(username).update({
      outgoingFriendRequests: firebase.firestore.FieldValue.arrayRemove(this.state.ourUsername),
    })
    db.collection("usernames").doc(this.state.ourUsername).update({
      incomingFriendRequests: firebase.firestore.FieldValue.arrayRemove(username),
    })
  }



    render() {
      return (
      <IonPage>

        <IonModal isOpen={this.state.isAddFriendModalOpen}>
          <IonHeader>
            <IonToolbar>
              <IonButtons>
                <IonButton onClick={() => {this.setState({isAddFriendModalOpen: false})}} id='addFriendModalCloseButton' fill='clear'>
                  <IonIcon id='addFriendModalCloseIcon' icon={closeCircleOutline}/>
                </IonButton>
              </IonButtons>
              <IonTitle>
                Add Friend
              </IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonItem lines='none' id='searchFriendItem'>
              <IonInput id='addFriendSearch' />

              <IonButton onClick={() => {this.addFriend(this.state.targetUsername)}} slot='end' id='addFriendButton' fill='clear'>
                <IonIcon id='addFriendButtonIcon' icon={addCircleOutline} />
              </IonButton>
            </IonItem>

          </IonContent>
        </IonModal>

        <IonHeader>
          <IonToolbar>
            <IonTitle>
              Social
            </IonTitle>
            <IonButtons slot='end'>
              <IonButton onClick={() => {this.setState({isAddFriendModalOpen: true})}} fill='clear'>
                <IonIcon icon={personAddOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent>
        {
          this.state.friendsList.map(Friend =>
            <IonItem key={Friend.toString()}>
              <IonButton class = 'friendListItem'>{Friend.toString()}</IonButton>
              <IonIcon class = 'friendIcon' icon ={addCircleOutline}/>
            </IonItem>
        )}

        </IonContent>
      </IonPage>
      )
    }

}

export default Social
