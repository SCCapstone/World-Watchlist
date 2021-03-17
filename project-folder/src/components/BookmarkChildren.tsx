import { IonItem } from '@ionic/react';
import React from 'react';
import ParentComponent from './SubscriptionParent';
import BookmarkChild from './BookmarkChild'
function BookmarkChildren(props: {bookmark: any}) {
    // console.log("Child list: "+props.subs.length+" in list");
    let bookmark = props.bookmark.map((bookmark:any, index:any)=> {return <BookmarkChild key={bookmark.title.toString()} 
     bookmark={bookmark} index={index}></BookmarkChild>});
  return <ParentComponent>{bookmark}</ParentComponent>;
} 
export default BookmarkChildren;