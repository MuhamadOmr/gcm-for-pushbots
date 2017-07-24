/**
 * Created by MUHAMAD on 07/24/2017.
 */
var express =require('express');
var bodyParser = require('body-parser');
var {router} = require('./apis/gcm');
var app = express();
require('config/env');
app.use(bodyParser.json());


app.listen(3000, () =>{
    console.log('started on the port 3000');
});



app.use('/', router);