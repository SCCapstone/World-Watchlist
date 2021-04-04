import { IonItem } from '@ionic/react';
import React from 'react';
import {article} from './ArticleTypes';
import FeedList from './FeedList';
import ChildComponent from './SubscriptionChild'
import ParentComponent from './SubscriptionParent';

function ChildrenComponent(props: {allArticles:any[],subs: Array<String>, func: any, articles:any[], openShareModal: (theArticle: article, shouldOpen: boolean) => void, mode: string, sort: string}) {
    // console.log("Child list: "+props.subs.length+" in list");
    if ( props.mode == "cards") {
      let subs = props.subs.map((item, index)=> {return <ChildComponent  key={item.toString()} subscription={item}
        index={index} func={props.func} articles={props.articles[index]} openShareModal={props.openShareModal}></ChildComponent>});
      return <ParentComponent>{subs}</ParentComponent>;
    } else if ( props.mode == "all") {
      let sub2: Array<any> = [];
      switch (props.sort) {
        case "title":
          sub2 = props.allArticles.sort((a, b) => a.title < b.title ? -1 : a.title > b.title ? 1 : 0);
          break;
        case "pubDate":
          sub2 = props.allArticles.sort((a, b) => ( new Date(b.pubDate).valueOf() - new Date(a.pubDate).valueOf()));
          break;
      }
      // if ( props.sort == "title") {
      //   subs = subs.sort((a, b) => a.title < b.title ? -1 : a.title > b.title ? 1 : 0);
      // } else if ( props.sort == "pubDate") {
      //   subs = subs.sort((a, b) => ( new Date(a.pubDate).valueOf() - new Date(b.pubDate).valueOf()));
      // }
      return <FeedList key={sub2.toString()} headerName={"News"} articleList={sub2} openShareModal={props.openShareModal}></FeedList>
    }
    return <div></div>
} 
export default ChildrenComponent;
