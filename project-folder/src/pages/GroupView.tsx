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
  IonInput,
  IonSegment,
  IonSegmentButton
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
  addOutline,
  sendOutline
} from 'ionicons/icons'

import Message from '../components/Message'
import GroupFeed from '../components/GroupFeed';
import { article, articleList } from '../components/ArticleTypes';
import { tempapiSearch, tempremoveSubscription, tempsearchTopic, tempsubscribe, validTopic } from '../components/TempFunctions';
import SubscriptionModal from '../components/SubscriptionModal';
import SearchModal from '../components/SearchModal';
import { NewsDB } from '../config/config';

// type SubState = {
//   showModal: boolean,
//   closeButton: () => {},
//   unsubscribeButton: () => {},
//   subscriptions: string[]
// }

type MyState = {
  articles: article[],
  blockedSources: string[],
  subscriptions: string[],
  showSubscriptionModal: boolean,
  showSearchModal: boolean,
  topicSearched: string,
  showSearchAlert: boolean,
  showLoading: boolean,
  showSearchingModal: boolean,
  articlesSearched: article[],
  showSubscribeAlert: boolean,
  groupSegment: string|undefined,
  groupViewPopoverEvent: any,
  isGroupViewPopoverOpen: boolean,
  isSettingsModalOpen: boolean,
  isMembersModalOpen: boolean,
  isFriendsListModalOpen: boolean,
  isNicknameReadOnly: boolean,
  tempNickname: string,
  members: Member[],
  owner: Member | undefined,
  messages: any[],
  photoDictionary: any,
  currentMessage: string,
  nameDictionary: any,
  blockedList: string[]
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
  addFriendToGroup: (friend : string, group: string) => void,
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

type Member = {
  uid: string;
  displayName: string;
  photo: string;
}


class GroupView extends React.Component<MyProps, MyState> {

  state: MyState = {
    articles: [],
    blockedSources:[],
    subscriptions: [],
    showSubscriptionModal: false,
    showSearchModal: false,
    topicSearched: "",
    showSearchAlert: false,
    showLoading: false,
    showSearchingModal: false,
    articlesSearched: [],
    showSubscribeAlert: false,
    groupSegment: 'feed',
    groupViewPopoverEvent: undefined,
    isGroupViewPopoverOpen: false,
    isSettingsModalOpen: false,
    isMembersModalOpen: false,
    isFriendsListModalOpen: false,
    isNicknameReadOnly: true,
    tempNickname: this.props.groupDetails.nickname,
    members: [],
    owner: {uid: '', displayName: '', photo: ''},
    messages: [],
    photoDictionary: {},
    currentMessage: '',
    nameDictionary: {},
    blockedList: []
  };
  realtime_db = firebase.database();
  anchorRef: React.RefObject<HTMLDivElement>;
  constructor(props: MyProps) {
    super(props)
    this.pullImage()
    this.anchorRef = React.createRef()
  }

  componentDidMount() {
    let members : Member[] = []
    this.props.groupDetails.members.forEach(memberUid => {
      db.collection('profiles').doc(memberUid).get().then((document) => {
        let member : Member = {
          photo: document.data()?.photo,
          displayName: document.data()!.displayName,
          uid: memberUid
        }

        members.push(member)
        if(memberUid === this.props.groupDetails.owner) {
          this.setState({
            owner: member
          })
        }
      })
    })
    this.setState({
      members: members,
    })
  }

  componentDidUpdate(prevProps: MyProps) {
    if(prevProps.groupDetails.members.length !== this.props.groupDetails.members.length) {
      if(auth.currentUser) {
        db.collection('blockedUsers').doc(auth.currentUser?.uid).get().then((document) => {
          this.setState({blockedList: document.data()!.blocked})
        })
      }
      let members : Member[] = []
      let photoDictionary : any = new Object()
      photoDictionary["World-Watchlist"] = "https://firebasestorage.googleapis.com/v0/b/worldwatchlist.appspot.com/o/images%2Fearth.jpg?alt=media&token=8dfce470-5dac-4126-b3d2-4f3d42a07b8a"
      let nameDictionary : any = new Object()
      nameDictionary["World-Watchlist"] = "World-Watchlist"
      this.props.groupDetails.members.forEach(memberUid => {
        db.collection('profiles').doc(memberUid).get().then((document) => {
          let member : Member = {
            photo: document.data()?.photo,
            displayName: document.data()!.displayName,
            uid: memberUid
          }
          members.push(member)
          photoDictionary[member.uid] = member.photo
          nameDictionary[member.uid] = member.displayName
          console.log(photoDictionary[member.uid])
          console.log(nameDictionary[member.uid])
          if(memberUid === this.props.groupDetails.owner) {
            this.setState({
              owner: member
            })
          }
        })
      })
      this.setState({
        members: members,
        photoDictionary: photoDictionary,
        nameDictionary: nameDictionary
      })
    }
    if(prevProps.groupDetails.id !== this.props.groupDetails.id) {
      this.setState({messages: []})
      let messages : any[] = []
      this.realtime_db.ref(this.props.groupDetails.id).orderByKey().on('child_added', (snapshot) => {
        messages.push({...snapshot.val(), key: snapshot.key})
        console.log({...snapshot.val(), key: snapshot.key})

        this.setState({messages: messages})
        if ( this.state.groupSegment === "messages")
          this.anchorRef.current!.scrollIntoView();

      })
    }
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

  sendMessage() {
    let timestamp = Date.now()
    this.realtime_db.ref(this.props.groupDetails.id).child(timestamp.toString()).set({message: this.state.currentMessage, sender: auth.currentUser?.uid})
    this.setState({
      currentMessage: ''
    })
  }

  getId() {
    return this.props.groupDetails.id;
  }

  handleSegmentSwitch(e: any) {
    let segmentValue = e.detail.value;
    this.setState({groupSegment: segmentValue});
    if (segmentValue === "messages") {
      console.log("Messages selected");
      this.anchorRef.current!.scrollIntoView();
    }
  }

  subscribeCloseButton() {
    this.setState({showSubscriptionModal: false});
  }
  
  unsubscribeButton(index: number) {
    tempremoveSubscription(index, this.getId(), this.state.subscriptions);
  }

  subscribeButton(topic: string) {
    tempsubscribe(topic, this.getId());
  }

  searchCloseButton() {
    this.setState({showSearchModal: false});
  }

  handleTopicChange(e: any) {
    this.setState({topicSearched: e.target.value});
  }

  async handleSearchTopic() {
    this.setState({showLoading: true, articlesSearched: []});
    if (validTopic(this.state.topicSearched)) {
      this.setState({showSearchingModal: true});
      let searched = await tempsearchTopic(this.state.topicSearched, this.props.groupDetails.id);
      this.setState({articlesSearched: searched});
    } else {
      console.log("Invalid topic");
      this.setState({showSearchAlert: true});
    }
    this.setState({showLoading: false});
  }

  handleDismissSearch() {
    this.setState({showSearchAlert: false});
  }

  handleCloseSearchModal() {
    this.setState({showSearchModal: false});
  }

  handleAddTopic() {
    tempsubscribe(this.state.topicSearched, this.props.groupDetails.id);
    this.setState({showSubscribeAlert: true});
  }

  handleDismissSubscribe() {
    this.setState({showSubscriptionModal: false});
  }
  // // copied from Feed.tsx
  // async searchTopic(topic:any) {
  //   this.setState({showLoading: true})
  //   this.setState({articlesSearched:[]})
  //     if (topic === null || topic === undefined || topic === '') {
  //       console.log("Enter a valid topic");
  //       this.setState({showSearchAlert:true})
  //     } else {
  //       this.toggleNewsModal()
  //       let aList : articleList = [];
  //       /* cache data on topic search */
  //       await NewsDB.collection(topic.toLowerCase()).get()
  //       .then(async (snapshot) => {
  //       if (snapshot.empty) {
  //         // searching through api and sending to firestore instead of searching in main collection
  //         await tempapiSearch(topic, 'search', this.props.groupDetails.id)
       
  //       } else {
  //       console.log("collection exist, will pull data from that collection")

  //       aList = [];
  //       snapshot.docChanges().forEach((change) => {
  //         if (change.doc.exists) {
  //           let articleItem = change.doc.data();
  //           var html = articleItem.Description;
  //           var a = document.createElement("a");
  //           a.innerHTML = html;
  //           var text = a.textContent || a.innerText || "";
  //           aList.push({title: articleItem.Title, link: articleItem.Link, description: text, source: articleItem.source, pubDate: articleItem.pubDate})
  //         }
  //         this.setState({articlesSearched: aList})
  //       })
  //       }
  //     })
  //   }
  //   this.setState({showLoading: false})
  //   return 0
  // }

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
                {this.state.owner!.displayName}
              </IonTitle>
            </IonItem>
          </IonList>
          <IonListHeader>Members ({this.props.groupDetails.members.length - 1}) </IonListHeader>
          <IonList>
            {
              this.state.members.map((member) => {
                return member.uid !== this.props.groupDetails!.owner ?
                  <IonItem key={member.uid}>
                    <IonTitle>
                      {member.displayName}
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
                  <IonButton onClick={() => {this.props.addFriendToGroup(FriendObj.uid, this.props.groupDetails.id)}} fill='clear'>
                    <IonIcon slot='end' icon={this.props.groupDetails.members.includes(FriendObj.uid) ? checkmarkOutline : addOutline}/>
                  </IonButton>
                </IonItem>
              )
            })
          }
        </IonList>
      </IonContent>
      </IonModal>

      <SubscriptionModal showModal={this.state.showSubscriptionModal}
      closeButton={this.subscribeCloseButton.bind(this)}
      unsubButton={this.unsubscribeButton.bind(this)}
      subscriptions={this.state.subscriptions}></SubscriptionModal>

      <SearchModal showModal={this.state.showSearchModal}
      closeModal={this.searchCloseButton.bind(this)}
      topicSearched={this.state.topicSearched}
      handleTopicChange={this.handleTopicChange.bind(this)}
      searchTopicButton={this.handleSearchTopic.bind(this)}
      showSearchAlert={this.state.showSearchAlert}
      dismissSearchAlertButton={this.handleDismissSearch.bind(this)}
      showLoading={this.state.showLoading}
      showSearchingModal={this.state.showSearchModal}
      closeSearchingModal={this.handleCloseSearchModal.bind(this)}
      addTopicButton={this.handleAddTopic.bind(this)}
      articlesSearched={this.state.articlesSearched}
      showSubscribeAlert={this.state.showSubscribeAlert}
      dismissSubscribeAlertButton={this.handleDismissSubscribe.bind(this)}></SearchModal>

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
              { (auth.currentUser?.uid === this.props.groupDetails.owner) ?
              <div>
              <IonItem button={true}  onClick={() => {this.setState({isGroupViewPopoverOpen: false, showSubscriptionModal: true})}}>
                <IonLabel>Subscriptions</IonLabel>
                <IonIcon className='groupViewPopoverIcon' slot='end' /*icon={}*//>
              </IonItem>
              <IonItem button={true}  onClick={() => {this.setState({isGroupViewPopoverOpen: false, isSettingsModalOpen: true})}}>
                <IonLabel>Search for Subscriptions</IonLabel>
                <IonIcon className='groupViewPopoverIcon' slot='end' /*icon={settingsOutline}*//>
              </IonItem>
              </div> : null
              }
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

        <IonModal cssClass='modalScroll' swipeToClose={true} isOpen={this.props.isGroupModalOpen}>
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
          {/* Pulled from Social Page */}
          <IonSegment id="groupSegment" onIonChange={this.handleSegmentSwitch.bind(this)} value={this.state.groupSegment}>
          <IonSegmentButton value='messages' class="groupSegmentButton">
            <IonLabel>Messages</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value='feed' class="groupSegmentButton">
            <IonLabel>Feed</IonLabel>
          </IonSegmentButton>
        </IonSegment>
          {(this.state.groupSegment === "messages") ?
          <IonContent className='groupViewMessageContainer' scrollY={true}>
          <div className='messageContainerDiv'>
            {this.state.messages.map((message) => {
              return !this.state.blockedList.includes(message.sender) ?
               <Message key={message.key} sender={this.state.nameDictionary[message.sender]} content={message.message}  photo={this.state.photoDictionary[message.sender]} /> :
               <Message key={message.key} sender={this.state.nameDictionary[message.sender]} content={'This content is from a blocked user.'}  photo={this.state.photoDictionary[message.sender]} />
            })}
            <div className='groupViewAnchor'  />
            <div className='groupViewAnchor2' ref={this.anchorRef} />
          </div>
            <div className='groupViewMessageBox'>
              <IonInput value={this.state.currentMessage} onIonChange={(e) => {this.setState({currentMessage: (e.target as HTMLInputElement).value})}} className='groupViewMessageInput' />
              <IonButton onClick={() => {this.sendMessage()}} fill='clear' className='groupViewMessageButton'>
                <IonIcon slot="icon-only" className='groupViewMessageSend' icon={sendOutline} />
              </IonButton>
            </div>
            <div className='bottomSpaceFiller' />
          </IonContent>

          :
          <IonContent>
            <GroupFeed headerName="Group News" articles={this.state.articles}></GroupFeed>
          </IonContent>
  }
        </IonModal>
      </div>
    )
  }

}

export default GroupView;
