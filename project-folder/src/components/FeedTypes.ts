import { articleList } from "./ArticleTypes"

export type MyState = {
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
  
export type MyProps = {
    history: any;
    location: any;
  }