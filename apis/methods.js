/**
 * Created by MUHAMAD on 07/27/2017.
 */
var {Gcm} = require('../models/gcm');
const axios = require('axios');
var jobs = function () {

  function validateResponseFromAxios(response) {

    if(response.data.results[0].error) {
      return Promise.reject(response.data.results[0].error + "not registered with GCM");
    }

    return Promise.resolve(response)
  }

  function notRegisteredBefore (token){
    return Gcm.find({regId: regT}).then((doc) =>{
      if(doc.length){
        // console.log(doc);
        // console.log(token);
        return Promise.reject("already registered");
      }
      else{
        return Promise.resolve("token is not registered in the DB before")
      }
    })
  }


  function saveToken (token){

    return Gcm.create({regId: token})

  }

  function validateInCreateTokenB(response) {
    return validateResponseFromAxios(response)
  }

  function notRegisteredInCreateTokenB(response1) {
    return notRegisteredBefore(regT);
  }
  function saveInCreateTokenB(response2) {
    return saveToken(regT);
  }

  function createTokenB(regToken) {
    regT = regToken;
    return axios.post(
        'https://gcm-http.googleapis.com/gcm/send',
        {to: regToken},
        {
          headers: {
            'Content-Type': 'application/json',
            // auth key in the config/env.js
            'Authorization': process.env.authkey
          }
        })
    .then(validateInCreateTokenB)
    .then(notRegisteredInCreateTokenB)
    .then(saveInCreateTokenB)
    .catch((e) => {
      console.log(e);
    })
  }

  // verify the token if it registered in the DB
  var verifyInDB = function(regID) {
    return Gcm.find({regId: regID}).then((doc) => {
      return Promise.resolve(doc);
    }).catch((e) => {
      return Promise.reject("the token is not registered in the DB");
    })

  }

    //send notification by verifying the token is in the DB first then send the notification
    var sendNotification = function(regID) {
      return verifyInDB(regID).then(() => {
        return sendRequest(
            'https://gcm-http.googleapis.com/gcm/send',
            {
              "notification": {
                "title": "sending notification",
              },
              "to": regID
            },
            {
              headers: {
                'Content-Type': 'application/json',
                // auth key in the config/env.js
                'Authorization': process.env.authKey
              }
            }).then((response) => {

          return Promise.resolve(response);
        })
      }).catch((e) => {

        return Promise.reject(e);

      })
    }

    // public part
    return {


      createTokenB: createTokenB,
      verifyInDB: verifyInDB,
      sendNotification: sendNotification,


    }



}
module.exports = jobs()
