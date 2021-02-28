import { IonList, IonListHeader } from "@ionic/react";
import React from "react";
import ArticleList from "./ArticleList";
import { article } from "./ArticleTypes";

import './FeedList.css'

function FeedList( props: {headerName: string, articleList: Array<article>}) {
    return (
    <IonList>
        <IonListHeader id="feedHeader">
          {props.headerName}
        </IonListHeader>
        <ArticleList theArticleList={props.articleList}></ArticleList>
    </IonList>)
}
export default FeedList;