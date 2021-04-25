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
  IonInput
} from '@ionic/react'

import './GroupView.css'

import firebase, {db, auth} from '../firebase'
import Placeholder from '../images/placeholder.png'
import {
  closeCircleOutline,
  addCircleOutline
} from 'ionicons/icons'

type MyState = {
  incomingFriends: Friend[];
  outgoingFriends: Friend[];
}

type Friend = {
  displayName: string;
  photo: string;
  uid: string;
}

type MyProps = {
  history: any;
  location: any;
  isPendingRequestsModalOpen: boolean;
  togglePendingRequestsModal: () => void;
  incomingRequests: string[];
  outgoingRequests: string[];
  acceptFriend: (targetUserId: string) => void;
  declineFriend: (targetUserId: string) => void;
  cancelOutgingRequest: (targetUserId: string) => void;
}


class PendingRequests extends React.Component<MyProps, MyState> {

  state: MyState = {
    incomingFriends: [],
    outgoingFriends: []
  };

  constructor(props: MyProps) {
    super(props)
  }

  componentDidMount() {

    this.props.incomingRequests.map(IncomingFriend => {
      return db.collection("profiles").doc(IncomingFriend).get().then((document) => {
        if(document.data()) {
          this.setState({
            incomingFriends: [...this.state.incomingFriends, {displayName: document.data()!.displayName, uid: IncomingFriend, photo: document.data()!.photo}]
          })
        }
      })
    })
    this.props.outgoingRequests.map(OutgoingFriend => {
      return db.collection("profiles").doc(OutgoingFriend).get().then((document) => {
        if(document.data()) {
          this.setState({
            outgoingFriends: [...this.state.outgoingFriends, {displayName: document.data()!.displayName, uid: OutgoingFriend, photo: document.data()!.photo}]
          })
        }
      })
    })
  }

  componentDidUpdate(prevProps: MyProps) {

    if(this.props.incomingRequests !== prevProps.incomingRequests) {
      let oldLength = prevProps.incomingRequests.length;
      let newLength = this.props.incomingRequests.length;
      console.log(newLength+" "+oldLength);
      this.setState({
        incomingFriends: []
      })
        this.props.incomingRequests.map(IncomingFriend => {
          return db.collection("profiles").doc(IncomingFriend).get().then((document) => {
            if(document.data()) {
              this.setState({
                incomingFriends: [...this.state.incomingFriends, {displayName: document.data()!.displayName, uid: IncomingFriend, photo: document.data()!.photo}]
              })
            }
          })
        })
      if (newLength > oldLength) // likely new requests
        alert("New Friend Request");
    }
    if(this.props.outgoingRequests !== prevProps.outgoingRequests) {
      this.setState({
        outgoingFriends: []
      })
      this.props.outgoingRequests.map(async OutgoingFriend => {
        const document = await db.collection("profiles").doc(OutgoingFriend).get();
        if (document.data()) {
          this.setState({
            outgoingFriends: [...this.state.outgoingFriends, { displayName: document.data()!.displayName, uid: OutgoingFriend, photo: document.data()!.photo }]
          });
        }
    })
    }
  }

  render() {
    return (
      <IonModal isOpen={this.props.isPendingRequestsModalOpen} onDidDismiss={() => {this.props.togglePendingRequestsModal()}}>
        <IonHeader>
          <IonToolbar id='socialToolbar2'>
            <IonButtons slot='start'>
              <IonButton onClick={() => {this.props.togglePendingRequestsModal()}} id='addFriendModalCloseButton' fill='clear'>
                <IonIcon id='addFriendModalCloseIcon' icon={closeCircleOutline}/>
              </IonButton>
            </IonButtons>
            <IonTitle id="socialTitle2">
              Pending Requests
            </IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <h2 id='incomingFriendRequestHeader'>Incoming Friend Requests</h2>
          {this.state.incomingFriends.length !== 0 ? this.state.incomingFriends.map(IncomingFriend =>
            <IonItem key={IncomingFriend.uid}>
              <IonLabel>{IncomingFriend.displayName}</IonLabel>
              <IonButton onClick={() => {this.props.acceptFriend(IncomingFriend.uid)}} className='acceptButton' slot='end' fill='clear'>
                <IonIcon className='addIcon' icon={addCircleOutline} />
              </IonButton>
              <IonButton onClick={() => {this.props.declineFriend(IncomingFriend.uid)}} className='denyButton' slot='end' fill='clear'>
                <IonIcon className='denyIcon' icon={closeCircleOutline} />
              </IonButton>
            </IonItem>) : <IonLabel>You have no incoming Friend Requests</IonLabel>}

          <h2 id='outgoingFriendRequestHeader'>Outgoing Friend Requests</h2>
          {this.state.outgoingFriends.length !== 0 ? this.state.outgoingFriends.map(OutgoingFriend =>
            <IonItem key={OutgoingFriend.uid}>
              <IonLabel>{OutgoingFriend.displayName}</IonLabel>
              <IonButton onClick={() => {this.props.cancelOutgingRequest(OutgoingFriend.uid)}} className='denyButton' slot='end' fill='clear'>
                <IonIcon className='denyIcon' icon={closeCircleOutline} />
              </IonButton>
            </IonItem>) : <IonLabel>You have no outgoing Friend Requests</IonLabel>}
        </IonContent>
      </IonModal>
    )
  }

}

export default PendingRequests;
