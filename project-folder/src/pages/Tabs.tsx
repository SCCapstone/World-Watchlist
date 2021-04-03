import React from 'react';
import {
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonLabel,
  IonIcon,
  IonRouterOutlet
} from '@ionic/react'
import { Redirect, Route } from 'react-router-dom';
import { bookmark, bookmarkOutline, newspaperOutline, peopleOutline, settingsOutline} from 'ionicons/icons';
import Feed from '../pages/Feed'
import Social from '../pages/Social'
import Settings from '../pages/Settings'
import Bookmark from '../pages/Bookmark'
import {auth, db} from '../firebase'
import './Tabs.css'

type Friend = {
  uuid: string;
  uid: string;
  displayName: string;
  photo: string;
  lastMessage: string;
  lastMessageSender: string;
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
  lastMessage: string;
  lastMessageSender: string;
}

type MyState = {
  subscriptionGroupList: any[],
  subscriptionFriendList: any[],
  ourUsername: string,
  friendsListSubscription: any,
  friendsList: Friend[],
  unsubscribeBlockedUsers: any
  blockedUsers: any,
  incomingRequests: string[];
  outgoingRequests: string[];
  numGroups: number;
  groupArray: Group[]
  unsubscribeGroupArray: any[];
  unsubscribeIncomingRequests: (() => void) | undefined;
  unsubscribeOutgoingRequests: (() => void) | undefined;
}

class Tabs extends React.Component<MyProps, MyState> {
  state: MyState = {
    subscriptionFriendList: [],
    subscriptionGroupList: [],
    ourUsername: '',
    friendsListSubscription: undefined,
    friendsList: [],
    unsubscribeBlockedUsers: [],
    blockedUsers: [],
    incomingRequests: [],
    outgoingRequests: [],
    numGroups: 0,
    groupArray: [],
    unsubscribeGroupArray: [],
    unsubscribeIncomingRequests: undefined,
    unsubscribeOutgoingRequests: undefined
  };

  constructor(props: MyProps){
    super(props)

    auth.onAuthStateChanged(() => {
      if(auth.currentUser) {
        //gets the username of our user
        db.collection("profiles").doc(auth.currentUser.uid).get().then(doc => {
          if(doc.data()) {
            this.setState({ourUsername: doc.data()!.displayName})
            //creates a subscription to our user's friends list

            let unsubscribeFriendsList = db.collection('friends').doc(auth.currentUser?.uid).onSnapshot((friendsListSnapshot) => {
            let friends : Friend[] = []
            friendsListSnapshot.data()!.friendsList.map((friend : string) => {
              db.collection('profiles').doc(friend).onSnapshot((profileSnapshot) => {
                db.collection('friends').doc(auth.currentUser?.uid).collection('uuids').doc(friend).get().then((uuidDoc) => {

                  let stateFriendsList = this.state.friendsList
                  let friendObj = {
                    photo: profileSnapshot.data()?.photo,
                    displayName: profileSnapshot.data()!.displayName,
                    uuid: uuidDoc.data()!.uuid,
                    uid: friend,
                    lastMessage: uuidDoc.data()!.lastMessage,
                    lastMessageSender: uuidDoc.data()!.lastMessageSender
                  }
                  let sentinel = true
                  stateFriendsList.map((stateFriend, index) => {
                    if(stateFriendsList[index].uid === friendObj.uid) {
                      stateFriendsList[index] = friendObj
                      sentinel = false
                    }

                  })
                  if(sentinel) {
                    stateFriendsList.push(friendObj)
                  }
                  this.setState({friendsList: stateFriendsList})
                })
              })
            })
          })

            // create subscription to user's blocked users list
            this.state.unsubscribeBlockedUsers = db.collection('blockedUsers').doc(auth.currentUser?.uid).onSnapshot((snapshot) => {
              if(snapshot.exists && snapshot.data()!.blocked !== undefined) {
                this.setState({blockedUsers: snapshot.data()!.blocked})
              } else {
                db.collection("blockedUsers").doc(auth.currentUser?.uid).set({blocked: []})
                this.setState({blockedUsers: []})
              }
            })

            //creates a subscription to our user's incoming friend requests
            let unsubscribeIncomingRequests = db.collection('incomingFriendRequests').doc(auth.currentUser?.uid).onSnapshot((snapshot) => {
              if(snapshot.data()) {
                console.log(snapshot.data()!.incomingFriendRequests)
                this.setState({incomingRequests: snapshot.data()!.incomingFriendRequests})
              }
            })

            //creates a subscription to our user's outgoing friend requests
            let unsubscribeOutgoingRequests = db.collection('outgoingFriendRequests').doc(auth.currentUser!.uid).onSnapshot((snapshot) => {
              if(snapshot.data()) {
                console.log(snapshot.data()!.outgoingFriendRequests)
                this.setState({outgoingRequests: snapshot.data()!.outgoingFriendRequests})
              }
            })

            //crate a subscription to the list of a users groups
            let unsubscribeGroups = db.collection('profiles').doc(auth.currentUser?.uid).onSnapshot((snapshot) => {
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
                        owner: snapshot.data()!.owner,
                        lastMessage: snapshot.data()!.lastMessage,
                        lastMessageSender: snapshot.data()!.lastMessageSender
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

            this.setState({
              unsubscribeIncomingRequests: unsubscribeIncomingRequests,
              unsubscribeOutgoingRequests: unsubscribeOutgoingRequests
            })
          }
        })
      }
    })
  }

  componentWillUnmount() {
    //since we have subscriptions, we cancel them here to prevent a memory leak
    if(this.state.unsubscribeIncomingRequests !== undefined) {
      this.state.unsubscribeIncomingRequests()
    }
    if(this.state.unsubscribeOutgoingRequests !== undefined) {
      this.state.unsubscribeOutgoingRequests()
    }

    for(let i = 0; i < this.state.unsubscribeGroupArray.length; i++) {
      this.state.unsubscribeGroupArray[i]()
    }
  }



  subscribeToGroup(subscription: any, groupId: string) {
    let tempList = this.state.subscriptionGroupList
    tempList.push([groupId, subscription])
  }

  subscribeToFriend(subscription: any) {

  }

  unsubcribeFromGroup(groupId: string) {

  }

  unsubscribeFromFriend(friendId: string) {

  }

  render() {
    return (
      <IonTabs>
        <IonRouterOutlet>
          <Route path="/main" exact render={() => <Redirect to="/main/feed"/>} />
          <Route path="/main/feed" component={Feed} exact={true} />
          <Route path="/main/social" render={() => <Social {...this.props} friendsList={this.state.friendsList} groupArray={this.state.groupArray} ourUsername={this.state.ourUsername} incomingRequests={this.state.incomingRequests} outgoingRequests={this.state.outgoingRequests}/> } />
          <Route path="/main/settings" component={Settings} exact={true}/>
          <Route path="/main/bookmark" component={Bookmark} exact={true}/>
        </IonRouterOutlet>
        <IonTabBar color='dark'class='tabToolbar' slot="bottom">
            <IonTabButton class='tabIcon' tab="feed" href="/main/feed">
              <IonIcon icon={newspaperOutline} />
              <IonLabel>Feed</IonLabel>
            </IonTabButton>
            <IonTabButton class='tabIcon' tab="social" href="/main/social">
              <IonIcon icon={peopleOutline} />
              <IonLabel>Social</IonLabel>
            </IonTabButton>
            <IonTabButton class='tabIcon' tab="bookmark" href="/main/bookmark">
              <IonIcon icon={bookmarkOutline} />
              <IonLabel>Bookmark</IonLabel>
            </IonTabButton>
            <IonTabButton class='tabIcon' tab="settings" href="/main/settings">
              <IonIcon icon={settingsOutline} />
              <IonLabel>Settings</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
    )
  }

}

export default Tabs
