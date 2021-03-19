const functions = require('firebase-functions');
const axios = require('axios');
var convert = require('xml-js');
const express = require('express')
var f = require("./scraper.js");
const fs = require("fs")
const cheerio = require("cheerio")
const request = require("request");
const cors = require('cors')({origin: true});

const app = express();

app.use(cors);

app.get('/favicon.ico', function(req, res) { 
  res.status(204);
  res.end();    
});


app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

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

admin.initializeApp({
  config
});

const db = admin.firestore();
async function writeDoc(articles, collection_name) {
    let URL_ID, urlLink, title, description;
    for (i = 0; i < articles.length; i++) {
        /* replacing all forward slash with dash to avoid errors */
        title = await articles[i].title.replace(/\//g, "-");
        description = await articles[i].description;
        urlLink = await articles[i].link;
        source = await articles[i].source;
        pubDate = await articles[i].pubDate
        await db.collection(collection_name).doc(title).set(
          {
              Title: title,
              Description: description,
              Link: urlLink,
              source: source,
              pubDate: pubDate
          })
        }
  return null
}


/* go through rss feed and get article information*/
async function getRSS(url, collection_name) {
  try {
  await axios.get(url).then(
    async (response) => {
      let article_info = [];
      let result2 = convert.xml2json(await response.data, {compact: true, spaces: 4});
      let info2 = await JSON.parse(result2);
      /* using set length of articles to get instead of getting all articles with info2.rss.channel.item.length */
      for ( i = 0 ; i < 10 ; ++i ) {
        item = info2.rss.channel.item[i];
        //console.log(info2.rss.channel.item[i]);
        let title = link = description = image = date = null;
        title = await f.getTitle(item);
        link = await f.getLink(item);
        description = await getDesc(link);
        var pathArray = link.split( '/' );
        var protocol = pathArray[0];
        var host = pathArray[2];
        var baseUrl = protocol + '//' + host;
        pubDate = await f.getDate(item)
        temp = new f.article(title, description, link, baseUrl, pubDate);
        article_info.push(temp);
      }
      await writeDoc(article_info, collection_name);
    }).catch((error) => {
      console.log(error);
    })
    return null
  }catch (error) {
    console.log(Object.keys(error), error.message); 
  }
}

/* gets the name of each collection and updates its */
async function updateALL() {
  collectionArr = []
  try {
  await db.listCollections()
  .then(async snapshot=> {
      snapshot.forEach(async snaps=>{
        await collectionArr.push(snaps["_queryOptions"].collectionId);  // GET LIST OF ALL COLLECTIONS
      })
    await Promise.all(collectionArr);
  })
  .catch(error=>console.log(error));
  // url = "https://news.google.com/rss/search?q="+
  console.log(collectionArr)
  collectionArr.forEach(async collectionID => {
    url = "https://news.google.com/rss/search?q="+collectionID
    await getRSS(url, collectionID)
  })
  return null
  }catch (error) {
    console.log(Object.keys(error), error.message); 
  }
}

async function deleteAll(){
  collectionArr = []
  try {
  await db.listCollections()
  .then(async snapshot=> {
      snapshot.forEach(async snaps=>{
        await collectionArr.push(snaps["_queryOptions"].collectionId);  // GET LIST OF ALL COLLECTIONS
      })
  }) .catch(error=>console.log(error));
  // url = "https://news.google.com/rss/search?q="+
  collectionArr.forEach(async collectionID => {
    // 10 docs are deleted from each collection
    await deleteCollection(db,collectionID,10)
  })
  }catch (error) {
    console.log(Object.keys(error), error.message); 
  }
}


// deleting old news.
async function deleteCollection(db, collectionPath, batchSize) {
  const collectionRef = db.collection(collectionPath);
  const query = collectionRef.orderBy('__name__').limit(batchSize);
  console.log(collectionPath)
  return new Promise((resolve, reject) => {
    deleteQueryBatch(db, query, resolve).catch(reject);
  });
}

async function deleteQueryBatch(db, query, resolve) {
  const snapshot = await query.get();

  const batchSize = await snapshot.size;
  console.log(batchSize)
  if (batchSize === 2) {
    // When there are 2 documents left, we are done
    resolve();
    return;
  }
  // Delete documents in a batch
  const batch = db.batch();
  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });
  await batch.commit();
}


async function updateWeatherCollection(){
  let lat;
  let long;
  let location;
  const snapshot = await db.collection('weather').get()
  snapshot.docs.forEach(async doc => {
    long = doc.data().long
    lat = doc.data().lat
    location = doc.data().location
    await axios.get("https://api.openweathermap.org/data/2.5/onecall?lat="+lat+"&lon="+long+"&exclude={hourly,minutely}&appid=853ea8c8d782be685ad81ace7b65291a&units=imperial")
    .then(async (response) => {
      const dailyWeather = await response.data.daily
      const currentWeather = response.data.current
      var dailyData = []
      for (var i = 1; i < dailyWeather.length; i++) {
        dailyData.push({date:new Date(await dailyWeather[i].dt*1000).toString().substring(0,3), forecast:dailyWeather[i].weather[0].description, temp:dailyWeather[i].feels_like.day, dt:dailyWeather[i].dt})
      }
      db.collection('weather').doc(location).set({lat:lat, long:long, location:location ,temperature:currentWeather.temp+'F',weather_code: currentWeather.weather[0].description, weeklyForecast:dailyData})
    }).catch((error) => {
      console.log(error)
    });
  });
}


// function get description using metadata module
async function getDesc(link) {
  let desc = ""
  await axios.get(link).then( (response) => {
    const $ = cheerio.load(response.data);
    data = $('meta[name="description"]').attr('content')
    if (data || data !== null) {
      desc = data 
    } else {
      var urlElems = $('p')
      var urlSpan = $(urlElems[i])[0]
      if (urlSpan || urlSpan !== null) {
        urlText = $(urlSpan).text()
        desc = urlText
      }
    }
  }).catch((error) => {
    console.log(error);
  })
  return desc
}

// rsstojson api! get rss feed and return it INTO JSON! YES NOW WE DON'T have to USE AN API AND WORRY ABOUT LIMIT
app.get('/p', async function(req,res)
{
  var result2 = null
  var info2 = null
  var topic = req.query.topic
  var googleRSS = "https://news.google.com/rss/search?q="+topic+"&hl=en-US&gl=US&ceid=US:en"
  var article_info = [];
  var title = link = description = image = date = null;
  await axios.get(googleRSS).then(
    async (response) => {
      result2 = convert.xml2json(await response.data, {compact: true, spaces: 4});
      info2 = await JSON.parse(result2);
      // get 12 initially
      for ( i = 0 ; i < 12 ; ++i ) {
        item = info2.rss.channel.item[i];
        title = await f.getTitle(item).replace(/\//g, "-");
        link = await f.getLink(item);
        description = await getDesc(link);
        if (!description) {
          description = "View the full coverage below."
        } 
        var pathArray = link.split( '/' );
        var protocol = pathArray[0];
        var host = pathArray[2];
        var baseUrl = protocol + '//' + host;
        pubDate = await f.getDate(item)
        temp = new f.article(title, description, link, baseUrl, pubDate);
        article_info.push(temp);
      }
    }).catch((error) => {
      console.log(error);
    })
    res.send(article_info)
})


// get content of articles from
app.get('/url', async function(req,res)
{
  var url = req.query.url
  request(url, function(error, response, body) {
  if(error) {
    console.log("Error: " + error);
  }
  console.log("Status code: " + response.statusCode);
  var $ = cheerio.load(body); 
  var article = $('article')
  var p = article.find('p').children().remove().end()
  var img =  $("body").find('img')
  var logo = $(img[0]).attr('src')
  res.send({content:p.text().trim(),logo:logo})
  });
})
// function schedules. {https://cloud.google.com/scheduler/docs/configuring/cron-job-schedules} 
// delete every 7 hours and 57 minute
exports.scheduledDelete = functions.pubsub.schedule('57 7 * * *').onRun(async (context) => {
  console.log("deleting current collections and updating.")
  await deleteAll()
})
// update right after every 8 hours
exports.scheduledUpdate = functions.pubsub.schedule('* 8 * * *').onRun(async (context) => {
  console.log("deleting current collections and updating.")
  await updateALL()
})

exports.app = functions.https.onRequest(app)
