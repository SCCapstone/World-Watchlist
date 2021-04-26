const functions = require('firebase-functions');
const axios = require('axios');
let convert = require('xml-js');
const express = require('express')
let f = require("./scraper.js");
const fs = require("fs")
const cheerio = require("cheerio")
const request = require("request");
const cors = require('cors')({origin: true});
let currentDate = new Date();
const waitTime = 18000000;
const day = 10
const oldTime = day * 24 * 60 * 60 * 1000;  
const app = express();
const timeFrame = 119400; // 1.99 minutes
app.use(cors);
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
app.options('*', cors);
app.get('/favicon.ico', function(req, res) { 
  res.status(204);
  res.end();    
});


app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

let config = {
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
db.settings({ ignoreUndefinedProperties: true })
async function writeDoc(articles, collection_name) {
  console.log(articles)
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

// async function scrapeRSS(rssFeed){
//   let article_info = [];
//   const scrapePromise = new Promise(async (resolve,reject)=>{
//     let title = link = description = image = date = null;
//     for ( i = 0 ; i < 10 ; ++i ) {
//       item = await rssFeed.rss.channel.item[i];
//       title = await f.getTitle(item);
//       link = await f.getLink(item);
//       console.log("title",title)
//       console.log("link",link)
      
//       await getDesc(link).then(result=>{
//         description = result
//       }).catch(error=>{description = error})
//       let pathArray = await link.split( '/' );
//       let protocol = pathArray[0];
//       let host = pathArray[2];
//       let baseUrl = protocol + '//' + host;
//       pubDate = await f.getDate(item)
//       let pubDateObj = new Date(pubDate);
//       console.log("PubDate", pubDate)
//       console.log("pubDateObj", pubDateObj)
//       console.log("currentDate - pubDateObj < waitTime:", currentDate - pubDateObj < waitTime)
//       temp = new f.article(title, description, link, baseUrl, pubDate);
//       if (currentDate - pubDateObj < waitTime)
//         article_info.push(temp);
//       }
//     console.log("rssScrape",article_info)
//     resolve(article_info)
//   })
//   return scrapePromise
// }


/* go through rss feed and get article information*/
async function getRSS(url, collection_name) {
  // console.log("TEST",url, collection_name)
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
        let pathArray = link.split( '/' );
        let protocol = pathArray[0];
        let host = pathArray[2];
        let baseUrl = protocol + '//' + host;
        let pubDate = await f.getDate(item)
        let pubDateObj = new Date(pubDate);
        // console.log("PubDate", pubDate)
        // console.log("pubDateObj", pubDateObj)
        // console.log("currentDate - pubDateObj < waitTime:", currentDate - pubDateObj < waitTime)
        let temp = new f.article(title, description, link, baseUrl, pubDate);
        if (currentDate - pubDateObj < waitTime)
          article_info.push(await temp);
        item = title = link = description = image = date = pathArray = null;
        protocol = host = baseUrl = pubDate = pubDateObj = temp = null;
        }
      console.log("TEST",article_info)
      await writeDoc(article_info, collection_name);
      article_info = result2 = info2 = null;
    }).catch((error) => {
      console.log(error);
    })
    return null
  }catch (error) {
    console.log(Object.keys(error), error.message); 
  }
}

async function getCollection() {
  let collectionArr = [];
  const collectionPromise = await new Promise(async (resolve,reject)=>{
    await db.listCollections()
    .then(async snapshot=> {
        snapshot.forEach(async snaps=>{
          collectionArr.push(await snaps["_queryOptions"].collectionId);  // GET LIST OF ALL COLLECTIONS
        })
        
    }).catch(error=>
      {console.log(error)
      reject(error)});
    collectionArr = collectionArr.filter(item => item !== 'weather')
    resolve(collectionArr)
    console.log('getCollection function',collectionArr)
  })
  return collectionPromise
}

/* gets the name of each collection and updates its */
async function updateALL() {
  console.log('Run update all test')
  await getCollection().then(async collectionArr=>{
    // console.log(collectionArr)
    currentDate = new Date(Date.now());
      collectionArr.forEach(async collectionID => {
        url = "https://news.google.com/rss/search?q="+collectionID
        await getRSS(url, collectionID)
      })
    // url = "https://news.google.com/rss/search?q="+
  }).catch(err=>console.log(err))
  return 0
}
// delete news that are over 10 days
async function deleteOldNews(){
  collectionArr = await getCollection()
  try {
  // url = "https://news.google.com/rss/search?q="+
  collectionArr.forEach(async collectionID => {
    const col = db.collection(collectionID)
    // console.log(oldTime)
    let date = new Date(Date.now() - oldTime) 
    let date2 = new Date(date);
    console.log(date2)
    await col.get().then(doc=>{
      doc.forEach(async doc2 => {
        let pubDate = await doc2.data().pubDate
        let pubDate2 = new Date(pubDate);
        // delete news article if older than 10 days.
        if (pubDate2-date2<=0) {
          await db.collection(collectionID).doc(doc2.id).delete();
        }
        console.log(pubDate2 - date2);
      });
    }).catch(err=>console.log(err));
    
    // await deleteCollection(db,collectionID,10)
  })
  }catch (error) {
    console.log(Object.keys(error), error.message); 
  }
}


// deleting a collection
// async function deleteCollection(db, collectionPath, batchSize) {
//   const collectionRef = db.collection(collectionPath);
//   const query = collectionRef.orderBy('__name__').limit(batchSize);
//   console.log(collectionPath)
//   return new Promise((resolve, reject) => {
//     deleteQueryBatch(db, query, resolve).catch(reject);
//   });
// }

// async function deleteQueryBatch(db, query, resolve) {
//   const snapshot = await query.get();

//   const batchSize = await snapshot.size;
//   console.log(batchSize)
//   if (batchSize === 2) {
//     // When there are 2 documents left, we are done
//     resolve();
//     return;
//   }
//   // Delete documents in a batch
//   const batch = db.batch();
//   snapshot.docs.forEach((doc) => {
//     batch.delete(doc.ref);
//   });
//   await batch.commit();
// }

async function getWeatherInfo(long,lat,location){
  let dailyData = []
  await axios.get("https://api.openweathermap.org/data/2.5/onecall?lat="+lat+"&lon="+long+"&exclude={hourly,minutely}&appid=853ea8c8d782be685ad81ace7b65291a&units=imperial",{setTimeout: 2})
  .then(async (response) => {
    const dailyWeather = await response.data.daily
    const currentWeather = await response.data.current
    for (let i = 1; i < dailyWeather.length; i++) {
      dailyData.push({date:new Date(await dailyWeather[i].dt*1000).toString().substring(0,3), forecast:await dailyWeather[i].weather[0].description, temp:await dailyWeather[i].feels_like.day, dt:await dailyWeather[i].dt})
    }
    await db.collection('weather').doc(location).update({lat:lat, long:long, location:location ,temperature:currentWeather.temp+'F',weather_code: currentWeather.weather[0].description, weeklyForecast:dailyData})
  }).catch((error) => {
    console.log(error)
  });
}


async function updateWeatherCollection(){
  let lat;
  let long;
  let location;
  const snapshot = await db.collection('weather').get()
  snapshot.docs.forEach(async doc => {
    long = await doc.data().long
    lat = await doc.data().lat
    location = doc.id
    getWeatherInfo(long,lat,location)
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
      let urlElems = $('p')
      let urlSpan = $(urlElems[i])[0]
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
async function getArticles(topic){
  const promise = new Promise(async (resolve, reject) => {
    let googleRSS = "https://news.google.com/rss/search?q="+topic+"&hl=en-US&gl=US&ceid=US:en"
    let article_info = [];
    let title = link = description = image = date = null;
    await axios.get(googleRSS,{setTimeout: 2}).then(
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
          let pathArray = link.split( '/' );
          let protocol = pathArray[0];
          let host = pathArray[2];
          let baseUrl = protocol + '//' + host;
          pubDate = await f.getDate(item)
          temp = new f.article(title, description, link, baseUrl, pubDate);
          article_info.push(temp);
        }
      }).catch((error) => {
        reject(error);
      })
      resolve(article_info)
  })
  return promise
}

// rsstojson api! get rss feed and return it INTO JSON! YES NOW WE DON'T have to USE AN API AND WORRY ABOUT LIMIT
app.get('/p', async function(req,res)
{
  
  let topic = req.query.topic
  getArticles(topic).then(result=>
    {
      if (result!==undefined)
        res.send(result)
      else {
        res.send('error')
      }
    })
})


// get content of articles from
app.get('/url', async function(req,res)
{
  let url = req.query.url
  request(url, function(error, response, body) {
  if(error) {
    console.log("Error: " + error);
    res.send('error')
  } else {
    console.log("Status code: " + response.statusCode);
    let $ = cheerio.load(body); 
    let article = $('article')
    let p = article.find('p').children().remove().end()
    let img =  $("body").find('img')
    let logo = $(img[0]).attr('src')
    res.send({content:p.text().trim(),logo:logo})
  }
  });
})
// function schedules. {https://cloud.google.com/scheduler/docs/configuring/cron-job-schedules}

// check and update every 10 minute to see if an article has been posted in the last 60 minute
exports.scheduledUpdate = functions.pubsub.schedule('* 1 * * *').onRun(async (context) => {
  await updateALL()
})
// delete old news if a news article has been posted more than 10 days every day
exports.scheduledDelete = functions.pubsub.schedule('* 23 * * *').onRun(async (context) => {
  console.log("checking if there are old news.")
  await deleteOldNews()
})
// update weather information every day
exports.scheduledWeatherUpdate = functions.pubsub.schedule('* 23 * * *').onRun(async (context) => {
  console.log("update weather collection.")
  await updateWeatherCollection()
})


exports.app = functions.https.onRequest(app)
