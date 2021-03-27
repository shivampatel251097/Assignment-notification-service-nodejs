var express = require("express");
const schedule = require('node-schedule');

//Twilio 
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

var subscribersList = require('../model/subscribersList');

const whatsappRouter = express.Router();

whatsappRouter.post('/',(req,res)=>{
    for(let i=0;i<subscribersList.length;i++){
        client.messages 
        .create({ 
           body: req.body.text, 
           from: 'whatsapp:+14155238886',       
           to: "whatsapp:"+subscribersList[i].PhoneNo
         }) 
        .then(message => {
          console.log(message);
        }) 
        .done();
    }
res.send("What's App message successfully sent to al the Subscribers!");
})

whatsappRouter.post('/schedule',(req,res)=>{    
    var dateTime = req.body.dateTime;
    var datePart = dateTime.split('T')[0];
    var date = datePart.split('/')[0];
    var month = datePart.split('/')[1];
    var year = datePart.split('/')[2];

    var timePart = dateTime.split('T')[1];
    var hour = timePart.split(':')[0];
    var min = timePart.split(':')[1];
    var sec = timePart.split(':')[2];
    const scheduleDate =new Date(year,month,date,hour,min,sec);
    const job = schedule.scheduleJob(scheduleDate, ()=>{
      for(let i=0;i<subscribersList.length;i++){
        client.messages 
        .create({ 
           body: req.body.text, 
           from: 'whatsapp:+14155238886',       
           to: "whatsapp:"+subscribersList[i].PhoneNo
         }) 
        .then(message => {
          console.log(message);
        }) 
        .done();
    }
  })
res.send("What's App message Will be delivered to all the subscribers on the sheduled time!");
})

module.exports = whatsappRouter;