import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const db = admin.firestore();

export const gameCount = functions.firestore
  .document('games/{gameId}') // brackets cause this function to run on any document change event ( specified )
  .onCreate( async (snapshot, context) => {
    // get data from snapshot (user data created in creation of new game)
    const data = snapshot.data();
    // grab reference to specific user document
    const userRef = db.doc(`users/${data.uid}`);
    // query db with reference to specific snapshot
    const userSnap = await userRef.get();
    // get user data from snapshot
    const userData = userSnap.data();

    let gameCount;
    if ( userData && userData.gamecount) {
      gameCount = userData.gameCount + 1
    } else {
      gameCount = 0;
    }

    // update the players game count by one
    return userRef.update({
      gameCount 
    });
  });

export const userTrend = functions.firestore
  .document('games/{gameID}')
  .onUpdate( (snapshot, context) => { // on update snapshots return both a before an after object
    const before = snapshot.before.data();
    const after = snapshot.after.data();

    let trend;
    if (after.score >= before.score) {
      trend = 'you are impoving';
    } else {
      trend = 'you are declining in performance';
    }

    const userRef = db.doc(`users/${after.uid}`)

    // be careful not to call an update on the same record, that will cause an 
    // infinite loop
    return userRef.update({
      trend
    });
  })