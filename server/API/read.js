const admin = require('../../project-folder/src/API/node_modules/firebase-admin');
const serviceAccount = require('./world-watchlist-server-fa5a3-firebase-adminsdk-1gbjp-b433d05376.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();
const articlesRef = db.collection('articles');
async function getdocs() {
    const snapshot = await articlesRef.get();
    snapshot.forEach(doc => {
    console.log(doc.id, '=>', doc.data());
    });
}

getdocs()

exports.getdocs = getdocs;