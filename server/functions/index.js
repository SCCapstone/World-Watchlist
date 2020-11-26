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

function getRSS(url, res) {
  axios.get(url).then(
    (response) => {
      res.set('Cache-Control', 'public, max-age=300, s-maxage=600') // loads information quicker by caching the results to user.
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
      console.log(article_info)
      res.send(article_info);
      // article_info = [];
      // console.log(links2)
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
exports.app = functions.https.onRequest(app)
