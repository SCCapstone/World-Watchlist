import React from 'react';

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
  IonChip

} from '@ionic/react'
import firebase, {db, auth} from '../firebase'
import {addCircleOutline, closeCircleOutline, newspaperOutline, mailOutline, arrowBackOutline, arrowForwardOutline, personCircleOutline} from 'ionicons/icons'
import { Capacitor, Plugins, CameraResultType, FilesystemDirectory } from '@capacitor/core';
import './Settings.css'
const { Camera, Filesystem } = Plugins;
const PHOTO_STORAGE = "photos";
export function usePhotoGallery() {}





type MyState = {
  isBlockSourceModalOpen:boolean;
  isUpdateEmailModalOpen:boolean;
  isChangeUsernameModalOpen:boolean;
  blockedSources:string[];
  currentUserName:string;
  sourceToBlock:string;
  sourceToUnBlock:string;
  localList:string[];
  newEmail:string;
  newUsername:string;


}

type MyProps = {
  history: any;
  location: any;
}

class Settings extends React.Component<MyProps, MyState> {

  state: MyState = {
    isBlockSourceModalOpen: false,
    isUpdateEmailModalOpen: false,
    isChangeUsernameModalOpen: false,
    blockedSources: [],
    currentUserName :'',
    sourceToBlock:"",
    sourceToUnBlock:"",
    localList: [],
    newEmail:'',
    newUsername:'',


  };



  constructor(props: MyProps) {
    super(props)
    this.blockSource = this.blockSource.bind(this);

        if(auth.currentUser) { // gets the name of the current user
          db.collection("users").doc(auth.currentUser.uid).get().then(doc => {
            if(doc.data()) {
              this.setState({currentUserName: doc.data()!.username})
              var temp= db.collection('usernames').doc(this.state.currentUserName).onSnapshot((snapshot) => { //blockedSources not in firebase?
                if(snapshot.data()) {
                 this.setState({blockedSources: snapshot.data()!.blockedSources})
                }
              })
            }
          })
        }
       this.pullImage();
  }

  blockSource(sourceName:string) {
    if(sourceName!="" && sourceName.length > 3) { //makes sure the source is a valid site and isn't blank
      if(!this.state.localList.includes(sourceName))
        this.state.localList.push(sourceName);
      this.addToList(sourceName);
      this.state.blockedSources.push(sourceName);
      console.log(this.state.blockedSources);
      db.collection('usernames').doc(this.state.currentUserName).get().then(document => {
      if(document.exists && this.isValidSite(sourceName)) {
        db.collection('usernames').doc(this.state.currentUserName).update({
        blockedSources : firebase.firestore.FieldValue.arrayUnion(sourceName)
        })
      }
    })
  }
}

unBlockSource(sourceName:string) {
  if(sourceName!="" ) { //makes sure the source is a valid site and isn't blank
    db.collection('usernames').doc(this.state.currentUserName).get().then(document => {
    if(document.exists) {
      db.collection('usernames').doc(this.state.currentUserName).update({
        blockedSources: firebase.firestore.FieldValue.arrayRemove(sourceName)
      })
    }
  })
}
}

changeEmail(email:string) {
  if(this.state.currentUserName!=undefined&& email.length > 3) { //makes sure the source is a valid site and isn't blank
    db.collection('usernames').doc(this.state.currentUserName).get().then(document => { //works for one specific user currently
    if(document.exists) {
      db.collection('usernames').doc(this.state.currentUserName).update({
        "email.firebase" : email
      })

    }
  })
}
  }

  changeUsername(newName:string) {
    if(this.state.currentUserName!=undefined&& newName.length > 3) { //makes sure the source is a valid site and isn't blank
      db.collection('usernames').doc(this.state.currentUserName).get().then(document => { //works for one specific user currently
      if(document.exists) {
        db.collection('usernames').doc(this.state.currentUserName).update({
          "username.firebase" : newName
        })

      }
    })
  }
    }

    pullImage() {
      var storage = firebase.storage();
      var storageRef = firebase.storage().ref();
      var pathReference = storageRef.child('Images/iceland-16-860x484.jpg');
      pathReference.getDownloadURL().then((url)=> {
         var img = document.getElementById('myimg');
         if(img!=null)
          img.setAttribute('src', url);
      })
      .catch((error) => {
  // A full list of error codes is available at
  // https://firebase.google.com/docs/storage/web/handle-errors
  switch (error.code) {
    case 'storage/object-not-found':
      // File doesn't exist
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




   uploadImage() {
    const i = document.getElementById('image');
      var storage = firebase.storage();
      var storageRef = firebase.storage().ref();
      var newPicRef = storageRef.child('images/new.jpg');
      var file = document.getElementById('image');
      if(file!=null) {
      file.addEventListener('change', function(evt) {
        if(evt.target!=null) {
     // let firstFile = evt.target.files[0] // upload the first file only
      //let uploadTask = storageRef.put(firstFile)
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
      return (
      <IonPage>
      <IonModal isOpen={this.state.isBlockSourceModalOpen}>
        <IonHeader>
          <IonToolbar>
            <IonButtons>
              <IonButton onClick={() => {this.setState({isBlockSourceModalOpen: false})}} id='toBlock' fill='clear'>
              <IonIcon id='closeBlockIcon' icon={arrowBackOutline}/>
              </IonButton>
            </IonButtons>
            <IonTitle>
              Block a Source

            </IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
        <IonItem lines='none' id='block'>
          <IonInput class='addSource' onIonChange={(e) => {this.setState({sourceToBlock: (e.target as HTMLInputElement).value})}} />
          <IonButton onClick={() => {this.blockSource(this.state.sourceToBlock)}}  fill='clear'>
            <IonIcon id='addBlockIcon' icon={addCircleOutline} />
          </IonButton>
        </IonItem>
        <br/>
        Unblock
        <IonItem lines='none' id='block'>
          <IonInput class='addSource' onIonChange={(e) => {this.setState({sourceToUnBlock: (e.target as HTMLInputElement).value})}} />
          <IonButton onClick={() => {this.unBlockSource(this.state.sourceToUnBlock)}}  fill='clear'>
            <IonIcon id='addBlockIcon' icon={addCircleOutline} />
          </IonButton>
        </IonItem>
        <br/>
        <IonHeader id = 'blockedSourcesHeader'>You Won't See Content From:</IonHeader>
        <br/>

        <ul id = "blockedList"></ul>
          {
            this.state.blockedSources.map(Blocked =>
              <IonItem key = {Blocked.toString()}>
              <IonItem class = 'blockedListEntry'>{Blocked.toString()}</IonItem>
              </IonItem>
            )}
        </IonContent>
      </IonModal>



      <IonModal isOpen={this.state.isUpdateEmailModalOpen}>
        <IonHeader>
          <IonToolbar>
            <IonButtons>
              <IonButton onClick={() => {this.setState({isUpdateEmailModalOpen: false})}} id='toBlock' fill='clear'>
              <IonIcon id='closeBlockIcon' icon={arrowBackOutline}/>
              </IonButton>
            </IonButtons>

            <IonTitle>
              Update Email

            </IonTitle>
            </IonToolbar>
          </IonHeader>
        <IonContent>
        <IonItem lines='none' id='block'>
          <IonInput class = 'addSource' onIonChange={(e) => {this.setState({newEmail: (e.target as HTMLInputElement).value})}} />
          <IonButton onClick={() => {this.changeEmail(this.state.newEmail)}}  fill='clear'>
            <IonIcon id='addBlockIcon' icon={arrowForwardOutline} />
          </IonButton>
        </IonItem>
        </IonContent>
      </IonModal>

      <IonModal isOpen={this.state.isChangeUsernameModalOpen}>
        <IonHeader>
          <IonToolbar>
            <IonButtons>
              <IonButton onClick={() => {this.setState({isChangeUsernameModalOpen: false})}} id='toBlock' fill='clear'>
              <IonIcon id='closeBlockIcon' icon={arrowBackOutline}/>
              </IonButton>
            </IonButtons>

            <IonTitle>
              Change Username

            </IonTitle>
            </IonToolbar>
          </IonHeader>
        <IonContent>
        <IonItem lines='none' id='block'>
          <IonInput class = 'addSource' onIonChange={(e) => {this.setState({newUsername: (e.target as HTMLInputElement).value})}} />
          <IonButton onClick={() => {this.changeUsername(this.state.newUsername)}}  fill='clear'>
            <IonIcon id='addBlockIcon' icon={arrowForwardOutline} />
          </IonButton>
        </IonItem>
        </IonContent>

      </IonModal>
        <IonHeader>
          <IonToolbar>
            <IonTitle>
              Settings
            </IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonAvatar>
          <img id = 'myimg' />
        </IonAvatar>
        <IonItem>
            <IonLabel>Notifications</IonLabel>
            <IonToggle value="Notifications" />
          </IonItem>

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
          Update Email
        <IonButtons slot='end'>
          <IonButton onClick={() => {this.setState({isUpdateEmailModalOpen: true})}} fill='clear'>

            <IonIcon id = 'emailChangeButton' icon={mailOutline}/>
          </IonButton>
          </IonButtons>
          </IonItem>

          <IonItem id ='changeUsername'>
            Change Username
          <IonButtons slot='end'>
            <IonButton onClick={() => {this.setState({isChangeUsernameModalOpen: true})}} fill='clear'>

              <IonIcon id = 'userNameChangeButton' icon={personCircleOutline}/>
              </IonButton>
              </IonButtons>
              </IonItem>

               <IonItem id ='updateEmail'>
          Change Profile Picture
      
          <input type = 'file' id = 'image'></input>
        
          </IonItem>
            <IonItem>
            
            
           

          
          </IonItem>
        </IonContent>
      </IonPage>
      )
    }

}

export default Settings
