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
  IonButtons
} from '@ionic/react'

import './Feed.css'
import { db } from '../API/config';
import ArticleList from '../components/ArticleList';
import { article, articleList } from '../components/ArticleTypes';
import Weather from './Weather'
import { Redirect, Route } from 'react-router-dom';
import { cloud } from 'ionicons/icons';
type MyState = {
  articles: articleList;
  unsubscribeArticles: any;
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
    unsubscribeArticles: undefined
  };

  constructor(props: MyProps) {
    super(props)
    let aList : articleList = [];
    let unsubscribeArticles = db.collection('BBCNews').get().then((snapshot) => {
      aList = []

      snapshot.forEach(doc => {
        let articleItem = doc.data();
        aList.push({title: articleItem.Title, link: articleItem.Link, description: articleItem.Description})
      })
      this.setState({articles: aList})
    })
    this.setState({unsubscribeArticles: unsubscribeArticles})
  }

  // getUserData = () => {
  // db.collection("BBCNews")
  //   .doc('55118880')
  //   .get()
  //   .then(doc => {
  //     const data = doc.data();
  //     console.log(data);
  //     return data;
  //   });
  // };

  // saveBBCNews = (someVar: articleList) => {
  //   let BBCNews = db.collection("BBCNews");
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
  getBBCNews() {
    let BBCNews = db.collection("BBCNews")
    let aList: articleList = [];// {list: []};
    let allNews = BBCNews.get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          let articleItem = doc.data();
          aList.push({title: articleItem.Title, link: articleItem.Link, description: articleItem.Description})
          //console.log(doc.id, '=>', doc.data());
        });
      });
      return aList;
  };

  componentDidMount() {
    //this.setState({articles: this.getBBCNews()})
  }

  componentWillUnmount() {
    this.state.unsubscribeArticles()
  }

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
        <IonButtons slot='start'>
          <IonButton href="/Weather">
              <IonIcon icon={cloud} />
          </IonButton>
        </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
    <ArticleList theArticleList={this.state.articles}></ArticleList>
      </IonContent>
    </IonPage>
    )
  }

}

export default Feed;
