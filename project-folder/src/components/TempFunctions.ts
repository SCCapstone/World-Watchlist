// converted methods in Feed.tsx to functions, attempted move of constructors
import { LocalNotifications, Plugins } from "@capacitor/core";
import axios from "axios";
import firebase from "firebase"
import { NewsDB } from "../config/config";
import { db } from "../firebase"
import { articleList } from "./ArticleTypes";
const { Storage } = Plugins;

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
  let temp = topic.replace(/\ /g,"%2520")
  let rssurl = "https%3A%2F%2Fnews.google.com%2Frss%2Fsearch%3Fq%3D"+temp+"%26hl%3Den-US%26gl%3DUS%26ceid%3DUS%3Aen"
  await axios({
    method: 'GET',
    url:'https://api.rss2json.com/v1/api.json?rss_url='+rssurl+"&api_key=ygho9vm848pakf5b24oawteww7slkcj2ccgiu13w"
  // url: "https://send-rss-get-json.herokuapp.com/convert/?u="+"https://news.google.com/rss/search?q="+topic+"&hl=en-US&gl=US&ceid=US:en"
  // https://api.rss2json.com/v1/api.json?rss_url=
  })
  .then(async (response) => {
    const data = await response.data
    console.log(data)
    await data.items.forEach((articleItem: any) => {
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

export const tempcheckCollection = async (collection:string) => {
    let isChanging = false;
    var observer = NewsDB.collection(collection).where('Title', '!=', '')
    .onSnapshot(async querySnapshot => {
        // if there are changes to the metadata, clear cache and add new docs to the 
        if (querySnapshot.metadata.fromCache === false) {
          tempclear();
            isChanging = true;
        //   this.setState({isChanging:true})
          if (!(await LocalNotifications.requestPermission()).granted) return;
          // send notification for every changes in collection
            await LocalNotifications.schedule({
              notifications: [{
                title: 'New articles in your feed!',
                body: "Check them out!",
                id: 1,
                schedule: {
                  at:new Date(new Date().getTime() + 1000),
                  repeats:false,
                }
              }]
            });
      }
    });
    return isChanging;
}

export const tempclear = async () => {
    await Storage.clear();
}