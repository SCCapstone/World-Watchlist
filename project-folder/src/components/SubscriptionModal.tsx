import { IonModal, IonHeader, IonToolbar, IonButtons, IonButton, IonIcon, IonTitle, IonContent, IonCard, IonItem } from "@ionic/react"
import { closeCircleOutline, removeCircleOutline } from "ionicons/icons"
import React, { useState } from "react"
import { article } from "./ArticleTypes"
import ChildrenComponent from "./SubscriptionChildren"
import FeedList from '../components/FeedList';


function SubscriptionModal(props: {unsubButton: any, subscriptions: string[], articles:any[], openShareModal: (theArticle: article, shouldOpen: boolean) => void, mode: string, sort: string}) {
      
return ( <>{<ChildrenComponent subs={props.subscriptions} func={props.unsubButton} articles={ props.articles} openShareModal={props.openShareModal} mode={props.mode} sort={props.sort}></ChildrenComponent>}</>
        
);

}
export default SubscriptionModal;
