/**
 * Created by MUHAMAD on 07/27/2017.
 */
var {Gcm} = require('../models/gcm');
const axios = require('axios');
var jobs = function () {

    var sendRequest = function ( url , data , header){

        // make axios request and validate in the then call by reject or resolve
     return axios.post(
            url,
            data,
            {headers: header}
        )
         .then((response) => {
         //  checking for errors in the gcm request
          //     return error message if error exist
                if(response.data.results[0].error) {
                    return Promise.reject(response.data.results[0].error + "not registered with GCM");
                }

               return Promise.resolve(response)
        })
         .catch((error) => {
           return Promise.reject(error);
         });
    }



    var createToken = function (regeId) {

        // sendRequest method will validate by making a sync request
        // no data provided in the request only the registration id
        return sendRequest(
            'https://gcm-http.googleapis.com/gcm/send' ,
            {to: regeId},
            {
                'Content-Type':'application/json',
                // auth key in the config/env.js
                'Authorization': process.env.authKey
            }).then(()=>{

            //create the record in the DB
           return Gcm.create({regId: regeId}).then((doc)=>{
                return Promise.resolve(doc);

            })

            }).catch((e)=>{
                return Promise.reject(e);
            })
    }

    
    // verify the token if it registered in the DB
    var verifyInDB = function (regID){
        return Gcm.find({regId:regID}).then((doc)=>{
            return Promise.resolve(doc);
        })
            .catch((e)=>{
            return Promise.reject("the token is not registered in the DB");
            })

    }

    //send notification by verifying the token is in the DB first then send the notification
    var sendNotification = function (regID){
   return verifyInDB(regID).then(()=>{
       return sendRequest(
        'https://gcm-http.googleapis.com/gcm/send',
        { "notification": {
            "title": "sending notification",
            },
            "to" : regID
        },
        {headers: {
            'Content-Type':'application/json',
            // auth key in the config/env.js
            'Authorization': process.env.authKey
        }
        }).then((response)=>{

            return Promise.resolve(response);
        })
    }).catch((e)=>{

            return Promise.reject(e);

        })
    }

    // public part
    return {

        sendRequest: sendRequest,
        createToken: createToken,
        verifyInDB: verifyInDB,
        sendNotification: sendNotification



    }

}


module.exports = jobs();
