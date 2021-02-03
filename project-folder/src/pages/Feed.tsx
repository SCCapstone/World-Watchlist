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
  IonLoading
} from '@ionic/react'

import './Feed.css'
import { NewsDB } from '../API/config';
import firebase, {db,auth} from '../firebase'
import ArticleList from '../components/ArticleList';
import { article, articleList } from '../components/ArticleTypes';
import Weather from './Weather'
import { Redirect, Route } from 'react-router-dom';
import { cloud } from 'ionicons/icons';

type MyState = {
  articles: articleList;
  subs: string[];
  unsubscribeArticles: any;
  CurrentUser:any;
  topicSearched:any;
  showLoading:boolean
}

type MyProps = {
  history: any;
  location: any;
}

// function getBBCNews() {
//   let BBCNews = db.collection("BBCNews")
//   let aList: articleList = [];// {list: []};
//   let allNews = BBCNews.get()
//     .then(snapshot => {
//       snapshot.forEach(doc => {
//         let articleItem = doc.data();
//         aList.push({title: articleItem.Title, link: articleItem.Link, description: articleItem.Description})
//         console.log(doc.id, '=>', doc.data());
//       });
//     });
//     return aList;
// };

// function FeedFunc() {
//   const [articles, setArticles] = useState(Array<article>());
//   setArticles(getBBCNews());
//   return (
//     <IonPage>
//       <IonHeader>
//         <IonToolbar>
//           <IonTitle>
//             Feed
//           </IonTitle>
//         </IonToolbar>
//       </IonHeader>
//       <IonContent>
//     <ArticleList theArticleList={articles}></ArticleList>
//       </IonContent>
//     </IonPage>
//   );
// }
// export default FeedFunc;

class Feed extends React.Component<MyProps, MyState> {
  state: MyState = {
    articles: [],
    subs: [],
    unsubscribeArticles: undefined,
    CurrentUser: null,
    topicSearched:null,
    showLoading:false
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
          // go into weatherSubscription collection
          // const dbSubscription = db.collection('weatherSubscription').doc(this.state.CurrentUser)
        // get subscription list
        db.collection("topicSubscription").doc(this.state.CurrentUser).get().then(sub_list => {
          if (doc.exists && doc.data() !== undefined && doc.data()!.subList !== undefined) {
            this.setState({subs: doc.data()!.subList});
          } else {
            db.collection("topicSubscription").doc(this.state.CurrentUser).update({subList: []});
            this.setState({subs: []})
          }
        })
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });
      }
    })

      
  }

  // getUserData = () => {
  // NewsDB.collection("BBCNews")
  //   .doc('55118880')
  //   .get()
  //   .then(doc => {
  //     const data = doc.data();
  //     console.log(data);
  //     return data;
  //   });
  // };

  // saveBBCNews = (someVar: articleList) => {
  //   let BBCNews = NewsDB.collection("BBCNews");
  //   let allNews = BBCNews.get()
  //     .then(snapshot => {
  //       someVar.list = [];
  //       snapshot.forEach(doc => {
  //         let articleItem = doc.data();
  //         let newArticle = {title: articleItem.Title, link: articleItem.Link, description: articleItem.Description};
  //         someVar.list.push(newArticle);
  //       });
  //     });
  // }

  /* search firebase database for topic*/
  async searchTopic(topic:any) {
    let aList : articleList = [];
    let unsubscribeArticles = NewsDB.collection(topic).get().then((snapshot) => {
      aList = []

      snapshot.forEach(doc => {
        let articleItem = doc.data();
        aList.push({title: articleItem.Title, link: articleItem.Link, description: articleItem.Description})
      })
      this.setState({articles: aList})
    })
    this.setState({unsubscribeArticles: unsubscribeArticles})
  }

  async subscribe(topic:any) {
    console.log("topic is: " + topic)
  }

  // async getBBCNews() {
  //   let BBCNews = NewsDB.collection("BBCNews")
  //   let aList: articleList = [];// {list: []};
  //   let allNews = BBCNews.get()
  //     .then(snapshot => {
  //       snapshot.forEach(doc => {
  //         let articleItem = doc.data();
  //         aList.push({title: articleItem.Title, link: articleItem.Link, description: articleItem.Description})
  //         //console.log(doc.id, '=>', doc.data());
  //       });
  //     });
  //     return aList;
  // };

  // async getSubArticles(sub_name: string) {
  //   let sub_collection = NewsDB.collection(sub_name);
  //   let aList: articleList = [];// {list: []};
  //   let allNews = sub_collection.get()
  //     .then(snapshot => {
  //       snapshot.forEach(doc => {
  //         let articleItem = doc.data();
  //         aList.push({title: articleItem.Title, link: articleItem.Link, description: articleItem.Description})
  //         //console.log(doc.id, '=>', doc.data());
  //       });
  //     });
  //     return aList;
  // };

  // componentDidMount() {
  //   this.setState({articles: this.getBBCNews()})
  // }

  // componentWillUnmount() {
  //   this.state.unsubscribeArticles()
  // }

  render() {
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
          <IonButton href="/Weather">
              <IonIcon icon={cloud} />
          </IonButton>
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
      
              
    <ArticleList theArticleList={this.state.articles}></ArticleList>
      </IonContent>
    </IonPage>
    )
  }

}

export default Feed;
