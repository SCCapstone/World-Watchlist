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
          </IonCardHeader>
          <IonCardContent>
              {props.theArticle.description}
            </IonCardContent>
            <IonCardContent><a onClick={()=>openURL(props.theArticle.link)}>source</a></IonCardContent>
        </IonCard>
}

export default Article;