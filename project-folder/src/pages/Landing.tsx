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
import firebase, {auth, db, signInWithGoogle} from '../firebase.js'
import { isValidEmail, isValidPassword } from '../components/TempFunctions';
import Errors from '../components/Errors';
import { Plugins } from '@capacitor/core';
import "@codetrix-studio/capacitor-google-auth";

type MyState = {
  loginEmail: string;
  loginPassword: string;
  registerEmail: any;
  registerPassword: string;
  registerConfirmPassword: string;
  shouldLoginShow: boolean;
  username: any;
  btnText: string;
  login_error_messages: string[];
  registration_error_messages: string[];
}

type MyProps = {
  history: any;
  location: any;
}
const { Storage } = Plugins;


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
    login_error_messages: [],
    registration_error_messages: []
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
             db.collection('topicSubscription').doc(auth.currentUser?.uid).set({
  
            privateSubList:[]
          }, {merge:true})
            Storage.set({key:'isLoggedIn', value:JSON.stringify(true)});
            this.props.history.push("/main")
          }
        }).catch((error) => {
          //error handling
          console.log(error.message)
          let messages = error.message;
          if (messages !== this.state.login_error_messages[0]) {
            this.setState({login_error_messages: [messages]})
          }
        })
      })
    }
  }

  async googleLogin(){
   const provider = new firebase.auth.GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
   const googleSignIn = await auth.signInWithPopup(provider);
   Storage.set({key:'isLoggedIn', value:JSON.stringify(true)});
    this.setState({registerEmail:googleSignIn.user?.email})
    this.setState({username:googleSignIn.user?.displayName})
    if (!(await db.collection('profiles').doc(auth.currentUser?.uid).get()).exists) {
      await this.googleLoginUploadDataToFirebase().then(() => {
        this.props.history.push("/main")
      })
    } else {
      this.props.history.push("/main")
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
    if ( this.state.registerConfirmPassword !== this.state.registerPassword)
      messages.push("Passwords do not match");
    if ( messages !== this.state.registration_error_messages)
      this.setState({registration_error_messages: messages})
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
          console.log(error.message);
          let messages = error.message;
          if ( messages !== this.state.registration_error_messages[0])
            this.setState({registration_error_messages: [messages]})
        })
      })
    }
  }

  async googleLoginUploadDataToFirebase() {
      const createProfile : Promise<void> = db.collection('profiles').doc(auth.currentUser?.uid).set({
            blockedSources:[],
            groups: [],
            displayName: this.state.username,
            photo: '',
            notifications: false
          })

     const createSubs : Promise<void> =  db.collection('topicSubscription').doc(auth.currentUser?.uid).set({
            subList:[],
            privateSubList:[]
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

  async uploadDataToFirebase() {
    const createProfile : Promise<void> = db.collection('profiles').doc(auth.currentUser?.uid).set({
      blockedSources:[],
      groups: [],
      displayName: this.state.username,
      photo: '',
      notifications: false
    })
     const createSubs: Promise<void> = db.collection('topicSubscription').doc(auth.currentUser?.uid).set({
            subList:[],
            privateSubList:[]
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

    return await Promise.all([createProfile, createSubs, createEmail, createOutgoingFriendRequests, createIncomingFriendRequests, createFriends])
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
                  <IonInput value={this.state.loginEmail} className='loginInput' type='email' placeholder = 'Email Address' onIonChange={(e) => {this.setState({loginEmail: (e.target as HTMLInputElement).value})}}  autofocus={true}/>
                </IonItem>

                <IonItem lines='none' className='loginItem'>
                  <IonLabel className='loginLabel' position='floating'></IonLabel>
                  <IonInput value={this.state.loginPassword}  className='loginInput' type='password' placeholder = 'Password' onIonChange={(e) => {this.setState({loginPassword: (e.target as HTMLInputElement).value})}}/>
                </IonItem>
              </div>
              <IonButton shape = 'round' onClick={() => {this.login()}} className='loginButton'>Submit</IonButton>
              <Errors errors={this.state.login_error_messages}></Errors>
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
              <Errors errors={this.state.registration_error_messages}></Errors>
            </div>
        }

          <IonButton shape = 'round' className = 'landingSwitch' onClick={() => {if(this.state.btnText=='Create an Account') this.state.btnText='Log In'; else this.state.btnText='Create an Account';this.setState({shouldLoginShow: !this.state.shouldLoginShow})}} >{this.state.btnText}</IonButton>
          <IonButton shape = 'round' className = 'landingSwitch' onClick= {()=> {this.googleLogin()}}>GOOGLE</IonButton>
        </IonContent>
      </IonPage>
      )
    }

}

export default Landing
