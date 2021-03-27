var express = require("express");
const schedule = require('node-schedule');

var subscribersList = require('../model/subscribersList');
const mailRouter = express.Router();
//nodemailer for sending mails
const nodemailer = require('nodemailer');
let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      type: "OAuth2",
      user: "patelshivam251097@gmail.com", 
      clientId: process.env.CLIENT_ID_GMAIL,
      clientSecret: process.env.CLIENT_SECRET_GMAIL,
      refreshToken: process.env.REFRESH_TOKEN_GMAIL
    }
  });

mailRouter.post('/',(req,res)=>{
    var reqdata = req.body;
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
});

mailRouter.post('/schedule',(req,res)=>{

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

    const scheduleDate =new Date(year,month,date,hour,min,sec);
    const job = schedule.scheduleJob(scheduleDate, ()=>{
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
              console.log('Email sent: ' + res.response);}
          });
        }
        console.log("Mail Sent to Subscribers!")
    })
    res.send("Job scheduled successfully and Mail will be sent to all the Subscribers at the sheduled time!");
});

module.exports = mailRouter;