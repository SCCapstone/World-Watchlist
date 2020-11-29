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
  IonInput

} from '@ionic/react'
import firebase, {db, auth} from '../firebase'
import {addCircleOutline, closeCircleOutline, newspaperOutline, mailOutline, arrowBackOutline, arrowForwardOutline} from 'ionicons/icons'


import './Settings.css'

type MyState = {
  isBlockSourceModalOpen:boolean;
  isUpdateEmailModalOpen:boolean;
  blockedSources:string[];
  currentUserName:string;
  sourceToBlock:string;
  sourceToUnBlock:string;
  localList:string[];
  newEmail:string;

}

type MyProps = {
  history: any;
  location: any;
}

class Settings extends React.Component<MyProps, MyState> {

  state: MyState = {
    isBlockSourceModalOpen: false,
    isUpdateEmailModalOpen: false,
    blockedSources: [],
    currentUserName :"",
    sourceToBlock:"",
    sourceToUnBlock:"",
    localList: [],
    newEmail:''

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
  }

  blockSource(sourceName:string) {
    if(sourceName!="" && sourceName.length > 3) { //makes sure the source is a valid site and isn't blank
      if(!this.state.localList.includes(sourceName))
        this.state.localList.push(sourceName);
      this.addToList(sourceName);
      this.state.blockedSources.push(sourceName);
      console.log(this.state.blockedSources);
      db.collection('usernames').doc("purple#0#0").get().then(document => {
      if(document.exists && this.isValidSite(sourceName)) {
        db.collection('usernames').doc("purple#0#0").update({
        blockedSources : firebase.firestore.FieldValue.arrayUnion(sourceName)
        })
      }
    })
  }
}

unBlockSource(sourceName:string) {
  if(sourceName!="" ) { //makes sure the source is a valid site and isn't blank
    db.collection('usernames').doc("purple#0#0").get().then(document => {
    if(document.exists) {
      db.collection('usernames').doc("purple#0#0").update({
        blockedSources: firebase.firestore.FieldValue.arrayRemove(sourceName)
      })
    }
  })
}
}

changeEmail(email:string) {
  var user = firebase.auth().currentUser;
  if(email!="" && email.length > 3) { //makes sure the source is a valid site and isn't blank
    db.collection('usernames').doc("purple#0#0").get().then(document => { //works for one specific user currently
    if(document.exists) {
      db.collection('usernames').doc("pruple#0#0").update({
        "email.firebase" : email
      })

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
        <IonHeader>
          <IonToolbar>
            <IonTitle>
              Settings
            </IonTitle>
          </IonToolbar>
        </IonHeader>
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
        </IonContent>
      </IonPage>
      )
    }

}

export default Settings
