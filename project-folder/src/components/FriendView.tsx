import React from 'react';
//import Placeholder from '../images/placeholder.png';
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
} from '@ionic/react'

import './FriendView.css'

import firebase, {db, auth} from '../firebase'
import Placeholder from '../images/placeholder.png'
import {
  closeCircleOutline,
  sendOutline,
  personRemoveOutline
} from 'ionicons/icons'

import Message from '../components/Message'



type MyState = {
  subs: string[];
  senderToView: any;
  senderImage: string;
  friendViewPopoverEvent: any,
  isFriendViewPopoverOpen: boolean,
  isSettingsModalOpen: boolean,
  isMembersModalOpen: boolean,
  isFriendsListModalOpen: boolean,
  messages: any[],
  photoDictionary: any,
  currentMessage: string,
  nameDictionary: any,
  isProfileModalOpen:boolean;
}

type MyProps = {

  history: any;
  location: any;
  friendDetails: Friend;
  isFriendModalOpen: boolean;
  isProfileModalOpen:boolean;
  toggleProfileModal:boolean;
  toggleFriendModal: any;
  removeFriend: (targetUserId: string) => void,
  setSenderToView: (sender:string)=> void,
  ourUsername: string
}


type Friend = {
  uuid: string;
  uid: string;
  displayName: string;
  photo: string;
  lastMessage: string;
  lastMessageSender: string;
}



class FriendView extends React.Component<MyProps, MyState> {

  state: MyState = {
    subs:[],
    senderToView: undefined,
    senderImage:'',
    friendViewPopoverEvent: undefined,
    isFriendViewPopoverOpen: false,
    isSettingsModalOpen: false,
    isProfileModalOpen:false,
    isMembersModalOpen: false,
    isFriendsListModalOpen: false,
    messages: [],
    photoDictionary: {},
    currentMessage: '',
    nameDictionary: {}
  };
  realtime_db = firebase.database();
  anchorRef: React.RefObject<HTMLDivElement>;
  constructor(props: MyProps) {
    super(props)
    this.anchorRef = React.createRef()

    this.openProfile = this.openProfile.bind(this);
    this.closeProfile = this.closeProfile.bind(this);
  }

  componentDidMount() {


  }

  /*setSenderToView(s:string) {
    console.log(s)
    console.log(firebase.auth().currentUser!.uid)
    if(firebase.auth().currentUser!.uid == s) // It's you

    this.setState({senderToView:this.state.nameDictionary[s]})
     this.setState({senderImage: this.state.photoDictionary[s]})
    db.collection('topicSubscription').doc(s).onSnapshot((snapshot) => {
      this.setState({subs:snapshot.data()!.subList})
    })
    db.collection('profiles').doc(s).get().then(doc=>{

     // lastMessageSender: this.props.ourUsername
    })
    console.log(this.state.subs)

  }*/

  componentDidUpdate(prevProps: MyProps) {
    if(prevProps.friendDetails.uid !== this.props.friendDetails.uid) {
      this.setState({messages: []})
      let photoDictionary : any = new Object()
      photoDictionary["World-Watchlist"] = "https://firebasestorage.googleapis.com/v0/b/worldwatchlist.appspot.com/o/images%2Fearth.jpg?alt=media&token=8dfce470-5dac-4126-b3d2-4f3d42a07b8a"
      let nameDictionary : any = new Object()
      nameDictionary["World-Watchlist"] = "World-Watchlist"
      if(auth.currentUser?.uid) {
        db.collection('profiles').doc(auth.currentUser!.uid).get().then((document) => {
          nameDictionary[auth.currentUser!.uid] = document.data()!.displayName
          photoDictionary[auth.currentUser!.uid] = document.data()!.photo
          photoDictionary[this.props.friendDetails.uid] = this.props.friendDetails.photo
          nameDictionary[this.props.friendDetails.uid] = this.props.friendDetails.displayName
        })
      }
      let messages : any[] = []
      if(this.props.friendDetails.uuid !== '') {
        this.realtime_db.ref(this.props.friendDetails.uuid).orderByKey().on('child_added', (snapshot: { val: () => any; key: any; }) => {
          messages.push({...snapshot.val(), key: snapshot.key})
          console.log({...snapshot.val(), key: snapshot.key})
          this.setState({messages: messages})
          if(this.anchorRef.current !== null) {
            this.anchorRef.current!.scrollIntoView();
          }

        })
      }
      this.setState({
        photoDictionary: photoDictionary,
        nameDictionary: nameDictionary
      })
    }
  }

  sendMessage() {
    let timestamp = Date.now()
    this.realtime_db.ref(this.props.friendDetails.uuid).child(timestamp.toString()).set(
      {
        message: this.state.currentMessage,
        sender: auth.currentUser?.uid,
        read: [{readBy: auth.currentUser?.email, readAt: Date.now.toString()}],
        time: timestamp.toString()
      }
    )
    console.log('my id ' + auth.currentUser!.uid)
    console.log('their  id ' + this.props.friendDetails.uid)
    db.collection('friends').doc(auth.currentUser?.uid).collection('uuids').doc(this.props.friendDetails.uid).update({
      lastMessage: this.state.currentMessage,
      lastMessageSender: this.props.ourUsername
    })
    db.collection('friends').doc(this.props.friendDetails.uid).collection('uuids').doc(auth.currentUser?.uid).update({
      lastMessage: this.state.currentMessage,
      lastMessageSender: this.props.ourUsername
    })

    this.setState({
      currentMessage: ''
    })
  }

 /*setModalValues(uid:string){
    db.collection('profiles').doc(uid).get().then(doc=>{
      this.setState({profileImage:})
      lastMessageSender: this.props.ourUsername
    })

  }*/

  openProfile(sender: string) {
   // this.anchorRef.setSenderToView(sender)
  }

  closeProfile() {
    this.setState({isProfileModalOpen:false})
  }

  render() {
    return (
      <div>
        <IonPopover
          cssClass='friendViewPopover'
          event={this.state.friendViewPopoverEvent}
          isOpen={this.state.isFriendViewPopoverOpen}
          onDidDismiss={() => {this.setState({isFriendViewPopoverOpen: false, friendViewPopoverEvent: undefined})}}
        >
          <IonContent>
            <IonList>
              <IonListHeader id='friendViewPopoverListHeader'><b>Friend Options</b></IonListHeader>
              <IonItem button={true} onClick={() => {this.props.removeFriend(this.props.friendDetails.uid)}}>
                <IonLabel>Remove Friend</IonLabel>
                <IonIcon className='friendViewPopoverIcon' slot='end' icon={personRemoveOutline}/>
              </IonItem>
            </IonList>
          </IonContent>
        </IonPopover>

        <IonModal cssClass='modalScroll' swipeToClose={true} isOpen={this.props.isFriendModalOpen} onDidDismiss={this.props.toggleFriendModal}>
          <IonHeader>
            <IonToolbar>
              <IonButtons slot = 'start'>
                <IonButton fill='clear' onClick={() => {this.props.toggleFriendModal()}}>
                  <IonIcon className='friendViewIcon' icon={closeCircleOutline}/>
                </IonButton>
              </IonButtons>
              <IonButtons slot='end'>

              <IonAvatar onClick={(event : any) => {event.persist(); this.setState({isFriendViewPopoverOpen: true, friendViewPopoverEvent: event})}} className='friendViewProfilePicture'>
                <img src = {this.props.friendDetails.photo !== "" && this.props.friendDetails.photo !== undefined ? this.props.friendDetails.photo : Placeholder}/>
              </IonAvatar>


              </IonButtons>

              <IonTitle>{this.props.friendDetails ? this.props.friendDetails.displayName : undefined}</IonTitle>
            </IonToolbar>
          </IonHeader>


          <IonContent className='friendViewMessageContainer' scrollY={true}>
          <div className='messageContainerDiv'onClick={()=>{console.log("here"); this.setState({isProfileModalOpen:true})}}>
            {this.state.messages.map((message) => {
              
              return <div onClick={()=>{this.props.setSenderToView(message.sender);console.log("here"); this.openProfile(message.sender); this.setState({isProfileModalOpen:true})}}> <Message openProfile={this.openProfile} closeProfile={this.closeProfile} key={message.key} sender={this.state.nameDictionary[message.sender]} content={message.message} photo={this.state.photoDictionary[message.sender]} read={message.read} /></div>
              //console.log(db.collection('profiles').doc(message.sender))
              
            })}
            <div onClick={() => {this.setState({isProfileModalOpen:true}); console.log("here");this.openProfile(this.state.senderToView); console.log("here")}} className='friendViewAnchor'  />
            <div className='friendViewAnchor2' onClick={() => {console.log("here")}} ref={this.anchorRef} />
          </div>
            <div className='friendViewMessageBox'>
              <IonInput value={this.state.currentMessage} onIonChange={(e) => {this.setState({currentMessage: (e.target as HTMLInputElement).value})}} className='friendViewMessageInput' />
              <IonButton onClick={() => {this.sendMessage()}} fill='clear' className='friendViewMessageButton'>
                <IonIcon  slot="icon-only" className='friendViewMessageSend' icon={sendOutline} />
              </IonButton>
            </div>
            <div className='bottomSpaceFiller' />
          </IonContent>
        </IonModal>


      </div>
    )
  }

}

export default FriendView;
