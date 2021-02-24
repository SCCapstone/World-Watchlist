import React, { useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonContent,
  IonTitle,
  IonRouterOutlet,
  IonIcon,
  IonLabel,
  IonButton,
  IonButtons,
  IonSearchbar,
  IonLoading,
  IonModal,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonFabButton,
  IonCardContent,
  IonCardSubtitle,
  IonItem,
  IonCheckbox,
  IonList, IonListHeader, IonAlert, IonToast
} from '@ionic/react'
import './Feed.css'
import { NewsDB } from '../config/config';
import firebase, {db,auth} from '../firebase'
import ArticleList from '../components/ArticleList';
import { article, articleList } from '../components/ArticleTypes';
import Weather from './Weather'
import { add, addCircle, archive, bookmarks, closeCircleOutline, cloud, search } from 'ionicons/icons';
import { Plugins } from '@capacitor/core';
import axios from 'axios';
const { Storage } = Plugins;

type MyState = {
  articles: articleList;
  subs: string[];
  articlesSearched:any[],
  subscribedArticles: any;
  CurrentUser:any;
  topicSearched:any;
  showLoading:boolean;
  showModal:boolean,
  showSubscription:boolean,
  allArticles:any[],
  locationBased:boolean,
  isWeatherModalOpen:boolean,
  isSearchingModal:boolean,
  showSearchAlert:boolean,
  showSubscribeAlert:boolean
}

type MyProps = {
  history: any;
  location: any;
}

class Feed extends React.Component<MyProps, MyState> {
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
        await db.collection("profiles").doc(auth.currentUser.uid).get().then(async doc => {
          if(doc.data()) {

          }
          // everytime there is a new subscription, update news onto main feed
          db.collection("topicSubscription").doc(auth.currentUser?.uid).onSnapshot(async (sub_list) => {
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
              db.collection("topicSubscription").doc(auth.currentUser?.uid).set({subList: []});
            }
          })
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });
        // end of getting data from server
      }
    })
  }

  toggleWeatherModal() {
    this.setState({isWeatherModalOpen: !this.state.isWeatherModalOpen})
  }

  /*clear capacitor local storage */
  async clear() {
    await Storage.clear();
  }

  /* can currently subscribe to: gaming, health, politics, sports, technology, world */
  async addSubscription(sub: string) {
    if (sub!== "") {
      await db.collection("topicSubscription").doc(this.state.CurrentUser).update({subList: firebase.firestore.FieldValue.arrayUnion(sub)})
    }
  }

  async removeSubscription(index:any) {
    if (this.state.subs[index] !== "") {
      await db.collection("topicSubscription").doc(this.state.CurrentUser).update({subList: firebase.firestore.FieldValue.arrayRemove(this.state.subs[index])})
    }
  }

  ParentComponent = (props:any) => (
    <div>
      <div id="children-pane">
        {props.children}
      </div>
    </div>
  );

  ChildComponent = (props: {subscription:any, index:any}) =>
  <IonCard>
        <IonCardHeader >
          <IonCardTitle>{props.subscription}</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
          <IonButton expand="block" fill="outline" color="secondary" type="submit" onClick={()=> this.unsubscribe(props.subscription,props.index)}>unsubscribe</IonButton>
          </IonCardContent>
      </IonCard>


  async toggleNewsModal(){
    await this.setState({isSearchingModal: true})

  }

  /* search firebase database for topic*/
  async searchTopic(topic:any) {
    this.setState({showLoading: true})
    this.setState({articlesSearched:[]})
      if (topic === null || topic === undefined || topic === '') {
        console.log("Enter a valid topic");
        this.setState({showSearchAlert:true})
      } else {
        await this.toggleNewsModal()
        let aList : articleList = [];
        /* cache data on topic search */
        await NewsDB.collection(topic.toLowerCase()).get()
        .then(async (snapshot) => {
        if (snapshot.empty) {
          // searching through api and sending to firestore instead of searching in main collection
          await this.apiSearch(topic, 'search')
        /* Searching topics based on string matching titles to input if a collection doesn't exist */
          // console.log("can't find the collection, will search in all collection")
          // var filtered = this.state.allArticles.filter(doc => doc.Title.toLowerCase().includes(topic.toLowerCase()))
          // if (filtered.length === 0) {
          //   console.log("currently no news on", topic)
          // } else {
          //   filtered.forEach(filtered => {
          //     aList.push({title: filtered.Title, link: filtered.Link, description: filtered.Description})
          //   })
          //   this.setState({articlesSearched: aList})
          // }
        } else {
        console.log("collection exist, will pull data from that collection")

        aList = [];
        snapshot.docChanges().forEach((change) => {
          if (change.doc.exists) {
            let articleItem = change.doc.data();
            var html = articleItem.description;
            var a = document.createElement("a");
            a.innerHTML = html;
            aList.push({title: articleItem.Title, link: articleItem.Link, description: articleItem.Description})
          }
          this.setState({articlesSearched: aList})
        })
        }
      })
    }
    this.setState({showLoading: false})
    return 0
}

  async subscribe(topic:any) {
    if (topic === null || topic === undefined || topic === '') {
      console.log("Enter a valid topic");
    } else {
      /* cache data on subscribe */
      await NewsDB.collection(topic.toLowerCase()).get()
        .then(async (snapshot) => {
       /* Creating a new collection if topic collection doesn't exist and subscribing to it */
      if (snapshot.empty) {
        await this.apiSearch(topic, 'subscribe')
        /* using this.state.allArticles called in constructor */
      //   var filteredArticles = this.state.allArticles.filter(doc => doc.Title.toLowerCase().includes(topic.toLowerCase()))
      //   if (this.state.locationBased === true) {
      //     await this.apiSearch(topic, 'subscribe')
      //   } else if (filteredArticles.length === 0) {
      //     console.log("currently no news on that topic")
      //   }
      //   else {
      //     filteredArticles.forEach(async filteredArticles => {
      //       await NewsDB.collection(topic.toLowerCase()).doc(filteredArticles.Title).set({Title:filteredArticles.Title, Link: filteredArticles.Link, Description: filteredArticles.Description});
      //     })
      //   }
      //   console.log("Making new collection called", topic, " and subscribing")
      //   await this.addSubscription(topic.toLowerCase());
      }
      else {
        console.log("News about "+ topic +" has been found and will be subscribed.")
        await this.addSubscription(topic.toLowerCase());
      }
      var source = snapshot.metadata.fromCache ? "local cache" : "server";
          console.log("Data came from " + source);
    })
  }
  }

  unsubscribe(topic:any,index:any) {
    console.log("News about "+ topic +" has been found and will be unsubscribed.")
    this.removeSubscription(index);
  }

  /* using an api to turn rss feeds into json to avoid cors policy errors */
  async apiSearch(topic: any, type:string) {
    let aList : articleList = [];
    /* needed for the api.rss2json to work */
    let temp = topic.replace(/\ /g,"%2520")
    let rssurl = "https%3A%2F%2Fnews.google.com%2Frss%2Fsearch%3Fq%3D"+temp+"%26hl%3Den-US%26gl%3DUS%26ceid%3DUS%3Aen"
    await axios({
      method: 'GET',
      url:'https://api.rss2json.com/v1/api.json?rss_url='+rssurl
    // url: "https://send-rss-get-json.herokuapp.com/convert/?u="+"https://news.google.com/rss/search?q="+topic+"&hl=en-US&gl=US&ceid=US:en"
    // https://api.rss2json.com/v1/api.json?rss_url=
  })
    .then(async (response) => {
      const data = response.data
      await data.items.forEach((articleItem: any) => {
        /* remove <a> html tag from description */
        var html = articleItem.description;
        var a = document.createElement("a");
        a.innerHTML = html;
        var text = a.textContent || a.innerText || "";
        aList.push({title: articleItem.title, link: articleItem.link, description: text})
      })
      if (type==='search') {
        this.setState({articlesSearched: aList})
      } else {
        aList.forEach(async newsItem => {
          await NewsDB.collection(topic.toLowerCase()).doc(newsItem.title).set({Title:newsItem.title, Link: newsItem.link, Description: newsItem.description});
        })
        await this.addSubscription(topic.toLowerCase());
      }
    }).catch((error) => {
      console.log(error)
    });
  }

  // /* store news in 'all' collection into capicitor local storage on start to reduce reading*/
  // async setMainCollection(){
  //   let allNews: any[] = []
  //   var allArticlesLocal = await Storage.get({key:'allArticles'})
  //   if ((allArticlesLocal.value)?.length === undefined || JSON.parse((allArticlesLocal.value)).length === 0) {
  //     NewsDB.collection('all').where("Title", "!=", " ")
  //       .onSnapshot(async (snapshot) => {
  //         snapshot.docChanges().forEach((change) => {
  //           allNews.push(change.doc.data());
  //         });
  //         this.setState({allArticles:allNews})
  //         var source = snapshot.metadata.fromCache ? "local cache" : "server";
  //         console.log("Data came from " + source);
  //         await Storage.set({ key: 'allArticles', value: JSON.stringify(allNews) });
  //         console.log('Storing in local storage');
  //       })
  //     } else {
  //       this.setState({allArticles:JSON.parse(allArticlesLocal.value)})
  //       console.log('already in local storage')
  //   }
  // }

  // async componentDidMount() {
  //   await this.setMainCollection()
  // }


  render() {
    const subs = [];
      for (var i = 0; i < this.state.subs.length; i+=1) {
        subs.push(<this.ChildComponent key={i} subscription={this.state.subs[i]} index={i} />);
    };
    return (
    <IonPage>
      <IonHeader>
        <IonToolbar class ='feedToolbar'>
          <IonTitle class='feedTitle'>
            Feed
          </IonTitle>
      <IonButtons slot="start">
          <IonButton onClick={() => {this.setState({isWeatherModalOpen: true})}}  fill='clear'>
              <IonIcon icon={cloud} />
          </IonButton>
          </IonButtons>
          <IonButtons slot="end">
          <IonButton onClick={() => {this.setState({showSubscription: true})}}  fill='clear'>
              <IonIcon icon={bookmarks} />
          </IonButton>
          </IonButtons>
          <IonButtons slot="end">
          <IonButton onClick={() => {this.setState({showModal: true})}}  fill='clear'>
              <IonIcon icon={search} />
          </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>

        <Weather toggleWeatherModal={this.toggleWeatherModal} isOpen={this.state.isWeatherModalOpen}/>
        {/* Modal for searching topics */}
    <IonModal isOpen={this.state.showModal}>
        <IonHeader>
            <IonToolbar class='feedToolbar2'>
        <IonButtons slot='start'>
                <IonButton onClick={() => {this.setState({showModal: false})}} fill='clear'>
                  <IonIcon id='addFriendModalCloseIcon' icon={closeCircleOutline}/>
                </IonButton>
        </IonButtons>

        <IonTitle class='feedTitle2'>
          Search Topics

        </IonTitle>
        </IonToolbar>
        </IonHeader>
        <IonContent>
        <IonSearchbar placeholder="Enter a Topic or Location" value={this.state.topicSearched} onIonInput={(e: any) => this.setState({topicSearched:e.target.value} )} animated>
      </IonSearchbar>

      <IonButton expand="block" fill="outline" color="secondary" type="submit" onClick={async () => await this.searchTopic(this.state.topicSearched)}>
          search
      </IonButton>

      <IonAlert
          isOpen={this.state.showSearchAlert}
          onDidDismiss={() => this.setState({showSearchAlert:false})}
          message="Enter a valid topic or location"
       />
      <IonLoading
        isOpen={this.state.showLoading}
        onDidDismiss={() => this.setState({showLoading: false})}
        message={'Loading...'}
        duration={5000}
      />


      {/* <IonItem> */}
         {/* check if person wants to search location */}
  {/* <IonLabel>Location based search</IonLabel> */}
  {/* <IonCheckbox onIonChange={e=> this.setState({locationBased:e.detail.checked}) }></IonCheckbox> */}
  {/* </IonItem> */}
      <IonModal isOpen={this.state.isSearchingModal}>
      <IonHeader>
      <IonToolbar>
      <IonButtons slot='start'>
                <IonButton onClick={() => this.setState({isSearchingModal: false})} fill='clear'>
                  <IonIcon id='addFriendModalCloseIcon' icon={closeCircleOutline}/>
                </IonButton>
        </IonButtons>
        <IonButtons slot='end'>
        <IonButton color="secondary" onClick={()=> this.subscribe(this.state.topicSearched) && this.setState({showSubscribeAlert:true})} fill='clear'>
        <IonIcon icon={addCircle}/>
        </IonButton>
      </IonButtons>
      <IonTitle>
          News
        </IonTitle>
      </IonToolbar>
      </IonHeader>
      <IonContent>

      <ArticleList theArticleList={this.state.articlesSearched}></ArticleList>
      <IonAlert
          isOpen={this.state.showSubscribeAlert}
          onDidDismiss={() => this.setState({showSubscribeAlert:false,isSearchingModal:false})}
          message={"Subscribed to " + this.state.topicSearched}
       />
      </IonContent>
      </IonModal>
        </IonContent>
    </IonModal>
    <IonModal isOpen={this.state.showSubscription}>
        <IonHeader>
            <IonToolbar class='feedToolbar2'>
        <IonButtons slot='start'>
                <IonButton onClick={() => {this.setState({showSubscription: false})}} fill='clear'>
                  <IonIcon id='addFriendModalCloseIcon' icon={closeCircleOutline}/>
                </IonButton>
        </IonButtons>

        <IonTitle class='feedTitle2'>
                Subscriptions
        </IonTitle>
        </IonToolbar>
        </IonHeader>
        <IonContent>
        <IonCard>
        <this.ParentComponent>
       {subs}
      </this.ParentComponent>
        </IonCard>
        </IonContent>
    </IonModal>
    <IonList>
        <IonListHeader>
          Recent News
        </IonListHeader>
      <ArticleList theArticleList={this.state.articles}></ArticleList>
    </IonList>
      </IonContent>

    </IonPage>
    )
  }
}
export default Feed;
