const accountSid = "**"
const authToken = "**"
import twilioClientCreator from 'twilio'


const client = twilioClientCreator(accountSid, authToken)

client.messages
  .create({
     body: 'Jarrett and Joseph say hi',
     from: '+19452077377',
     to: '+13343338745'
   })
  .then(message => console.log("I sent your message"));


