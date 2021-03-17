import { IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonHeader, IonIcon, IonImg, IonItem, IonModal, IonText, IonTitle, IonToolbar } from '@ionic/react';
import { closeCircleOutline, removeCircleOutline, trashBinOutline, trashOutline } from 'ionicons/icons';
import React, { useState } from 'react';
import firebase, {db,auth} from '../firebase'
import { Browser } from '@capacitor/core';
function BookmarkChild (props: {bookmark:any, index:any}) {
    const [showModal, setShowModal] = useState(false);
    async function removeBookmark(index:any){
        await db.collection("bookmarks").doc(auth.currentUser?.uid).update({bookmark: firebase.firestore.FieldValue.arrayRemove(props.bookmark[index])})
    }

    async function openURL(url:any){
        await Browser.open({ url: url });
    }
    return (
        <IonItem button onClick={() => { setShowModal(!showModal)} }>
    <IonCard key={props.bookmark.title}>
      <IonCardHeader>
          <IonCardTitle>{props.bookmark.title}</IonCardTitle>
          <IonCardSubtitle>
              {props.bookmark.pubDate}
          </IonCardSubtitle>
      </IonCardHeader>
      <IonCardContent>
          {props.bookmark.description}
      </IonCardContent>
      <IonCardContent>
      <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
          <IonHeader>
              <IonToolbar class='feedToolbar2'>
              <IonButtons slot='start'>
        <IonButton onClick={()=>setShowModal(false)} fill='clear'>
          <IonIcon id='addFriendModalCloseIcon' icon={closeCircleOutline}/>
        </IonButton>
      </IonButtons>
                  <IonTitle class='feedTitle2'>
                      Article content
                  </IonTitle>
              </IonToolbar>
          </IonHeader>
          <IonContent>
                  <IonImg src={props.bookmark.logo}></IonImg>
              <IonItem>
                  <IonText>
                      <h4>
                          {props.bookmark.content}
                      </h4>
                  </IonText>
              </IonItem>
              <IonItem>
              <IonButton color="warning" onClick={() => {openURL(props.bookmark.url)} }>Source</IonButton>
          </IonItem>
          </IonContent>
      </IonModal>
      <IonButtons slot="end">
        <IonButton onClick={() => { removeBookmark(props.index); } }>
              <IonIcon icon={trashOutline}>
              </IonIcon>
        </IonButton>
      </IonButtons>
      </IonCardContent>
  </IonCard>  
    </IonItem>);
}

export default BookmarkChild;