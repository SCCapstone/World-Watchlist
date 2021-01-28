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
  IonAvatar
} from '@ionic/react'

import './GroupView.css'

import firebase, {db, auth} from '../firebase'
import Placeholder from '../images/placeholder.png'
import {closeCircleOutline} from 'ionicons/icons'

type MyState = {

}

type MyProps = {
  history: any;
  location: any;
  groupDetails: GroupType | undefined;
  isGroupModalOpen: boolean;
  toggleGroupModal: any;
}

type GroupType = {
  nickname: string;
  members: string[];
  id: string;
  profilePicture: string;
}

class GroupView extends React.Component<MyProps, MyState> {

  state: MyState = {
    articles: [],
    unsubscribeArticles: undefined
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
      <IonModal swipeToClose={true} isOpen={this.props.isGroupModalOpen}>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot = 'start'>
              <IonButton fill='clear' onClick={() => {this.props.toggleGroupModal()}}>
                <IonIcon className='groupViewIcon' icon={closeCircleOutline}/>
              </IonButton>
            </IonButtons>
            <IonButtons slot='end'>

            <IonAvatar className='groupViewProfilePicture'>
              {this.props.groupDetails ? <img src={this.props.groupDetails.profilePicture !== '' ? this.props.groupDetails.profilePicture : Placeholder} /> : undefined}
            </IonAvatar>


            </IonButtons>

            <IonTitle>{this.props.groupDetails ? this.props.groupDetails.nickname : undefined}</IonTitle>
          </IonToolbar>
        </IonHeader>
      </IonModal>
    )
  }

}

export default GroupView;
