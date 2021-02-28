import { articleList } from "./ArticleTypes"

export type FeedState = {
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
    showSubscribeAlert:boolean,
<<<<<<< HEAD
    isChanging:boolean
}
export type GroupFeedState = {
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
  isSearchingModal:boolean,
  showSearchAlert:boolean,
  showSubscribeAlert:boolean,
  isChanging:boolean,
  isWeatherModalOpen: boolean,
  groupId: string;
}
=======
    isChanging:boolean,
  }
  
>>>>>>> 424bbdd94799a9ad1ee9ab6cea4a33de224ed1a9
export type FeedProps = {
    history: any;
    location: any;
  }
export type GroupFeedProps = {
  groupId: string;
}