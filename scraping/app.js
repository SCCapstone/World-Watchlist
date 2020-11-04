const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const request = require('request')
request('https://www.reddit.com/r/programming.json', function (
  error,
  response,
  body
) {
  console.error('error:', error)
  console.log('body:', body)
})


const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});