const scraper_function = require('../scraper')
const axios = require('axios');
var convert = require('xml-js');





test('api to get topic articles works', ()=>{
  axios.get('https://world-watchlist-server-8f86e.web.app/p/?topic='+'columbia')
  .then(async (response) => {
    expect(response.statusText).toBe('OK')
  })
})


test('api to scrape content from articles when bookmarking given url', ()=>{
  axios.get('https://world-watchlist-server-8f86e.web.app/url/?url='+'https://www.nbcnews.com/news/us-news/alternate-juror-recounts-derek-chauvin-trial-moment-really-got-me-n1264916')
  .then(async (response) => {
    expect(response.statusText).toBe('OK')
  })
})


test('testing xml2json works.', () => {
  axios.get("http://feeds.bbci.co.uk/news/rss.xml").then(
        (response) => {
          let result2 = convert.xml2json(response.data, {compact: true, spaces: 4});
          expect(result2).toBeDefined()
        })
});




test('testing getImage() works.', () => {
  axios.get("http://feeds.bbci.co.uk/news/rss.xml").then(
        (response) => {
          let result2 = convert.xml2json(response.data, {compact: true, spaces: 4});
          let info2 = JSON.parse(result2);
            item = info2.rss.channel.item[0];
            let image = null;
            image = scraper_function.getImage(item);
            expect(image).toBeDefined()
        })
});



test('testing getDate() returns a string.', () => {
  axios.get("http://feeds.bbci.co.uk/news/rss.xml").then(
        (response) => {
          let result2 = convert.xml2json(response.data, {compact: true, spaces: 4});
          let info2 = JSON.parse(result2);
            item = info2.rss.channel.item[0];
            let date = null;
            date = scraper_function.getDate(item);
            expect(typeof date).toBe('string')
        })
});


test('testing getTitle() returns a string.', () => {
    axios.get("http://feeds.bbci.co.uk/news/rss.xml").then(
        (response) => {
          let result2 = convert.xml2json(response.data, {compact: true, spaces: 4});
          let info2 = JSON.parse(result2);
            item = info2.rss.channel.item[0];
            let title = null;
            title = scraper_function.getTitle(item);
            expect(typeof title).toBe('string')
        })
});

test('testing getLink() returns a string.', () => {
  axios.get("http://feeds.bbci.co.uk/news/rss.xml").then(
      (response) => {
        let result2 = convert.xml2json(response.data, {compact: true, spaces: 4});
        let info2 = JSON.parse(result2);
          item = info2.rss.channel.item[0];
          let link = null;
          link = scraper_function.getLink(item);
          expect(typeof link).toBe('string')
      })
});

test('testing getDesc() returns a string.', () => {
  axios.get("http://feeds.bbci.co.uk/news/rss.xml").then(
      (response) => {
        let result2 = convert.xml2json(response.data, {compact: true, spaces: 4});
        let info2 = JSON.parse(result2);
          item = info2.rss.channel.item[0];
          let description = null;
          description = scraper_function.getDesc(item);
          expect(typeof description).toBe('string')
      })
});