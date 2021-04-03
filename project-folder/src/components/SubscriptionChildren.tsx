import { IonItem } from '@ionic/react';
import React from 'react';
import {article} from './ArticleTypes';
import FeedList from './FeedList';
import ChildComponent from './SubscriptionChild'
import ParentComponent from './SubscriptionParent';

function ChildrenComponent(props: {subs: Array<String>, func: any, articles:any[], mode: string, sort: string}) {
    // console.log("Child list: "+props.subs.length+" in list");
    let subs: Array<any> = [];
    if ( props.mode == "cards") {
      subs = props.subs.map((item, index)=> {return <ChildComponent  key={item.toString()} subscription={item}
        index={index} func={props.func} articles={props.articles[index]}></ChildComponent>});
      return <ParentComponent>{subs}</ParentComponent>;
    } else if ( props.mode == "all") {
      props.articles.forEach((subs_articles: Array<article>) => {
        subs_articles.forEach((art: article)=> {
          subs.push(art)
        });
      });
      switch (props.sort) {
        case "title":
          subs = subs.sort((a, b) => a.title < b.title ? -1 : a.title > b.title ? 1 : 0);
          break;
        case "pubDate":
          subs = subs.sort((a, b) => ( new Date(b.pubDate).valueOf() - new Date(a.pubDate).valueOf()));
          break;
      }
      // if ( props.sort == "title") {
      //   subs = subs.sort((a, b) => a.title < b.title ? -1 : a.title > b.title ? 1 : 0);
      // } else if ( props.sort == "pubDate") {
      //   subs = subs.sort((a, b) => ( new Date(a.pubDate).valueOf() - new Date(b.pubDate).valueOf()));
      // }
      return <FeedList headerName={"News"} articleList={subs}></FeedList>
    }
    return <div></div>
} 
export default ChildrenComponent;