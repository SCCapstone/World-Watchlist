import React from 'react';
import { article } from './ArticleTypes';
import { Plugins } from '@capacitor/core';
import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonButton, IonItem } from '@ionic/react';
import firebase, {db,auth} from '../firebase'
import './Article.css'

const { Browser } = Plugins;

async function openURL(url:any){
  await Browser.open({ url: url });
}

async function get(){
  
}

 function yeet(a:article) { //yeets an article
  var temp = [];
   db.collection("profiles").doc(auth.currentUser?.uid)
          .onSnapshot(async (doc) => {
             temp = doc.data()!.blockedSources
             temp.push(new URL(a.link).host)
             db.collection('profiles').doc(auth.currentUser?.uid).update({
               blockedSources:temp

       // blockedSources : firebase.firestore.FieldValue.arrayUnion(str)

           })

  })
 
         }




function Article(props: {theArticle: article}) {
    //console.log(props.theArticle);
    return <IonCard>
      <meta httpEquiv="Cache-control" content="no-cache"></meta>
          <IonCardHeader>
            <IonCardTitle>{props.theArticle.title}</IonCardTitle>
            <IonCardSubtitle>
            {props.theArticle.pubDate}
            </IonCardSubtitle>
          </IonCardHeader>
          <IonCardContent>
              {props.theArticle.description}
            </IonCardContent>
           
            <IonCardContent>
            news source: {props.theArticle.source}
            <IonItem>
            <IonButton onClick={()=> {
            const ref = db.collection("profiles").doc(auth.currentUser?.uid)
            const res = ref.update({
              blockedSources: firebase.firestore.FieldValue.arrayUnion(props.theArticle.source)
            });
          }} slot = 'end'>Block this Source</IonButton>
            </IonItem>
            <br></br>
              <a onClick={()=>openURL(props.theArticle.link)}>link</a>
              </IonCardContent>
        </IonCard>
}

export default Article;