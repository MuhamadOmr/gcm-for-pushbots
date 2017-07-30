/**
 * Created by MUHAMAD on 07/27/2017.
 */
var {Gcm} = require('../models/gcm');
const axios = require('axios');
var jobs = function () {

    // private part
    var validate = function ( url , data , header){
        regeId = data.to;

        // make axios request with DB create in the then call
     return axios.post(
            url,
            {to: regeId},
            {headers: header}
        )
            .then((response) => {
           // checking for errors in the gcm request
               // return error message if error exist

                     return Promise.resolve(response)


    })
       .catch((error) => {
           console.log(error);
    });
    }


    var createToken = function (regeId , res , req) {
        // saves the registration Id in the DB if id is valid and not registered before
        if(Gcm.find({regId: regeId}).length){

            return Promise.reject("the token is already registered");
        }

        // saves the registration Id in the DB if id is vaild
        Gcm.create({regId: regeId},function (err , createdReg) {

            if(err) {
                res.status(400).send(err);
            }

            return console.log(createdReg.regId);

        });

    }
    // public part
    return {
        // using REVEALING MODULE PATTERN
        validate: validate,

    }

}


module.exports = jobs();
