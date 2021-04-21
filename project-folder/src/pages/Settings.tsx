// (Mostly) Clay Mallory
// File input code borrowed from https://medium.com/front-end-weekly/file-input-with-react-js-and-typescript-64dcea4b0a86.
import React, { useState } from 'react';
import { IonReactRouter } from '@ionic/react-router';
import { PushNotification, PushNotificationToken, PushNotificationActionPerformed, Capacitor, Plugins, CameraResultType, FilesystemDirectory} from '@capacitor/core';

import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonContent,
  IonTitle,
  IonButton,
  IonButtons,
  IonItem,
  IonLabel,
  IonToggle,
  IonIcon,
  IonModal,
  IonInput,
  IonAvatar,
  IonChip,
  IonAlert

} from '@ionic/react'

import firebase, {db, auth, signInWithGoogle} from '../firebase'
import "@codetrix-studio/capacitor-google-auth";

import {addCircleOutline, closeOutline, closeCircleOutline, newspaperOutline, exitOutline, mailOutline, arrowBackOutline, arrowForwardOutline, personCircleOutline, cloudUploadOutline} from 'ionicons/icons'
import './Settings.css'
import { isEnterKey } from '../components/TempFunctions';
 const { PushNotifications } = Plugins;
 const { Toast } = Plugins;
 const isPushAvailable = Capacitor.isPluginAvailable("PushNotifications");
 const { FCMPlugin, Storage } = Plugins;

type MyState = {
  isBlockSourceModalOpen:boolean;
  isAccountSettingsModalOpen:boolean;
  isChangePasswordModalOpen:boolean;
  isChangeUsernameModalOpen:boolean;
  isSignOutModalOpen:boolean;
  signOutAlert:boolean;
  blockedSources:string[];
  topics:[];
  currentUserName:string;
  sourceToBlock:string;
  sourceToUnBlock:string;
  localList:string[];
  newPassword:string;
  newUsername:string;
  notifications: [{}];
  isSubbed:boolean;
  profileImage: string;


}

type MyProps = {
  history: any;
  location: any;
}

class Settings extends React.Component<MyProps, MyState> {

  state: MyState = {
    profileImage:'',
    isBlockSourceModalOpen: false,
    isAccountSettingsModalOpen:false,
    isChangePasswordModalOpen: false,
    signOutAlert:false,
    isChangeUsernameModalOpen: false,
    isSignOutModalOpen: false,
    blockedSources: [],
    topics:[],
    currentUserName :'',
    sourceToBlock:"",
    sourceToUnBlock:"",
    localList: [],
    isSubbed:false,
    newPassword:'',
    newUsername:'',
    notifications:[{ id: 'id', title: 'Test', body: "Test Notification" }]
  };

  constructor(props: MyProps) {
    super(props);
    console.log("Here" + this.state.currentUserName);
    this.handleChange = this.handleChange.bind(this);
     //this.handleSubmit = this.handleSubmit.bind(this);
    this.blockSource = this.blockSource.bind(this);
    // call if authentication change to reset data.
      firebase.auth().onAuthStateChanged(() => {
        if(auth.currentUser) { // gets the name of the current user
          db.collection("profiles").doc(auth.currentUser.uid).get().then(doc => {
            if(doc.data()) {
              this.setState({currentUserName: doc.data()!.displayName})
              this.setState({isSubbed: doc.data()!.isSubbed})
              console.log(this.state.isSubbed)

              var temp= db.collection('profiles').doc(firebase.auth().currentUser!.uid).onSnapshot((snapshot) => { //blockedSources not in firebase?
                if(snapshot.data()) {
                 this.setState({blockedSources: snapshot.data()!.blockedSources})
                 console.log(this.state.blockedSources)
               //  this.setState({topics: snapshot.data()!.subList})
                // this.setState({currentUserName: snapshot.data()!.displayName})
                }
              })
            
            }
          })

        }
        else
          this.props.history.push("/landing")
      })
       this.pullImage();
      
  }



  async show() {
  await Toast.show({
    text: 'Hello!'
  });
}

  // push() { // This code is borrowed from https://enappd.com/blog/firebase-push-notification-in-ionic-react-capacitor/111/
    
  //   PushNotifications.register();
  //   var temp = this.state.topics;
  //   for(var i = 0; i < temp.length; i++) {
  //     PushNotifications.register().then(()=> {
  //       FCMPlugin.subscribeTo({topic:temp[i]})
  //     }).catch((err)=>console.log(err));
  // }

  //   // On succcess, we should be able to receive notifications
  //   PushNotifications.addListener('registration',
  //     (token: PushNotificationToken) => {
  //       alert('Push registration success, token: ' + token.value);
  //     }
  //   );

  //   // Some issue with your setup and push will not work
  //   PushNotifications.addListener('registrationError',
  //     (error: any) => {
  //       alert('Error on registration: ' + JSON.stringify(error));
  //     }
  //   );

  //   // Show us the notification payload if the app is open on our device
  //   PushNotifications.addListener('pushNotificationReceived',
  //     (notification: PushNotification) => {
  //       let notif = this.state.notifications;
  //       notif.push({ id: notification.id, title: notification.title, body: notification.body })
  //       this.setState({
  //         notifications: notif
  //       })
  //     }
  //   );

  //   // Method called when tapping on a notification
  //   PushNotifications.addListener('pushNotificationActionPerformed',
  //     (notification: PushNotificationActionPerformed) => {
  //       let notif = this.state.notifications;
  //       notif.push({ id: notification.notification.data.id, title: notification.notification.data.title, body: notification.notification.data.body })
  //       this.setState({
  //         notifications: notif
  //       })
  //     }
  //   );
  // }



  async handleChange(selectorFiles: FileList)
    {
      if(selectorFiles!=null) {
        console.log(selectorFiles);
        var storage = firebase.storage();
        var storageRef = firebase.storage().ref();
        var file = selectorFiles[0];
        var uid = firebase.auth().currentUser!.uid;
        var newPicRef = storageRef.child('profileImages/' + uid+ '.jpg');

        newPicRef.put(file);
        await new Promise(r => setTimeout(r, 1000));
        if(file.size < 2097152){
        newPicRef.getDownloadURL().then((url) => {
          db.collection('profiles').doc(auth.currentUser?.uid).update({
            photo: url
          })
        })

        this.pullImage();
      }
      else {
        console.log("Image is too big")
      }
    }
  }



  blockSource(sourceName:string) {
    if(sourceName!="" && sourceName.length > 3) { //makes sure the source is a valid site and isn't blank
      if(!this.state.localList.includes(sourceName))
        this.state.localList.push(sourceName);
      this.addToList(sourceName);
      const ref = db.collection("profiles").doc(auth.currentUser?.uid)
      const res = ref.update({
        blockedSources: firebase.firestore.FieldValue.arrayUnion(sourceName)
      });
  }
}

unBlockSource(sourceName:string) {
  if(sourceName!="" ) { //makes sure the source is a valid site and isn't blank
    db.collection('profiles').doc(firebase.auth().currentUser!.uid).get().then(document => {
    if(document.exists) {
      db.collection('profiles').doc(firebase.auth().currentUser!.uid).update({
        blockedSources: firebase.firestore.FieldValue.arrayRemove(sourceName)
      })
    }
  })
}
}

populate() {
var temp = this.state.blockedSources;
for (var i = temp.length - 1; i >= 0; i--) {
  this.addToList(temp[i]);
}

}

isEmailAddress(anEmail: string) {
  return anEmail !== "" && anEmail.includes("@");
}

changeEmail(newEmail: string) {
  if(auth.currentUser && this.isEmailAddress(newEmail)) {
    auth.currentUser.updateEmail(newEmail).then(function() {

  }).catch(function(error){

  })
}
}

changeDisplayName(newName: string) {
  if(auth.currentUser) {
     db.collection('profiles').doc(firebase.auth().currentUser!.uid).get().then(document => {
      if(document.exists) {
        db.collection('profiles').doc(firebase.auth().currentUser!.uid).update({
        displayName : newName
        })
      }
    })
  }

    
}


  async signOutUser() {
  if (auth.currentUser) {
    
    if(firebase.auth.GoogleAuthProvider.PROVIDER_ID == "GOOGLE_SIGN_IN_METHOD")
      await Plugins.GoogleAuth.signOut()
    else 
      auth.signOut()
    await Storage.set({key:'isLoggedIn', value:JSON.stringify(false)});
    this.props.history.push("/landing")
  }
  const alert = document.createElement('IonAlert');

}

  changePassword(password:string) {
  if(auth.currentUser) {
    auth.currentUser.updatePassword(password).then( () => {
        alert("Password change successful");
        this.setState({isChangePasswordModalOpen: false});
    }).catch(function(error){
      alert(error.message);

    })
  }
}

// notify() {

//   db.collection('profiles').doc(firebase.auth().currentUser!.uid).update({
//           notifications:this.state.isSubbed,
         
//         })
//   if(isPushAvailable&&this.state.isSubbed) 
//     this.push();
//   else if(!this.state.isSubbed) {

//   }


    
// }

/*changeEmail(email:string) {
  if(this.state.currentUserName!=undefined&& email.length > 3) { //makes sure the source is a valid site and isn't blank
    db.collection('usernames').doc(this.state.currentUserName).get().then(document => { //works for one specific user currently
    if(document.exists) {
      db.collection('usernames').doc(this.state.currentUserName).update({
        "email.firebase" : email
      })

    }
  })
}
  }*/

  changeUsername(newName:string) {
    if(this.state.currentUserName !== undefined && this.state.currentUserName !== newName && newName.length > 3) { //makes sure the source is a valid site and isn't blank & isn't the same name
      db.collection('profiles').doc(firebase.auth().currentUser!.uid).get().then(document => { //works for one specific user currently
      if(document.exists) {
        db.collection('profiles').doc(firebase.auth().currentUser!.uid).update({
          displayName:newName,
         

        })
        this.setState({currentUserName : newName});
        alert("Changed name to "+newName);
        this.setState({isChangeUsernameModalOpen: false});
      }
    })
  }

    }



    pullImage(){
      if(auth.currentUser) {
      var storage = firebase.storage();
      var storageRef = firebase.storage().ref();
      var pathReference;
      var pathName = 'profileImages/' +firebase.auth().currentUser!.uid+'.jpg';
      pathReference = storageRef.child(pathName);

        pathReference.getDownloadURL().then((url)=> {
         var img = document.getElementById('myimg');
         if(img!=null)
          img.setAttribute('src', url);
        console.log("pulling")

      })
      .catch((error) => {

  switch (error.code) {
    case 'storage/object-not-found':
    firebase.storage().ref().child('placeholder.png').getDownloadURL().then((url)=> {
         var img = document.getElementById('myimg');
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







   uploadImage() {
    var y = React.createRef();
      var storage = firebase.storage();
      var storageRef = firebase.storage().ref();
      var newPicRef = storageRef.child('profileImages/' + firebase.auth().currentUser!.uid + '.jpg');
      var file = document.getElementById('image');
      if(file!=null) {
      file.addEventListener('change', function(evt) {
        if(evt.target!=null) {
      }
  })
  }
    }


addToList(name:string) {
  if(!this.state.localList.includes(name)) {
    var list = document.getElementById("blockedList");
    var entry = document.createElement("li");
    entry.setAttribute("id", name);
    entry.appendChild(document.createTextNode(name));
  if(list!=null)
    list.appendChild(entry);
  console.log(list);
}

}

isValidSite(siteName:string) {
  if(siteName!='' && siteName.length>4) {
    if(siteName.substring(siteName.length-4, siteName.length-3)=='.') {
      var domainType = siteName.substring(siteName.length-3);
      if(domainType == 'com'|| domainType=='org'||domainType == 'net')
      return true;
    }
    }
    return false;
    }



    render() {
      const { notifications } = this.state;
      return (
      <IonPage>
      <IonModal isOpen={this.state.isBlockSourceModalOpen} onDidDismiss={() => {this.setState({isBlockSourceModalOpen: false})}}>
        <IonHeader>
          <IonToolbar class='settingsToolbar2'>
            <IonButtons>
              <IonButton onClick={() => {this.populate();this.setState({isBlockSourceModalOpen: false})}} id='toBlock' fill='clear'>
              <IonIcon id='closeBlockIcon' icon={arrowBackOutline}/>
              </IonButton>
            </IonButtons>
            <IonTitle class='settingsTitle2'>
              Block a Source
            </IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
        <h4 id = 'blockedSourcesHeader'>(Please include https:// in your sources)</h4>
        <IonItem lines='none' id='block'>
          <IonInput class='addSource' onKeyDown={(e) => {if (isEnterKey(e)) this.blockSource(this.state.sourceToBlock)}} onIonChange={(e) => {this.setState({sourceToBlock: (e.target as HTMLInputElement).value})}} />
          <IonButton onClick={() => {this.blockSource(this.state.sourceToBlock)}}  fill='clear'>
            <IonIcon id='addBlockIcon' icon={addCircleOutline} />
          </IonButton>
        </IonItem>
        <br/>
        <IonTitle id ='unblockText'>
        Unblock a Source
        </IonTitle>
        <br/>
       
        <IonHeader id = 'blockedSourcesHeader'>(Go to the feed page and refresh by scrolling down to see your sources blocked)</IonHeader>
        <br/>
        <ul id = "blockedList"></ul>
          {
            this.state.blockedSources.map(Blocked =>
              <IonItem key = {Blocked.toString()}>
              <IonItem class = 'blockedListEntry'>{Blocked.toString()}</IonItem>
                <IonButton slot = "end" onClick={() => {this.unBlockSource(Blocked.toString())}}  fill='clear'>
            <IonIcon id='addBlockIcon' icon={closeOutline} />
          </IonButton>
              </IonItem>
            )}
        </IonContent>
      </IonModal>



      <IonModal isOpen={this.state.isChangePasswordModalOpen} onDidDismiss={() => {this.setState({isChangePasswordModalOpen: false})}}>
        <IonHeader>
          <IonToolbar class='settingsToolbar2'>
            <IonButtons>
              <IonButton onClick={() => {this.setState({isChangePasswordModalOpen: false})}} id='toBlock' fill='clear'>
              <IonIcon id='closeBlockIcon' icon={arrowBackOutline}/>
              </IonButton>
            </IonButtons>

            <IonTitle class='settingsTitle2'>
              Change Password

            </IonTitle>
            </IonToolbar>
          </IonHeader>
        <IonContent>
        <IonItem lines='none' id='block'>
          <IonInput class = 'addSource' onKeyDown={(e) => {if (isEnterKey(e)) this.changePassword(this.state.newPassword)}} onIonChange={(e) => {this.setState({newPassword: (e.target as HTMLInputElement).value})}} />
          <IonButton onClick={() => {this.changePassword(this.state.newPassword)}}  fill='clear' placeholder='Enter new password'>
            <IonIcon id='addBlockIcon' icon={arrowForwardOutline} />
          </IonButton>
        </IonItem>
        </IonContent>
      </IonModal>

      <IonModal isOpen={this.state.isChangeUsernameModalOpen} onDidDismiss={() => {this.setState({isChangeUsernameModalOpen: false})}}>
        <IonHeader>
          <IonToolbar class='settingsToolbar2'>
            <IonButtons>
              <IonButton onClick={() => {this.setState({isChangeUsernameModalOpen: false})}} id='toBlock' fill='clear'>
              <IonIcon id='closeBlockIcon' icon={arrowBackOutline}/>
              </IonButton>
            </IonButtons>

            <IonTitle class='settingsTitle2'>
              Change Username

            </IonTitle>
            </IonToolbar>
          </IonHeader>
        <IonContent>
        <IonItem lines='none' id='block'>
          <IonInput class = 'addSource' onKeyDown={(e) => {if (isEnterKey(e)) this.changeUsername(this.state.newUsername)}} onIonChange={(e) => {this.setState({newUsername: (e.target as HTMLInputElement).value})}} />
          <IonButton onClick={() => {this.changeUsername(this.state.newUsername)}}  fill='clear'>
            <IonIcon id='addBlockIcon' icon={arrowForwardOutline} />
          </IonButton>
        </IonItem>
        </IonContent>

      </IonModal>
      <IonModal isOpen={this.state.isAccountSettingsModalOpen} onDidDismiss={() => {this.setState({isAccountSettingsModalOpen: false})}}>
        <IonHeader>
          <IonToolbar class='settingsToolbar2'>
            <IonButtons>
              <IonButton onClick={() => {this.setState({isAccountSettingsModalOpen: false})}} id='toBlock' fill='clear'>
              <IonIcon id='closeBlockIcon' icon={arrowBackOutline}/>
              </IonButton>
            </IonButtons>

            <IonTitle class='settingsTitle2'>
              Account Settings
            </IonTitle>
            </IonToolbar>
          </IonHeader>
        <IonContent>
        <IonItem id ='changeUsername'>

            Sign Out
          <IonButtons slot='end'>
            <IonButton onClick={() => {this.setState({signOutAlert:true})}} fill='clear'>
              <IonIcon id = 'userNameChangeButton' icon={exitOutline}/>
              </IonButton>
              <IonAlert
          isOpen= {this.state.signOutAlert}
          onDidDismiss={() => this.setState({signOutAlert:false})}
          
          header={'Are you sure you want to sign out?'}
         
          
          buttons={[
            {
              text: 'No',
              role: 'cancel',
              cssClass: 'secondary',
              handler: blah => {
                console.log('Confirm Cancel: blah');
              }
            },
            {
              text: 'Yes',
              handler: () => {
                {this.signOutUser();
                  this.setState({isAccountSettingsModalOpen:false})

                };
              }
            }
          ]}
        />
              </IonButtons>
              </IonItem>
        
          
        <IonItem id ='changeUsername'>
            Change Display Name
          <IonButtons slot='end'>
            <IonButton onClick={() => {this.setState({isChangeUsernameModalOpen: true})}} fill='clear'>

              <IonIcon id = 'userNameChangeButton' icon={personCircleOutline}/>
              </IonButton>
              </IonButtons>
              </IonItem>

               <IonItem id ='updateEmail'>
          Change Password
        <IonButtons slot='end'>
          <IonButton onClick={() => {this.setState({isChangePasswordModalOpen: true})}} fill='clear'>

            <IonIcon id = 'emailChangeButton' icon={mailOutline}/>
          </IonButton>
          </IonButtons>
          </IonItem>

        </IonContent>
      </IonModal>
        <IonHeader>
          <IonToolbar class='settingsToolbar'>
            <IonTitle class='settingsTitle'>
              Settings
            </IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonItem>
        <IonAvatar>
          <input type="file" id = 'fileSelect' onChange={ (e) => (this.handleChange(e.target.files!)) } />
          <img id = 'myimg' />
        </IonAvatar>
        {this.state.currentUserName}
        </IonItem>
        {/* <IonItem>
            <IonLabel>Notifications</IonLabel>
            <IonToggle checked = {this.state.isSubbed} onClick={(()=> {this.state.isSubbed = !this.state.isSubbed; this.push();this.notify()})} value="Notifications" />
          </IonItem> */}

        <IonContent>
        <IonItem>
        Content Filter
        <IonButtons slot='end'>
          <IonButton onClick={() => {this.setState({isBlockSourceModalOpen: true})}} fill='clear'>
            <IonIcon id = 'contentFilterButton' icon={newspaperOutline} />
          </IonButton>
        </IonButtons>
        </IonItem>

               <IonItem id ='updateEmail'>
               Change Profile Picture
               <IonButtons slot = 'end'>

                  <IonButton id = 'submit'>

        <input type="file" accept="image/x-png,image/gif,image/jpeg" id = 'fileSelect' onChange={ (e) => (this.handleChange(e.target.files!)) } />

       <IonIcon id = 'cloudUploadOutline' icon={cloudUploadOutline}/>
        </IonButton>



        </IonButtons>
          </IonItem>
            

              <IonItem id ='changeUsername'>
            Account Settings
          <IonButtons slot='end'>
            <IonButton onClick={() => {this.setState({isAccountSettingsModalOpen: true})}} fill='clear'>

              <IonIcon id = 'userNameChangeButton' icon={personCircleOutline}/>
              </IonButton>
              </IonButtons>
              </IonItem>



        </IonContent>
      </IonPage>
      )
    }

}

export default Settings
