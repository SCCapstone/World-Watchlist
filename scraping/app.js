const http = require('http');
var convert = require('xml-js');
const hostname = '127.0.0.1';
const port = 3000;
let links = []
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
  for ( i = 0 ; i < info.rss.channel.item.length ; ++i )
    links.push(info.rss.channel.item[i].link._text);
  console.log(links);
})


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