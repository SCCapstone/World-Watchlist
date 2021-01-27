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
  IonLabel,
  IonPopover,
  IonList,
  IonListHeader,
  IonAvatar
} from '@ionic/react'

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
import Messenger from './Messenger'


type MyState = {
  isAddFriendModalOpen: boolean;
  ourUsername: string;
  targetUsername: string;
  friendsList: string[];
  blockedFriends: string[];
  isPendingRequestsModalOpen: boolean;
  isMessengerModalOpen: boolean;
  incomingRequests: string[];
  outgoingRequests: string[];
  messageRef: string;
  isSocialPopoverOpen: boolean;
  socialPopoverEvent: any;
  isCreateGroupModalOpen: boolean;
  groupNickname: string;
  groupArray: Group[],
  numGroups: number,
  unsubscribeGroupArray: any[]
}

type MyProps = {
  history: any;
  location: any;
}

type Group = {
  nickname: string;
  members: string[];
  id: string;
  profilePicture: string;
}

class Social extends React.Component<MyProps, MyState> {
  realtime_db = firebase.database();
  state: MyState = {
    isAddFriendModalOpen: false,
    ourUsername: '',
    targetUsername: '',
    friendsList: [],
    blockedFriends: [],
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
    unsubscribeGroupArray: []
  };
  unsubscribeFriendsList: any;
  unsubscribeBlockedFriends: any;
  unsubscribeIncomingRequests: any;
  unsubscribeOutgoingRequests: any;
  unsubscribeGroups: any;


  constructor(props: MyProps) {
    super(props)

    //Begin Functin bindings

    this.addFriend = this.addFriend.bind(this);
    this.acceptFriend = this.acceptFriend.bind(this);
    this.declineFriend = this.declineFriend.bind(this);
    this.cancelOutgingRequest = this.cancelOutgingRequest.bind(this);
    this.toggleMessengerModal = this.toggleMessengerModal.bind(this);
    this.blockFriend = this.blockFriend.bind(this);
    this.unblockFriend = this.blockFriend.bind(this);
    this.generateUniqueGroupId = this.generateUniqueGroupId.bind(this);
    this.createGroup = this.createGroup.bind(this);
    //End Function Bindings

    //Begin firebase data subscriptins
    auth.onAuthStateChanged(() => {
      if(auth.currentUser) {
        //gets the username of our user
        db.collection("users").doc(auth.currentUser.uid).get().then(doc => {
          if(doc.data()) {
            console.log('social debug username: ' + doc.data()!.username)
            this.setState({ourUsername: doc.data()!.username})
            //creates a subscription to our user's friends list
            this.unsubscribeFriendsList = db.collection('friends').doc(this.state.ourUsername).onSnapshot((snapshot) => {
              if(snapshot.data()) {
                this.setState({friendsList: snapshot.data()!.friendsList})
              }
            })
            // create subscription to user's blocked friends list
            this.unsubscribeBlockedFriends = db.collection('blockedFriends').doc(this.state.ourUsername).onSnapshot((snapshot) => {
              if(snapshot.data()) {
                this.setState({blockedFriends: snapshot.data()!.blockedFriends})
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

            //crate a subscription to the list of a users groups
            this.unsubscribeGroups = db.collection('usernames').doc(this.state.ourUsername).onSnapshot((snapshot) => {
              if(snapshot.data()) {
                this.setState({
                  numGroups: snapshot.data()!.groups.length
                })
                let unsubscribeGroupArray = []
                for(let i = 0; i < this.state.numGroups; i++) {
                  let unsubscribeIndividualGroup = db.collection('groups').doc(snapshot.data()!.groups[i]).onSnapshot((snapshot) => {
                    let groupArray = [...this.state.groupArray]
                    if(snapshot.data()) {
                      let group : Group = {
                        nickname: snapshot.data()!.nickname,
                        members: snapshot.data()!.members,
                        id: snapshot.data()!.id,
                        profilePicture: snapshot.data()!.profilePicture
                      }
                      groupArray[i] = group
                      this.setState({groupArray: groupArray})
                      console.log(group)
                    }
                  })
                  unsubscribeGroupArray.push(unsubscribeIndividualGroup)
                }
                this.setState({
                  unsubscribeGroupArray: unsubscribeGroupArray
                })
              }

            })
          }
        })
      }
    })

    //End firebase data subscriptins

  }

  componentWillUnmount() {
    //since we have subscriptions, we cancel them here to prevent a memory leak
    this.unsubscribeFriendsList()
    this.unsubscribeBlockedFriends()
    this.unsubscribeIncomingRequests()
    this.unsubscribeOutgoingRequests()
    for(let i = 0; i < this.state.unsubscribeGroupArray.length; i++) {
      this.state.unsubscribeGroupArray[i]()
    }
  }

  subscribeGroups() {

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
      let friendMessageRef : any = new Object
      friendMessageRef[username] =  btoa(this.state.ourUsername + '|' + username)
      db.collection('friends').doc(this.state.ourUsername).update(
        friendMessageRef
      )
      let friendMessageRef2 : any = new Object
      friendMessageRef2[this.state.ourUsername] =  btoa(this.state.ourUsername + '|' + username)
      db.collection('friends').doc(username).update(
        friendMessageRef2
      )
      db.collection('friends').doc(this.state.ourUsername).update({
        friendsList: firebase.firestore.FieldValue.arrayUnion(username)
      })
      db.collection('friends').doc(username).update({
        friendsList: firebase.firestore.FieldValue.arrayUnion(this.state.ourUsername),
      })
      this.realtime_db.ref('/'+btoa(this.state.ourUsername + '|' + username)).push({message: 'This is the beginning of your message history.', sender: 'World-Watchlist'})
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

  blockFriend(username: string) { // adds given friend to blocked list, users on blocked list are excluded from stuff
    if(username != "") {
      let chosenFriend = db.collection('friends').doc(username);
      db.collection('blockedFriends').add(chosenFriend);
      // db.collection('friends').doc(username).delete() // remove user once added to blocked list, line included for future possibility
    }
  }

  unblockFriend(username: string) {
    if(username != "") {
      let chosenFriend = db.collection('blockedFriends').doc(username);
      // db.collection('friends').add(chosenFriend);
      db.collection('blockedFriends').doc(username).delete() // remove user once added to blocked list, line included for future possibility
    }
  }

  loadMessages(username: string) {

    db.collection('friends').doc(this.state.ourUsername).get().then((doc) => {
      if(doc.data()) {
        this.setState({messageRef: doc.get(username)})
        this.setState({isMessengerModalOpen: true})
      }
    })
  }

  toggleMessengerModal() {
    this.setState({isMessengerModalOpen: !this.state.isMessengerModalOpen})
  }

  async generateUniqueGroupId() : Promise<string> {
  let generateUniqueGroupIdPromise = new Promise<string>((resolve, reject) => {
      let code = Math.random().toString(36);
      db.collection('groudIds').doc(code).get().then((doc) => {
        if(!doc.exists) {
          resolve(code)
        } else {
          this.generateUniqueGroupId()
        }
      })
    })

    return await generateUniqueGroupIdPromise
  }

  createGroup() {
    this.generateUniqueGroupId().then((code) => {
      db.collection('groups').doc(code).set({
        owner: this.state.ourUsername,
        members: [this.state.ourUsername],
        nickname: this.state.groupNickname,
        id: code,
        profilePicture: ''
      })
      db.collection('usernames').doc(this.state.ourUsername).update({
        groups: firebase.firestore.FieldValue. arrayUnion(code),
      })
    })
  }


    render() {

      return (
      <IonPage>

        <IonModal isOpen={this.state.isAddFriendModalOpen}>
          <IonHeader>
            <IonToolbar>
              <IonButtons slot='start'>
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
              <IonButtons slot='start'>
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

        <IonModal isOpen={this.state.isMessengerModalOpen}>
          <Messenger {...this.props} messageRef={this.state.messageRef} toggleMessengerModal={this.toggleMessengerModal} username={this.state.ourUsername}/>
        </IonModal>

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
              <IonItem button={true}><IonLabel>New Message</IonLabel><IonIcon className='socialPopoverIcon' slot='end' icon={sendOutline}/></IonItem>
            </IonList>
          </IonContent>
        </IonPopover>

        <IonModal isOpen={this.state.isCreateGroupModalOpen}>
          <IonHeader>
            <IonToolbar>
            <IonButtons slot='start'>
              <IonButton onClick={() => {this.setState({isCreateGroupModalOpen: false})}} fill='clear'>
                <IonIcon id='closeCreateGroupModalIcon' icon={closeCircleOutline} />
              </IonButton>
            </IonButtons>
              <IonTitle>Create Group</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonInput className='createGroupInput' placeholder='Group Nickname' onIonChange={(e) => {this.setState({groupNickname: (e.target as HTMLInputElement).value})}}/>
            <IonButton onClick={() => {this.createGroup(); this.setState({isCreateGroupModalOpen: false})}} id='createGroupButton'>Create</IonButton>
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
              <IonButton onClick={(event : any) => {event.persist(); this.setState({isSocialPopoverOpen: true, socialPopoverEvent: event})}} fill='clear'>
                <IonIcon icon={addOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent>
        {
          this.state.friendsList.map(Friend =>
            <IonItem onClick={() => {this.loadMessages(Friend.toString())}} key={Friend.toString()}>
              <IonLabel>{Friend.toString()}</IonLabel>
            </IonItem>
        )}
        {
          this.state.groupArray.map((displayGroup : Group) => {
            return (
              <IonItem lines='none' button={true} className='socialGroupItem' key={displayGroup.id}>
                <IonAvatar slot='start' className='socialGroupAvatar'>
                  <img src={displayGroup.profilePicture !== '' ? displayGroup.profilePicture : Placeholder} />
                </IonAvatar>
                <IonLabel className='socialGroupLabel'>
                  {displayGroup.nickname}
                </IonLabel>

              </IonItem>
            )
          })
        }


        </IonContent>
      </IonPage>
      )
    }

}

export default Social
