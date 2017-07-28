
var express =require('express');
var router = express.Router();
var  {mongoose}= require('../DB/mongoose');
var {Gcm} = require('../models/gcm');
var jobs = require('./methods');
var axios = require('axios');


router.post('/register', (req,res) => {

    // get the registration ID  from the request body
    var regId = req.body.regId;

jobs.sendReq(
        'https://gcm-http.googleapis.com/gcm/send' ,
        {to: regId},
        {
            'Content-Type':'application/json',
            // auth key in the config/env.js
            'Authorization': process.env.authKey
        }
    );

});


router.post('/push', (req , res ) =>{

});


module.exports = {router:router};







