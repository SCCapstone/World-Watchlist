const http = require('http');
const axios = require('axios');
var convert = require('xml-js');
const hostname = '127.0.0.1';
const port = 3000;
let links = [];
let links2 = [];
let article_info = [];


function removeEntries(list) {
  for( i = 0 ; i < list.length ; ++i ) {
    if (list[i].includes("puzzle") ||
      list[i].includes("crossword")) {
        list.pop
      }
  }
}
function removeEntries(list) {
  for( i = 0 ; i < list.length ; ++i ) {
    if (list[i].includes("puzzle") ||
      list[i].includes("crossword")) {
        list.pop
      }
  }
}

function getArticles(rssFeed) {

}
function getRSS(rssFeed) {

}
function getTitle(itemObj) {
  let title = null;
  if ( "title" in itemObj ) // check if item has title
    itemObj = itemObj["title"];
  if( "_text" in itemObj) { // check item's child
    title = itemObj._text;
  } else if ( "_cdata" in itemObj) {
    title = itemObj._cdata;
  } else {
    console.log(itemObj);
  }
  return title;
}

function getLink(itemObj) {
  let link = null;
  if ( "link" in itemObj)
    itemObj = itemObj["link"];
  if( "_text" in itemObj) { // check item's child
    link = itemObj._text;
  } else if ( "_cdata" in itemObj) {
    link = itemObj._cdata;
  } else {
    console.log(itemObj);
  }
  return link;
}
function getDesc(itemObj) {
  let description = null;
  if ("description" in itemObj)
    itemObj = itemObj["description"];
  if( "_text" in itemObj) { // check item's child
    description = itemObj._text;
  } else if ( "_cdata" in itemObj) {
    description = itemObj._cdata;
  } else {
    console.log(itemObj);
  }
  return description;
}
function getImage(itemObj) {
  let image = null;
  if ( "media:content" in itemObj) {
    itemObj = itemObj["media:content"];
  } else if ("media:thumbnail" in itemObj) {
    itemObj = itemObj["media:thumbnail"];
  }
  if ( "image" in itemObj) {
    image = itemObj["image"];
  } else if ("") {

  } else {
    console.log(itemObj);
  }
  return image;
}
class article {
  constructor(title, description, link, image) {
    this.title = title;
    this.description = description;
    this.link = link;
    this.image = image;
  }
}
// const request = require('request')
// request('https://newsapi.org/v2/everything?q=bitcoin&apiKey=608f2a765753454fa4b75aea9f5c53f5', function (
//   error,
//   response,
//   body
// ) {http://feeds.foxnews.com/foxnews/latest
//   console.error('error:', error)
//   var info = JSON.parse(body)
//   console.log('body:', info.articles)
// })
// http://feeds.bbci.co.uk/news/rss.xml
// https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml
// http://rss.cnn.com/rss/cnn_topstories.rss
// https://www.cbsnews.com/latest/rss/world
// https://abcnews.go.com/abcnews/internationalheadlines
//http://feeds.washingtonpost.com/rss/sports?itid=lk_inline_manual_28
//
axios.get("").then(
  (response) => {
    // console.log(response);
    // console.log(response.data);
    let result2 = convert.xml2json(response.data, {compact: true, spaces: 4});
    // console.log(result2);
    let info2 = JSON.parse(result2)
    // console.log(info2.rss.channel.item)
    for ( i = 0 ; i < info2.rss.channel.item.length ; ++i ) {
      item = info2.rss.channel.item[i];
      console.log(info2.rss.channel.item[i]);
      let title = link = description = image = null;
      title = getTitle(item);
      link = getLink(item);
      description = getDesc(item);
      image = getImage(item);
      temp = new article(title, description, link, image);
      // temp = {"title": info2.rss.channel.item[i].title._text
      // , "link": info2.rss.channel.item[i].link._text
      // , "description": info2.rss.channel.item[i].description._text
      // , "image":null}
      // media = info2.rss.channel.item[i]["media:content"]
      // if (media != null && media.media == "image") {
      //   console.log("\n\n", info2.rss.channel.item[i]["media:content"]._attributes, "\n\n")
      //   temp.image = media["media:content"].url;
      // }
      article_info.push(temp);
      links2.push(info2.rss.channel.item[i].link._text);
    }
    console.log(article_info);
    // console.log(links2);
  }).catch((error) => {
    console.log(error);
  })
/*const request = require('request')
request('https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml', function (
  error,
  response,
  body
) {
  var result1 = convert.xml2json(body, {compact: true, spaces: 4});
  var info = JSON.parse(result1)
  for ( i = 0 ; i < info.rss.channel.item.length ; ++i )
    links.push(info.rss.channel.item[i].link._text);
  console.log(links);
})*/


const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  for(let i = 0 ; i < links.length ; ++i)
    res.write(links[i]+'\n');
  res.end('Hello World');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});