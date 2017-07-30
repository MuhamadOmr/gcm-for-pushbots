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


describe.only('test methods', ()=>{
beforeEach((done)=>{
response = {
    data:{
        results: [
        {message_id: "4445"},
        ]
    }
}
error ={
    data:{
        results: [
            {
                error: "NotRegistered"
            }
        ]
    }
}

//Make the stub
    requestSend = sinon.stub(axios, 'post');
    regID = "c5355j-XGEI:APA91bEkYswCt3nmHDT6FGDGMh1yioSFmYfJqcd7kURBkc6RXEuKnG_fklkLU7wX1X1zS_r5ZYmlePOGx3G6VonnaNGTrSwOSCKKi8XJqrbFDA7gtvvOOYoOmmNWV4yG0i_O0rl-0k6n";
    done();

})

    it('should validate and return the message id',()=>{
        // STUB the Axios post method

        requestSend.resolves(response);

        return jobs.validate(
        'https://gcm-http.googleapis.com/gcm/send' ,
        {to: regID},
        {
            'Content-Type':'application/json',
            // auth key in the config/env.js
            'Authorization': process.env.authKey
        }

    ).should.eventually.have.nested.property('data.results[0].message_id');

    })
    it('should validate and return error ',()=>{
        // STUB the Axios post method

        // stub the promise to reject
        requestSend.rejects(error);

        return jobs.validate(
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

    })

    afterEach((done)=>{
        requestSend.restore();
        done();

    })
})

describe('/Register',()=> {
    beforeEach((done) => {

        regID = "c5355j-XGEI:APA91bEkYswCt3nmHDT6FGDGMh1yioSFmYfJqcd7kURBkc6RXEuKnG_fklkLU7wX1X1zS_r5ZYmlePOGx3G6VonnaNGTrSwOSCKKi8XJqrbFDA7gtvvOOYoOmmNWV4yG0i_O0rl-0k6n";
        Gcm.remove({}).then(() => {

            done();

        });
    });


    it("saved in the database ", (done) => {

        // stub the axios method
        var requestSend = sinon.stub(axios, 'post').resolves(regID);

        jobs.sendReq(
            'https://gcm-http.googleapis.com/gcm/send',
            {to: regID},
            {
                'Content-Type': 'application/json',
                // auth key in the config/env.js
                'Authorization': process.env.authKey
            }
        );
        // test the database and set timeout to make sure that axios
        // sent the request and finished it's then call
        setTimeout(() => {
            Gcm.find().then((tokens) => {
                expect(tokens.length).to.equal(1);
                expect(tokens[0].regId).to.equal(regID);
                //  check for the axios.post to be called
                expect(requestSend.calledOnce.should.be.true);
                done();

            }).catch((e) => done(e));
        } , 1900)
    })
})
