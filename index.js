'use strict';

import express from 'express'
import dotenv from 'dotenv'
import twilioClientCreator from 'twilio'

dotenv.config();

const client = twilioClientCreator(process.env.SID, process.env.AUTH_TOKEN)

const message = "Mason demo"

const numbers = ['5555555555', '8888888888', '7777777777']


// Constants
const PORT = 8080;

// App
const app = express();
app.get('/', async (req, res) => {
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

app.listen(PORT, () => {
  console.log(`Running on ${PORT}`);
});