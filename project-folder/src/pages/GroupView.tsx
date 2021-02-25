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
  cloudUploadOutline,
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
  friendList: Friend[],
  addFriendToGroup: (friend : string, group: string) => void
}

type GroupType = {
  nickname: string;
  members: string[];
  id: string;
  profilePicture: string;
  owner: string;
}

type Friend = {
  uuid: string;
  uid: string;
  displayName: string;
  photo: string;
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
    tempNickname: this.props.groupDetails.nickname,
  };

  constructor(props: MyProps) {
    super(props)
    this.pullImage()

  }


  componentDidMount() {

  }

  componentWillUnmount() {

  }

   async pullImage() {
      if(auth.currentUser) {
      var storage = firebase.storage();
      var storageRef = firebase.storage().ref();
      var pathReference;
      var pathName = 'groupImages/' +this.props.groupDetails!.id+'.jpg';
      pathReference = storageRef.child(pathName);

        pathReference.getDownloadURL().then((url)=> {
         var img = document.getElementById('groupImage');
         if(img!=null)
          img.setAttribute('src', url);

      })
      .catch((error) => {
  // A full list of error codes is available at
  // https://firebase.google.com/docs/storage/web/handle-errors
  switch (error.code) {
    case 'storage/object-not-found':
    firebase.storage().ref().child('placeholder.png').getDownloadURL().then((url)=> {
         var img = document.getElementById('groupImg');
         if(img!=null)
          img.setAttribute('src', url);
      })

      break;
    case 'storage/unauthorized':
      // User doesn't have permission to access the object
      break;
    case 'storage/canceled':
      // User canceled the upload
      break;
    case 'storage/unknown':
      // Unknown error occurred, inspect the server response
      break;
  }
});


  }
}

  async uploadImage(selectorFiles: FileList)
    {
        if(selectorFiles[0]!=null) {
        var storageRef = firebase.storage().ref();
        var file = selectorFiles[0];
        var uid = this.props.groupDetails!.id;
        var newPicRef = storageRef.child('groupImages/' + uid+ '.jpg');
        newPicRef.put(file);
        await new Promise(r => setTimeout(r, 1000));
        var url = await newPicRef.getDownloadURL();


          db.collection('groups').doc(this.props.groupDetails.id).update({
          profilePicture: url
        })


        this.pullImage();

    }
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
          this.props.groupDetails.owner === auth.currentUser?.uid ?
            <div>
              <IonItem>
                Change Profile Picture
               <IonButtons slot = 'end'>

                  <IonButton id = 'submit'>

<input type="file" id = 'fileSelect' onChange={ (e) => (this.uploadImage(e.target.files!)) } />

 <IonIcon id = 'cloudUploadOutline' icon={cloudUploadOutline}/>
</IonButton>



        </IonButtons>
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
            this.props.friendList.map((FriendObj) => {
              return (
                <IonItem key={FriendObj.uid}>
                  <IonLabel>
                    {FriendObj.displayName}
                  </IonLabel>
                  <IonButton onClick={() => {this.props.addFriendToGroup(FriendObj.displayName, this.props.groupDetails.id)}} fill='clear'>
                    <IonIcon slot='end' icon={this.props.groupDetails.members.includes(FriendObj.uid) ? checkmarkOutline : addOutline}/>
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
                <img src = {this.props.groupDetails.profilePicture !== "" ? this.props.groupDetails.profilePicture : Placeholder}/>
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
