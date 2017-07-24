/**
 * Created by MUHAMAD on 07/24/2017.
 */
var express =require('express');
var bodyParser = require('body-parser');
var app = express();
require('config/env');
var {router} = require('./apis/gcm');
app.use(bodyParser.json());


app.listen(3000, () =>{
    console.log('started on the port 3000');
});


// use the routes located in apis/gcm.js
app.use('/', router);