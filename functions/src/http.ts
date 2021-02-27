import * as functions from 'firebase-functions';
import * as express from 'express';

import * as admin from 'firebase-admin';
admin.initializeApp(); // the admin database can be used to modify
// pretty much anything on firestore, initialize should only be called once

export const basicHTTP = functions.https.onRequest( (request, response) => {

  const name = request.query.name;

  if ( !name ) {
    response.status(400).send('no name supplied');
  }

  response.send(`${name}`);
});


const app = express();

app.get('/cat', ( req, res ) => {
  res.send('CAT');
});

app.get('/dog', ( req, res ) => {
  res.send('DOG');
});

export const api = functions.https.onRequest(app);