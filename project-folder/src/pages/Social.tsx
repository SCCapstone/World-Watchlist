import React, {useState} from 'react';
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

    //Begin Functin bindings

    this.addFriend = this.addFriend.bind(this);
    this.acceptFriend = this.acceptFriend.bind(this);
    this.declineFriend = this.declineFriend.bind(this);
    this.cancelOutgingRequest = this.cancelOutgingRequest.bind(this);

    //End Functin Bindings

    //Begin firebase data subscriptins
    if(auth.currentUser) {
      //gets the username of our user
      db.collection("users").doc(auth.currentUser.uid).get().then(doc => {
        if(doc.data()) {
          this.setState({ourUsername: doc.data()!.username})
          //creates a subscription to our user's friends list
          this.unsubscribeFriendsList = db.collection('friends').doc(this.state.ourUsername).onSnapshot((snapshot) => {
            if(snapshot.data()) {
              this.setState({friendsList: snapshot.data()!.friendsList})
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
    //End firebase data subscriptins

  }

  componentWillUnmount() {
    //since we have subscriptions, we cancel them here to prevent a memory leak
    this.unsubscribeFriendsList()
    this.unsubscribeIncomingRequests()
    this.unsubscribeOutgoingRequests()
  }



  addFriend(username: string) { //sends a friend request to a user
    if(username !== "" && username !== this.state.ourUsername) {
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

  cancelOutgingRequest(username: string) {
    if(username !== "" && username !== this.state.ourUsername) {
      db.collection('usernames').doc(username).get().then(document => {
        if(document.exists) {
          db.collection('incomingFriendRequests').doc(username).update({
            incomingFriendRequests: firebase.firestore.FieldValue.arrayRemove(this.state.ourUsername)
          })
          db.collection('outgoingFriendRequests').doc(this.state.ourUsername).update({
            outgoingFriendRequests: firebase.firestore.FieldValue.arrayRemove(username)
          })
        }
      })
    }
  }

  acceptFriend(username: string) { //accepts a friend request from a user
    if(username != "") {
      db.collection('outgoingFriendRequests').doc(username).update({
        outgoingFriendRequests: firebase.firestore.FieldValue.arrayRemove(this.state.ourUsername),
      })
      db.collection('incomingFriendRequests').doc(this.state.ourUsername).update({
        incomingFriendRequests: firebase.firestore.FieldValue.arrayRemove(username),
      })
      db.collection('friends').doc(this.state.ourUsername).update({
        friendsList: firebase.firestore.FieldValue.arrayUnion(username)
      })
      db.collection('friends').doc(username).update({
        friendsList: firebase.firestore.FieldValue.arrayUnion(this.state.ourUsername)
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
                <IonButton onClick={() => {this.acceptFriend(IncomingFriend.toString())}} className='acceptButton' slot='end' fill='clear'>
                  <IonIcon className='addIcon' icon={addCircleOutline} />
                </IonButton>
                <IonButton onClick={() => {this.declineFriend(IncomingFriend.toString())}} className='denyButton' slot='end' fill='clear'>
                  <IonIcon className='denyIcon' icon={closeCircleOutline} />
                </IonButton>
              </IonItem>)}
            <h2 id='outgoingFriendRequestHeader'>Outgoing Friend Requests</h2>
            {this.state.outgoingRequests.map(OutgoingFriend =>
              <IonItem key={OutgoingFriend.toString()}>
                <IonLabel>{OutgoingFriend.toString()}</IonLabel>
                <IonButton onClick={() => {this.cancelOutgingRequest(OutgoingFriend.toString())}} className='denyButton' slot='end' fill='clear'>
                  <IonIcon className='denyIcon' icon={closeCircleOutline} />
                </IonButton>
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
              <IonLabel>{Friend.toString()}</IonLabel>
            </IonItem>
        )}

        </IonContent>
      </IonPage>
      )
    }

}

export default Social
