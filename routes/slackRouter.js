var express = require("express");
const schedule = require('node-schedule');

const {App} = require('@slack/bolt');
const app = new App({
    token:  process.env.SLACK_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET
});


const slackRouter = express.Router();

slackRouter.post('/',async (req,res)=>{
    const result = await app.client.chat.postMessage({
        token: process.env.SLACK_TOKEN,
        channel: req.body.channel,
        text: req.body.text
    });
    res.send(result);
    console.log(result);
})

slackRouter.post('/schedule', (req,res)=>{
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
    const job = schedule.scheduleJob(scheduleDate, async()=>{
        const result = await app.client.chat.postMessage({
            token: process.env.SLACK_TOKEN,
            channel: req.body.channel,
            text: req.body.text
        });
    console.log(result);
  })
  res.send("Slack Bot has sheduled a message and will be delivered to the Channel on the sheduled time!");
})

module.exports = slackRouter;