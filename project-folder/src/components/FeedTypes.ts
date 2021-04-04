import { articleList } from "./ArticleTypes"
type modeTypes = "cards" | "all";
export type sortTypes = "title" | "pubDate" | "none";
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
    muted:any[]
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
type Group = {
  nickname: string;
  members: string[];
  id: string;
  profilePicture: string;
  owner: string;
  lastMessage: string;
  lastMessageSender: string;
}

export type FeedProps = {
    history: any;
    location: any;
    openShareModal: (theArticle: article, shouldOpen: boolean) => void;
    isShareModalOpen: boolean;
    myArticle: article;
    groupArray: Group[];
    ourUsername: string;
  }
export type GroupFeedProps = {
  groupId: string;
}
