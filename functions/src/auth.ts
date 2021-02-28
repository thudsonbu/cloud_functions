import * as functions from 'firebase-functions';

import * as admin from 'firebase-admin';
admin.initializeApp(); // admin db

const db = admin.firestore(); // define outside so that db is not declared in 
// each function

export const createUserRecord = functions.auth.user()
  .onCreate( ( user, context ) => {
    const userRef = db.doc(`users/${user.uid}`);

    return userRef.set({ // must return promise
      name: user.displayName,
      createdAt: context.timestamp,
      nickname: 'bubba'
    });
});