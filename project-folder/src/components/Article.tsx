import React from 'react';
import { article } from './ArticleTypes';
import { Plugins } from '@capacitor/core';
import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle } from '@ionic/react';
import './Article.css'
const { Browser } = Plugins;

async function openURL(url:any){
  await Browser.open({ url: url });
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
            <br></br>
              <a onClick={()=>openURL(props.theArticle.link)}>link</a>
              </IonCardContent>
        </IonCard>
}

export default Article;