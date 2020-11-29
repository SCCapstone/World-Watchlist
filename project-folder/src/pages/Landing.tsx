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

type MyState = {
  loginEmail: string;
  loginPassword: string;
  registerEmail: string;
  registerPassword: string;
  registerConfirmPassword: string;
  shouldLoginShow: boolean;
  username: string;
  usernameIdentifier: number;
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
    usernameIdentifier: -1
  };



  constructor(props: MyProps) {
    super(props)

    this.login = this.login.bind(this);
    this.register = this.register.bind(this);
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
      auth.signInWithEmailAndPassword(this.state.loginEmail, this.state.loginPassword).catch((error) => {
        //error handling
        console.log(error.message)

      }).then(() => {
        //user successfully logs in
        //reroute here
        console.log(auth.currentUser)
        if(auth.currentUser) {
          this.props.history.push("/main")
        }
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
    //attempts to register a user
    //field checks

    auth.createUserWithEmailAndPassword(this.state.registerEmail, this.state.registerPassword).catch((error) => {
      //error handling
      console.log(error.message)
    }).then(() => {
      //user successfully registers
      //reroute here
      this.getUsernameIdentifier().then(() => {
        this.props.history.push("/main")
      })

    })
  }

  firstUnusedNumber(myArray: number[]) : number {
    //takes a sorted array of integers and checks each index to find first unused integer
    let max = myArray.length
    for(let i = 0; i < max; i++) {
      if(myArray[i] !== i) {
        return i
      }
    }
    return max
  }

  async getUsernameIdentifier() {
    //Should run when a user registers
    //Assigns numbers to end of Username such as example#0
    db.collection('usernameIdentifiers').doc(this.state.username).get().then((document) => {
      if(document.exists) {
        //someone has used this username before
        if(document.data()) {
            let used_indentifiers = document.data()!.identifiers
            let identifier = this.firstUnusedNumber(used_indentifiers)
            this.setState({usernameIdentifier: identifier})
            let new_identifiers = used_indentifiers.push(identifier)
            new_identifiers = new_identifiers.sort()
            db.collection('usernameIdentifiers').doc(this.state.username).update({
              identifiers: new_identifiers
            })
        }
      }
      //document doesnt exist
      else {
        db.collection('usernameIdentifiers').doc(this.state.username).set({
          identifiers: [0]
        })
        this.setState({usernameIdentifier: 0})
      }
      db.collection('users').doc(auth.currentUser?.uid).set({
        blockedSources:[],
        groups: [],
        username: this.state.username + '#' + this.state.usernameIdentifier.toString()
      })
      db.collection('usernames').doc(this.state.username + '#' + this.state.usernameIdentifier.toString()).set({
        blockedSources:[],
        groups: [],
        username: this.state.username + '#' + this.state.usernameIdentifier.toString(),
        outgoingFriendRequests: [],
        incomingFriendRequests: []
      })
      db.collection("outgoingFriendRequests").doc(this.state.username + '#' + this.state.usernameIdentifier.toString()).set({
        outgoingFriendRequests: []
      })
      db.collection("incomingFriendRequests").doc(this.state.username + '#' + this.state.usernameIdentifier.toString()).set({
        incomingFriendRequests: []
      })
      db.collection("friends").doc(this.state.username + '#' + this.state.usernameIdentifier.toString()).set({
        friendsList: []
      })
    })


  }


    render() {
      return (
      <IonPage>
        <IonHeader>
          <IonToolbar className='landingToolbar'>
            <IonTitle>
              {this.state.shouldLoginShow ? 'Login' : 'Register'}
            </IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className='landingContent'>
        {
          this.state.shouldLoginShow ?
            <div className='loginContainer'>
              <div id='loginInputContainer'>
                <IonItem lines='none' className='loginItem'>
                <IonLabel className='loginLabel' position='floating'>Email</IonLabel>
                  <IonInput value={this.state.loginEmail} className='loginInput' type='email' placeholder = 'Email Address' onIonChange={(e) => {this.setState({loginEmail: (e.target as HTMLInputElement).value})}} />
                </IonItem>

                <IonItem lines='none' className='loginItem'>
                  <IonLabel className='loginLabel' position='floating'>Password</IonLabel>
                  <IonInput value={this.state.loginPassword}  className='loginInput' type='password' placeholder = 'Password' onIonChange={(e) => {this.setState({loginPassword: (e.target as HTMLInputElement).value})}}/>
                </IonItem>
              </div>
              <IonButton onClick={() => {this.login()}} className='loginButton'>Submit</IonButton>
            </div>
          :
            <div className='registerContainer'>
              <div id='registerInputContainer'>
                <IonItem lines='none' className='registerItem'>
                <IonLabel className='registerLabel' position='floating' id = 'email'>Email</IonLabel>
                  <IonInput value={this.state.registerEmail} className='registerInput' type='email' placeholder = 'Email Address' onIonChange={(e) => {this.setState({registerEmail: (e.target as HTMLInputElement).value})}} />
                </IonItem>

                <IonItem lines='none' className='registerItem'>
                  <IonLabel className='registerLabel' position='floating'>Password</IonLabel>
                  <IonInput value={this.state.registerPassword} className='registerInput' type='password' placeholder = 'Password' onIonChange={(e) => {this.setState({registerPassword: (e.target as HTMLInputElement).value})}}/>
                </IonItem>

                <IonItem lines='none' className='registerItem'>
                  <IonLabel className='registerLabel' position='floating'>Confirm Password</IonLabel>
                  <IonInput value={this.state.registerConfirmPassword}  className='registerInput' type='password' placeholder = 'Confirm Password' onIonChange={(e) => {this.setState({registerConfirmPassword: (e.target as HTMLInputElement).value})}}/>
                </IonItem>

                <IonItem lines='none' className='registerItem'>
                  <IonLabel className='registerLabel' position='floating'>Username</IonLabel>
                  <IonInput value={this.state.username} className='registerInput' type='text' placeholder = 'Username' onIonChange={(e) => {this.setState({username: (e.target as HTMLInputElement).value})}}/>
                </IonItem>
              </div>
              <IonButton onClick={() => {this.register()}} className='registerButton'>Submit</IonButton>
            </div>
        }

          <IonButton className = 'landingSwitch' onClick={() => {this.setState({shouldLoginShow: !this.state.shouldLoginShow})}} >Switch</IonButton>
        </IonContent>
      </IonPage>
      )
    }

}

export default Landing
