const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const nodemailer = require('nodemailer');
const schedule = require('node-schedule');
const smtpTransport = require('nodemailer-smtp-transport');
var subscribersList = require('./model/subscribersList');
const port = process.env.port || 3000;

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.get('/',(req,res)=>{
    res.send("Welcome to Express!")
})

app.post('/sendmail',(req,res)=>{
    var reqdata = req.body;
    let transporter = nodemailer.createTransport(smtpTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        auth: {
          user: reqdata.user,
          pass: reqdata.password
        }
      }));
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

app.post('/schedule',(req,res)=>{

    var dateTime = req.body.dateTime;
    var datePart = dateTime.split('T')[0];
    var date = datePart.split('/')[0];
    var month = datePart.split('/')[1];
    var year = datePart.split('/')[2];

    var timePart = dateTime.split('T')[1];
    var hour = timePart.split(':')[0];
    var min = timePart.split(':')[1];
    var sec = timePart.split(':')[2];
    

    const sheduleDate =new Date();
    console.log("year "+year);
    console.log("month "+month);
    console.log("date "+date);
    console.log("hour "+hour);
    console.log("min "+min);
    console.log(sheduleDate);
    const job = schedule.scheduleJob(sheduleDate, ()=>{
        console.log(sheduleDate);
        res.send(subscribersList);
    })
})

app.listen(port,()=>{
    console.log(`App is running on port http://localhost:${port}`);
})