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
  exitOutline,
  peopleOutline,
  settingsOutline,
  chevronDownOutline,
  pencilOutline,
  checkmarkOutline,
  addOutline
} from 'ionicons/icons'

type MyState = {
  articles: any,
  groupViewPopoverEvent: any,
  isGroupViewPopoverOpen: boolean,
  isSettingsModalOpen: boolean,
  isMembersModalOpen: boolean,
  isFriendsListModalOpen: boolean,
  isNicknameReadOnly: boolean,
  tempNickname: string
}

type MyProps = {
  history: any;
  location: any;
  groupDetails: GroupType;
  isGroupModalOpen: boolean;
  toggleGroupModal: any;
  leaveGroup: () => void,
  deleteGroup: () => void,
  currentUser: string,
  friendList: string[],
  addFriendToGroup: (friend : string, group: string) => void
}

type GroupType = {
  nickname: string;
  members: string[];
  id: string;
  profilePicture: string;
  owner: string;
}

class GroupView extends React.Component<MyProps, MyState> {

  state: MyState = {
    articles: [],
    groupViewPopoverEvent: undefined,
    isGroupViewPopoverOpen: false,
    isSettingsModalOpen: false,
    isMembersModalOpen: false,
    isFriendsListModalOpen: false,
    isNicknameReadOnly: true,
    tempNickname: this.props.groupDetails.nickname
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
      <div>
      <IonModal swipeToClose={false} isOpen={this.state.isMembersModalOpen}>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot = 'start'>
              <IonButton fill='clear' onClick={() => {this.setState({isMembersModalOpen: false})}}>
                <IonIcon className='groupViewIcon' icon={chevronDownOutline}/>
              </IonButton>
            </IonButtons>
            <IonTitle>Members</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonListHeader>Owner</IonListHeader>
          <IonList>
            <IonItem>
              <IonTitle>
                {this.props.groupDetails!.owner}
              </IonTitle>
            </IonItem>
          </IonList>
          <IonListHeader>Members ({this.props.groupDetails.members.length - 1}) </IonListHeader>
          <IonList>
            {
              this.props.groupDetails.members.map((member) => {
                return member !== this.props.groupDetails!.owner ?
                  <IonItem>
                    <IonTitle>
                      {member}
                    </IonTitle>
                  </IonItem>
                 : undefined
              })
            }
          </IonList>
        </IonContent>
      </IonModal>

      <IonModal swipeToClose={false} isOpen={this.state.isSettingsModalOpen}>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot = 'start'>
              <IonButton fill='clear' onClick={() => {this.setState({isSettingsModalOpen: false})}}>
                <IonIcon className='groupViewIcon' icon={chevronDownOutline}/>
              </IonButton>
            </IonButtons>
            <IonTitle>Group Settings</IonTitle>

          </IonToolbar>
        </IonHeader>
        <IonContent>
        {
          this.props.groupDetails.owner === this.props.currentUser ?
            <div>
              <IonItem>
                <IonTitle>Put group photo change here</IonTitle>
              </IonItem>
              <IonItem>
                <IonInput onIonChange={(e) => {this.setState({tempNickname: (e.target as HTMLInputElement).value})}} placeholder={this.props.groupDetails.nickname} readonly={this.state.isNicknameReadOnly} value={this.state.tempNickname}/>
                <IonButton onClick={
                  () => {this.setState({
                    isNicknameReadOnly: !this.state.isNicknameReadOnly
                  });
                  db.collection('groups').doc(this.props.groupDetails.id).update({
                    nickname: this.state.tempNickname
                  })
                }
                } slot='end' fill='clear'>
                  <IonIcon icon={this.state.isNicknameReadOnly ? pencilOutline : checkmarkOutline} />
                </IonButton>
              </IonItem>
              <IonItem onClick={() => {this.setState({isSettingsModalOpen: false}); this.props.deleteGroup()}}>
                Delete Group
              </IonItem>
            </div> : undefined
        }

        </IonContent>
      </IonModal>

      <IonModal swipeToClose={false} isOpen={this.state.isFriendsListModalOpen}>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot = 'start'>
            <IonButton fill='clear' onClick={() => {this.setState({isFriendsListModalOpen: false})}}>
              <IonIcon className='groupViewIcon' icon={chevronDownOutline}/>
            </IonButton>
          </IonButtons>
          <IonTitle>Add Member</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonListHeader>Friends ({this.props.friendList.length})</IonListHeader>
        <IonList>
          {
            this.props.friendList.map((friend) => {
              return (
                <IonItem>
                  <IonLabel>
                    {friend}
                  </IonLabel>
                  <IonButton onClick={() => {this.props.addFriendToGroup(friend, this.props.groupDetails.id)}} fill='clear'>
                    <IonIcon slot='end' icon={this.props.groupDetails.members.includes(friend) ? checkmarkOutline : addOutline}/>
                  </IonButton>
                </IonItem>
              )
            })
          }
        </IonList>
      </IonContent>
      </IonModal>

        <IonPopover
          cssClass='groupViewPopover'
          event={this.state.groupViewPopoverEvent}
          isOpen={this.state.isGroupViewPopoverOpen}
          onDidDismiss={() => {this.setState({isGroupViewPopoverOpen: false, groupViewPopoverEvent: undefined})}}
        >
          <IonContent>
            <IonList>
              <IonListHeader id='groupViewPopoverListHeader'><b>Group Options</b></IonListHeader>
              <IonItem button={true} onClick={() => {this.setState({isGroupViewPopoverOpen: false, isMembersModalOpen: true})}}>
                <IonLabel>Members</IonLabel>
                <IonIcon className='groupViewPopoverIcon' slot='end' icon={peopleOutline}/>
              </IonItem>
              <IonItem button={true}  onClick={() => {this.setState({isGroupViewPopoverOpen: false, isFriendsListModalOpen: true})}}>
                <IonLabel>Add Member</IonLabel>
                <IonIcon className='groupViewPopoverIcon' slot='end' icon={addOutline}/>
              </IonItem>
              <IonItem button={true}  onClick={() => {this.setState({isGroupViewPopoverOpen: false, isSettingsModalOpen: true})}}>
                <IonLabel>Settings</IonLabel>
                <IonIcon className='groupViewPopoverIcon' slot='end' icon={settingsOutline}/>
              </IonItem>
              <IonItem onClick={() => {this.setState({isGroupViewPopoverOpen: false}); this.props.leaveGroup()}} button={true}>
                <IonLabel id='leaveGroup'>Leave Group</IonLabel>
                <IonIcon id='groupViewPopoverLeave' slot='end' icon={exitOutline}/>
              </IonItem>

            </IonList>
          </IonContent>
        </IonPopover>

        <IonModal swipeToClose={true} isOpen={this.props.isGroupModalOpen}>
          <IonHeader>
            <IonToolbar>
              <IonButtons slot = 'start'>
                <IonButton fill='clear' onClick={() => {this.props.toggleGroupModal()}}>
                  <IonIcon className='groupViewIcon' icon={closeCircleOutline}/>
                </IonButton>
              </IonButtons>
              <IonButtons slot='end'>

              <IonAvatar onClick={(event : any) => {event.persist(); this.setState({isGroupViewPopoverOpen: true, groupViewPopoverEvent: event})}} className='groupViewProfilePicture'>
                {this.props.groupDetails ? <img src={this.props.groupDetails.profilePicture !== '' ? this.props.groupDetails.profilePicture : Placeholder} /> : undefined}
              </IonAvatar>


              </IonButtons>

              <IonTitle>{this.props.groupDetails ? this.props.groupDetails.nickname : undefined}</IonTitle>
            </IonToolbar>
          </IonHeader>
        </IonModal>
      </div>
    )
  }

}

export default GroupView;
