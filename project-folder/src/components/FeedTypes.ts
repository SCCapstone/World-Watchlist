import { articleList } from "./ArticleTypes"
type modeTypes = "cards" | "all";
type sortTypes = "title" | "pubDate" | "none";
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
    subArticles:any[],
    locationBased:boolean,
    isWeatherModalOpen:boolean,
    isSearchingModal:boolean,
    showSearchAlert:boolean,
    showSubscribeAlert:boolean,
    isChanging:boolean,
    showErrorSubscribe:boolean,
    showErrorAlert:boolean,
    mode: modeTypes,// "cards" | "all",
    sort: sortTypes// "title" | "pubDate" | "none"
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
  mode: modeTypes, // "cards" | "all",
  sort: sortTypes // "title" | "pubDate" | "none"
}

interface article {
    title: string;
    link: string;
    description: string;
    source:any;
    pubDate:any;
}
export type FeedProps = {
    history: any;
    location: any;
    openShareModal: (theArticle: article, shouldOpen: boolean) => void
  }
export type GroupFeedProps = {
  groupId: string;
}
