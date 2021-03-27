var express = require("express");
const schedule = require('node-schedule');

//Twilio 
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

var subscribersList = require('../model/subscribersList');

const textRouter = express.Router();

textRouter.post('/',(req,res)=>{
    for(let i=0;i<subscribersList.length;i++){
      client.messages 
      .create({ 
         body: req.body.text,  
         messagingServiceSid: 'MG6a5291b7397e45776ac5cb092a48114e',      
         to: subscribersList[i].PhoneNo
       }) 
      .then(message => {
        console.log(message);
      }) 
      .done();
    }
    res.send("Text message is sent successfully to all the Subscribers!");
  })

textRouter.post('/schedule',(req,res)=>{

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
            messagingServiceSid: 'MG6a5291b7397e45776ac5cb092a48114e',      
            to: subscribersList[i].PhoneNo
        }) 
        .then(message => {
        console.log(message);
        }) 
        .done();
        }
    })
    res.send("Text message will be sent successfully to all the subscribers at sheduled time!");
})

module.exports = textRouter;