import * as functions from 'firebase-functions';

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