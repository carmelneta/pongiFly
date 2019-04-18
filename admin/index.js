//import * as admin from 'firebase-admin';

var admin = require('firebase-admin');
var serviceAccount = require('./kkk.json');

//  = admin.initializeApp();

 var app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  
function main() {
    var db = admin.firestore();
    


    db.collection('users').get()
    .then((snapshot) => {
        snapshot.forEach((doc) => {
        console.log(doc.id, '=>', doc.data());
        });
    })
    .catch((err) => {
        console.log('Error getting documents', err);
    });
}

main();