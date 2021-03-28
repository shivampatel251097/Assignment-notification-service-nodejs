const express = require('express');
const app = express();
const path = require('path');

const bodyParser = require('body-parser');
require('dotenv').config()

//Routers
var slackRouter = require('./routes/slackRouter');
var textRouter = require('./routes/textRouter');
var whatsappRouter = require('./routes/whatsappRouter');
var mailRouter = require('./routes/mailRouter');


const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.use(express.static(path.join(__dirname, 'public')))
app.set('views', __dirname + '/public');
// app.engine('html', require('ejs').renderFile);
// app.set('view engine', 'html');

app.get('/',(req,res)=>{
  res.render('index.html');
})

app.use('/slack',slackRouter);
app.use('/text',textRouter);
app.use('/whatsapp',whatsappRouter);
app.use('/mail',mailRouter);


app.listen(port,()=>{
    console.log(`App is running on port http://localhost:${port}`);
})