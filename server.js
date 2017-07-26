/**
 * Created by MUHAMAD on 07/24/2017.
 */
var express =require('express');
var bodyParser = require('body-parser');
var app = express();
require('./config/env');
var {router} = require('./apis/routes');
app.use(bodyParser.json());


app.listen(process.env.PORT , () =>{
    console.log('started on the port 3000');
});


// use the routes located in apis/routes.js
app.use('/', router);

module.exports = {app};