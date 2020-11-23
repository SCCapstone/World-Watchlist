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
function writeDoc(articles, doc_name) {
    let URL_ID, urlLink, title, description;
    // let articles = data;
    console.log(articles.length);
    let article_list = [];
    for (i = 0; i < articles.length; i++) {
        title = articles[i].title;
        description = articles[i].description;
        urlLink = articles[i].link;
        article_list.push({'Title': title, 'Description': description, 'Link': urlLink});
        URL_ID = (urlLink.split('/').pop());
        // db.collection('BBCNews').doc(URL_ID).set(
        //     {
        //         Title: title,
        //         Description: description,
        //         Link: urlLink
        //     }
        // );
    }
    db.collection('articles').doc(doc_name).set(
        {articles: article_list}
    )
}
function bbcpost() {
    axios.post("http://localhost:5000/bbc").then(({ data }) => {
        writeDoc(data, 'BBCNews');
        // var URL_ID, urlLink, title, description
        // var articles = data
        // console.log(articles.length)
        // let article_list = []
        // for (i = 0; i < articles.length; i++) {
        //     title = articles[i].title
        //     description = articles[i].description
        //     urlLink = articles[i].link
        //     article_list.push({'Title': title, 'Description': description, 'Link': urlLink})
        //     URL_ID = (urlLink.split('/').pop())
        //     // db.collection('BBCNews').doc(URL_ID).set(
        //     //     {
        //     //         Title: title,
        //     //         Description: description,
        //     //         Link: urlLink
        //     //     }
        //     // );
        // }
        // db.collection('articles').doc('BBCNews').set(
        //     {articles: article_list}
        // )
    });
}
function nytpost() {
    axios.post("http://localhost:5000/nyt").then(({ data }) => {
        writeDoc(data, 'NYTNews')
        // var URL_ID, urlLink, title, description
        // var articles = data
        // console.log(articles.length)
        // for (i = 0; i < articles.length; i++) {
        //     title = articles[i].title
        //     description = articles[i].description
        //     urlLink = articles[i].link
        //     URL_ID = (urlLink.split('/').pop())
        //     db.collection('NYTNews').doc(URL_ID).set(
        //         {
        //             Title: title,
        //             Description: description,
        //             Link: urlLink
        //         }
        //     );
        // }
    });
}
function thisInterval() {
    bbcpost();
    nytpost();
}
setInterval(thisInterval, 6000);




