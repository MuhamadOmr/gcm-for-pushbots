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


describe.only('test sendRequest method', ()=>{
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
  axiosPost = sinon.stub(axios, 'post');
    requestSend = sinon.stub(jobs, 'sendRequest');

  // make stub for the not registered method
    notRegisteredB = sinon.stub(jobs, 'notRegisteredInCreateTokenB');
    regID = "c5355j-XGEI:APA91bEkYswCt3nmHDT6FGDGMh1yioSFmYfJqcd7kURBkc6RXEuKnG_fklkLU7wX1X1zS_r5ZYmlePOGx3G6VonnaNGTrSwOSCKKi8XJqrbFDA7gtvvOOYoOmmNWV4yG0i_O0rl-0k6n";

    Gcm.remove({}).then(()=>{

        done();

      });

});

    it('should create token in the DB',()=>{
        // STUB the Axios post method to send response object

        requestSend.resolves(response);
      axiosPost.resolves(response);
       notRegisteredB.resolves("token is not registered in the DB before");
        return jobs.createTokenB({to: regID})
        .should.eventually.have.nested.include({'regId':regID});

    });


  it('should not create token in the DB if already registered',(done)=>{
    // STUB the Axios post method to send response object

    requestSend.resolves(response);

    notRegisteredB.rejects("already registered");
    Gcm.find({}).then((docs)=>{
        expect(docs.length).to.be.equal(0);
        done();
    })

  });
  it('should not create token in the GCM rejected request',(done)=>{
    // STUB the Axios post method to send response object

    requestSend.rejects(error);

    Gcm.find({}).then((docs)=>{
      expect(docs.length).to.be.equal(0);
      done();
    })

  });
    afterEach((done)=>{
        requestSend.restore();
        notRegisteredB.restore();
      axiosPost.restore();
        done();

    })
});


