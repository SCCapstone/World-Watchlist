const admin = require('firebase-admin');
const axios = require('axios')
const serviceAccount = require('./RSSFEED_DB-f800edfd5b6b.json');
/*
For now, put bbc news info into BBCNews Collection
using the end of url as doc id
and {title, desc, link} as fields.
*/
function  bbcpost() {
    axios.post("http://localhost:5000/bbc").then(({ data }) => {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
        const db = admin.firestore();
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

bbcpost();




