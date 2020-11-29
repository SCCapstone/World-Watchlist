import React from 'react';

import './Messenger.css'

import {
         IonContent,
         IonPage,
         IonInput,
         IonHeader,
         IonToolbar,
         IonTitle,
         IonItem,
         IonLabel,
         IonIcon,
         IonButtons,
         IonButton
       } from '@ionic/react';

import firebase, {auth} from '../firebase'
import {send, closeCircleOutline} from 'ionicons/icons';

type MyProps = {
  history: any;
  location: any;
  messageRef: string;
  toggleMessengerModal: any;
  username: string;
}

type MyState = {
  messages: any;
  newUpdate: string;
  submitPressed: string;

}

class Messenger extends React.Component<MyProps, MyState> {

  state: MyState = {
  messages: undefined,
  newUpdate: "",
  submitPressed: "#ff99aa",
};

  realtime_db = firebase.database();
  messageReference = this.realtime_db.ref(this.props.messageRef);
  messageContainer: React.RefObject<HTMLDivElement>;



  constructor(props: MyProps) {
    super(props);
    this.messageContainer = React.createRef<HTMLDivElement>()
    // ### Begin Function Bindings ###

    this.postToFeed = this.postToFeed.bind(this);
    // ### End Function Bindings

    //subscribe to published comments

  }

  async componentWillMount() {
  this.messageReference.on('value', (value) => {
    this.setState({messages: value.val()})
    console.log(value)


  })
  if(!auth.currentUser) {
    this.props.history.push("/home")
  }

}

loadMessages = () => {
  const messages = this.state.messages
  if(this.messageContainer.current) {
    this.messageContainer.current!.scrollIntoView(true)
  }

  return (
    <div className="messageFeed">{
      messages && Object.keys(messages).map(key => {
        return (
          <IonItem class='message' key={key}>
            <IonLabel class="ion-text-wrap" position="stacked">{messages[key].sender}</IonLabel>
            <IonLabel class="ion-text-wrap">{messages[key].message}</IonLabel>
          </IonItem>
        )
      })
    }
    <div style={{height: "20px"}}ref={this.messageContainer}></div>
    </div>
  )
}

postToFeed() {
  if(this.state.newUpdate != "") {
    this.messageReference.push({message: this.state.newUpdate, sender: this.props.username})
    this.setState({newUpdate: ""})
  }
}

    render() {
      return (
        <div>
          <IonHeader>
            <IonToolbar>
              <IonButtons>
                <IonButton onClick={() => {this.props.toggleMessengerModal()}} id='closeMessengerModal' fill='clear'>
                  <IonIcon id='closeMessengerModalIcon' icon={closeCircleOutline}/>
                </IonButton>
              </IonButtons>
              <IonTitle>
                Messenger
              </IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent className='messengerContent'>
            {<div className='messageWrapper'>{this.loadMessages()}</div>}
              <IonItem lines="none" className="feedChatbox">
                <IonInput value={this.state.newUpdate} onIonChange={(event) => this.setState({newUpdate: ((event.target as HTMLInputElement).value)})}></IonInput>
                <IonIcon onTouchEnd={()=>{this.setState({submitPressed: "#ff99aa"})}} onTouchStart={() => {this.setState({submitPressed: "#7f7880"})}} style={{color: this.state.submitPressed}} onClick={() => {this.postToFeed()}} icon={send}></IonIcon>
              </IonItem>
          </IonContent>
        </div>
      )
    }

}

export default Messenger
