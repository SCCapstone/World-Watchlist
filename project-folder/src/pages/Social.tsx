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
import firebase, {db, auth} from '../firebase'
import {personAddOutline, closeCircleOutline, addCircleOutline, listOutline} from 'ionicons/icons'
import './Social.css'

type MyState = {
  isAddFriendModalOpen: boolean;
  ourUsername: string;
  targetUsername: string;
  friendsList: string[];
  isPendingRequestsModalOpen: boolean;
  incomingRequests: string[];
  outgoingRequests: string[];
}

type MyProps = {
  history: any;
  location: any;
}

class Social extends React.Component<MyProps, MyState> {

  state: MyState = {
    isAddFriendModalOpen: false,
    ourUsername: '',
    targetUsername: '',
    friendsList: [],
    isPendingRequestsModalOpen: false,
    incomingRequests: [],
    outgoingRequests: []
  };
  unsubscribeFriendsList: any;
  unsubscribeIncomingRequests: any;
  unsubscribeOutgoingRequests: any;


  constructor(props: MyProps) {
    super(props)
    this.addFriend = this.addFriend.bind(this);

    if(auth.currentUser) {
      //gets the username of our user
      db.collection("users").doc(auth.currentUser.uid).get().then(doc => {
        if(doc.data()) {
          this.setState({ourUsername: doc.data()!.username})
          //creates a subscription to our user's friends list
          this.unsubscribeFriendsList = db.collection('usernames').doc(this.state.ourUsername).onSnapshot((snapshot) => {
            if(snapshot.data()) {
              this.setState({friendsList: snapshot.data()!.friends})
            }
          })

          //creates a subscription to our user's incoming friend requests
          this.unsubscribeIncomingRequests = db.collection('incomingFriendRequests').doc(this.state.ourUsername).onSnapshot((snapshot) => {
            if(snapshot.data()) {
              this.setState({incomingRequests: snapshot.data()!.incomingFriendRequests})
            }
          })

          //creates a subscription to our user's outgoing friend requests
          this.unsubscribeOutgoingRequests = db.collection('outgoingFriendRequests').doc(this.state.ourUsername).onSnapshot((snapshot) => {
            if(snapshot.data()) {
              this.setState({outgoingRequests: snapshot.data()!.outgoingFriendRequests})
            }
          })
        }
      })
    }

  }

  componentWillUnmount() {
    this.unsubscribeFriendsList()
  }



  addFriend(username: string) { //sends a friend request to a user
    if(username != "") {
      db.collection('usernames').doc(username).get().then(document => {
        if(document.exists) {
          db.collection('incomingFriendRequests').doc(username).update({
            incomingFriendRequests: firebase.firestore.FieldValue.arrayUnion(this.state.ourUsername)
          })
          db.collection('outgoingFriendRequests').doc(this.state.ourUsername).update({
            outgoingFriendRequests: firebase.firestore.FieldValue.arrayUnion(username)
          })
        }
      })
    }
  }

  acceptFriend(username: string) { //accepts a friend request from a user
    if(username != "") {
      db.collection('outgoingFriendRequests').doc(username).update({
        outgoingFriendRequests: firebase.firestore.FieldValue.arrayRemove(this.state.ourUsername),
        friends: firebase.firestore.FieldValue.arrayUnion(this.state.ourUsername)
      })
      db.collection('incomingFriendRequests').doc(this.state.ourUsername).update({
        incomingFriendRequests: firebase.firestore.FieldValue.arrayRemove(username),
        friends: firebase.firestore.FieldValue.arrayUnion(username)
      })
    }

  }

  declineFriend(username: string) { //declines a friend request from a user
    if(username != "") {
      db.collection('outgoingFriendRequests').doc(username).update({
        outgoingFriendRequests: firebase.firestore.FieldValue.arrayRemove(this.state.ourUsername),
      })
      db.collection('incomingFriendRequests').doc(this.state.ourUsername).update({
        incomingFriendRequests: firebase.firestore.FieldValue.arrayRemove(username),
      })
    }
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
              <IonInput id='addFriendSearch' onIonChange={(e) => {this.setState({targetUsername: (e.target as HTMLInputElement).value})}} />

              <IonButton onClick={() => {this.addFriend(this.state.targetUsername)}} slot='end' id='addFriendButton' fill='clear'>
                <IonIcon id='addFriendButtonIcon' icon={addCircleOutline} />
              </IonButton>
            </IonItem>

          </IonContent>
        </IonModal>

        <IonModal isOpen={this.state.isPendingRequestsModalOpen}>
          <IonHeader>
            <IonToolbar>
              <IonButtons>
                <IonButton onClick={() => {this.setState({isPendingRequestsModalOpen: false})}} id='addFriendModalCloseButton' fill='clear'>
                  <IonIcon id='addFriendModalCloseIcon' icon={closeCircleOutline}/>
                </IonButton>
              </IonButtons>
              <IonTitle>
                Pending Requests
              </IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <h2 id='incomingFriendRequestHeader'>Incoming Friend Requests</h2>
            {this.state.incomingRequests.map(IncomingFriend =>
              <IonItem key={IncomingFriend.toString()}>
                <IonLabel>{IncomingFriend.toString()}</IonLabel>
              </IonItem>)}
            <h2 id='outgoingFriendRequestHeader'>Outgoing Friend Requests</h2>
            {this.state.outgoingRequests.map(OutgoingFriend =>
              <IonItem key={OutgoingFriend.toString()}>
                <IonLabel>{OutgoingFriend.toString()}</IonLabel>
              </IonItem>)}
          </IonContent>
        </IonModal>

        <IonHeader>
          <IonToolbar>
            <IonTitle>
              Social
            </IonTitle>
            <IonButtons slot="start">
              <IonButton onClick={() => {this.setState({isPendingRequestsModalOpen: true})}}  fill='clear'>
                <IonIcon icon={listOutline}/>
              </IonButton>
            </IonButtons>
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
