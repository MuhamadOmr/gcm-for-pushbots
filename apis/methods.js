/**
 * Created by MUHAMAD on 07/27/2017.
 */
var {Gcm} = require('../models/gcm');
const axios = require('axios');
var jobs = function () {

    // private part
    var sendReq = function ( url , data , header){
        regeId = data.to;

        var error;
        // make axios request with DB create in the then call
        axios.post(
            url,
            {to: regeId},
            {headers: header}
        )
            .then((response) => {
           // checking for errors in the gcm request

                error = response.data.results[0].error;
                  // return error message if error exist
                   if(error) {
                   return Promise.reject(error);
                  }
          // saves the registration Id in the DB if id is vaild
                   Gcm.create({regId: regeId},function (err , createdReg) {

                       if(err) {
                           return Promise.reject(err);
                       }

                     return Promise.resolve(createdReg.regId);

                   });
    })
       .catch((error) => {
           console.log(error);
    });
    }
    // public part
    return {
        // using REVEALING MODULE PATTERN
        sendReq: sendReq,
    }

}


module.exports = jobs();
