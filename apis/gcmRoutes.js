
var express =require('express');
var router = express.Router();
var  {mongoose}= require('../DB/mongoose');
var {Gcm} = require('../models/gcm');
var jobs = require('./methods');
var axios = require('axios');


router.post('/register', (req,res) => {

    // get the registration ID  from the request body
    var regId = req.body.regId;

    // create the token in the DB
  jobs.createTokenB({to: regId}).then((response)=>{
       console.log(response);
    }).catch((e)=>{
        console.log(e);
    });

});


router.post('/push', (req , res ) =>{

    // get the registration ID  from the request body
    var regId = req.body.regId;

   return jobs.sendNotification(regId).then((response)=>{
       console.log(response);
   }).catch((e)=>{
       console.log(e);
   });

});


module.exports = {router:router};


