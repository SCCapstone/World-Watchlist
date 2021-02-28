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
    isChanging:boolean,
  }
  
export type FeedProps = {
    history: any;
    location: any;
  }