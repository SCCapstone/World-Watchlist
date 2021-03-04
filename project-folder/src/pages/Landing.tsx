import React from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonItemDivider,
  IonList,
  IonItem,
  IonContent,
  IonInput,
  IonTitle,
  IonButton,
  IonLabel
} from '@ionic/react'

import './Landing.css'
import firebase, {auth, db} from '../firebase.js'
import { isValidEmail, isValidPassword } from '../components/TempFunctions';
import Errors from '../components/Errors';

type MyState = {
  loginEmail: string;
  loginPassword: string;
  registerEmail: string;
  registerPassword: string;
  registerConfirmPassword: string;
  shouldLoginShow: boolean;
  username: string;
  btnText: string;
  error_messages: string[];
}

type MyProps = {
  history: any;
  location: any;
}



class Landing extends React.Component<MyProps, MyState> {

  state: MyState = {
    loginEmail: '',
    loginPassword: '',
    registerEmail: '',
    registerPassword: '',
    registerConfirmPassword: '',
    shouldLoginShow: true,
    username: '',
    btnText: '',
    error_messages: []
  };



  constructor(props: MyProps) {
    super(props)

    this.login = this.login.bind(this);
    this.register = this.register.bind(this);
    this.state.btnText = 'Create an Account';
  }

  login() {
    //attempts to sign a user into the app
    //field checks
    let guard = true
    if(this.state.loginEmail === '') {
      guard = false
    }
    if(this.state.loginPassword === '') {
      guard = false
    }
    if(guard) {
      firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(() => {
        auth.signInWithEmailAndPassword(this.state.loginEmail, this.state.loginPassword).then(() => {
          //user successfully logs in
          //reroute here
          console.log(auth.currentUser)
          if(auth.currentUser) {
            this.props.history.push("/main")
          }
        }).catch((error) => {
          //error handling
          console.log(error.message)

        })
      })
    }
  }

  register() {
    let guard = true
    if(this.state.registerEmail ==='') {
      guard = false
    }
    if(this.state.registerPassword === '') {
      guard = false
    }
    if(this.state.registerConfirmPassword !== this.state.registerPassword) {
      guard = false
    }
    let emailReturn = isValidEmail(this.state.registerEmail);
    let passReturn = isValidPassword(this.state.registerPassword);
    let messages = emailReturn.concat(passReturn);
    console.log(messages);
    console.log(messages === this.state.error_messages);
    if ( messages !== this.state.error_messages)
      this.setState({error_messages: messages})
    if (messages.length !== 0)
      guard = false;
    //attempts to register a user
    //field checks
    if (guard) {
      firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(() => {
        auth.createUserWithEmailAndPassword(this.state.registerEmail, this.state.registerPassword).then(() => {
          //user successfully registers
          //reroute here
          this.uploadDataToFirebase().then((result) => {
            this.props.history.push("/main")
          })
        //admin.storage.ref().child(this.state.username+'#'+this.state.usernameIdentifier.toString() + '/new.jpg').put('../images/placeholder.png')
        //firebase.put('asdf');

        }).catch((error) => {
          //error handling
          console.log(error.message)
        })
      })
    }
  }

  async uploadDataToFirebase() {
    const createProfile : Promise<void> = db.collection('profiles').doc(auth.currentUser?.uid).set({
      blockedSources:[],
      groups: [],
      displayName: this.state.username,
      photo: '',
      notifications: false
    })
    const createEmail : Promise<void> = db.collection('emails').doc(this.state.registerEmail).set({
      userid: auth.currentUser?.uid
    })
    const createOutgoingFriendRequests : Promise<void> = db.collection("outgoingFriendRequests").doc(auth.currentUser?.uid).set({
      outgoingFriendRequests: []
    })
    const createIncomingFriendRequests : Promise<void> = db.collection("incomingFriendRequests").doc(auth.currentUser?.uid).set({
      incomingFriendRequests: []
    })
    const createFriends : Promise<void> = db.collection("friends").doc(auth.currentUser?.uid).set({
      friendsList: []
    })

    return await Promise.all([createProfile, createEmail, createOutgoingFriendRequests, createIncomingFriendRequests, createFriends])
  }

    render() {
      return (
      <IonPage>
        <IonHeader>
          <IonToolbar className='landingToolbar'>
            <IonTitle class='loginTitle'>
              {this.state.shouldLoginShow ? 'Login' : 'Create an Account'}
            </IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className='landingContent'>
        {
          this.state.shouldLoginShow ?
            <div className='loginContainer'>
              <div id='loginInputContainer'>
                <h1 id='header'>World Watchlist</h1>
                <IonItem lines='none' className='loginItem'>
                <IonLabel class='loginLabel' position='floating'></IonLabel>
                  <IonInput value={this.state.loginEmail} className='loginInput' type='email' placeholder = 'Email Address' onIonChange={(e) => {this.setState({loginEmail: (e.target as HTMLInputElement).value})}} />
                </IonItem>

                <IonItem lines='none' className='loginItem'>
                  <IonLabel className='loginLabel' position='floating'></IonLabel>
                  <IonInput value={this.state.loginPassword}  className='loginInput' type='password' placeholder = 'Password' onIonChange={(e) => {this.setState({loginPassword: (e.target as HTMLInputElement).value})}}/>
                </IonItem>
              </div>
              <IonButton shape = 'round' onClick={() => {this.login()}} className='loginButton'>Submit</IonButton>
            </div>
          :
            <div className='registerContainer'>
              <div id='registerInputContainer'>
              <h1 id='header'>Register for an account</h1>
                <IonItem lines='none' className='registerItem'>
                <IonLabel className='registerLabel' position='floating' id = 'email'></IonLabel>
                  <IonInput id = 'test' value={this.state.registerEmail} className='registerInput' type='email' placeholder = 'Email Address' onIonChange={(e) => {this.setState({registerEmail: (e.target as HTMLInputElement).value})}} />
                </IonItem>

                <IonItem lines='none' className='registerItem'>
                  <IonLabel className='registerLabel' position='floating'></IonLabel>
                  <IonInput value={this.state.registerPassword} className='registerInput' type='password' placeholder = 'Password' onIonChange={(e) => {this.setState({registerPassword: (e.target as HTMLInputElement).value})}}/>
                </IonItem>

                <IonItem lines='none' className='registerItem'>
                  <IonLabel className='registerLabel' position='floating'></IonLabel>
                  <IonInput value={this.state.registerConfirmPassword}  className='registerInput' type='password' placeholder = 'Confirm Password' onIonChange={(e) => {this.setState({registerConfirmPassword: (e.target as HTMLInputElement).value})}}/>
                </IonItem>

                <IonItem lines='none' className='registerItem'>
                  <IonLabel className='registerLabel' position='floating'></IonLabel>
                  <IonInput value={this.state.username} className='registerInput' type='text' placeholder = 'Username' onIonChange={(e) => {this.setState({username: (e.target as HTMLInputElement).value})}}/>
                </IonItem>
              </div>
              <IonButton shape = 'round' onClick={() => {this.register()}} className='registerButton'>Submit</IonButton>
              <span>What up though homie</span>
              <Errors errors={this.state.error_messages}></Errors>
            </div>
        }

          <IonButton shape = 'round' className = 'landingSwitch' onClick={() => {if(this.state.btnText=='Create an Account') this.state.btnText='Log In'; else this.state.btnText='Create an Account';this.setState({shouldLoginShow: !this.state.shouldLoginShow})}} >{this.state.btnText}</IonButton>
        </IonContent>
      </IonPage>
      )
    }

}

export default Landing
