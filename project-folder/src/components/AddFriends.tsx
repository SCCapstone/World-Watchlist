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
  addCircleOutline,
  checkmarkOutline
} from 'ionicons/icons'

type MyState = {
  targetUserId: string;
  friendRequestSent: boolean;
}

type MyProps = {
  history: any;
  location: any;
  isAddFriendModalOpen: boolean;
  addFriend: (targetUserId: string) => Promise<string>;
  toggleAddFriendModal: () => void;
}


class AddFriends extends React.Component<MyProps, MyState> {

  state: MyState = {
    targetUserId: '',
    friendRequestSent: false
  };

  constructor(props: MyProps) {
    super(props)
  }


  componentDidMount() {

  }

  componentWillUnmount() {

  }

  addFriendLogic() {
    this.props.addFriend(this.state.targetUserId).then((result) => {
      if(result) {
        this.setState({friendRequestSent: true})
      }
    }).catch((error: string) => {
      if(error) {
        this.setState({friendRequestSent: false})
        alert(error)
      }
    });
  }

  render() {
    return (
      <IonModal isOpen={this.props.isAddFriendModalOpen} onDidDismiss={this.props.toggleAddFriendModal}>
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
            <IonInput id='addFriendSearch' onIonChange={(e) => {this.setState({targetUserId: (e.target as HTMLInputElement).value, friendRequestSent: false})}} />
            <IonButton onClick={() => {this.addFriendLogic()}} slot='end' id='addFriendButton' fill='clear'>
              <IonIcon id='addFriendButtonIcon' icon={this.state.friendRequestSent ? checkmarkOutline : addCircleOutline} />
            </IonButton>
          </IonItem>

          <div className='addFriendWhiteSpace'/>
          {this.state.friendRequestSent ? <IonLabel className='friendRequestSent'>Friend Request sent to {this.state.targetUserId}</IonLabel> : undefined}

        </IonContent>
      </IonModal>
    )
  }

}

export default AddFriends;
