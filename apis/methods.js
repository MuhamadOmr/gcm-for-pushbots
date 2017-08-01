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
    else{

    return Promise.resolve(response)
    }  }

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
function sendRequest(data){
  return axios.post(
      'https://gcm-http.googleapis.com/gcm/send',
      data,
      {
        headers: {
          'Content-Type': 'application/json',
          // auth key in the config/env.js
          'Authorization': process.env.authkey
        }
      })
}
  function createTokenB(data) {
    regT = data.to;
    return sendRequest(data)
    .then(validateInCreateTokenB)
    .then(notRegisteredInCreateTokenB)
    .then(saveInCreateTokenB)
    .catch((e) => {
      console.log(e);
    })
  }
function findInDB(regID){
    return Gcm.find({regId: regID}).then((doc) => {
      if(doc.length === 0 ){
        return Promise.reject("the token is not registered in the DB");
      }
      return Promise.resolve(doc);
    }).catch((e) => {
      return Promise.reject("the token is not registered in the DB");
    })
  }

  function verifyInDBandNotify (regID){
    return findInDB(regID).then(function(){

    }).then(function(){

    })

  }

    // public part
    return {

      createTokenB: createTokenB,



    }

}
module.exports = jobs()
