// converted methods in Feed.tsx to functions, attempted move of constructors
import { LocalNotifications, Plugins } from "@capacitor/core";
import axios from "axios";
import firebase from "firebase"
import { addListener } from "process";
import { NewsDB } from "../config/config";
import { db } from "../firebase"
import { article, articleList } from "./ArticleTypes";
const { Storage } = Plugins;

export const hasTopics = async (userId: string|undefined) => {
    if (userId !== undefined && userId !== null && userId !== "") {
        db.collection("topicSubscription").doc(userId).get().then((docData) => {
            if (!docData.exists) {
                console.log("Making new list");
                db.collection("topicSubscription").doc(userId).set({subList: []});
            } else {
                console.log("Already has list");
            }
        })
    } else {
        console.log("Invalid user id: "+userId+".");
        console.log(userId);
    }
}

export const tempaddSubscription = async (sub: string, userId: string|undefined) => {
    console.log("Temp add called");
  if (sub!== "")
    await db.collection("topicSubscription").doc(userId).update({subList: firebase.firestore.FieldValue.arrayUnion(sub)});
}

export const tempremoveSubscription = async (index:any, userId: string|undefined, subs: string[]) => {
    console.log("temp remove called");
    if (subs[index] !== "") {
      await db.collection("topicSubscription").doc(userId).update({subList: firebase.firestore.FieldValue.arrayRemove(subs[index])});
    }
}

export const tempsubscribe = async (topic:any, userId: string|undefined) => {
    if (topic === null || topic === undefined || topic === '') {
        console.log("Enter a valid topic");
    } else {
      /* cache data on subscribe */
      await NewsDB.collection(topic.toLowerCase()).get()
        .then(async (snapshot) => {
       /* Creating a new collection if topic collection doesn't exist and subscribing to it */
        if (snapshot.empty) {
            await tempapiSearch(topic, 'subscribe', userId);
        } else {
        console.log("News about "+ topic +" has been found and will be subscribed.");
        await tempaddSubscription(topic.toLowerCase(), userId);
      }
            var source = snapshot.metadata.fromCache ? "local cache" : "server";
            console.log("Data came from " + source);
        })
    }
}

export const tempapiSearch = async (topic: any, type:string, userId: string|undefined) => {
  let aList : articleList = [];
  /* needed for the api.rss2json to work */
    await axios({
      method: 'GET',
      /* using server api to turn rss feeds into json to avoid cors policy errors */
      url:'https://world-watchlist-server-8f86e.web.app/'+topic
    })
  .then(async (response) => {
    await response.data.forEach((articleItem: any) => {
      /* remove <a> html tag from description */
      var html = articleItem.description;
      var a = document.createElement("a");
      a.innerHTML = html;
      var text = a.textContent || a.innerText || "";
      var pathArray = articleItem.link.split( '/' );
      var protocol = pathArray[0];
      var host = pathArray[2];
      var baseUrl = protocol + '//' + host;
      aList.push({title: articleItem.title, link: articleItem.link, description: text, source: baseUrl, pubDate:articleItem.pubDate})
    })
    if (type==='search') {
      return aList;
    } else {
      aList.forEach(async newsItem => {
        var html = newsItem.description;
        var a = document.createElement("a");
        a.innerHTML = html;
        var text = a.textContent || a.innerText || "";
        var pathArray = newsItem.link.split( '/' );
        var protocol = pathArray[0];
        var host = pathArray[2];
        var baseUrl = protocol + '//' + host;
        await NewsDB.collection(topic.toLowerCase()).doc(newsItem.title).set({Title: newsItem.title, Link: newsItem.link, Description: text, source: baseUrl, pubDate:newsItem.pubDate});
      })
      await tempaddSubscription(topic.toLowerCase(), userId);
    }
  }).catch((error) => {
    console.log(error)
  });
  return aList
}

export const getArticles = async (userId: string|undefined) => {
    let aList: any[] = [];
    let articles: any[] = [];
    let subscriptions: any[] = [];
    db.collection("topicSubscription").doc(userId).onSnapshot(async (sub_list) => {
        articles = []; // this.setState({articles:[]});
        if (sub_list.exists) {
            subscriptions = await sub_list.data()!.subList; // this.setState({subs: await sub_list.data()!.subList});
            console.log("subs",subscriptions);
            for (var i = 0; i < subscriptions.length; i++) {
            /* Observe any changes in firestore and send a notification*/
            let isChanging = await tempcheckCollection(subscriptions[i]);
            aList = [];
            var articlesLocal = await Storage.get({key:subscriptions[i]});
            // check local storage if collection exist take from cache, if collection changes, get from server
            if ((articlesLocal.value)?.length === undefined || JSON.parse((articlesLocal.value)).length === 0 || isChanging===true) {
                console.log("local storage empty for", subscriptions[i]);
                await NewsDB.collection(subscriptions[i]).get().then(async (snapshot) => {
                    snapshot.forEach(async doc => {
                        if (doc.exists) {
                            let articleItem = doc.data();
                            var html = articleItem.Description;
                            var a = document.createElement("a");
                            a.innerHTML = html;
                            var text = a.textContent || a.innerText || "";
                            aList.push({title: articleItem.Title, link: articleItem.Link, description: text, source:articleItem.source, pubDate: articleItem.pubDate});
                        } else {
                            console.log("Cannot find anything in database.");
                        }
                    })
            var source = snapshot.metadata.fromCache ? "local cache" : "server";
            console.log("Sub Articles came from " + source);
            await Storage.set({ key: subscriptions[i], value: JSON.stringify(aList)});
            articles = [...articles, ...aList]; // this.setState({articles: [...articles, ...aList]});
        })
        } else {
            articles = [...articles, ...JSON.parse(articlesLocal.value)]; // this.setState({articles:[...articles, ...JSON.parse(articlesLocal.value)]});
            console.log("taking from capacitor cache");
        }
        }
        console.log("articles",articles);
    } else {
        db.collection("topicSubscription").doc(userId).set({subList: []});
    }
    })
    return {articles: articles, subs: subscriptions};
}

export const tempGetSubscribedArticles = async (blockedSources: string[], subscriptions: string[], articles: article[]) => {
    // this.setState({articles:[]})
    // get blocked sources on firestore
    let aList : any[] = [];
    let newArticles: article[] = [];
    console.log(blockedSources)
    for (var i = 0; i < subscriptions.length; i++) {
      /* Observe any changes in firestore and send a notification*/
      let isChanging = await tempcheckCollection(subscriptions[i])
      aList = []
      var articlesLocal = await Storage.get({key:subscriptions[i]})
      // check local storage if collection exist take from cache, if collection changes, get from server
      if ((articlesLocal.value)?.length === undefined || JSON.parse((articlesLocal.value)).length === 0 || isChanging === true) {
        console.log("local storage empty for", subscriptions[i])
        await NewsDB.collection(subscriptions[i]).get()
      .then(async (snapshot) => {
        snapshot.forEach(async doc => {
          if (doc.exists) {
            let articleItem = doc.data();
            var html = articleItem.Description;
            var a = document.createElement("a");
            a.innerHTML = html;
            var text = a.textContent || a.innerText || "";
            //await new Promise(r => setTimeout(r, 1000));
            var domain = (articleItem.source)
            if(!blockedSources.includes(domain)) {
              console.log("blocked")
              aList.push({title: articleItem.Title, link: articleItem.Link, description: text, source:domain, pubDate: articleItem.pubDate})
            }
          } else {
            console.log("Cannot find anything in database.")
          }
        })
        var source = snapshot.metadata.fromCache ? "local cache" : "server";
        console.log("Sub Articles came from " + source);
        await Storage.set({ key: subscriptions[i], value: JSON.stringify(aList)});
        console.log("List to be pushed");
        console.log(aList);
        newArticles = newArticles.concat(aList);
        // this.setState({articles: [...this.state.articles, ...aList]});
      })
      } else {
        let parsed = JSON.parse(articlesLocal.value);
        // console.log("parsed data");
        // console.log(parsed);
        newArticles = newArticles.concat(parsed);
        // console.log("Concatenated list");
        // console.log(newArticles);
        // this.setState({articles:[...this.state.articles, ...JSON.parse(articlesLocal.value)]})
        // console.log("taking from capacitor cache");
      }
    //   this.setState({isChanging:false}) // ignoring
    }
    console.log("Returning articles");
    console.log(newArticles);
    return newArticles;
}

export const tempcheckCollection = async (collection:string) => {
    let isChanging = false;
    var observer = NewsDB.collection(collection).where('Title', '!=', '')
    .onSnapshot(async querySnapshot => {
        // if there are changes to the metadata, clear cache and add new docs to the 
      const LocalNotificationPendingList = await LocalNotifications.getPending()
        // if there are changes to the metadata, clear cache and add new docs to the 
        if (querySnapshot.metadata.fromCache === false) {
          // clear cache so new articles can be added to cache
          tempclear();
          isChanging = true;
          if (!(await LocalNotifications.requestPermission()).granted) return;
          // send notification for every changes in collection
            await LocalNotifications.schedule({
              notifications: [{
                title: 'Changes in your feed!',
                body: "Check them out!",
                id: 1,
                schedule: {
                  // notification 1 minutes after change in collections
                  at:new Date(new Date().getTime() + 60000),
                  repeats:false
                },
              }]
            });
          }
          if (LocalNotificationPendingList.notifications.length>0) {
            LocalNotifications.cancel(LocalNotificationPendingList)
          }
        })
    return isChanging;
}

export const tempsearchTopic = async (topic:any, userId: string|undefined) => {
    let aList : articleList = [];
      if (!validTopic(topic)/*topic === null || topic === undefined || topic === ''*/) {
        console.log("Enter a valid topic");
      } else {
        // this.toggleNewsModal()
        /* cache data on topic search */
        await NewsDB.collection(topic.toLowerCase()).get()
        .then(async (snapshot) => {
        if (snapshot.empty) {
          // searching through api and sending to firestore instead of searching in main collection
          console.log("Search temp api");
          aList = await tempapiSearch(topic, 'search', userId);
        } else {
        console.log("collection exist, will pull data from that collection")

        aList = [];
        snapshot.docChanges().forEach((change) => {
          if (change.doc.exists) {
            let articleItem = change.doc.data();
            var html = articleItem.Description;
            var a = document.createElement("a");
            a.innerHTML = html;
            var text = a.textContent || a.innerText || "";
            aList.push({title: articleItem.Title, link: articleItem.Link, description: text, source: articleItem.source, pubDate: articleItem.pubDate})
          }
        //   this.setState({articlesSearched: aList})
        })
        console.log(aList);
        }
      })
    }
    console.log("Printing temp search topic list");
    console.log(aList);
    return aList;
}

export const validTopic = (topic: string) => {
    return topic !== null && topic !== undefined && topic !== "";
}

export const tempclear = async () => {
    await Storage.clear();
}

export const isValidEmail = (email: string) : string[] => {
  let errors: string[] = [];
  if (!email.includes('@'))
    errors.push("Invalid email");
  return errors;
}

export const isValidPassword = (password: string) : string[] => {
  let errors: string[] = [];
  if (password.length < 6 || password.length > 20)
    errors.push("Password must have 6-20 characters");
  return errors;
}