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

describe('/Register',()=> {
    beforeEach(() => {

        regID = "c5355j-XGEI:APA91bEkYswCt3nmHDT6FGDGMh1yioSFmYfJqcd7kURBkc6RXEuKnG_fklkLU7wX1X1zS_r5ZYmlePOGx3G6VonnaNGTrSwOSCKKi8XJqrbFDA7gtvvOOYoOmmNWV4yG0i_O0rl-0k6n";
        Gcm.remove({});

    });

    it("saved in the database ", (done) => {


        // assume the promise is resolved
        var saveDB = sinon.stub(Gcm, 'create').resolves(regID);
        var requestSend = sinon.stub(axios, 'post').resolves(regID);

        jobs.sendReq(
            'https://gcm-http.googleapis.com/gcm/send' ,
            {to: regID},
            {
                'Content-Type':'application/json',
                // auth key in the config/env.js
                'Authorization': process.env.authKey
            }
        );


        // check for the axios.post to be called
        expect(requestSend.calledOnce.should.be.true);

        //check for the Gcm.create to be called
        process.nextTick(function () {
            expect(saveDB.calledOnce.should.be.false);
        });

        // check the database if the token is registered
        expect(() => {
            Gcm.find({regId: regID}).then((tokens) => {
                expect(tokens.length).toBe(1);
                expect(tokens[0].regId).toBe(regID);
            });

        });
        done();


    });
})

describe("/push" , ()=> {


})
