'use strict';

import express from 'express'
import dotenv from 'dotenv'
import twilioClientCreator from 'twilio'
import bodyParser from 'body-parser'
const { MessagingResponse } = twilioClientCreator.twiml

dotenv.config();

const client = twilioClientCreator(process.env.SID, process.env.AUTH_TOKEN)

const message = "Mason demo"

const numbers = []

// Constants
const PORT = 8080;

// App
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/sendMessage', async (req, res) => {
  await client.messages
  .create({
     body: message,
     from: '+19452077377',
     to: '+13343338745'
   })
  .then(message => console.log("I sent your message"))
  .catch(error => console.log(error.message))
  res.send('Hello World');
});

app.post('/receiveMessage', (req, res) => {
  const twiml = new MessagingResponse();
  console.log("Got message from: " + req.body.From)
  twiml.message('Thank you for opting in! Your number is recorded as: ' + req.body.From)
  /*
  if (req.body.Body == 'hello') {
    twiml.message('Hi!');
  } else if (req.body.Body == 'bye') {
    twiml.message('Goodbye');
  } else {
    twiml.message(
      'No Body param match, Twilio sends this in the request to your server.'
    );
  }
  */
  res.type('text/xml').send(twiml.toString());
});

app.listen(PORT, () => {
  console.log(`Running on ${PORT}`);
});