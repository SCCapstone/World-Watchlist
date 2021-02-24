import { Plugins } from "@capacitor/core";
import { NewsDB } from "../config/config";
import { auth, db } from "../firebase";
import Feed from "../pages/Feed";
import { articleList } from "./ArticleTypes";
import { MyProps, MyState } from "./FeedTypes";

const { Storage } = Plugins;
class GroupFeed extends Feed {
    state: MyState = {
      articles: [],
      subs: [],
      articlesSearched:[],
      subscribedArticles: undefined,
      CurrentUser: null,
      topicSearched:null,
      showLoading:false,
      showModal:false,
      showSubscription:false,
      allArticles:[],
      locationBased:false,
      isWeatherModalOpen:false,
      isSearchingModal:false,
      showSearchAlert:false,
      showSubscribeAlert:false
    };
  
    constructor(props: MyProps) {
      super(props)
      let aList : articleList = [];
      this.toggleWeatherModal = this.toggleWeatherModal.bind(this);
      auth.onAuthStateChanged(async () => {
        if(auth.currentUser) {
          //gets the username of our user
          await db.collection("users").doc(auth.currentUser.uid).get().then(async doc => {
            if(doc.data()) {
              console.log('current user: ' + doc.data()!.username)
              this.setState({CurrentUser:doc.data()!.username})
            }
            // everytime there is a new subscription, update news onto main feed
            db.collection("topicSubscription").doc(this.state.CurrentUser).onSnapshot(async (sub_list) => {
              this.setState({articles:[]})
              this.setState({subs: await sub_list.data()!.subList});
              if (sub_list.exists) {
                console.log("current sub list: ", sub_list.data()!.subList)
                for (var i = 0; i < this.state.subs.length; i++) {
                  var articlesLocal = await Storage.get({key:this.state.subs[i]})
                  // check local storage if collection exist
                  if ((articlesLocal.value)?.length === undefined || JSON.parse((articlesLocal.value)).length === 0) {
                    console.log("local storage empty for", this.state.subs[i])
                    await NewsDB.collection(this.state.subs[i]).get()
                  .then(async (snapshot) => {
                    snapshot.forEach(doc => {
                      if (doc.exists) {
                        let articleItem = doc.data();
                        var html = articleItem.description; 
                        var a = document.createElement("a"); 
                        a.innerHTML = html; 
                        var text = a.textContent || a.innerText || ""; 
                        aList.push({title: articleItem.Title, link: articleItem.Link, description: text})
                      } else {
                        console.log("Cannot find anything in database.")
                      }
                    })
                    var source = snapshot.metadata.fromCache ? "local cache" : "server";
                    console.log("Sub Articles came from " + source);
                    await Storage.set({ key: this.state.subs[i], value: JSON.stringify(aList) });
                    this.setState({articles: aList})
                  })
                  } else {
                    let cache = JSON.parse(articlesLocal.value)
                    this.setState({articles: cache})
                    console.log("taking from capacitor cache")
                  }
                }
              //   if (this.state.subs.length !== 0) {
              //     for (var i = 0; i < this.state.subs.length; i++) {
              //     await NewsDB.collection(this.state.subs[i]).get()
              //     .then((snapshot) => {
              //       snapshot.forEach(async doc => {
              //         if (doc.exists) {
              //           let articleItem = doc.data();
              //           aList.push({title: articleItem.Title, link: articleItem.Link, description: articleItem.Description})
              //         } else {
              //           console.log("Cannot find anything in database.")
              //         }
              //       })
              //       var source = snapshot.metadata.fromCache ? "local cache" : "server";
              //       console.log("Sub Articles came from " + source);
              //     }).catch(function(error) {
              //       console.log("Error getting document:", error);
              //     })
              //   }
              // }
              } else {
                db.collection("topicSubscription").doc(this.state.CurrentUser).set({subList: []});
              }
            })
          }).catch(function(error) {
              console.log("Error getting document:", error);
          });
          // end of getting data from server
        }
      })
    }
    
  }
export default GroupFeed;