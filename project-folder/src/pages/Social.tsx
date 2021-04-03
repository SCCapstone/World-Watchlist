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
  IonLabel,
  IonPopover,
  IonList,
  IonListHeader,
  IonAvatar,
  IonSegment,
  IonSegmentButton
} from '@ionic/react'

import GroupView from '../components/GroupView'
import Placeholder from '../images/placeholder.png'

import firebase, {db, auth} from '../firebase'
import {
  personAddOutline,
  closeCircleOutline,
  listOutline,
  addOutline,
  addCircleOutline,
  sendOutline
} from 'ionicons/icons'

import './Social.css'
import AddFriends from '../components/AddFriends';
import PendingRequests from '../components/PendingRequests';
import FriendView from '../components/FriendView'
import { article } from '../components/ArticleTypes';

type MyState = {
  isAddFriendModalOpen: boolean;
  subList: string[];
  profileToView: toView;
  toggleProfileModal:boolean;
  isProfileModalOpen: boolean;
  targetUsername: string;
  friendsList: Friend[];
  blockedUsers: [];
  isPendingRequestsModalOpen: boolean;
  isMessengerModalOpen: boolean;
  incomingRequests: string[];
  outgoingRequests: string[];
  messageRef: string;
  isSocialPopoverOpen: boolean;
  socialPopoverEvent: any;
  isCreateGroupModalOpen: boolean;
  groupNickname: string;
  groupArray: Group[];
  numGroups: number;
  unsubscribeGroupArray: any[];
  groupDetails: Group;
  isGroupModalOpen: boolean;
  segmentSelected: string | undefined;
  activeMessages: any[];
  isFriendModalOpen: boolean;
  friendDetails: Friend,
  ourUsername: string
}

type MyProps = {
  history: any;
  location: any;
  friendsList: Friend[];
  groupArray: Group[];
  ourUsername: string;
  incomingRequests: string[];
  outgoingRequests: string[];
  openShareModal: (theArticle: article, shouldOpen: boolean) => void;
}

type Group = {
  nickname: string;
  members: string[];
  id: string;
  profilePicture: string;
  owner: string;
  lastMessage: string;
  lastMessageSender: string;
}

type Friend = {
  uuid: string;
  uid: string;
  displayName: string;
  photo: string;
  lastMessage: string;
  lastMessageSender: string;
}

type toView = {
  uid: string;
  displayName: string;
  photo: string;
  subs: string[];
}

class Social extends React.Component<MyProps, MyState> {
  realtime_db = firebase.database();
  state: MyState = {
    profileToView: {
      uid:'',
      displayName:'',
      photo:'',
      subs:[],
    },
    subList:[""],
    isAddFriendModalOpen: false,
    isProfileModalOpen: false,
    targetUsername: '',
    friendsList: [],
    blockedUsers: [],
    isPendingRequestsModalOpen: false,
    isMessengerModalOpen: false,
    incomingRequests: [],
    outgoingRequests: [],
    messageRef: '',
    isSocialPopoverOpen: false,
    socialPopoverEvent: undefined,
    isCreateGroupModalOpen: false,
    groupNickname: '',
    groupArray: [],
    numGroups: 0,
    unsubscribeGroupArray: [],
    groupDetails: {
      nickname: '',
      members: [],
      id: '',
      profilePicture: '',
      owner: '',
      lastMessage: '',
      lastMessageSender: ''
    },
    friendDetails: {
      uuid: '',
      uid: '',
      displayName: '',
      photo: '',
      lastMessage: '',
      lastMessageSender: ''
    },
    isGroupModalOpen: false,
    segmentSelected: 'groups',
    activeMessages: [],
    isFriendModalOpen: false,
    ourUsername: '',
    toggleProfileModal:false
  };


  unsubscribeGroups: any;


  constructor(props: MyProps) {
    super(props)


    //Begin Functin bindings

    this.addFriend = this.addFriend.bind(this);
    this.acceptFriend = this.acceptFriend.bind(this);
    this.declineFriend = this.declineFriend.bind(this);
    this.removeFriend = this.removeFriend.bind(this);
    this.setSenderToView = this.setSenderToView.bind(this);
    this.blockUser = this.blockUser.bind(this);
    this.cancelOutgingRequest = this.cancelOutgingRequest.bind(this);
    this.generateUniqueFriendId = this.generateUniqueFriendId.bind(this);
    this.generateUniqueGroupId = this.generateUniqueGroupId.bind(this);
    this.createGroup = this.createGroup.bind(this);
    this.toggleGroupModal = this.toggleGroupModal.bind(this);
    this.deleteGroup = this.deleteGroup.bind(this);
    this.leaveGroup = this.leaveGroup.bind(this);
    this.toggleGroupModal = this.toggleGroupModal.bind(this);
    this.toggleProfileModal = this.toggleProfileModal.bind(this);
    this.toggleAddFriendModal = this.toggleAddFriendModal.bind(this);
    this.togglePendingRequestsModal = this.togglePendingRequestsModal.bind(this);
    this.addFriendToGroup = this.addFriendToGroup.bind(this);
    this.generateRandomString = this.generateRandomString.bind(this);
    this.toggleFriendModal = this.toggleFriendModal.bind(this);
    //End Function Bindings

    //Begin firebase data subscriptins


    //End firebase data subscriptins

  }


  openProfileModal(s:string) {

  }

  subscribeGroups() {

  }

  async setSenderToView(uid:string) {

    console.log(firebase.auth().currentUser!.uid)
    //if(firebase.auth().currentUser!.uid == uid) // It's you
    var temp = [""];


    db.collection('profiles').doc(uid).get().then(async (doc)=> {
      if(doc.data()) {
    this.setState({isProfileModalOpen:true})
  }
    await db.collection('topicSubscription').doc(uid).onSnapshot((snapshot) => {
      if(snapshot.data())
     this.setState({subList:snapshot.data()!.subList})


    })
    console.log(this.state.subList)
    var friendName = "";
    var photoName = "";

     await db.collection("profiles").doc(uid).get().then(doc => {
       if(doc.data()) {
       friendName = doc.data()!.displayName;
       photoName = doc.data()!.photo;
     }

     })
    this.setState({profileToView: {
        uid:uid,
        displayName:friendName,
        photo:photoName,
        subs:this.state.subList
      }})
    db.collection('profiles').doc(uid).get().then(doc=>{

     // lastMessageSender: this.props.ourUsername
    })

})
  }


  async addFriend(email: string) : Promise<string> { //sends a friend request to a user
    const addFriendPromise : Promise<string> = new Promise((resolve, reject) => {
        if(email !== "" && email !== auth.currentUser?.email) {
          db.collection('emails').doc(email).get().then(document => {
            if(document.exists) {
              db.collection('incomingFriendRequests').doc(document.data()!.userid).update({
                incomingFriendRequests: firebase.firestore.FieldValue.arrayUnion(auth.currentUser?.uid)
              })
              db.collection('outgoingFriendRequests').doc(auth.currentUser?.uid).update({
                outgoingFriendRequests: firebase.firestore.FieldValue.arrayUnion(document.data()!.userid)
              })
              resolve("Success")
            } else {
              reject("User email not found");
            }
          })
        } else {
          if ( email === "") {
            reject("String was empty");
        } else {
            reject("You cannot enter your own email");
        }
      }
    })
    return addFriendPromise
  }

  cancelOutgingRequest(targetUserId: string) {
    if(targetUserId !== "" && targetUserId !== auth.currentUser?.email) {
      db.collection('incomingFriendRequests').doc(targetUserId).update({
        incomingFriendRequests: firebase.firestore.FieldValue.arrayRemove(auth.currentUser?.uid)
      })
      db.collection('outgoingFriendRequests').doc(auth.currentUser?.uid).update({
        outgoingFriendRequests: firebase.firestore.FieldValue.arrayRemove(targetUserId)
      })
    }
  }

  generateRandomString(length: number) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_~';
    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  async generateUniqueFriendId() : Promise<string> {
  let generateUniqueFriendIdPromise = new Promise<string>((resolve, reject) => {
      let code = this.generateRandomString(50)
      db.collection('friendIds').doc(code).get().then((doc) => {
        if(!doc.exists) {
          db.collection('friendIds').doc(code).set({
            inUse: true
          })
          resolve(code)
        } else {
          if(!doc.data()?.inUse) {
            db.collection('friendIds').doc(code).set({
              inUse: true
            })
          } else {
            this.generateUniqueFriendId()
          }
        }
      })
    })
    return await generateUniqueFriendIdPromise
  }

  async generateUniqueGroupId() : Promise<string> {
    let generateUniqueGroupIdPromise = new Promise<string>((resolve, reject) => {
        let code = this.generateRandomString(50)
        db.collection('groudIds').doc(code).get().then((doc) => {
          if(!doc.exists) {
            db.collection('groupIds').doc(code).set({
              inUse: true
            })
            resolve(code)
          } else {
            if(!doc.data()?.inUse) {
              db.collection('groupIds').doc(code).set({
                inUse: true
              })
            } else {
              this.generateUniqueGroupId()
            }
          }
        })
      })

      return await generateUniqueGroupIdPromise
  }

  acceptFriend(targetUserId: string) {
    //accepts a friend request from a user
    //generates a friend UUID that can uniquely identify this friend pair
    if(targetUserId != "") { //ensure we are not calling firebase path with empty string
      this.generateUniqueFriendId().then((uniqueFriendId : string) => {
        //remove incoming and outgoing friend requests
        db.collection('outgoingFriendRequests').doc(targetUserId).update({
          outgoingFriendRequests: firebase.firestore.FieldValue.arrayRemove(auth.currentUser?.uid),
        })
        db.collection('incomingFriendRequests').doc(auth.currentUser?.uid).update({
          incomingFriendRequests: firebase.firestore.FieldValue.arrayRemove(targetUserId),
        })
        db.collection('friends').doc(auth.currentUser?.uid).update({
          friendsList: firebase.firestore.FieldValue.arrayUnion(targetUserId)
        })
        db.collection('friends').doc(targetUserId).update({
          friendsList: firebase.firestore.FieldValue.arrayUnion(auth.currentUser?.uid)
        })
        //set unique friend uuid pair for messaging
        db.collection('friends').doc(auth.currentUser?.uid).collection('uuids').doc(targetUserId).set({
          uuid: uniqueFriendId,
          friend: targetUserId,
          lastMessage: 'Join the conversation! Send a message here to get started.',
          lastMessageSender: 'World-Watchlist'
        })
        db.collection('friends').doc(targetUserId).collection('uuids').doc(auth.currentUser?.uid).set({
          uuid: uniqueFriendId,
          friend: auth.currentUser?.uid,
          lastMessage: 'Join the conversation! Send a message here to get started.',
          lastMessageSender: 'World-Watchlist'
        })
        let timestamp = Date.now()
        this.realtime_db.ref(uniqueFriendId).child(timestamp.toString()).set({message: 'Join the conversation! Send a message here to get started.', sender: 'World-Watchlist', read: [{readBy: auth.currentUser?.email, readAt: timestamp.toString()}], time: timestamp, isArticle: false})
      })
    }
  }

  declineFriend(targetUserId: string) { //declines a friend request from a user
    if(targetUserId != "") {
      db.collection('outgoingFriendRequests').doc(targetUserId).update({
        outgoingFriendRequests: firebase.firestore.FieldValue.arrayRemove(auth.currentUser?.uid),
      })
      db.collection('incomingFriendRequests').doc(auth.currentUser?.uid).update({
        incomingFriendRequests: firebase.firestore.FieldValue.arrayRemove(targetUserId),
      })
    }
  }

  removeFriend(targetUserId: string) { //removes a user from friend list
    if(targetUserId != "") {
      db.collection('friends').doc(auth.currentUser?.uid).collection('uuids').doc(targetUserId).get().then((document) => {
        db.collection('friendIds').doc(document.data()!.uuid).update({
          inUse: false
        })
        db.collection('friends').doc(auth.currentUser?.uid).collection('uuids').doc(targetUserId).delete()
        db.collection('friends').doc(targetUserId).collection('uuids').doc(auth.currentUser?.uid).delete()
        db.collection('friends').doc(auth.currentUser?.uid).update({
          friendsList: firebase.firestore.FieldValue.arrayRemove(targetUserId)
        })
        db.collection('friends').doc(targetUserId).update({
          friendsList: firebase.firestore.FieldValue.arrayRemove(auth.currentUser?.uid)
        })
        this.setState({isFriendModalOpen: false})
      })
    }
  }

  blockUser(userid: string) { // adds given friend to blocked list, users on blocked list are excluded from stuff
    if(userid !== "") {
      // assuming userid exists
      // let chosenUser = db.collection('usernames').doc(username);
      // let chosenUser = db.collection('email').doc(userid).get().then(docData => {
      //   if (docData.exists)
      //     return docData.data()?.userid}).catch(catchData => console.log("Data crash!"));
      // if( chosenUser === undefined)
      //   return;
      console.log("User exists, attempting to block");
      db.collection('blockedUsers').doc(auth.currentUser?.uid).update({blocked: firebase.firestore.FieldValue.arrayUnion(userid)});
      console.log("User should be added to blocked list");
      /*if ( this.isFriend(username))
       *  this.removeFriend(username); // remove user once added to blocked list, line included for future possibility
       */
    }
  }

  exists(username: string) {
    return username !== "" //&& db.collection('usernames').doc(username) !== undefined
  }

  createGroup() {
    this.generateUniqueGroupId().then((code) => {
      db.collection('groups').doc(code).set({
        owner: auth.currentUser?.uid,
        members: [auth.currentUser?.uid],
        nickname: this.state.groupNickname,
        id: code,
        profilePicture: '',
        lastMessage: 'Join the conversation! Send a message here to get started.',
        lastMessageSender: 'World-Watchlist'
      })
      db.collection('profiles').doc(auth.currentUser?.uid).update({
        groups: firebase.firestore.FieldValue. arrayUnion(code),
      })
      let timestamp = Date.now()
      this.realtime_db.ref(code).child(timestamp.toString()).set({content: 'Join the conversation! Send a message here to get started.', sender: 'World-Watchlist', read: [{readBy: auth.currentUser?.email, readAt: timestamp.toString()}], time: timestamp, isArticle: false})
    })

  }

  leaveGroup() {
    //function is intended to be called from the groupView page
    //1 remove our user from the group collection
    //2 remove the group from the user collection

    //1
    if(auth.currentUser?.uid !== this.state.groupDetails.owner) {
      //user is not the owner of the group, can simply leave.
      db.collection('groups').doc(this.state.groupDetails.id).update({
        members: firebase.firestore.FieldValue.arrayRemove(auth.currentUser?.uid)
      })

    } else {
      //user is the host of the group
      if(this.state.groupDetails.members.length === 1) {
        //user is the only member in the group. delete the group.
        this.deleteGroup()
      } else {
        //user is the host but there are other members in the group. user is not deleting the group.
        if(this.state.groupDetails.members[0] !== auth.currentUser?.uid) {
            db.collection('groups').doc(this.state.groupDetails.id).update({
              owner: this.state.groupDetails.members[0],
              members: firebase.firestore.FieldValue.arrayRemove(auth.currentUser?.uid)

            })
        } else {
          db.collection('groups').doc(this.state.groupDetails.id).update({
            owner: this.state.groupDetails.members[1],
            members: firebase.firestore.FieldValue.arrayRemove(auth.currentUser?.uid)
          })
        }
      }
    }
    //2
    db.collection('profiles').doc(auth.currentUser?.uid).update({
      groups: firebase.firestore.FieldValue.arrayRemove(this.state.groupDetails.id)
    })
    this.setState({isGroupModalOpen: false})
  }

  deleteGroup() {
    //delete a group
    //intended to be used from the groupView page
    if(auth.currentUser?.uid === this.state.groupDetails.owner) {
      this.state.groupDetails.members.forEach((member) => {
        db.collection('profiles').doc(member).update({
          groups: firebase.firestore.FieldValue.arrayRemove(this.state.groupDetails.id)
        })
        db.collection('groups').doc(this.state.groupDetails.id).delete()
      })
      this.setState({
        isGroupModalOpen: false
      })
    } else {
      console.log('User should not be able to use this function')
    }

  }

  addFriendToGroup(targetUid: string, group: string) {
    db.collection('profiles').doc(targetUid).update({
      groups: firebase.firestore.FieldValue.arrayUnion(group)
    })
    db.collection('groups').doc(group).update({
      members: firebase.firestore.FieldValue.arrayUnion(targetUid)
    })
  }

  toggleGroupModal() {
    this.setState({isGroupModalOpen: /*!this.state.isGroupModalOpen*/false})
  }
  toggleProfileModal(){
    this.setState({isProfileModalOpen:false})
  }
  toggleAddFriendModal() {
    this.setState({isAddFriendModalOpen: /*!this.state.isAddFriendModalOpen*/false})
  }
  togglePendingRequestsModal() {
    this.setState({isPendingRequestsModalOpen: /*!this.state.isPendingRequestsModalOpen*/false})
  }
  toggleFriendModal() {
    this.setState({isFriendModalOpen: /*!this.state.isFriendModalOpen*/false})
  }






    render() {

      let groupState = "group";
      return (
      <IonPage>
        <AddFriends
          {...this.props}
          isAddFriendModalOpen={this.state.isAddFriendModalOpen}
          toggleAddFriendModal={this.toggleAddFriendModal}
          addFriend={this.addFriend}
        />

        <PendingRequests
          {...this.props}
          incomingRequests = {this.props.incomingRequests}
          outgoingRequests = {this.props.outgoingRequests}
          acceptFriend = {this.acceptFriend}
          declineFriend = {this.declineFriend}
          cancelOutgingRequest = {this.cancelOutgingRequest}
          isPendingRequestsModalOpen = {this.state.isPendingRequestsModalOpen}
          togglePendingRequestsModal = {this.togglePendingRequestsModal}

        />

        <GroupView
          isGroupModalOpen={this.state.isGroupModalOpen}
          groupDetails={this.state.groupDetails}
          {...this.props}
          toggleGroupModal={this.toggleGroupModal}
          leaveGroup={this.leaveGroup}
          deleteGroup={this.deleteGroup}
          friendList={this.props.friendsList}
          addFriendToGroup={this.addFriendToGroup}
          ourUsername={this.props.ourUsername}
          openShareModal={this.props.openShareModal}
        />

        <FriendView
          {...this.props}
          friendDetails = {this.state.friendDetails}
          isFriendModalOpen = {this.state.isFriendModalOpen}
          toggleFriendModal = {this.toggleFriendModal}
          removeFriend = {this.removeFriend}
          ourUsername={this.props.ourUsername}
          isProfileModalOpen={this.state.isProfileModalOpen}
          toggleProfileModal={this.state.toggleProfileModal}
          setSenderToView={this.setSenderToView}
          openShareModal={this.props.openShareModal}
        />


        <IonPopover
          cssClass='socialPopover'
          event={this.state.socialPopoverEvent}
          isOpen={this.state.isSocialPopoverOpen}
          onDidDismiss={() => {this.setState({isSocialPopoverOpen: false, socialPopoverEvent: undefined})}}
        >
          <IonContent>
            <IonList>
              <IonListHeader id='socialPopoverListHeader'><b>Social Options</b></IonListHeader>
              <IonItem button={true} onClick={() => {this.setState({isSocialPopoverOpen: false, isAddFriendModalOpen: true})}}><IonLabel>Add Friend</IonLabel><IonIcon className='socialPopoverIcon' slot='end' icon={personAddOutline}/></IonItem>
              <IonItem button={true}  onClick={() => {this.setState({isSocialPopoverOpen: false, isCreateGroupModalOpen: true})}}><IonLabel>Create Group</IonLabel><IonIcon className='socialPopoverIcon' slot='end' icon={addCircleOutline}/></IonItem>
              {/* <IonItem button={true}><IonLabel>New Message</IonLabel><IonIcon className='socialPopoverIcon' slot='end' icon={sendOutline}/></IonItem> */}
            </IonList>
          </IonContent>
        </IonPopover>

        <IonModal isOpen={this.state.isCreateGroupModalOpen} onDidDismiss={() => {this.setState({isCreateGroupModalOpen: false})}}>
          <IonHeader>
            <IonToolbar class='socialToolbar2'>
            <IonButtons slot='start'>
              <IonButton onClick={() => {this.setState({isCreateGroupModalOpen: false})}} fill='clear'>
                <IonIcon id='closeCreateGroupModalIcon' icon={closeCircleOutline} />
              </IonButton>
            </IonButtons>
              <IonTitle class='socialTitle2'>Create Group</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonInput className='createGroupInput' placeholder='Group Nickname' onIonChange={(e) => {this.setState({groupNickname: (e.target as HTMLInputElement).value})}}/>
            <IonButton onClick={() => {this.createGroup(); this.setState({isCreateGroupModalOpen: false})}} id='createGroupButton'>Create</IonButton>
          </IonContent>
        </IonModal>

        <IonHeader>
          <IonToolbar class='socialToolbar'>
            <IonTitle class='socialTitle'>
              Social
            </IonTitle>
            <IonButtons slot="start">
              <IonButton class='socialHeaderButton' onClick={() => {this.setState({isPendingRequestsModalOpen: true})}}  fill='clear'>
                <IonIcon icon={listOutline}/>
              </IonButton>
            </IonButtons>
            <IonButtons slot='end'>
              <IonButton class='socialHeaderButton' onClick={(event : any) => {event.persist(); this.setState({isSocialPopoverOpen: true, socialPopoverEvent: event})}} fill='clear'>
                <IonIcon icon={addOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent>
        <IonSegment onIonChange={e => this.setState({segmentSelected: e.detail.value})} value={this.state.segmentSelected}>
          <IonSegmentButton value='groups'>
            <IonLabel>Groups</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value='friends'>
            <IonLabel>Friends</IonLabel>
          </IonSegmentButton>
        </IonSegment>
        {
          this.state.segmentSelected === 'groups' ?
          <div>{
            this.props.groupArray.map((displayGroup : Group) => {
              return (
                <IonItem onClick={() => {this.setState({groupDetails: displayGroup, isGroupModalOpen: true})}} lines='none' button={true} className='socialGroupItem' key={displayGroup.id}>
                  <IonAvatar slot='start' className='socialGroupAvatar'>
                    <img src = {displayGroup.profilePicture ? displayGroup.profilePicture : Placeholder}/>
                  </IonAvatar>
                  <div className='messagePreview'>
                    <IonLabel className='socialGroupLabel'>
                      {displayGroup.nickname}
                    </IonLabel>
                    <IonLabel className='socialGroupMessagePreview'>{displayGroup.lastMessage}</IonLabel>
                  </div>
                </IonItem>
              )
            })
          }
        </div> :
        <div>
        {this.props.friendsList.map((friend: Friend) => {
          return (
            <IonItem onClick={() => {this.setState({friendDetails: friend, isFriendModalOpen: true})}} lines='none' button={true} className='socialGroupItem' key={friend.uid}>
              <IonAvatar slot='start' className='socialGroupAvatar'>
                <img src = {friend.photo ? friend.photo : Placeholder}/>
              </IonAvatar>
              <div className='messagePreview'>
                <IonLabel className='socialGroupLabel'>
                  {friend.displayName}
                </IonLabel>
                <IonLabel className='socialGroupMessagePreview'>{friend.lastMessage}</IonLabel>
              </div>

            </IonItem>
            )
          })
      }
        </div>
      }

      <IonModal isOpen={this.state.isProfileModalOpen} onDidDismiss={() => {this.setState({isProfileModalOpen: false})}}>
        <IonHeader>
          <IonToolbar class='settingsToolbar2'>
            <IonButtons>
              <IonButton onClick={() => {this.setState({isProfileModalOpen: false})}} id='toBlock' fill='clear'>
              <IonIcon id='closeBlockIcon' icon={closeCircleOutline}/>
              </IonButton>
            </IonButtons>

            <IonTitle class='settingsTitle2'>
            <IonAvatar class = "image-center">
          <img src = {this.state.profileToView.photo !== '' ?this.state.profileToView.photo : Placeholder}/>
        </IonAvatar>

            </IonTitle><IonTitle class = "image-center">{this.state.profileToView.displayName}</IonTitle>
            </IonToolbar>

          </IonHeader>
          <IonItem>

          <IonLabel class = "colored">Topic Subscriptions</IonLabel>
          </IonItem>
        <IonContent>

        <ul id = "blockedList"></ul>
          {
            this.state.profileToView.subs.map(Blocked =>
              <IonItem key = {Blocked.toString()}>
              <IonItem class = 'blockedListEntry'>{Blocked.toString()}</IonItem>
              </IonItem>
            )}

        </IonContent>
      </IonModal>


        </IonContent>
      </IonPage>
      )
    }

}

export default Social
