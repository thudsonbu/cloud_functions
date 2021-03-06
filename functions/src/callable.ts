import * as functions from 'firebase-functions';
// firebase admin db (includes stuff like users and db change functions)
import * as admin from 'firebase-admin';
// twilio skd
import Twilio = require('twilio');

// to begin we install twilio with npm i twilio
// before we start, we need to set an api key for twilio, in order to view
// api keys we can run firebase functions:config:get, this should be an empty
// object, we then run firebase:config:set twilio.sid="xxx" and 
// twilio.token="xxxx" to set our sender id as xxx (not actual id) and our 
// auth token as xxxx (not the actual token)

// THIS WILL NOT WORK WITHOUT AN API KEY

// access api keys that we set above
const credentials = functions.config().twilio;

// create twilio client using creds we created
const client = new Twilio( credentials.sid, credentials.token );

// get the admin db from firestore
const db = admin.firestore();

// setup our callable function, similar to https funcs but use on call and
// take in data and context

/**
 * @param data - whatever data that you pass in from client side code
 * @param context - context about the request like user id...
 */
export const sendText = functions.https.onCall( async (data, context) => {
  // get userid from the context that is automaticall given when func called
  const userId = context.auth?.uid;
  // get reference to user document
  const userRef = db.doc(`users/${userId}`); 
  // take snapshot of userdocument
  const userSnap = await userRef.get();
  // gab reference to user phone number (if there is one)
  const number = userSnap.data().phone || 0;
  // return promise for sms message to be sent
  return client.messages.create({
    body: data.message,
    to: number,
    from: '+1234567890'
  });
});