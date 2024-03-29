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
  IonList, IonListHeader, IonAlert, IonToast, IonFab
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
import { FeedProps, FeedState, sortTypes } from '../components/FeedTypes';
import FeedList from '../components/FeedList';
import FeedToolbar from '../components/FeedToolbar';
import ShareModal from '../components/ShareModal'
import { tempaddSubscription, tempremoveSubscription, tempapiSearch, tempsubscribe, isEnterKey,  } from '../components/TempFunctions';
import SubscriptionModal from '../components/SubscriptionModal';
const { Storage, App, LocalNotifications   } = Plugins;




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
    showErrorSubscribe:false,
    mode: "all",
    sort: "title",
    muted:[]
  };

  constructor(props: FeedProps) {
    super(props)
    this.toggleWeatherModal = this.toggleWeatherModal.bind(this);
    
    auth.onAuthStateChanged(async () => {
      this.setState({subs:[], subArticles:[], articles:[]})
      if(auth.currentUser) {
        this.setState({CurrentUser:auth.currentUser?.uid})
        db.collection("profiles").doc(auth.currentUser?.uid)
          .onSnapshot(async (doc) => {
            if (doc.exists) {
              if (await doc.data()!.blockedSources===undefined || await doc.data()!.muteNotification===undefined){
                await db.collection("profiles").doc(this.state.CurrentUser).update({blockedSources: []});
                await db.collection("profiles").doc(this.state.CurrentUser).update({muteNotification:[]});
                this.setState({blockedSources:  await doc.data()!.blockedSources});
              } else {
                this.setState({blockedSources:  await doc.data()!.blockedSources});
                this.setState({muted:await doc.data()!.muteNotification})
              }
            }
      })
          // everytime there is a new subscription, update news onto main feed
          db.collection("topicSubscription").doc(this.state.CurrentUser)
          .onSnapshot(async (sub_list) => {
            if (sub_list.exists) {
              this.setState({subs: await sub_list.data()!.subList});
              // console.log("subs",this.state.subs)
              // get articles
              await this.getSubscribedArticles('onload')
            } else {
              db.collection("topicSubscription").doc(this.getId()).set({subList: []});
              this.setState({subs: []});
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

  async getSubscribedArticles(context:any){
    this.setState({subArticles:[], articles:[]})
    // get blocked sources on firestore
    let aList : any[];
    if (this.state.subs) {
      for (var i = 0; i < this.state.subs.length; i++) {
        /* Observe any changes in firestore and send a notification*/
        
        await this.checkCollection(this.state.subs[i],i,context)
        aList = []
        var articlesLocal = await Storage.get({key:this.state.subs[i]})
        // check local storage if collection exist take from cache, if collection changes, get from server
        if ((articlesLocal.value)?.length === undefined || JSON.parse((articlesLocal.value)).length === 0 || this.state.isChanging===true || context==='refreshing') {
          await NewsDB.collection(this.state.subs[i]).get()
        .then(async (snapshot) => {
          if ( snapshot.empty) {
            
          } else {
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
          await Storage.set({ key: this.state.subs[i], value: JSON.stringify(aList)});
          this.state.subArticles.push(aList)
          this.setState({articles:[...this.state.articles, ...aList]})
        }
        })
        } else {
          this.state.subArticles.push(JSON.parse(articlesLocal.value))
          this.setState({articles:[...this.state.articles, ...JSON.parse(articlesLocal.value)]})
        }
        this.setState({isChanging:false})
      }
    }
  }

  // refresh articles on feed
  async doRefresh(event: CustomEvent<RefresherEventDetail>) {
        await db.collection("profiles").doc(auth.currentUser?.uid).get()
          .then(async (doc) => {
            if (doc.exists) {
                this.setState({blockedSources:  await doc.data()!.blockedSources});
                console.log(this.state.blockedSources)
                this.setState({muted:await doc.data()!.muteNotification})
                await this.getSubscribedArticles('refreshing')
            }
        })
    setTimeout(() => {
      console.log('refreshing ended');
      event.detail.complete();
    }, 1000);
  }

  getId() {
    // return user_id if current user else null
    return this.state.CurrentUser;
  }

  toggleWeatherModal() {
    this.setState({isWeatherModalOpen: false/*!this.state.isWeatherModalOpen}*/});
  }


  // check server collection for changes
  async checkCollection(collection:string,index:any, context:any){
    // Subscribe to a specific
    NewsDB.collection(collection)
    .onSnapshot(async querySnapshot => {
      if ( querySnapshot.empty ) {
        console.log('empty');
        return;
      }
      let newArticle:any = querySnapshot.docChanges()[0].doc?.id
        const LocalNotificationPendingList = await LocalNotifications.getPending()
        // console.log(change.doc)
        // if there are changes to the metadata, clear cache and add new docs to the
        if (querySnapshot.metadata.fromCache === false && querySnapshot.docChanges()[0].doc.metadata.fromCache===false && querySnapshot.docChanges()[0].type==='added') {
          // clear cache so new articles can be added to cache
          Storage.remove({key:collection})
          this.setState({isChanging:true})
          // if localnotification is not granted or notification is muted, don't send notifications.
          if (!(await LocalNotifications.requestPermission()).granted || this.state.muted.includes(collection) || context==='refreshing')  return;
          else {
            await LocalNotifications.schedule({
              notifications: [{
                title: newArticle,
                body: 'New article from the topic \'' +collection +'\' .',
                id: 1,
                schedule:{repeats:false, at: new Date(Date.now())}
              }]
            });
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
            }
              
    }
      // makes sure they can't be more than 1 notifications on single changes
      if (LocalNotificationPendingList.notifications.length>0) {
        await LocalNotifications.cancel(LocalNotificationPendingList)
      }
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
            if(!this.state.blockedSources.includes(articleItem.source)) 
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

  handleToggle() {
    let current = this.state.mode;
    this.setState({mode: current == 'cards' ? 'all' : 'cards'});
    return this.state.mode
  }

  handleSort(option: sortTypes) {
    this.setState({sort: option});
    /*switch(option) {
      case "title":
        this.setState({})
    }*/
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
         toggleMode={this.handleToggle.bind(this)}
         toggleSort={this.handleSort.bind(this)}></FeedToolbar>

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
    <ShareModal {...this.props} isShareModalOpen={this.props.isShareModalOpen} openShareModal={this.props.openShareModal} ourUsername={this.props.ourUsername}/>
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
        <IonSearchbar placeholder="Enter a Topic or Location" value={this.state.topicSearched} onKeyUp={(e: any) => {if (isEnterKey(e)) this.searchTopic(this.state.topicSearched);}} onIonInput={(e: any) => this.setState({topicSearched:e.target.value} )} animated>
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
        duration={200000}
      />

      <IonModal isOpen={this.state.isSearchingModal} onDidDismiss={() => this.setState({isSearchingModal: false})}>
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
      <ArticleList theArticleList={this.state.articlesSearched} openShareModal={this.props.openShareModal}></ArticleList>
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
      subscriptions={this.state.subs? this.state.subs : []}
      articles={(this.state.subArticles? this.state.subArticles : [])}
      allArticles={(this.state.articles)}
      openShareModal={this.props.openShareModal}
      mode={this.state.mode}
      sort={this.state.sort}
    ></SubscriptionModal>
    <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => {this.setState({showModal: true})}}>
            <IonIcon icon={search} />
          </IonFabButton>
        </IonFab>
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
