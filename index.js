'use strict';
import express from 'express'
import dotenv from 'dotenv'
import twilioClientCreator from 'twilio'
import bodyParser from 'body-parser'
const { MessagingResponse } = twilioClientCreator.twiml

import firebase from 'firebase-admin'
import { applicationDefault } from 'firebase-admin/app';


firebase.initializeApp({
  credential: applicationDefault(),
  databaseURL: 'https://mcmillon-ox-project-default-rtdb.firebaseio.com/'
});

const database = firebase.database()


dotenv.config();

const client = twilioClientCreator(process.env.SID, process.env.AUTH_TOKEN)

const message = "Hello! The NWA Mobile Food Bank will be distributing food at McMillon Innovation Studio on 12/18 @ 9 AM. If you / someone on your behalf plan on picking up food, please respond “Y”. Otherwise, please respond “N”"

const numbers = []

// Constants
const PORT = 8080;

// App
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/sendMessage', async (req, res) => {
  for(let i = 0; i < numbers.length; i++)
  {
    await client.messages
    .create({
       body: message,
       from: '+19452077377',
       to: numbers[i]
     })
    .then(message => console.log("I sent your message"))
    .catch(error => console.log(error.message))
  }
  res.send('sent messages');
});


app.post('/receiveMessage', (req, res) => {
  const twiml = new MessagingResponse();
  const number = req.body.From;
  const sentMessage = req.body.Body.toLowerCase();
  if (sentMessage == 'yes' || sentMessage == 'y') {
    const ref = database.ref('/nwa-food-bank/mcmillon/users')
    ref.once('value').then(snapshot => {
      const data = snapshot.val();
      ref.update({checked_in: data.checked_in ? data.checked_in + 1 : 1}, () => {});
      console.log(data);
    });
    twiml.message('Thanks! We will see you there then');
  } else if (sentMessage == 'no' || sentMessage == 'n') {
    twiml.message('Thanks! We are here if you need us');
  } else if(numbers.indexOf(number) < 0) {
    twiml.message('Thank you for opting in! Your number is recorded as: ' + req.body.From);
  }
  if(numbers.indexOf(number) < 0)
  {
    numbers.push(number)
  }
  res.type('text/xml').send(twiml.toString());
});

app.listen(PORT, () => {
  console.log(`Running on ${PORT}`);
});
