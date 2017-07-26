
var express =require('express');
var router = express.Router();
const axios = require('axios');
var {Token} = require('../models/token');
var pushbots = require('pushbots');
var Pushbots = new pushbots.api({
    // getting the app id and secret
    id: process.env.pushAppId,
    secret: process.env.pushAppSecret,
});


router.post('/register', (req,res) => {

    // get the registration ID  from the request body
    var regId = req.body.regId;

// send http request with the Registration ID ... sync request
    axios({
        method: 'post',
        url: 'https://gcm-http.googleapis.com/gcm/send',
        data: {
            to : regId,
        },
        headers: {
            'Content-Type':'application/json',
            // auth key in the config/env.js
            'Authorization': process.env.authKey
        },
    })

        .then((response) => {
           // // checking for errors in the gcm request
           var error = response.data.results[0].error;
           // return error message if error exist
           if(error){
                 return res.status(404).send('Must enter valid registration ID');
            }

            // saves the registration Id in the DB if id is vaild
           Gcm.create({regId: req.body.regId},function (err , createdReg) {

               if(err) {
                   return res.status(400).send(err);
               }

                return res.status(200).send(createdReg);

            });

        })
        .catch(function (error) {
            res.status(400).send(error);
        });
});



router.post('/', (req , res ) =>{


});


module.exports = {router:router};







