import { IonItem } from '@ionic/react';
import React from 'react';
import ChildComponent from './SubscriptionChild'
import ParentComponent from './SubscriptionParent';

function ChildrenComponent(props: {subs: Array<String>, func: any}) {
    console.log("Child list: "+props.subs.length+" in list");
    // let i = 0;
    // let subs = props.subs.map((item)=> {return <ChildComponent subscription={item} index={i++} ></ChildComponent>});
    let subList = [];
    for (var i = 0; i < props.subs.length; i+=1) {
      subList.push(<ChildComponent key={i} subscription={props.subs[i]} index={i} func={props.func}></ChildComponent>);
  };
  return <ParentComponent>{subList}</ParentComponent>;
} 
export default ChildrenComponent;