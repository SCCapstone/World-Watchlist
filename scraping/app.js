const axios = require('axios');
var convert = require('xml-js');
const express = require('express')
const app = express()
const port = 3000;
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

app.get('/', (req, res) => {
  axios.get('https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml').then(
  (response) => {
    // console.log(response);
    // console.log(response.data);
    let result2 = convert.xml2json(response.data, {compact: true, spaces: 4});
    // console.log(result2);
    let info2 = JSON.parse(result2)
    // console.log(info2.rss.channel.item)
    for ( i = 0 ; i < info2.rss.channel.item.length ; ++i ) {
      temp = {"title": info2.rss.channel.item[i].title._text
      , "link": info2.rss.channel.item[i].link._text
      , "description": info2.rss.channel.item[i].description._text
      , "image":null}
      media = info2.rss.channel.item[i]["media:content"]
      if (media != null && media.media == "image") {
        console.log("\n\n", info2.rss.channel.item[i]["media:content"]._attributes, "\n\n")
        temp.image = media["media:content"].url;
      }
      article_info.push(temp);
      links2.push(info2.rss.channel.item[i].link._text);
    }
    // console.log(article_info);
    res.send(article_info);
    // console.log(links2);
  }).catch((error) => {
    console.log(error);
  })
  
})


app.listen(port) 
console.log("listetning on http://localhost:" + port);
