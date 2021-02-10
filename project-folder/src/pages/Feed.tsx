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

type MyState = {
  articles: articleList;
  subs: string[];
  articlesSearched:any[],
  unsubscribeArticles: any;
  CurrentUser:any;
  topicSearched:any;
  showLoading:boolean;
  showModal:boolean,
  collectionExist:boolean,
  showSubscription:boolean
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
    unsubscribeArticles: undefined,
    CurrentUser: null,
    topicSearched:null,
    showLoading:false,
    showModal:false,
    collectionExist:false,
    showSubscription:false
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
          db.collection("topicSubscription").doc(this.state.CurrentUser).onSnapshot((sub_list) => {
            if (sub_list.exists) {
              console.log(sub_list.data()!.subList)
              this.setState({subs: sub_list.data()!.subList});
              let aList : articleList = [];
              if (this.state.subs.length !== 0) {
                for (var i = 0; i < this.state.subs.length; i++) {
                let unsubscribeArticles = NewsDB.collection(this.state.subs[i]).get()
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
                this.setState({articles: aList})
            }
            } else {
              db.collection("topicSubscription").doc(this.state.CurrentUser).set({subList: []});
            }
          })

        }).catch(function(error) {
            console.log("Error getting document:", error);
        });
      }
      
    })
  }

  /* can currently subscribe to: gaming, health, politics, sports, technology, world */
  addSubscription(sub: string) {
    if ( sub !== "") {
      db.collection("topicSubscription").doc(this.state.CurrentUser).update({subList: firebase.firestore.FieldValue.arrayUnion(sub)})
    }
  }

  removeSubscription(index:any) {
    this.state.subs.splice(index,1)
    if (this.state.subs[index] !== "") {
      db.collection("topicSubscription").doc(this.state.CurrentUser).update({subList: (this.state.subs)})
    }
    console.log(this.state.subs)
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
          <IonButton size="small" color="dark" type="submit" expand="full" shape="round" onClick={()=> this.removeSubscription(props.index)}>unsub</IonButton>

        </IonCardHeader>
      </IonCard>  

  /* search firebase database for topic*/
  async searchTopic(topic:any) {
    if (topic === null || topic === undefined || topic === '') {
      console.log("Enter a valid topic");
    } else {
    let aList : articleList = [];
    let unsubscribeArticles = NewsDB.collection(topic.toLowerCase()).get()
    .then((snapshot) => {
      aList = []
      snapshot.forEach(doc => {
        if (doc.exists) {
          this.setState({collectionExist:true})
          let articleItem = doc.data();
          aList.push({title: articleItem.Title, link: articleItem.Link, description: articleItem.Description})
        } else {
          console.log("Cannot find anything in database.")
        }
      })
      this.setState({articlesSearched: aList})
    }).catch(function(error) {
      console.log("Error getting document:", error);
  });
    this.setState({unsubscribeArticles: unsubscribeArticles})
  }
  }
  async subscribe(topic:any) {
    let aCollection = NewsDB.collection(topic.toLowerCase()).get().then((snapshot) => {
      if ( snapshot.empty) {
        console.log("Cannot find any news on that topic.")
      } else {
        console.log("News about "+ topic +" has been found and will be subscribed.")
        this.addSubscription(topic);
        this.setState({collectionExist:false})        
      }
    });
    // console.log("Reference"+aCollection);
    // if( /*this.state.collectionExist*/) {
    //   console.log("News about "+ topic +" has been found and will be subscribed.")
    //   this.addSubscription(topic);
    //   this.setState({collectionExist:false})
    // } else {
    //   console.log("Cannot find any news on that topic.")
    // }
    
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
        <IonSearchbar placeholder="Topic" onIonInput={(e: any) => this.setState({topicSearched:e.target.value})} animated>
      </IonSearchbar>
      <IonButton size="default" color="dark" type="submit" expand="full" shape="round" onClick={()=>this.setState({showLoading: true})}>
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
