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
reddit rss: https://www.reddit.com/r/worldnews/.rss
washington post rss: http://feeds.washingtonpost.com/rss/world
cnbc rss: https://www.cnbc.com/id/100727362/device/rss/rss.html
abc rss: https://abcnews.go.com/abcnews/internationalheadlines
cbs rss: https://www.cbsnews.com/latest/rss/world
time rss breaking news: https://time.com/feed/
vox rss: https://www.vox.com/rss/world/index.xml
nytimes: https://www.nytimes.com/svc/collections/v1/publish/https://www.nytimes.com/section/world/rss.xml
*/
const admin = require('firebase-admin');
const serviceAccount = require('./world-watchlist-server-fa5a3-firebase-adminsdk-1gbjp-b433d05376.json');

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
        title = articles[i].title;
        description = articles[i].description;
        urlLink = articles[i].link;
        article_list.push({'Title': title, 'Description': description, 'Link': urlLink});
        URL_ID = (urlLink.split('/').pop());
        db.collection(collection_name).doc(URL_ID).set(
          {
              Title: title,
              Description: description,
              Link: urlLink
          })
        }
}

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
      writeDoc(article_info, collection_name);
    }).catch((error) => {
      console.log(error);
    })
}
// app.post('/bbc', (req, res) => {
//   url = "http://feeds.bbci.co.uk/news/rss.xml";
//   getRSS(url, res);

// })
// app.post('/nyt', (req, res) => {
//   url = "https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml";
//   getRSS(url, res);
// })

function bbcpost() {
  url = "http://feeds.bbci.co.uk/news/rss.xml";
  getRSS(url, 'BBCNews');
}
function nytpost() {
  url = "https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml";
  getRSS(url, "NYTNews");
}
function thisInterval() {
  bbcpost();
  nytpost();
  console.log("Sending to firestore.")
}
setInterval(thisInterval, 60000);
exports.app = functions.https.onRequest(app)
