import { articleList } from "./ArticleTypes"

export type FeedState = {
    articles: articleList;
    subs: string[];
    blockedSources: string[],
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
export type FeedProps = {
    history: any;
    location: any;
  }
export type GroupFeedProps = {
  groupId: string;
}