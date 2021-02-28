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

import './AddFriends.css'

import firebase, {db, auth} from '../firebase'
import Placeholder from '../images/placeholder.png'
import {
  closeCircleOutline,
  addCircleOutline
} from 'ionicons/icons'

type MyState = {
  targetUserId: string;
}

type MyProps = {
  history: any;
  location: any;
  isAddFriendModalOpen: boolean;
  addFriend: (targetUserId: string) => void;
  toggleAddFriendModal: () => void;
}


class AddFriends extends React.Component<MyProps, MyState> {

  state: MyState = {
    targetUserId: ''
  };

  constructor(props: MyProps) {
    super(props)
  }


  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render() {
    return (
      <IonModal isOpen={this.props.isAddFriendModalOpen}>
        <IonHeader>
          <IonToolbar class='socialToolbar2'>
            <IonButtons slot='start'>
              <IonButton onClick={() => {this.props.toggleAddFriendModal()}} id='addFriendModalCloseButton' fill='clear'>
                <IonIcon id='addFriendModalCloseIcon' icon={closeCircleOutline}/>
              </IonButton>
            </IonButtons>
            <IonTitle class='socialTitle2'>
              Add Friend
            </IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
        <IonLabel class='addFriendDescription'>
        Please input the email of the user you wish to add.
        </IonLabel>
          <IonItem lines='none' id='searchFriendItem'>
            <IonInput id='addFriendSearch' onIonChange={(e) => {this.setState({targetUserId: (e.target as HTMLInputElement).value})}} />
            <IonButton onClick={() => {this.props.addFriend(this.state.targetUserId)}} slot='end' id='addFriendButton' fill='clear'>
              <IonIcon id='addFriendButtonIcon' icon={addCircleOutline} />
            </IonButton>
          </IonItem>

        </IonContent>
      </IonModal>
    )
  }

}

export default AddFriends;
