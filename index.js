const express = require('express');
const app = express();
const bodyParser = require('body-parser');
require('dotenv').config()
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

const nodemailer = require('nodemailer');
const schedule = require('node-schedule');
const smtpTransport = require('nodemailer-smtp-transport');
var subscribersList = require('./model/subscribersList');

//twilio 
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.get('/',(req,res)=>{
  res.send("Welcome to Express!")
})

app.post('/sendmail',(req,res)=>{
    var reqdata = req.body;
    let transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: reqdata.user,
        type: "OAuth2",
        user: reqdata.user, 
        clientId: " 295955112744-f209rcndvedpmd4e3g28pl1iuf1rafjl.apps.googleusercontent.com",
        clientSecret: "EJH36yq0EhpEIDdte5Ikw_nN",
        refreshToken: "1//04NWM04wz7Q7MCgYIARAAGAQSNwF-L9IrlWrGg2NzgdvuUf6bF8B7V7yxLcsX22zturlaws9nlQMumer2fAkz7hctauqDzptQo50"
      }
    });

    for(let i=0;i<subscribersList.length;i++){
    let mailOptions = {
    from: 'patelshivam251097@gmail.com',
    to: subscribersList[i].email,
    subject: reqdata.subject,
    html: reqdata.html
    };
    
    transporter.sendMail(mailOptions, function(err, res){
        if (err) {
          console.log(err);
        } else {
          console.log('Email sent: ' + res.response);
        }
      });
    }
    res.send("Mail Sent successfully to all the Subscribers!");
})

app.post('/scheduleMail',(req,res)=>{

    var reqdata = req.body;
    var dateTime = req.body.dateTime;
    var datePart = dateTime.split('T')[0];
    var date = datePart.split('/')[0];
    var month = datePart.split('/')[1];
    var year = datePart.split('/')[2];

    var timePart = dateTime.split('T')[1];
    var hour = timePart.split(':')[0];
    var min = timePart.split(':')[1];
    var sec = timePart.split(':')[2];
    

    const sheduleDate =new Date(year,month,date,hour,min,sec);
    // var zoneTime = sheduleDate.toLocaleString("en-US", {timeZone: "Asia/Kolkata"});
    // new_date = new Date(zoneTime);
    // final_date=new_date.toLocaleString()
    // console.log("year "+year);
    // console.log("month "+month);
    // console.log("date "+date);
    // console.log("hour "+hour);
    // console.log("min "+min);
    // console.log(zoneTime);
    const job = schedule.scheduleJob(sheduleDate, ()=>{
      let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: reqdata.user,
          type: "OAuth2",
          user: reqdata.user, 
          clientId: " 295955112744-f209rcndvedpmd4e3g28pl1iuf1rafjl.apps.googleusercontent.com",
          clientSecret: "EJH36yq0EhpEIDdte5Ikw_nN",
          refreshToken: "1//04NWM04wz7Q7MCgYIARAAGAQSNwF-L9IrlWrGg2NzgdvuUf6bF8B7V7yxLcsX22zturlaws9nlQMumer2fAkz7hctauqDzptQo50"
        }
      });
        for(let i=0;i<subscribersList.length;i++){
        let mailOptions = {
        from: 'patelshivam251097@gmail.com',
        to: subscribersList[i].email,
        subject: reqdata.subject,
        html: reqdata.html
        };
        
        transporter.sendMail(mailOptions, function(err, res){
            if (err) {
              console.log(err);
            } else {
              console.log('Email sent: ' + res.response);
            }
          });
        }
        console.log("Mail Sent to Subscribers!")
    })
    res.send("Cron job sheduled successfully mail will be sent to all the Subscribers at sheduled time!");
})



app.post('/sendtext',(req,res)=>{
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

app.post('/scheduletext',(req,res)=>{

    var dateTime = req.body.dateTime;
    var datePart = dateTime.split('T')[0];
    var date = datePart.split('/')[0];
    var month = datePart.split('/')[1];
    var year = datePart.split('/')[2];

    var timePart = dateTime.split('T')[1];
    var hour = timePart.split(':')[0];
    var min = timePart.split(':')[1];
    var sec = timePart.split(':')[2];
    const sheduleDate =new Date(year,month,date,hour,min,sec);
  
    const job = schedule.scheduleJob(sheduleDate, ()=>{
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

app.post('/sendwhatsapp',(req,res)=>{
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


app.post('/shedulewhatsapp',(req,res)=>{
  
    var dateTime = req.body.dateTime;
    var datePart = dateTime.split('T')[0];
    var date = datePart.split('/')[0];
    var month = datePart.split('/')[1];
    var year = datePart.split('/')[2];

    var timePart = dateTime.split('T')[1];
    var hour = timePart.split(':')[0];
    var min = timePart.split(':')[1];
    var sec = timePart.split(':')[2];
    const sheduleDate =new Date(year,month,date,hour,min,sec);
    const job = schedule.scheduleJob(sheduleDate, ()=>{
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

app.listen(port,()=>{
    console.log(`App is running on port http://localhost:${port}`);
})