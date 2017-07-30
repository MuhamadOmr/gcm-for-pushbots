
var express =require('express');
var router = express.Router();
var  {mongoose}= require('../DB/mongoose');
var {Gcm} = require('../models/gcm');
var jobs = require('./methods');
var axios = require('axios');


router.post('/register', (req,res) => {

    // get the registration ID  from the request body
    var regId = req.body.regId;

    return jobs.createToken(regId).then((response)=>{
       console.log(response);
    }).catch((e)=>{
        console.log(e);
    });

});


router.post('/push', (req , res ) =>{

    // get the registration ID  from the request body
    var regId = req.body.regId;

    Gcm.find({regId:regId} , function(err , doc) {

        if(err){
            return res.status(400).send("token is not in the DB");
        }


        axios.post(
            'https://gcm-http.googleapis.com/gcm/send',
            { "notification": {
                "title": "sending notification",

            },
                "to" : regId
            },
            {headers: {
                'Content-Type':'application/json',
                // auth key in the config/env.js
                'Authorization': process.env.authKey
            }
            }
        )
        jobs.sendNoti(
            'https://gcm-http.googleapis.com/gcm/send' ,
            { "notification": {
                "title": "sending notification",

            },
                "to" : regId
            },
            {
                'Content-Type':'application/json',
                // auth key in the config/env.js
                'Authorization': process.env.authKey
            }
        );
    } )
});


module.exports = {router:router};







