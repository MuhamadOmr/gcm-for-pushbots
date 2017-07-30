/**
 * Created by MUHAMAD on 07/27/2017.
 */
var {Gcm} = require('../models/gcm');
const axios = require('axios');
var jobs = function () {


    var validate = function ( url , data , header){
        regeId = data.to;

        // make axios request and validate in the then call by reject or resolve
     return axios.post(
            url,
            {to: regeId},
            {headers: header}
        )
            .then((response) => {
         //  checking for errors in the gcm request
          //     return error message if error exist

                if(response.data.results[0].error) {
                    return Promise.reject(response);
                }
               return Promise.resolve(response)


    })
       .catch((error) => {
           return Promise.reject(error);
    });
    }



// execute the validate method first
    var createToken = function (regeId) {

        return validate(
            'https://gcm-http.googleapis.com/gcm/send' ,
            {to: regeId},
            {
                'Content-Type':'application/json',
                // auth key in the config/env.js
                'Authorization': process.env.authKey
            }).then((response)=>{
            //console.log(response);

            //create the record in the DB
           return Gcm.create({regId: regeId}).then((doc)=>{

                return Promise.resolve(doc);
            }).catch((e)=>{
                return Promise.reject(e);
            })
        }).catch((e)=>{
            return Promise.reject(e);
        })
    }
    // public part
    return {

        validate: validate,
        createToken: createToken,



    }

}


module.exports = jobs();
