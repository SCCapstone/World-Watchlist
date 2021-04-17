import React, { useState } from 'react';
import { article } from './ArticleTypes';
import { Plugins } from '@capacitor/core';
import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonButton, IonItem, IonIcon, IonLoading, IonAlert } from '@ionic/react';
import firebase, {db,auth} from '../firebase'
import './Article.css'
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';
import { get } from 'http';
import { type } from 'os';
import axios from 'axios';
import { bookmarkOutline, handLeftOutline, newspaper, newspaperOutline, sendOutline } from 'ionicons/icons';
const { Browser , Storage } = Plugins;

function Article(props: {theArticle: article, openShareModal: (theArticle: article, shouldOpen: boolean) => void}) {

  const [showLoading, setShowLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showBlockAlert, setShowBlockAlert] = useState(false);
  const [showErrorAlert, setshowErrorAlert] = useState(false);

  async function openURL(url:any, title:any){
    await Browser.open({ url: url });
  }

  async function bookmark(url:any,title:any,description:any,pubDate:any){
    setShowLoading(true)
    var content:any
    await axios({
      method: 'GET',
      /* scrape articles for content */
      url:'https://world-watchlist-server-8f86e.web.app/url/?url='+url
    })
    .then(async (response) => {
      content = await response.data
      console.log(response)
      if (!content || content.content=="" || content==='error') {
        let logo = "https://www.trendsetter.com/pub/media/catalog/product/placeholder/default/no_image_placeholder.jpg"
        let content = "Check out the full coverage from the source."
        await db.collection("bookmarks").doc(auth.currentUser?.uid).update({bookmark: firebase.firestore.FieldValue.arrayUnion({title:title, description:description, pubDate:pubDate, content:content,logo:logo, url:url})})
        setShowLoading(false)
        setshowErrorAlert(true)
      } else {
        await db.collection("bookmarks").doc(auth.currentUser?.uid).update({bookmark: firebase.firestore.FieldValue.arrayUnion({title:title, description:description, pubDate:pubDate, content:content.content,logo:content.logo || "https://www.trendsetter.com/pub/media/catalog/product/placeholder/default/no_image_placeholder.jpg", url:url})})
        setShowLoading(false)
      }
    }).catch((error) => {
      console.log(error)
    });
    
  }

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
            <IonAlert
          isOpen={showBlockAlert}
          onDidDismiss={() => setShowBlockAlert(false)}
          subHeader={'Blocked!'}
          message={'Check out your list of blocked sources in the settings.'}      
        />
            <IonLoading
              isOpen={showLoading}
              onDidDismiss={()=>{setShowLoading(false); setShowAlert(true)}}
              message={'Loading...'}
              duration={800000}
            />
            <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          subHeader={'Bookmarked!'}
          message={'Check them out in the bookmark tab.'}      
        />
        <IonAlert
          isOpen={showErrorAlert}
          onDidDismiss={() => setshowErrorAlert(false)}
          subHeader={'Bookmarked!'}
          message={'Unable to scrape content, checkout the coverage in the source page!'}      
        />
              <IonButton  onClick={()=>openURL(props.theArticle.link,props.theArticle.title)}>
              <IonIcon icon={newspaperOutline}> </IonIcon>
              </IonButton>
            <IonButton onClick={()=>{bookmark(props.theArticle.link,props.theArticle.title,props.theArticle.description,props.theArticle.pubDate)}}>
              <IonIcon icon={bookmarkOutline}> </IonIcon>
            </IonButton>
            <IonButton onClick={()=>{props.openShareModal(props.theArticle, true)}}>
              <IonIcon icon={sendOutline}> </IonIcon>
            </IonButton>
            <IonButton onClick={()=>{setShowBlockAlert(true);blockSource()}}>
            <IonIcon icon={handLeftOutline}> </IonIcon> {props.theArticle.source}</IonButton>
              </IonCardContent>
        </IonCard>
}

export default Article;
