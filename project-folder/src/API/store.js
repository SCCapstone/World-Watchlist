const admin = require('firebase-admin');
const axios = require('axios')
const serviceAccount = require('./\world-watchlist-server-fa5a3-firebase-adminsdk-1gbjp-b433d05376.json');
/*
For now, put bbc news info into BBCNews Collection
using the end of url as doc id
and {title, desc, link} as fields.
*/
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();
function bbcpost() {
    axios.post("http://localhost:5000/bbc").then(({ data }) => {
        var URL_ID, urlLink, title, description
        var articles = data
        console.log(articles.length)
        for (i = 0; i < articles.length; i++) {
            title = articles[i].title
            description = articles[i].description
            urlLink = articles[i].link
            URL_ID = (urlLink.split('/').pop())
            db.collection('BBCNews').doc(URL_ID).set(
                {
                    Title: title,
                    Description: description,
                    Link: urlLink
                }
            );
        }
    });
}
function thisInterval() {
    bbcpost();
}
setInterval(thisInterval, 6000);




