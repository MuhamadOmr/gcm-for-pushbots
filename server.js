/**
 * Created by MUHAMAD on 07/24/2017.
 */
var express =require('express');
var bodyParser = require('body-parser');
var app = express();
require('./config/env');
var {router} = require('./apis/gcmRoutes');
app.use(bodyParser.json());


// this using the port in the config file
app.listen(process.env.PORT || 3000 , () =>{
    console.log('started on the port 3000');
});

// use the routes located in apis/gcmRoutes.js
app.use('/', router);

module.exports = {app};