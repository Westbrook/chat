importScripts('dist/firebase-bundle.js');

let firebase = firebaseBundle.firebase;
let collectionData = firebaseBundle.collectionData;

let app = firebase.initializeApp(
  {
    apiKey: "AIzaSyBJhRBcpE--XW1csRxYareKXNkT1iLZg24",
    authDomain: "https://video-chat-poc.firebaseapp.com",
    databaseUrl: "https://video-chat-poc.firebaseio.com/",
    projectId: "video-chat-poc",
    storageBucket: "video-chat-poc.appspot.com"
  }
);

function initializeApp() {
  const firestore = app.firestore();
  const settings = {/* your settings... */ timestampsInSnapshots: true};
  firestore.settings(settings);

  let messagesRef = firestore.collection('openRooms/westbrook/events');
  collectionData(messagesRef, 'id').subscribe(messages => {
    console.log('all', performance.now())
    self.postMessage({
      cmd: 'messages',
      messages
    });
  });


  let usersRef = firestore.collection('openRooms/westbrook/users');
  collectionData(usersRef, 'id').subscribe(users => {
    self.postMessage({
      cmd: 'users',
      users
    });
  });
}

self.addEventListener('message', event => {
  switch(event.data.cmd) {
  case 'initializeApp':
    initializeApp();
    break;
  case 'postMessage':
    let message = event.data.message;
    messagesRef.doc(''+message.ts)
      .set(message);
    break;
  }
});
