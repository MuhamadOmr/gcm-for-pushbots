/**
 * Created by MUHAMAD on 07/24/2017.
 */
var jobs = require('../apis/methods');
const supertest = require('supertest');
const {app} = require('../server');
var {Gcm} = require('../models/gcm');
const axios = require('axios');
var chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
var should = require('chai').should();
var expect = chai.expect;
var sinon = require('sinon');


describe('test sendRequest method', ()=>{
beforeEach((done)=>{
    response = {
        data:{
            results: [
            {message_id: "4445"},
            ]
        }
    };
    error ={
        data:{
            results: [
                {
                    error: "NotRegistered"
                }
            ]
        }
    };

//Make the stub for axios method
    requestSend = sinon.stub(axios, 'post');
    regID = "c5355j-XGEI:APA91bEkYswCt3nmHDT6FGDGMh1yioSFmYfJqcd7kURBkc6RXEuKnG_fklkLU7wX1X1zS_r5ZYmlePOGx3G6VonnaNGTrSwOSCKKi8XJqrbFDA7gtvvOOYoOmmNWV4yG0i_O0rl-0k6n";
    done();

});

    it('should validate and return the message id',()=>{
        // STUB the Axios post method to send response object

        requestSend.resolves(response);

        return jobs.sendRequest(
        'https://gcm-http.googleapis.com/gcm/send' ,
        {to: regID},
        {
            'Content-Type':'application/json',
            // auth key in the config/env.js
            'Authorization': process.env.authKey

        }).should.eventually.have.nested.property('data.results[0].message_id');

    });
    it('should validate and return error ',()=>{

        // stub the promise to reject the sending of requests
        requestSend.rejects(error);

        return jobs.sendRequest(
            'https://gcm-http.googleapis.com/gcm/send' ,
            {to: regID},
            {
                'Content-Type':'application/json',
                // auth key in the config/env.js
                'Authorization': process.env.authKey
            }

        ).then(()=>{

        }).catch((Err)=>{
            // expect to return the error
            expect(Err).to.equal(error);

        })

    });

    afterEach((done)=>{
        requestSend.restore();
        done();

    })
});

describe('test Register method', ()=>{
    beforeEach((done)=>{
        response = {
            data:{
                results: [
                    {message_id: "4445"},
                ]
            }
        };
        error ={
            data:{
                results: [
                    {
                        error: "NotRegistered"
                    }
                ]
            }
        };
//Make the stub for both axios and validate
        requestSend = sinon.stub(axios, 'post');
        validateToken = sinon.stub(jobs, 'sendRequest');
        regID = "c5355j-XGEI:APA91bEkYswCt3nmHDT6FGDGMh1yioSFmYfJqcd7kURBkc6RXEuKnG_fklkLU7wX1X1zS_r5ZYmlePOGx3G6VonnaNGTrSwOSCKKi8XJqrbFDA7gtvvOOYoOmmNWV4yG0i_O0rl-0k6n";
        Gcm.remove({}).then(()=>{

            done();

        });
    });

    it('should add token to the database',(done)=>{
        // STUB the validate method to resolve
        requestSend.resolves(response);
        validateToken.resolves(response);

        jobs.createToken(regID).then((doc)=>{
            expect(doc).to.have.property('regId');
            done();


        })

    }).timeout(3000);


    it('should NOT add token to the database',(done)=>{
        // STUB the sendRequest method to reject

        requestSend.rejects(error);

        jobs.createToken(regID).catch((Err)=>{

            // expect to return the error
            expect(Err).to.equal(error);
            done();
        })

    }).timeout(3000);

    afterEach((done)=>{
        validateToken.restore();
        requestSend.restore();
        done();

    })
});

