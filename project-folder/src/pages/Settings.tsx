// Clay Mallory
// File input code borrowed from Input code taken from https://medium.com/front-end-weekly/file-input-with-react-js-and-typescript-64dcea4b0a86. I tried to implement this a few other ways that apparently work in Javascript, but not Typescript and this is the only solution I found
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
import {addCircleOutline, closeCircleOutline, newspaperOutline, mailOutline, arrowBackOutline, arrowForwardOutline, personCircleOutline, cloudUploadOutline} from 'ionicons/icons'
import { Capacitor, Plugins, CameraResultType, FilesystemDirectory } from '@capacitor/core';
import './Settings.css'


type MyState = {
  isBlockSourceModalOpen:boolean;
  isChangePasswordModalOpen:boolean;
  isChangeUsernameModalOpen:boolean;
  blockedSources:string[];
  currentUserName:string;
  sourceToBlock:string;
  sourceToUnBlock:string;
  localList:string[];
  newPassword:string;
  newUsername:string;


}

type MyProps = {
  history: any;
  location: any;
}

class Settings extends React.Component<MyProps, MyState> {

  state: MyState = {
    isBlockSourceModalOpen: false,
    isChangePasswordModalOpen: false,
    isChangeUsernameModalOpen: false,
    blockedSources: [],
    currentUserName :'',
    sourceToBlock:"",
    sourceToUnBlock:"",
    localList: [],
    newPassword:'',
    newUsername:'',


  };


  constructor(props: MyProps) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
     this.handleSubmit = this.handleSubmit.bind(this);
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

  async handleChange(selectorFiles: FileList)
    {
        console.log(selectorFiles);
        var storage = firebase.storage();
        var storageRef = firebase.storage().ref();
        var file = selectorFiles[0];
        var uid = firebase.auth().currentUser!.uid;
        var newPicRef = storageRef.child('profileImages/' + uid+ '.jpg');
        newPicRef.put(file);
        await new Promise(r => setTimeout(r, 1000));
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

signOutUser() {
  if ( auth.currentUser) {
    auth.signOut()
  }
}

changePassword(password:string) {
  if(auth.currentUser) {
    auth.currentUser.updatePassword(password).then(function() {


  }).catch(function(error){


  })
}
}

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

    handleSubmit(){
      
      
    }

 

    pullImage() {
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

      })
      .catch((error) => {
  // A full list of error codes is available at
  // https://firebase.google.com/docs/storage/web/handle-errors
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
   // const i = document.getElementById('image')!.files[0];
    var y = React.createRef();
      var storage = firebase.storage();
      var storageRef = firebase.storage().ref();
      var newPicRef = storageRef.child('images/new.jpg');
      var file = document.getElementById('image');
     // var v = file.files;
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
              <IonButton onClick={() => {this.populate();this.setState({isBlockSourceModalOpen: false})}} id='toBlock' fill='clear'>
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
        <IonTitle id ='unblockText'>
        Unblock a Source
        </IonTitle>
        <br/>
        <br/>
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



      <IonModal isOpen={this.state.isChangePasswordModalOpen}>
        <IonHeader>
          <IonToolbar>
            <IonButtons>
              <IonButton onClick={() => {this.setState({isChangePasswordModalOpen: false})}} id='toBlock' fill='clear'>
              <IonIcon id='closeBlockIcon' icon={arrowBackOutline}/>
              </IonButton>
            </IonButtons>

            <IonTitle>
              Change Password

            </IonTitle>
            </IonToolbar>
          </IonHeader>
        <IonContent>
        <IonItem lines='none' id='block'>
          <IonInput class = 'addSource' onIonChange={(e) => {this.setState({newPassword: (e.target as HTMLInputElement).value})}} />
          <IonButton onClick={() => {this.changePassword(this.state.newPassword)}}  fill='clear'>
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
          <IonButton onClick={() => {this.setState({isChangePasswordModalOpen: true})}} fill='clear'>

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
               <IonButtons slot = 'end'>

                  <IonButton id = 'submit'>
              
<input type="file" id = 'fileSelect' onChange={ (e) => (this.handleChange(e.target.files!)) } /> 

 <IonIcon id = 'cloudUploadOutline' icon={cloudUploadOutline}/>
</IonButton>
          
      
         
        </IonButtons>
          </IonItem>
            <IonItem>
            
            
           

          
          </IonItem>
        </IonContent>
      </IonPage>
      )
    }

}

export default Settings
