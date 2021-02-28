import * as functions from 'firebase-functions';
import * as express from 'express';
import * as cors from 'cors';

export const basicHTTP = functions.https.onRequest( (request, response) => {
  const name = request.query.name;

  if ( !name ) {
    response.status(400).send('no name supplied');
  }

  response.send(`${name}`);
});


const app = express();

// app.use configures all middleware
app.use(cors({ origin: true })); // cors module allows for cross origin requests aka localhost:5000 to localhost:5001

app.get('/cat', ( req, res ) => {
  res.send('CAT');
});

app.get('/dog', ( req, res ) => {
  res.send('DOG');
});

export const api = functions.https.onRequest(app);