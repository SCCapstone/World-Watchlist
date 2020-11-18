const functions = require('firebase-functions');
const axios = require('axios');
var convert = require('xml-js');
const express = require('express')
const app = express()
var f = require("./scraper.js");
let links2 = [];
let article_info = [];
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
app.post('/', (req, res) => {
  url = ""
  axios.get(url).then(
  (response) => {
    res.set('Cache-Control', 'public, max-age=300, s-maxage=600') // loads information quicker by caching the results to user.
    let result2 = convert.xml2json(response.data, {compact: true, spaces: 4});
    let info2 = JSON.parse(result2)
    for ( i = 0 ; i < info2.rss.channel.item.length ; ++i ) {
      item = info2.rss.channel.item[i];
      console.log(info2.rss.channel.item[i]);
      let title = link = description = image = null;
      title = f.getTitle(item);
      link = f.getLink(item);
      description = f.getDesc(item);
      image = f.getImage(item);
      temp = new f.article(title, description, link, image);
      article_info.push(temp);
      links2.push(info2.rss.channel.item[i].link._text);
    }
    // console.log(article_info)
    res.send(article_info);
    // console.log(links2)
  }).catch((error) => {
    console.log(error);
  })
  
})
exports.app = functions.https.onRequest(app)
