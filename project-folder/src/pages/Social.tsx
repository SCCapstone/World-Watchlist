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
  IonItemGroup
} from '@ionic/react'

import GroupView from './GroupView'
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
  unsubscribeFriendsList: any;
  unsubscribeBlockedUsers: any;
  unsubscribeIncomingRequests: any;
  unsubscribeOutgoingRequests: any;
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
  owner: string;
}

class Social extends React.Component<MyProps, MyState> {
  realtime_db = firebase.database();
  state: MyState = {
    isAddFriendModalOpen: false,
    ourUsername: '',
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
      owner: ''
    },
    isGroupModalOpen: false,
    unsubscribeFriendsList: () => {},
    unsubscribeBlockedUsers: null,
    unsubscribeIncomingRequests: () => {},
    unsubscribeOutgoingRequests: () => {}
  };


  unsubscribeGroups: any;


  constructor(props: MyProps) {
    super(props)


    //Begin Functin bindings

    this.addFriend = this.addFriend.bind(this);
    this.acceptFriend = this.acceptFriend.bind(this);
    this.declineFriend = this.declineFriend.bind(this);
    this.removeFriend = this.removeFriend.bind(this);
    this.blockUser = this.blockUser.bind(this);
    this.cancelOutgingRequest = this.cancelOutgingRequest.bind(this);
    this.toggleMessengerModal = this.toggleMessengerModal.bind(this);
    this.generateUniqueGroupId = this.generateUniqueGroupId.bind(this);
    this.createGroup = this.createGroup.bind(this);
    this.toggleGroupModal = this.toggleGroupModal.bind(this);
    this.deleteGroup = this.deleteGroup.bind(this);
    this.leaveGroup = this.leaveGroup.bind(this);
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
            let unsubscribeFriendsList = db.collection('friends').doc(this.state.ourUsername).onSnapshot((snapshot) => {
              if(snapshot.data()) {
                this.setState({friendsList: snapshot.data()!.friendsList})
              }
            })

            // create subscription to user's blocked users list
            this.state.unsubscribeBlockedUsers = db.collection('blockedUsers').doc(this.state.ourUsername).onSnapshot((snapshot) => {
              if(snapshot.exists && snapshot.data()!.blocked !== undefined) {
                this.setState({blockedUsers: snapshot.data()!.blocked})
              } else {
                db.collection("blockedUsers").doc(this.state.ourUsername).set({blocked: []})
                this.setState({blockedUsers: []})
              }
            })

            //creates a subscription to our user's incoming friend requests
            let unsubscribeIncomingRequests = db.collection('incomingFriendRequests').doc(this.state.ourUsername).onSnapshot((snapshot) => {
              if(snapshot.data()) {
                this.setState({incomingRequests: snapshot.data()!.incomingFriendRequests})
              }
            })

            //creates a subscription to our user's outgoing friend requests
            let unsubscribeOutgoingRequests = db.collection('outgoingFriendRequests').doc(this.state.ourUsername).onSnapshot((snapshot) => {
              if(snapshot.data()) {
                this.setState({outgoingRequests: snapshot.data()!.outgoingFriendRequests})
              }
            })

            //crate a subscription to the list of a users groups
            this.unsubscribeGroups = db.collection('usernames').doc(this.state.ourUsername).onSnapshot((snapshot) => {
              if(snapshot.data()) {
                this.setState({
                  numGroups: snapshot.data()!.groups.length,
                  groupArray: []
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
                        profilePicture: snapshot.data()!.profilePicture,
                        owner: snapshot.data()!.owner
                      }
                      groupArray[i] = group
                      this.setState({groupArray: groupArray})
                      if(this.state.groupDetails.id === group.id) {
                        this.setState({groupDetails: group})
                      }
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

            this.setState({
              unsubscribeFriendsList: unsubscribeFriendsList,
              unsubscribeIncomingRequests: unsubscribeIncomingRequests,
              unsubscribeOutgoingRequests: unsubscribeOutgoingRequests
            })
          }
        })
      }
    })

    //End firebase data subscriptins

  }

  componentWillUnmount() {
    //since we have subscriptions, we cancel them here to prevent a memory leak
    this.state.unsubscribeFriendsList()
    this.state.unsubscribeIncomingRequests()
    this.state.unsubscribeOutgoingRequests()
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

  removeFriend(username: string) {
    console.log("Removing friend "+username);
    if (username !== "")
      if (this.state.friendsList.includes(username)) {
        let friends = db.collection('friends');
        friends.doc(this.state.ourUsername).update({friendsList: firebase.firestore.FieldValue.arrayRemove(username)});
        friends.doc(username).update({friendsList: firebase.firestore.FieldValue.arrayRemove(this.state.ourUsername)})
        friends.doc(this.state.ourUsername).update({[username]: firebase.firestore.FieldValue.delete()})
        friends.doc(username).update({[this.state.ourUsername]: firebase.firestore.FieldValue.delete()})
        console.log("Successfully removed friend");
      }
  }

  blockUser(username: string) { // adds given friend to blocked list, users on blocked list are excluded from stuff
    if(username !== "") {
      let chosenUser = db.collection('usernames').doc(username);
      if( chosenUser === undefined)
        return;
      console.log("User exists, attempting to block");
      db.collection('blockedUsers').doc(this.state.ourUsername).update({blocked: firebase.firestore.FieldValue.arrayUnion(username)});
      console.log("User should be added to blocked list");
      /*if ( this.isFriend(username))
       *  this.removeFriend(username); // remove user once added to blocked list, line included for future possibility
       */
    }
  }
  isFriend(username: string) {
    return username !== "" && this.state.friendsList.includes(username);
  }
  exists(username: string) {
    return username !== "" //&& db.collection('usernames').doc(username) !== undefined
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

  leaveGroup() {
    //function is intended to be called from the groupView page
    //1 remove our user from the group collection
    //2 remove the group from the user collection

    //1
    if(this.state.ourUsername !== this.state.groupDetails.owner) {
      //user is not the owner of the group, can simply leave.
      db.collection('groups').doc(this.state.groupDetails.id).update({
        members: firebase.firestore.FieldValue.arrayRemove(this.state.ourUsername)
      })

    } else {
      //user is the host of the group
      if(this.state.groupDetails.members.length === 1) {
        //user is the only member in the group. delete the group.
        this.deleteGroup()
      } else {
        //user is the host but there are other members in the group. user is not deleting the group.
        if(this.state.groupDetails.members[0] !== this.state.ourUsername) {
            db.collection('groups').doc(this.state.groupDetails.id).update({
              owner: this.state.groupDetails.members[0],
              members: firebase.firestore.FieldValue.arrayRemove(this.state.ourUsername)

            })
        } else {
          db.collection('groups').doc(this.state.groupDetails.id).update({
            owner: this.state.groupDetails.members[1],
            members: firebase.firestore.FieldValue.arrayRemove(this.state.ourUsername)
          })
        }
      }
    }
    //2
    db.collection('usernames').doc(this.state.ourUsername).update({
      groups: firebase.firestore.FieldValue.arrayRemove(this.state.groupDetails.id)
    })
    this.setState({isGroupModalOpen: false})
  }

  deleteGroup() {
    //delete a group
    //intended to be used from the groupView page
    if(this.state.ourUsername === this.state.groupDetails.owner) {
      this.state.groupDetails.members.forEach((member) => {
        db.collection('usernames').doc(member).update({
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

  addFriendToGroup(friend: string, group: string) {
    db.collection('usernames').doc(friend).update({
      groups: firebase.firestore.FieldValue.arrayUnion(group)
    })
    db.collection('groups').doc(group).update({
      members: firebase.firestore.FieldValue.arrayUnion(friend)
    })
  }

  toggleGroupModal() {
    this.setState({isGroupModalOpen: !this.state.isGroupModalOpen})
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
            <IonItemGroup>
            <IonItem button slot="start" onClick={() => {this.loadMessages(Friend.toString())}} key={Friend.toString()}>
              <IonLabel>{Friend.toString()}</IonLabel>
            </IonItem>
              <IonItem button slot="end" onClick={() => {this.removeFriend(Friend)}}>Remove Friend</IonItem>
              <IonButton onClick={() => {this.blockUser(Friend)}}>Block Friend</IonButton>
            </IonItemGroup>
        )}
        <GroupView
          isGroupModalOpen={this.state.isGroupModalOpen}
          groupDetails={this.state.groupDetails}
          {...this.props}
          toggleGroupModal={this.toggleGroupModal}
          leaveGroup={this.leaveGroup}
          deleteGroup={this.deleteGroup}
          currentUser={this.state.ourUsername}
          friendList={this.state.friendsList}
          addFriendToGroup={this.addFriendToGroup}
        />
        {
          this.state.groupArray.map((displayGroup : Group) => {
            return (
              <IonItem onClick={() => {this.setState({groupDetails: displayGroup, isGroupModalOpen: true})}} lines='none' button={true} className='socialGroupItem' key={displayGroup.id}>
                <IonAvatar slot='start' className='socialGroupAvatar'>
                  <img src = {displayGroup.profilePicture}/>
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
