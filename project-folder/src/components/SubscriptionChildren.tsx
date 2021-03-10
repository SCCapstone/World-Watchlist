import { IonItem } from '@ionic/react';
import React from 'react';
import ChildComponent from './SubscriptionChild'
import ParentComponent from './SubscriptionParent';

function ChildrenComponent(props: {subs: Array<String>, func: any, articles:any[]}) {
    // console.log("Child list: "+props.subs.length+" in list");
    let subs = props.subs.map((item, index)=> {return <ChildComponent key={item.toString()} subscription={item}
     index={index} func={props.func} articles={props.articles[index]}></ChildComponent>});
  return <ParentComponent>{subs}</ParentComponent>;
} 
export default ChildrenComponent;