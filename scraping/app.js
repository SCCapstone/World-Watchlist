const http = require('http');
var convert = require('xml-js');
const hostname = '127.0.0.1';
const port = 3000;

// const request = require('request')
// request('https://newsapi.org/v2/everything?q=bitcoin&apiKey=608f2a765753454fa4b75aea9f5c53f5', function (
//   error,
//   response,
//   body
// ) {
//   console.error('error:', error)
//   var info = JSON.parse(body)
//   console.log('body:', info.articles)
// })

const request = require('request')
request('https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml', function (
  error,
  response,
  body
) {
  var result1 = convert.xml2json(body, {compact: true, spaces: 4});
  var info = JSON.parse(result1)
  console.log(info.rss.channel)
  
})


const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});