import React, { useState } from 'react';
import {
  IonRefresher, IonRefresherContent,
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
import { RefresherEventDetail } from '@ionic/core';
import './Feed.css'
import './AllPages.css'
import { NewsDB } from '../config/config';
import firebase, {db,auth} from '../firebase'
import ArticleList from '../components/ArticleList';
import { article, articleList } from '../components/ArticleTypes';
import Weather from './Weather'
import { add, addCircle, archive, bookmarks, closeCircleOutline, cloud, notificationsCircleOutline, search } from 'ionicons/icons';
import { LocalNotifications, Plugins } from '@capacitor/core';
import axios from 'axios';
import ParentComponent from '../components/SubscriptionParent';
import ChildrenComponent from '../components/SubscriptionChildren';
import { FeedProps, FeedState } from '../components/FeedTypes';
import FeedList from '../components/FeedList';
import FeedToolbar from '../components/FeedToolbar';
import { tempaddSubscription, tempremoveSubscription } from '../components/TempFunctions';
import SubscriptionModal from '../components/SubscriptionModal';
const { Storage } = Plugins;



class Feed extends React.Component<FeedProps, FeedState> {
  state: FeedState = {
    articles: [],
    subs: [],
    blockedSources: [],
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
    showSubscribeAlert:false,
    isChanging:false
  };

  constructor(props: FeedProps) {
    super(props)
    this.toggleWeatherModal = this.toggleWeatherModal.bind(this);
    auth.onAuthStateChanged(async () => {
      if(auth.currentUser) {
          // everytime there is a new subscription, update news onto main feed
          db.collection("topicSubscription").doc(auth.currentUser?.uid)
          .onSnapshot(async (sub_list) => {
            if (sub_list.exists) {
              this.setState({subs: await sub_list.data()!.subList});
              console.log("subs",this.state.subs)
              // get articles
              await this.getSubscribedArticles()
              console.log("articles",this.state.articles)
            } else {
              db.collection("topicSubscription").doc(this.getId()).set({subList: []});
            }
          })
        
        // end of getting data from server
      }
    })
  }

  async getSubscribedArticles(){
    this.setState({articles:[]})
    // get blocked sources on firestore
    let aList : any[] = [];
    db.collection("profiles").doc(auth.currentUser?.uid)
          .onSnapshot(async (doc) => {
          this.setState({blockedSources:  await doc.data()!.blockedSources});
    })
    console.log(this.state.blockedSources)
    for (var i = 0; i < this.state.subs.length; i++) {
      /* Observe any changes in firestore and send a notification*/
      await this.checkCollection(this.state.subs[i])
      aList = []
      var articlesLocal = await Storage.get({key:this.state.subs[i]})
      // check local storage if collection exist take from cache, if collection changes, get from server
      if ((articlesLocal.value)?.length === undefined || JSON.parse((articlesLocal.value)).length === 0 || this.state.isChanging===true) {
        console.log("local storage empty for", this.state.subs[i])
        await NewsDB.collection(this.state.subs[i]).get()
      .then(async (snapshot) => {
        snapshot.forEach(async doc => {
          if (doc.exists) {
            let articleItem = doc.data();
            var html = articleItem.Description;
            var a = document.createElement("a");
            a.innerHTML = html;
            var text = a.textContent || a.innerText || "";
            //await new Promise(r => setTimeout(r, 1000));
            var domain = (articleItem.source)
            if(!this.state.blockedSources.includes(domain)) {
              console.log("blocked")
              aList.push({title: articleItem.Title, link: articleItem.Link, description: text, source:domain, pubDate: articleItem.pubDate})
            }
          } else {
            console.log("Cannot find anything in database.")
          }
        })
        var source = snapshot.metadata.fromCache ? "local cache" : "server";
        console.log("Sub Articles came from " + source);
        await Storage.set({ key: this.state.subs[i], value: JSON.stringify(aList)});
        this.setState({articles: [...this.state.articles, ...aList]})
      })
      } else {
        this.setState({articles:[...this.state.articles, ...JSON.parse(articlesLocal.value)]})
        console.log("taking from capacitor cache")
      }
      this.setState({isChanging:false})
    }
  }

  // refresh articles on feed
  async doRefresh(event: CustomEvent<RefresherEventDetail>) {
    this.setState({articles:[]})
    // get blocked sources on firestore
    let aList : any[] = [];
    db.collection("profiles").doc(auth.currentUser?.uid)
          .onSnapshot(async (doc) => {
          this.setState({blockedSources:  await doc.data()!.blockedSources});
    })
    for (var i = 0; i < this.state.subs.length; i++) {
      /* Observe any changes in firestore and send a notification*/
      await this.checkCollection(this.state.subs[i])
      aList = []
      // check local storage if collection exist take from cache, if collection changes, get from server
        console.log("local storage empty for", this.state.subs[i])
        await NewsDB.collection(this.state.subs[i]).get()
      .then(async (snapshot) => {
        snapshot.forEach(async doc => {
          if (doc.exists) {
            let articleItem = doc.data();
            var html = articleItem.Description;
            var a = document.createElement("a");
            a.innerHTML = html;
            var text = a.textContent || a.innerText || "";
            //await new Promise(r => setTimeout(r, 1000));
            var domain = (articleItem.source)
            if(!this.state.blockedSources.includes(domain)) {
              console.log("blocked")
              aList.push({title: articleItem.Title, link: articleItem.Link, description: text, source:domain, pubDate: articleItem.pubDate})
            }
          } else {
            console.log("Cannot find anything in database.")
          }
        })
      })
      this.setState({isChanging:false})
    }
    setTimeout(() => {
      console.log('refreshing ended');
      event.detail.complete();
      this.setState({articles: [...this.state.articles, ...aList]})
    }, 500);
  }
  
  getId() {
    // return user_id if current user else null
    return auth.currentUser?.uid;
  }
  
  toggleWeatherModal() {
    this.setState({isWeatherModalOpen: !this.state.isWeatherModalOpen})
  }

  // check server collection for changes
  async checkCollection(collection:string){
    var observer = NewsDB.collection(collection).where('Title', '!=', '')
    .onSnapshot(async querySnapshot => {
        const LocalNotificationPendingList = await LocalNotifications.getPending()
        // if there are changes to the metadata, clear cache and add new docs to the 
        if (querySnapshot.metadata.fromCache === false) {
          // clear cache so new articles can be added to cache
          this.clear()
          this.setState({isChanging:true})
          if (!(await LocalNotifications.requestPermission()).granted) return;
          // send notification for every changes in collection
            await LocalNotifications.schedule({
              notifications: [{
                title: 'Changes in your feed!',
                body: "Check them out!",
                id: 1,
                schedule: {
                  // notification 1 minutes after change in collections
                  at:new Date(new Date().getTime() + 60000),
                  repeats:false
                },
              }]
            });
      }
      // makes sure they can't be more than 1 notifications on single changes
      if (LocalNotificationPendingList.notifications.length>0) {
        LocalNotifications.cancel(LocalNotificationPendingList)
      }
      console.log(LocalNotificationPendingList)
    });
  }

  

  /*clear capacitor local storage */
  async clear() {
    await Storage.clear();
  }

  /* can currently subscribe to: gaming, health, politics, sports, technology, world */
  async addSubscription(sub: string) {
    // tempaddSubscription(sub, this.getId());
    if (sub!== "") {
      await db.collection("topicSubscription").doc(this.getId()).update({subList: firebase.firestore.FieldValue.arrayUnion(sub)})
    }
  }

  async removeSubscription(index:any) {
    // tempremoveSubscription(index, this.getId(), this.state.subs);
    if (this.state.subs[index] !== "") {
      await db.collection("topicSubscription").doc(this.getId()).update({subList: firebase.firestore.FieldValue.arrayRemove(this.state.subs[index])})
    }
  }


  toggleNewsModal(){
    this.setState({isSearchingModal: true})
  }

  /* search firebase database for topic*/
  async searchTopic(topic:any) {
    this.setState({showLoading: true})
    this.setState({articlesSearched:[]})
      if (topic === null || topic === undefined || topic === '') {
        console.log("Enter a valid topic");
        this.setState({showSearchAlert:true})
      } else {
        this.toggleNewsModal()
        let aList : articleList = [];
        /* cache data on topic search */
        await NewsDB.collection(topic.toLowerCase()).get()
        .then(async (snapshot) => {
        if (snapshot.empty) {
          // searching through api and sending to firestore instead of searching in main collection
          await this.apiSearch(topic, 'search')
       
        } else {
        console.log("collection exist, will pull data from that collection")

        aList = [];
        snapshot.docChanges().forEach((change) => {
          if (change.doc.exists) {
            let articleItem = change.doc.data();
            var html = articleItem.Description;
            var a = document.createElement("a");
            a.innerHTML = html;
            var text = a.textContent || a.innerText || "";
            aList.push({title: articleItem.Title, link: articleItem.Link, description: text, source: articleItem.source, pubDate: articleItem.pubDate})
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

  async unsubscribe(topic:any,index:any) {
    console.log("News about "+ topic +" has been found and will be unsubscribed.")
    await this.removeSubscription(index);
  }

  async apiSearch(topic: any, type:string) {
    let aList : articleList = [];
    await axios({
      method: 'GET',
      /* using server api to turn rss feeds into json to avoid cors policy errors */
      url:'https://world-watchlist-server-8f86e.web.app/'+topic
    })
    .then(async (response) => {
      console.log(response)
      await response.data.forEach((articleItem: any) => {
        /* remove <a> html tag from description */
        var html = articleItem.description;
        var a = document.createElement("a");
        a.innerHTML = html;
        var text = a.textContent || a.innerText || "";
        var pathArray = articleItem.link.split( '/' );
        var protocol = pathArray[0];
        var host = pathArray[2];
        var baseUrl = protocol + '//' + host;
        aList.push({title: articleItem.title, link: articleItem.link, description: text, source: baseUrl, pubDate:articleItem.pubDate})
      })
      if (type==='search') {
        this.setState({articlesSearched: aList})
      } else {
        aList.forEach(async newsItem => {
          var html = newsItem.description;
          var a = document.createElement("a");
          a.innerHTML = html;
          var text = a.textContent || a.innerText || "";
          var pathArray = newsItem.link.split( '/' );
          var protocol = pathArray[0];
          var host = pathArray[2];
          var baseUrl = protocol + '//' + host;
          await NewsDB.collection(topic.toLowerCase()).doc(newsItem.title).set({Title: newsItem.title, Link: newsItem.link, Description: text, source: baseUrl, pubDate:newsItem.pubDate});
        })
        await this.addSubscription(topic.toLowerCase());

      }
    }).catch((error) => {
      console.log(error)
    });
  }



  // async componentDidMount() {
  //     setInterval(() => {    
  //       this.clear()
  //     },180000000)
  // }

  // async scheduleLocalNotifications() {
  //   try {
  //     // Request/ check permissions
  //     if ((await LocalNotifications.requestPermission()).granted) {
  //       await LocalNotifications.schedule({
  //         notifications: [{
  //           title: 'New articles in your feed!',
  //           body: "new news on " + this.state.subs.pop(),
  //           id: 1,
  //           schedule: {
  //             at:new Date(new Date().getTime() + 1000)
  //           }
  //         }]
  //       });
  //     }
  //     // Clear old notifications in prep for refresh (OPTIONAL)
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }



  render() {
    
    return (
    <IonPage>
      <IonHeader>
        {/* <IonToolbar class ='feedToolbar'>
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
        </IonToolbar> */}
        <FeedToolbar 
         openWeather={() => this.setState({isWeatherModalOpen: true})} 
         showSubs={() => {this.setState({showSubscription: true})}}
         showModal={() => {this.setState({showModal: true})}}></FeedToolbar>
      </IonHeader>
      <IonContent>
      <IonRefresher slot="fixed" pullFactor={0.5} pullMin={100} pullMax={200} onIonRefresh={event=>this.doRefresh(event)}>
        <IonRefresherContent></IonRefresherContent>
      </IonRefresher>
        <Weather toggleWeatherModal={this.toggleWeatherModal} isOpen={this.state.isWeatherModalOpen}/>
        {/* Modal for searching topics */}
    <IonModal isOpen={this.state.showModal} onDidDismiss={() =>this.setState({showModal: false})}>
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

      <IonButton id="searchButton" expand="block" fill="outline" type="submit" shape="round" onClick={async () => await this.searchTopic(this.state.topicSearched)}>
          Search
      </IonButton>

      <IonAlert
          isOpen={this.state.showSearchAlert}
          onDidDismiss={() => this.setState({showSearchAlert:false})}
          message="Enter a valid topic or location"
       />
      <IonLoading
        isOpen={this.state.showLoading}
        message={'Loading...'}
        duration={7000}
      />


      {/* <IonItem> */}
         {/* check if person wants to search location */}
  {/* <IonLabel>Location based search</IonLabel> */}
  {/* <IonCheckbox onIonChange={e=> this.setState({locationBased:e.detail.checked}) }></IonCheckbox> */}
  {/* </IonItem> */}
      <IonModal isOpen={this.state.isSearchingModal} >
      <IonHeader>
      <IonToolbar id="newsToolbar">
      <IonButtons slot='start'>
                <IonButton onClick={() => this.setState({isSearchingModal: false})} fill='clear'>
                  <IonIcon id='addFriendModalCloseIcon' icon={closeCircleOutline}/>
                </IonButton>
        </IonButtons>
        <IonButtons slot='end'>
        <IonButton onClick={()=> this.subscribe(this.state.topicSearched) && this.setState({showSubscribeAlert:true})} fill='clear'>
        <IonIcon id="addTopic" icon={addCircle}/>
        </IonButton>
      </IonButtons>
      <IonTitle id="newsTitle">
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
    <SubscriptionModal showModal={this.state.showSubscription}
    closeButton={() => {this.setState({showSubscription: false})}}
    unsubButton={this.unsubscribe.bind(this)}
    subscriptions={this.state.subs}
    ></SubscriptionModal>
    {/*</IonContent><IonModal isOpen={this.state.showSubscription}>
        <IonHeader>
          <IonToolbar class='feedToolbar2'>
            <IonButtons slot='start'>
              <IonButton onClick={() => {this.setState({showSubscription: false})}} fill='clear'>
                <IonIcon id='addFriendModalCloseIcon' icon={closeCircleOutline}/>
              </IonButton>
            </IonButtons>

          <IonTitle class='feedTitle2'>Subscriptions</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonCard>
        {/* <ParentComponent>
       {subs}
      </ParentComponent>
            <ChildrenComponent subs={this.state.subs} func={this.unsubscribe.bind(this)}></ChildrenComponent>
          </IonCard>
        </IonContent>
    </IonModal> */}
    <FeedList headerName="Recent News" articleList={this.state.articles}></FeedList>
    {/* <IonList>
        <IonListHeader>
          Recent News
        </IonListHeader>
      <ArticleList theArticleList={this.state.articles}></ArticleList>
    </IonList> */}
      </IonContent>

    </IonPage>
    )
  }
}
export default Feed;
