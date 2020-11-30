const functions = require('firebase-functions');
const axios = require('axios');
var convert = require('xml-js');
const express = require('express')
const app = express()
var f = require("./scraper.js");
// let links2 = [];
// let article_info = [];
const cors = require('cors');
const { getArticles } = require('./scraper.js');
app.use(cors())
/*
nytimes: https://www.nytimes.com/svc/collections/v1/publish/https://www.nytimes.com/section/world/rss.xml
bbc: http://feeds.bbci.co.uk/news/rss.xml
*/
const admin = require('firebase-admin');
const serviceAccount = require('./world-watchlist-server-fa5a3-firebase-adminsdk-1gbjp-b433d05376.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();
function writeDoc(articles, doc_name) {
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
    }
    db.collection('articles').doc(doc_name).set(
        {articles: article_list}
    )
}


function getRSS(url, doc_name) {
  axios.get(url).then(
    (response) => {
      let article_info = [];
      let result2 = convert.xml2json(response.data, {compact: true, spaces: 4});
      let info2 = JSON.parse(result2);
      for ( i = 0 ; i < info2.rss.channel.item.length ; ++i ) {
        item = info2.rss.channel.item[i];
        console.log(info2.rss.channel.item[i]);
        let title = link = description = image = null;
        title = f.getTitle(item);
        link = f.getLink(item);
        description = f.getDesc(item);
        temp = new f.article(title, description, link);
        article_info.push(temp);
        // links2.push(info2.rss.channel.item[i].link._text);
      }
      // getArticles(result2, article_info);
      // console.log(article_info);
      writeDoc(article_info, doc_name);
      // article_info = [];
      // console.log(links2);
    }).catch((error) => {
      console.log(error);
    })
}
app.post('/bbc', (req, res) => {
  url = "http://feeds.bbci.co.uk/news/rss.xml";
  getRSS(url, res);

})
app.post('/nyt', (req, res) => {
  url = "https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml";
  getRSS(url, res);
})

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
setInterval(thisInterval, 36000000);
exports.app = functions.https.onRequest(app)
