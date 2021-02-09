const functions = require('firebase-functions');
const axios = require('axios');
var convert = require('xml-js');
const express = require('express')
const app = express()
var f = require("./scraper.js");
const cors = require('cors');
const { getArticles } = require('./scraper.js');
app.use(cors())
/*
nytimes: https://www.nytimes.com/svc/collections/v1/publish/https://www.nytimes.com/section/world/rss.xml
bbc: http://feeds.bbci.co.uk/news/rss.xml
*/
const admin = require('firebase-admin');
const serviceAccount = require('./world-watchlist-server-8f86e-firebase-adminsdk-uzswz-478530228e.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
function writeDoc(articles, collection_name) {
    let URL_ID, urlLink, title, description;
    // let articles = data;
    // console.log(articles.length);
    let article_list = [];
    for (i = 0; i < articles.length; i++) {
        /* replacing all forward slash with dash to avoid errors */
        title = articles[i].title.replace(/\//g, "-");
        description = articles[i].description;
        urlLink = articles[i].link;
        
        /* replacing all forward slash with dash to avoid errors */

        article_list.push({'Title': title, 'Description': description, 'Link': urlLink});
        // URL_ID = (urlLink.split('/').pop());
        // console.log("title: " + title)
        // console.log("url: " + urlLink)
        // console.log("description: " + description)
        db.collection(collection_name).doc(title).set(
          {
              Title: title,
              Description: description,
              Link: urlLink
          })
        }
}
/* go through rss feed and get article information*/
function getRSS(url, collection_name) {
  axios.get(url).then(
    (response) => {
      let article_info = [];
      let result2 = convert.xml2json(response.data, {compact: true, spaces: 4});
      let info2 = JSON.parse(result2);
      for ( i = 0 ; i < info2.rss.channel.item.length ; ++i ) {
        item = info2.rss.channel.item[i];
        //console.log(info2.rss.channel.item[i]);
        let title = link = description = image = null;
        title = f.getTitle(item);
        link = f.getLink(item);
        description = f.getDesc(item);
        temp = new f.article(title, description, link);
        article_info.push(temp);
      }
      // console.log(article_info)
      writeDoc(article_info, collection_name);
    }).catch((error) => {
      console.log(error);
    })
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
  getRSS(url, "sports");
}

async function politics_feed() {
  url = "https://www.politico.com/rss/politicopicks.xml";
  getRSS(url, "politics");
}

function thisInterval() {
  health_feed();
  world_feed();
  technology_feed();
  gaming_feed();
  sports_feed();
  politics_feed();
  console.log("Sending to firestore.")
}

/*refresh every 8 hours*/

setInterval(thisInterval, 10000);
exports.app = functions.https.onRequest(app)
