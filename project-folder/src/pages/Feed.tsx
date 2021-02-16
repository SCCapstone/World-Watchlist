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
  IonCardTitle
} from '@ionic/react'

import './Feed.css'
import { NewsDB } from '../config/config';
import firebase, {db,auth} from '../firebase'
import ArticleList from '../components/ArticleList';
import { article, articleList } from '../components/ArticleTypes';
import Weather from './Weather'
import { Redirect, Route } from 'react-router-dom';
import { bookmark, closeCircleOutline, cloud, search } from 'ionicons/icons';
import { Plugins } from '@capacitor/core';
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
  collectionExist:boolean,
  showSubscription:boolean,
  allArticles:any[],
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
    collectionExist:false,
    showSubscription:false,
    allArticles:[],
  };

  constructor(props: MyProps) {
    super(props)
    auth.onAuthStateChanged(async () => {
      if(auth.currentUser) {
        //gets the username of our user
        db.collection("users").doc(auth.currentUser.uid).get().then(doc => {
          if(doc.data()) {
            console.log('current user: ' + doc.data()!.username)
            this.setState({CurrentUser:doc.data()!.username})
          }
          // get subscription list .get().then
          db.collection("topicSubscription").doc(this.state.CurrentUser).onSnapshot(async (sub_list) => {
            if (sub_list.exists) {
              console.log("current sub list: ", sub_list.data()!.subList)
              this.setState({subs: sub_list.data()!.subList});
              let aList : articleList = [];
              if (this.state.subs.length !== 0) {
                for (var i = 0; i < this.state.subs.length; i++) {
                await NewsDB.collection(this.state.subs[i]).get()
                .then((snapshot) => {
                  snapshot.forEach(doc => {
                    if (doc.exists) {
                      this.setState({collectionExist:true})
                      let articleItem = doc.data();
                      aList.push({title: articleItem.Title, link: articleItem.Link, description: articleItem.Description})
                    } else {
                      console.log("Cannot find anything in database.")
                    }
                  })
                }).catch(function(error) {
                  console.log("Error getting document:", error);
                })
              }
            }
            /* reset articles in ui each sub and unsub */
            this.setState({articles: aList})
            } else {
              db.collection("topicSubscription").doc(this.state.CurrentUser).set({subList: []});
            }
          })

        }).catch(function(error) {
            console.log("Error getting document:", error);
        });
      }
      
      /* store news in 'all' collection into capicitor local storage to reduce reading*/
      let allNews: any[] = []
      var allArticlesLocal = await Storage.get({key:'allArticles'})
      if ((allArticlesLocal.value)?.length === undefined || JSON.parse((allArticlesLocal.value)).length === 0) {
        await NewsDB.collection('all').where("Title", "!=", " ")
        .onSnapshot((snapshot) => {
          snapshot.docChanges().forEach((change) => {
            allNews.push(change.doc.data())
        })
          var source = snapshot.metadata.fromCache ? "local cache" : "server";
          console.log("Data came from " + source);
          Storage.set({key: 'allArticles', value:JSON.stringify(allNews)})
          })
          console.log('Storing in local storage')
        } else {
          console.log('already in local storage')
          this.setState({allArticles:JSON.parse((allArticlesLocal.value))})
      }
      // await NewsDB.collection('all').where("Title", "!=", " ")
      // .onSnapshot((snapshot) => {
      //   snapshot.docChanges().forEach((change) => {
      //     allNews.push(change.doc.data())
      // });
      // })
      // this.setState({allArticles:allNews})
      console.log("allarticles", this.state.allArticles)
    })
    
  }

  async clear() {
    await Storage.clear();
  }

  /* Testing with local storage */
  async setObject() {
    let allNews: any[] = []
    const ret = await Storage.get({key:'sports'})
    if ((ret.value)?.length === undefined ||  JSON.parse((ret.value)).length === 0) {
      await NewsDB.collection('sports').where("Title", "!=", " ")
        .onSnapshot((snapshot) => {
          snapshot.docChanges().forEach((change) => {
            allNews.push(change.doc.data())
        })
        Storage.set({key: 'sports', value:JSON.stringify(allNews)})
        })
        console.log('Storing in local storage')
      } else {
        console.log('already in local storage')
        console.log(JSON.parse((ret.value) || '{}'))
      }
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
          <IonCardTitle >{props.subscription}</IonCardTitle>
          <IonButton size="small" color="dark" type="submit" expand="full" shape="round" onClick={()=> this.unsubscribe(props.subscription,props.index)}>unsub</IonButton>
        </IonCardHeader>
      </IonCard>  

  /* search firebase database for topic*/
  async searchTopic(topic:any) {
    if (topic === null || topic === undefined || topic === '') {
      console.log("Enter a valid topic");
    } else {
      this.setState({articlesSearched:[]})
      let aList : articleList = [];
      /* cache data on topic search */
      await NewsDB.collection(topic.toLowerCase()).where("Title", "!=", " ")
      .onSnapshot((snapshot) => {
      /* Searching topics based on string matching titles to input if a collection doesn't exist */
      if (snapshot.empty) {
        console.log("can't find the collection, will search in all collection")
        var filtered = this.state.allArticles.filter(doc => doc.Title.toLowerCase().includes(topic.toLowerCase()))
        if (filtered.length === 0) {
          console.log("currently no news on", topic)
        } else {
          filtered.forEach(filtered => {
            aList.push({title: filtered.Title, link: filtered.Link, description: filtered.Description})
          })
        this.setState({articlesSearched: aList})
        }
      } else {
      console.log("collection exist, will pull data from that collection")
      snapshot.docChanges().forEach((change) => {
        if (change.doc.exists) {
          this.setState({collectionExist:true})
          let articleItem = change.doc.data();
          aList.push({title: articleItem.Title, link: articleItem.Link, description: articleItem.Description})
        }
        this.setState({articlesSearched: aList})
      })
      }
      var source = snapshot.metadata.fromCache ? "local cache" : "server";
        console.log("Data came from " + source);
    })
  }
  }

  async subscribe(topic:any) {
    if (topic === null || topic === undefined || topic === '') {
      console.log("Enter a valid topic");
    } else {
      /* cache data on subscribe */
      await NewsDB.collection(topic.toLowerCase()).where("Title", "!=", " ")
      .onSnapshot((snapshot) => {
       /* Creating a new collection if topic collection doesn't exist and subscribing to it */
      if (snapshot.empty) {
        /* using this.state.allArticles called in constructor */
        var filteredArticles = this.state.allArticles.filter(doc => doc.Title.toLowerCase().includes(topic.toLowerCase()))
        if (filteredArticles.length === 0) {
          console.log("currently no news on that topic")
          return
        }
        filteredArticles.forEach(filteredArticles => {
          NewsDB.collection(topic.toLowerCase()).doc(filteredArticles.Title).set({Title:filteredArticles.Title, Link: filteredArticles.Link, Description: filteredArticles.Description});
        })
        console.log("Making new collection called", topic, " and subscribing")
        this.addSubscription(topic.toLowerCase());
      } else {
        console.log("News about "+ topic +" has been found and will be subscribed.")
        this.addSubscription(topic.toLowerCase());
        this.setState({collectionExist:false})        
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

  render() {
    const subs = [];
      for (var i = 0; i < this.state.subs.length; i+=1) {
        subs.push(<this.ChildComponent key={i} subscription={this.state.subs[i]} index={i} />);
    };
    return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>
            Feed
          </IonTitle>
          <IonRouterOutlet>
          <Route path="/Weather" component={Weather} exact={true} />
      </IonRouterOutlet>
      <IonButtons slot="start">
          <IonButton href="/Weather">
              <IonIcon icon={cloud} />
          </IonButton>
          </IonButtons>
          <IonButtons slot="end">
          <IonButton onClick={() => {this.setState({showSubscription: true})}}  fill='clear'>
              <IonIcon icon={bookmark} />
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
        
    <IonModal isOpen={this.state.showModal}>
        <IonHeader>
            <IonToolbar>

        <IonButtons slot='end'>
                <IonButton onClick={() => {this.setState({showModal: false})}} id='addFriendModalCloseButton' fill='clear'>
                  <IonIcon id='addFriendModalCloseIcon' icon={closeCircleOutline}/>
                </IonButton>
        </IonButtons>
        <IonTitle>
                Search Topics
        </IonTitle>
        </IonToolbar>
        </IonHeader>
        <IonContent>
        <IonSearchbar placeholder="Topic" onIonInput={(e: any) => this.setState({topicSearched:e.target.value} )} animated>
      </IonSearchbar>
      <IonButton size="default" color="dark" type="submit" expand="full" shape="round" onClick={()=> this.setState({showLoading: true})}>
          search
      </IonButton>
      <IonLoading
        isOpen={this.state.showLoading}
        onDidDismiss={() => this.searchTopic(this.state.topicSearched) && this.setState({showLoading: false})}
        message={'Getting data from database'}
        duration={150}
      />
      <IonButton size="default" color="dark" type="submit" expand="full" shape="round" onClick={()=>this.subscribe(this.state.topicSearched)}>
          subscribe
      </IonButton>
    <ArticleList theArticleList={this.state.articlesSearched}></ArticleList>
        </IonContent>
    </IonModal>
    <IonModal isOpen={this.state.showSubscription}>
        <IonHeader>
            <IonToolbar>
        <IonButtons slot='end'>
                <IonButton onClick={() => {this.setState({showSubscription: false})}} fill='clear'>
                  <IonIcon id='addFriendModalCloseIcon' icon={closeCircleOutline}/>
                </IonButton>
        </IonButtons>
        <IonTitle>
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
      <ArticleList theArticleList={this.state.articles}></ArticleList>
      </IonContent>

    </IonPage>
    )
  }

}

export default Feed;
