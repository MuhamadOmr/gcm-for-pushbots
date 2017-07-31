/**
 * Created by MUHAMAD on 07/30/2017.
 */
var jobs = require('../apis/methods');
var {Gcm} = require('../models/gcm');
const axios = require('axios');
var chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
var should = require('chai').should();
var expect = chai.expect;
var sinon = require('sinon');


describe('test Verify method', ()=>{
    beforeEach((done)=>{

       regID =
         "c5355j-XGEI:APA91bEkYswCt3nmHDT6FGDGMh1yioSFmYfJqcd7kURBkc6RXEuKnG_fklkLU7wX1X1zS_r5ZYmlePOGx3G6VonnaNGTrSwOSCKKi8XJqrbFDA7gtvvOOYoOmmNWV4yG0i_O0rl-0k6n";


        Gcm.create({regId: regID}).then(()=>{
            done();

        });

    });

    it('should verify and return the message id',(done)=>{


        jobs.verifyInDB(regID).then((docs) => {
            expect(docs.length).to.be.equal(1);
            expect(docs[0].regId).to.be.equal(regID);
            done();
        }).catch((e) => done(e));
    });
    it('should verify and return the error message',(done)=>{


        jobs.verifyInDB({regId:"44"}).catch((e) =>{

            expect(e).to.be.equal("the token is not registered in the DB");

            done();
        });

    });

    afterEach((done)=>{

        Gcm.remove({}).then(()=>{
            done();

        })
    })
});

describe('test sending notification', ()=>{
    beforeEach((done)=>{
        result = {
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

        //Make the stub for the verify method
        requestSend = sinon.stub(axios, 'post');
        verifyDB = sinon.stub(jobs, 'verifyInDB');
        sendRequest = sinon.stub(jobs, 'sendRequest');
        regID =
            "c5355j-XGEI:APA91bEkYswCt3nmHDT6FGDGMh1yioSFmYfJqcd7kURBkc6RXEuKnG_fklkLU7wX1X1zS_r5ZYmlePOGx3G6VonnaNGTrSwOSCKKi8XJqrbFDA7gtvvOOYoOmmNWV4yG0i_O0rl-0k6n";

        doc = [{
            regId: regID
        }];
      Gcm.remove({});
        Gcm.create({regId: regID}).then(()=>{
            done();

        });

    });

    it('should send notification successfully',(done)=>{
        // STUB the Axios post , the verify and the sendRequest methods
        verifyDB.resolves(doc);
        sendRequest.resolves(result);
        requestSend.resolves(result);

        // test the output to equal the result
        jobs.sendNotification(regID).then((response)=>{
            expect(response).to.be.equal(result);
            done();

        })
    });



    afterEach((done)=>{
        verifyDB.restore();
        sendRequest.restore();
        Gcm.remove({}).then(()=>{
            done();

        })
    })
});

