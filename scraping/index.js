const express = require('express');
const request = require('request');
const cheerio	= require('cheerio');
const { json } = require('express');
const app = express();

// app.get('/', function(req, res){

// 	let url = "https://www.nytimes.com/2020/11/13/arts/music/playlist-billie-eilish-lil-nas-x.html"
// 	if(url) {
// 		console.log("Scrape Request initiated: "+url);
// 		request(url, function(error, response, html){
//             console.log("Successfully retrieved data from "+url);
//             let data;
//             let title;
//             if(!error) {
//                 var $ = cheerio.load(html);
//                 title = $('h1');
//                 data = $("[name=articleBody]").html();
//             }
//             console.log("Outputting Scrape Data for "+url);
//             res.render('article', {data, title});
// 		});
// 	} else {
// 		res.json({"error": "URL Param not defined."});
// 	}

// });

// app.get('/', function(req, res){

// 	let url = "https://newsapi.org/v2/everything?q=apple&from=2020-11-13&to=2020-11-13&sortBy=popularity&apiKey=dfda0cc497794ebb8f91f0567ee26f69"
// 	if(url) {
// 		request(url, function(error, response, body){
//             const json_body = JSON.parse(body)
//             const articles = json_body.articles
//             status = json_body.status
//             list = []
//             console.log(articles[0].title)
//             for (i = 0 ; i <= articles.length; i++) {
//                 // title = articles[i].title
//                 // author = articles[i].author
//                 // description = articles[i].description
//                 // list.push({title,author,description})
//             }
//             //console.log(json_body.length())
//             res.send(articles)
// 		});
// 	} else {
// 		res.json({"error": "URL Param not defined."});
// 	}

// });
/* LISTEN ON PORT */
app.listen('8081')
console.log('NYT Started on Port 8081');
exports = module.exports = app;