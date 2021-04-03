import { Plugins } from "@capacitor/core";
// import { IonContent, IonPage } from "@ionic/react";
// import firebase from "firebase";
// import React from "react";
// import { NewsDB } from "../config/config";
// import { auth, db } from "../firebase";
// import Feed from "../pages/Feed";
// import { articleList } from "./ArticleTypes";
// import FeedList from "./FeedList";
// import { FeedProps, FeedState, GroupFeedProps, GroupFeedState } from "./FeedTypes";

import React from "react";
import { db } from "../firebase";
import { article } from "./ArticleTypes";
import FeedList from "./FeedList";

const { Storage } = Plugins;
// class GroupFeed extends Feed {
//     // state: FeedState = {
//     //   articles: [],
//     //   subs: [],
//     //   articlesSearched:[],
//     //   subscribedArticles: undefined,
//     //   CurrentUser: null,
//     //   topicSearched:null,
//     //   showLoading:false,
//     //   showModal:false,
//     //   showSubscription:false,
//     //   allArticles:[],
//     //   locationBased:false,
//     //   isWeatherModalOpen:false,
//     //   isSearchingModal:false,
//     //   showSearchAlert:false,
//     //   showSubscribeAlert:false,
//     //   isChanging:false
//     // };
//     state: FeedState = {
//       articles: [],
//       subs: [],
//       articlesSearched:[],
//       subscribedArticles: undefined,
//       CurrentUser: null,
//       topicSearched:null,
//       showLoading:false,
//       showModal:false,
//       showSubscription:false,
//       allArticles:[],
//       locationBased:false,
//       isSearchingModal:false,
//       showSearchAlert:false,
//       showSubscribeAlert:false,
//       isChanging:false,
//       isWeatherModalOpen: false
//     }
//     state2 = {
//       groupId: ""
//     }
//     constructor(props: GroupFeedProps) {
//       super(props)
//       this.state2 = {groupId: props.groupId};
//       let aList : any = [];
//       auth.onAuthStateChanged(async () => {
//         if(auth.currentUser) {
//           //gets the username of our user
//           await db.collection("users").doc(auth.currentUser.uid).get().then(async doc => {
//             if(doc.data()) {
//               console.log('current user: ' + doc.data()!.username)
//               this.setState({CurrentUser:doc.data()!.username})
//             }
//             // everytime there is a new subscription, update news onto main feed
//             db.collection("topicSubscription").doc(this.state.CurrentUser).onSnapshot(async (sub_list) => {
//               this.setState({articles:[]})
//               this.setState({subs: await sub_list.data()!.subList});
//               if (sub_list.exists) {
//                 console.log("current sub list: ", sub_list.data()!.subList)
//                 for (var i = 0; i < this.state.subs.length; i++) {
//                   var articlesLocal = await Storage.get({key:this.state.subs[i]})
//                   // check local storage if collection exist
//                   if ((articlesLocal.value)?.length === undefined || JSON.parse((articlesLocal.value)).length === 0) {
//                     console.log("local storage empty for", this.state.subs[i])
//                     await NewsDB.collection(this.state.subs[i]).get()
//                   .then(async (snapshot) => {
//                     snapshot.forEach(doc => {
//                       if (doc.exists) {
//                         let articleItem = doc.data();
//                         var html = articleItem.description;
//                         var a = document.createElement("a");
//                         a.innerHTML = html;
//                         var text = a.textContent || a.innerText || "";
//                         aList.push({title: articleItem.Title, link: articleItem.Link, description: text, source:articleItem.source, pubDate:articleItem.pubDate})
//                       } else {
//                         console.log("Cannot find anything in database.")
//                       }
//                     })
//                     var source = snapshot.metadata.fromCache ? "local cache" : "server";
//                     console.log("Sub Articles came from " + source);
//                     await Storage.set({ key: this.state.subs[i], value: JSON.stringify(aList) });
//                     this.setState({articles: aList})
//                   })
//                   } else {
//                     let cache = JSON.parse(articlesLocal.value)
//                     this.setState({articles: cache})
//                     console.log("taking from capacitor cache")
//                   }
//                 }
//               } else {
//                 db.collection("topicSubscription").doc(this.state.CurrentUser).set({subList: []});
//               }
//             })
//           }).catch(function(error) {
//               console.log("Error getting document:", error);
//           });
//           // end of getting data from server
//         }
//       })
//     }

//     getId() {
//       // return groupId
//       return "";
//     }

//     render() {
//       return (<IonContent>
//         <FeedList headerName="Group News" articleList={this.state.articles}></FeedList>
//       </IonContent>)
//     }
//   }

function GroupFeed(props: {headerName: string, articles: article[], openShareModal: (theArticle: article) => void}) {
  // let articles = Array<article>();
  // db.collection('topicSubscription').doc(props.groupId).get().then(docData => {
  //   if (docData.exists) {
  //     let subs = docData.data()?.subList;

  //   }
  // })
  return <FeedList headerName={props.headerName} articleList={props.articles} openShareModal={props.openShareModal}></FeedList>
}
export default GroupFeed;
