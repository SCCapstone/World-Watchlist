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
import { PushNotification, Plugins, LocalNotification } from '@capacitor/core';
import ParentComponent from '../components/SubscriptionParent';
import ChildrenComponent from '../components/SubscriptionChildren';
import { FeedProps, FeedState } from '../components/FeedTypes';
import FeedList from '../components/FeedList';
import FeedToolbar from '../components/FeedToolbar';
import { tempaddSubscription, tempremoveSubscription, tempapiSearch, tempsubscribe,  } from '../components/TempFunctions';
import SubscriptionModal from '../components/SubscriptionModal';
const { Storage, PushNotifications, FCMPlugin, BackgroundTask, App, LocalNotifications   } = Plugins;




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
    subArticles:[],
    locationBased:false,
    isWeatherModalOpen:false,
    isSearchingModal:false,
    showSearchAlert:false,
    showSubscribeAlert:false,
    isChanging:false,
    showErrorAlert:false,
    showErrorSubscribe:false
  };

  constructor(props: FeedProps) {
    super(props)
    this.toggleWeatherModal = this.toggleWeatherModal.bind(this);
    auth.onAuthStateChanged(async () => {
      if(auth.currentUser) {
        this.setState({CurrentUser:auth.currentUser?.uid})
        db.collection("profiles").doc(this.state.CurrentUser)
          .onSnapshot(async (doc) => {
            if (doc.exists)
              this.setState({blockedSources:  await doc.data()!.blockedSources});
            else {
              db.collection("profiles").doc(this.state.CurrentUser).set({blockedSources: []});
            }
      })
          // everytime there is a new subscription, update news onto main feed
          db.collection("topicSubscription").doc(this.state.CurrentUser)
          .onSnapshot(async (sub_list) => {
            if (sub_list.exists) {
              this.setState({subs: await sub_list.data()!.subList});
              // console.log("subs",this.state.subs)
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

  async componentDidMount(){
    await LocalNotifications.requestPermission()
    // await LocalNotifications.requestPermission().then(res=>{
    //   console.log("local notification granted: "+ res.granted)
    // })
  }

  async getSubscribedArticles(){
    // this.setState({articles:[]})
    this.setState({subArticles:[]})
    // get blocked sources on firestore
    let aList : any[];
    for (var i = 0; i < this.state.subs.length; i++) {
      /* Observe any changes in firestore and send a notification*/
      await this.checkCollection(this.state.subs[i],i)
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
            if(!this.state.blockedSources.includes(articleItem.source)) {
              aList.push({title: articleItem.Title, link: articleItem.Link, description: articleItem.Description, source:articleItem.source, pubDate: articleItem.pubDate})
            }
          } else {
            console.log("Cannot find anything in database.")
          }
        })
        var source = snapshot.metadata.fromCache ? "local cache" : "server";
        console.log("Sub Articles came from " + source);
        await Storage.set({ key: this.state.subs[i], value: JSON.stringify(aList)});
        this.state.subArticles.push(aList)
      })
      } else {
        this.state.subArticles.push(JSON.parse(articlesLocal.value))
        console.log("taking from capacitor cache")
      }
      this.setState({isChanging:false})
    }
  }

  // refresh articles on feed
  async doRefresh(event: CustomEvent<RefresherEventDetail>) {
    // this.setState({articles:[]})
    this.setState({subArticles:[]})
    // get blocked sources on firestore
    let aList : any[] = [];
    for (var i = 0; i < this.state.subs.length; i++) {
      /* Observe any changes in firestore and send a notification*/
      await this.checkCollection(this.state.subs[i],i)
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
            var domain = (articleItem.source)
            if(!this.state.blockedSources.includes(domain)) {
              aList.push({title: articleItem.Title, link: articleItem.Link, description: articleItem.Description, source:domain, pubDate: articleItem.pubDate})
            }
          } else {
            console.log("Cannot find anything in database.")
          }
        })
        this.state.subArticles.push(aList)
      })
      this.setState({isChanging:false})
    }
  }
    setTimeout(() => {
      console.log('refreshing ended');
      event.detail.complete();
    }, 500);
  }

  getId() {
    // return user_id if current user else null
    return this.state.CurrentUser;
  }
  
  toggleWeatherModal() {
    this.setState({isWeatherModalOpen: false/*!this.state.isWeatherModalOpen}*/});
  }


  // check server collection for changes
  async checkCollection(collection:string,index:any){
    // Subscribe to a specific 
    const profile = db.collection('profiles').doc(auth.currentUser?.uid)
    let doc = profile.get()
    let mutedNotification:any
    if (!(await doc).exists) {
      console.log('No such document!');
    } else {
      mutedNotification = (await doc).data()?.muteNotification
    }
    console.log(collection, "muted: ", mutedNotification.includes(collection))
    NewsDB.collection(collection)
    .onSnapshot(async querySnapshot => {
      console.log(querySnapshot.docChanges()[0])
      let newArticle:any = querySnapshot.docChanges()[0].doc?.id
        const LocalNotificationPendingList = await LocalNotifications.getPending()
        // console.log(change.doc)
        // if there are changes to the metadata, clear cache and add new docs to the 
        if (querySnapshot.metadata.fromCache === false && querySnapshot.docChanges()[0].doc.metadata.fromCache===false && querySnapshot.docChanges()[0].type==='added') {
          // clear cache so new articles can be added to cache
          Storage.remove({key:collection})
          this.setState({isChanging:true})
          if (!(await LocalNotifications.requestPermission()).granted || mutedNotification.includes(collection)) return;
          // send notification for every changes in collection
          App.addListener('appStateChange', async (state) => {
                if (!state.isActive) {
                  await LocalNotifications.schedule({
                    notifications: [{
                      title: newArticle,
                      body: 'New article from the topic \'' +collection +'\' .',
                      id: 1,
                      schedule:{repeats:false, at: new Date(Date.now())}
                    }]
                  });
                }
            })
            await LocalNotifications.schedule({
              notifications: [{
                title: newArticle,
                body: 'New article from the topic \'' +collection +'\' .',
                id: 1,
                schedule:{repeats:false, at: new Date(Date.now())}
              }]
            });
      }
      // makes sure they can't be more than 1 notifications on single changes
      if (LocalNotificationPendingList.notifications.length>0) {
        LocalNotifications.cancel(LocalNotificationPendingList)
      }
      console.log(LocalNotificationPendingList)
    // })
    });
    
  }
  

  /* can currently subscribe to: gaming, health, politics, sports, technology, world */
  async addSubscription(sub: string) {
    // tempaddSubscription(sub, this.getId());
    if (sub!== "") {
      await db.collection("topicSubscription").doc(this.state.CurrentUser).update({subList: firebase.firestore.FieldValue.arrayUnion(sub)})
    }
  }

  async removeSubscription(index:any) {
    // tempremoveSubscription(index, this.getId(), this.state.subs);
    if (this.state.subs[index] !== "") {
      await db.collection("topicSubscription").doc(this.state.CurrentUser).update({subList: firebase.firestore.FieldValue.arrayRemove(this.state.subs[index])})
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
          this.setState({articlesSearched :await tempapiSearch(topic, this.state.CurrentUser)})
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
      this.setState({showErrorAlert:true})
    } else if (this.state.subs.includes(topic)) {
      console.log("already subscribed")
      this.setState({showErrorSubscribe:true})
    }
    else {
      this.setState({showSubscribeAlert:true})
      await this.addSubscription(topic.toLowerCase());
    }
  }

  async unsubscribe(topic:any,index:any) {
    console.log("News about "+ topic +" has been found and will be unsubscribed.")
    await this.removeSubscription(index);
  }

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
         showModal={() => {this.setState({showModal: true})}}></FeedToolbar>
         
      </IonHeader>
      <IonContent>
      <IonTitle id="subTitle">
          Subscriptions

        </IonTitle>
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
        onDidDismiss={()=>{this.setState({showLoading:false})}}
        message={'Loading...'}
        duration={20000}
      />

      <IonModal isOpen={this.state.isSearchingModal} >
      <IonHeader>
      <IonToolbar id="newsToolbar">
      <IonButtons slot='start'>
                <IonButton onClick={() => this.setState({isSearchingModal: false})} fill='clear'>
                  <IonIcon id='addFriendModalCloseIcon' icon={closeCircleOutline}/>
                </IonButton>
        </IonButtons>
        <IonButtons slot='end'>
        <IonButton onClick={()=> this.subscribe(this.state.topicSearched)} fill='clear'>
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
       <IonAlert
          isOpen={this.state.showErrorSubscribe}
          onDidDismiss={() => this.setState({showErrorSubscribe:false})}
          message={"Could not retrieve articles or you are already subscribed to " + this.state.topicSearched}
       />
        {/* <IonAlert
          isOpen={this.state.showErrorAlert}
          onDidDismiss={() => this.setState({showErrorAlert:false})}
          message={"Error, enter valid information"}
       /> */}
       
      </IonContent>
      </IonModal>
        </IonContent>
    </IonModal>
    <SubscriptionModal 
    unsubButton={this.unsubscribe.bind(this)}
    subscriptions={this.state.subs}
    articles={(this.state.subArticles)}
    
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
    {/* <FeedList headerName={"Recent News"} articleList={this.state.articles}></FeedList> */}
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
