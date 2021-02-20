const functions = require('firebase-functions');
const axios = require('axios');
var convert = require('xml-js');
const express = require('express')
const app = express()
var f = require("./scraper.js");
const cors = require('cors');
const { getArticles } = require('./scraper.js');
app.use(cors())
var config = {
  apiKey: "AIzaSyCiQa3wPMFOp_PidtF-8arljaCT3XFMLhc",
  authDomain: "world-watchlist-server-8f86e.firebaseapp.com",
  databaseURL: "https://world-watchlist-server-8f862.firebaseio.com",
  projectId: "world-watchlist-server-8f86e",
  storageBucket: "world-watchlist-server-8f86e.appspot.com",
  messagingSenderId: "252689618671",
  appId: "1:252689618671:web:3ac355cc3bbad710d02d1a",
};

/*
nytimes: https://www.nytimes.com/svc/collections/v1/publish/https://www.nytimes.com/section/world/rss.xml
bbc: http://feeds.bbci.co.uk/news/rss.xml
*/
const admin = require('firebase-admin');
const serviceAccount = require('./world-watchlist-server-8f86e-firebase-adminsdk-uzswz-478530228e.json');

admin.initializeApp({
  config
});

const db = admin.firestore();
async function writeDoc(articles, collection_name) {
    let URL_ID, urlLink, title, description;
    // let articles = data;
    // console.log(articles.length);
    // let article_list = [];
    for (i = 0; i < articles.length; i++) {
        /* replacing all forward slash with dash to avoid errors */
        title = await articles[i].title.replace(/\//g, "-");
        description = await articles[i].description;
        urlLink = await articles[i].link;
        /* replacing all forward slash with dash to avoid errors */
        // article_list.push({'Title': title, 'Description': description, 'Link': urlLink});
        // URL_ID = (urlLink.split('/').pop());
        // console.log("title: " + title)
        // console.log("url: " + urlLink)
        // console.log("description: " + description)
        await db.collection(collection_name).doc(title).set(
          {
              Title: title,
              Description: description,
              Link: urlLink
          })
        }
  return 0
}
/* go through rss feed and get article information*/
async function getRSS(url, collection_name) {
  await axios.get(url).then(
    async (response) => {
      let article_info = [];
      let result2 = convert.xml2json(await response.data, {compact: true, spaces: 4});
      let info2 = await JSON.parse(result2);
      for ( i = 0 ; i < info2.rss.channel.item.length ; ++i ) {
        item = info2.rss.channel.item[i];
        //console.log(info2.rss.channel.item[i]);
        let title = link = description = image = date = null;
        title = await f.getTitle(item);
        link = await f.getLink(item);
        description = await f.getDesc(item);
        temp = new f.article(title, description, link);
        article_info.push(temp);
      }
      await Promise.all(article_info);
      // console.log(article_info)
      await writeDoc(article_info, collection_name);
    }).catch((error) => {
      console.log(error);
    })
    return 0;
}

/* deletes old news and add new news to firebase */

async function health_feed() {
  url = "https://rss.nytimes.com/services/xml/rss/nyt/Health.xml";
  getRSS(url, "health");
}

async function world_feed() {
  url = "https://rss.nytimes.com/services/xml/rss/nyt/World.xml";
  getRSS(url, "world");
}
async function technology_feed() {
  url = "http://feeds.bbci.co.uk/news/technology/rss.xml";
  getRSS(url, "technology");
}
async function gaming_feed() {
  url = "http://feeds.feedburner.com/ign/all";
  getRSS(url, "gaming");
}

async function sports_feed() {
  url = "https://www.espn.com/espn/rss/news";
  await getRSS(url, "sports");
}

async function politics_feed() {
  url = "https://www.politico.com/rss/politicopicks.xml";
  await getRSS(url, "politics");
  return 0
}

/* gets the name of each collection and updates its */
async function all_feed() {
  collectionArr = []
  await db.listCollections()
  .then(async snapshot=>{
      snapshot.forEach(async snaps=>{
        await collectionArr.push(snaps["_queryOptions"].collectionId);  // GET LIST OF ALL COLLECTIONS
      })
    await Promise.all(collectionArr);
  })
  .catch(error=>console.log(error));
  // url = "https://news.google.com/rss/search?q="+
  console.log(collectionArr)
  await collectionArr.forEach(async collectionID => {
    url = "https://news.google.com/rss/search?q="+collectionID
    await getRSS(url, collectionID)
  })
  return 0
}

async function thisInterval() {
  // await politics_feed()
  // all_feed()
  // health_feed();
  // world_feed();
  // technology_feed();
  // gaming_feed();
  // sports_feed();
  // politics_feed();
  console.log("Sending to firestore.")
}

/* function schedules invocation every 8 hours. {https://cloud.google.com/scheduler/docs/configuring/cron-job-schedules} */
exports.scheduledFunction = functions.pubsub.schedule('* 8 * * *').onRun(async (context) => {
  await all_feed()
  console.log("all feed updated")
})
exports.app = functions.https.onRequest(app)
