import React from 'react';
import { article } from './ArticleTypes';
import './Article.css'
import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle } from '@ionic/react';

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
            <IonCardContent><a href={props.theArticle.link}>source</a></IonCardContent>
        </IonCard>
}
export default Article;