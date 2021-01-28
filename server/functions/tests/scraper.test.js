const scraper_function = require('../scraper')
const axios = require('axios');
var convert = require('xml-js');

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