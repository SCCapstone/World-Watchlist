import React from 'react';
import { article } from './ArticleTypes';
import { Plugins } from '@capacitor/core';
import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonButton, IonItem, IonIcon } from '@ionic/react';
import firebase, {db,auth} from '../firebase'
import './Article.css'
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';
import { get } from 'http';
import { type } from 'os';
import axios from 'axios';
import { bookmarkOutline, handLeftOutline, newspaper, newspaperOutline } from 'ionicons/icons';
const { Browser  } = Plugins;
const jsdom = require("jsdom");
const { JSDOM } = jsdom;


async function openURL(url:any, title:any){
  const page = await Browser.open({ url: url });
}

async function bookmark(url:any,title:any,description:any,pubDate:any){
  var content:any
  await axios({
    method: 'GET',
    /* scrape articles for content */
    url:'https://world-watchlist-server-8f86e.web.app/url/?url='+url
  })
.then(async (response) => {
  content = await response.data
}).catch((error) => {
  console.log(error)
});
  if (!content) {
    content.logo = "https://i.stack.imgur.com/6M513.png"
    content.content = "Could not scrape article content."
  }
await db.collection("bookmarks").doc(auth.currentUser?.uid).update({bookmark: firebase.firestore.FieldValue.arrayUnion({title:title, description:description, pubDate:pubDate, content:content.content,logo:content.logo || "https://i.stack.imgur.com/6M513.png", url:url})})
}

function Article(props: {theArticle: article}) {
    //console.log(props.theArticle);
    function blockSource() {
      const ref = db.collection("profiles").doc(auth.currentUser?.uid)
      const res = ref.update({
        blockedSources: firebase.firestore.FieldValue.arrayUnion(props.theArticle.source)
      });
    }
    return <IonCard>
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
              <IonButton  onClick={()=>openURL(props.theArticle.link,props.theArticle.title)}>
              <IonIcon icon={newspaperOutline}> </IonIcon>
              </IonButton>
            <IonButton onClick={()=>{bookmark(props.theArticle.link,props.theArticle.title,props.theArticle.description,props.theArticle.pubDate)}}>
              <IonIcon icon={bookmarkOutline}> </IonIcon>
            </IonButton>
            <IonButton onClick={blockSource}>
            <IonIcon icon={handLeftOutline}> </IonIcon> {props.theArticle.source}</IonButton>
              </IonCardContent>
        </IonCard>
}

export default Article;