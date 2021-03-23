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
  friendViewPopoverEvent: any,
  isFriendViewPopoverOpen: boolean,
  isSettingsModalOpen: boolean,
  isMembersModalOpen: boolean,
  isFriendsListModalOpen: boolean,
  messages: any[],
  photoDictionary: any,
  currentMessage: string,
  nameDictionary: any
}

type MyProps = {
  history: any;
  location: any;
  friendDetails: Friend;
  isFriendModalOpen: boolean;
  toggleFriendModal: any;
  removeFriend: (targetUserId: string) => void,
}


type Friend = {
  uuid: string;
  uid: string;
  displayName: string;
  photo: string;
}



class FriendView extends React.Component<MyProps, MyState> {

  state: MyState = {
    friendViewPopoverEvent: undefined,
    isFriendViewPopoverOpen: false,
    isSettingsModalOpen: false,
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
  }

  componentDidMount() {

  }

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
          console.log(this.props.friendDetails.photo)
        })
      }
      let messages : any[] = []
      if(this.props.friendDetails.uuid !== '') {
        this.realtime_db.ref(this.props.friendDetails.uuid).orderByKey().on('child_added', (snapshot: { val: () => any; key: any; }) => {
          messages.push({...snapshot.val(), key: snapshot.key})
          console.log({...snapshot.val(), key: snapshot.key})
          this.setState({messages: messages})
          this.anchorRef.current!.scrollIntoView();
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
    this.realtime_db.ref(this.props.friendDetails.uuid).child(timestamp.toString()).set({message: this.state.currentMessage, sender: auth.currentUser?.uid, read: [{readBy: auth.currentUser?.email, readAt: Date.now.toString()}]})
    this.setState({
      currentMessage: ''
    })
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
          <div className='messageContainerDiv'>
            {this.state.messages.map((message) => {
              return <Message key={message.key} sender={this.state.nameDictionary[message.sender]} content={message.message} photo={this.state.photoDictionary[message.sender]} read={message.read} />
            })}
            <div className='friendViewAnchor'  />
            <div className='friendViewAnchor2' ref={this.anchorRef} />
          </div>
            <div className='friendViewMessageBox'>
              <IonInput value={this.state.currentMessage} onIonChange={(e) => {this.setState({currentMessage: (e.target as HTMLInputElement).value})}} className='friendViewMessageInput' />
              <IonButton onClick={() => {this.sendMessage()}} fill='clear' className='friendViewMessageButton'>
                <IonIcon slot="icon-only" className='friendViewMessageSend' icon={sendOutline} />
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
