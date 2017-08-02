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


describe('test sending notifications , /push endpoint', ()=>{
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
       regID =
         "c5355j-XGEI:APA91bEkYswCt3nmHDT6FGDGMh1yioSFmYfJqcd7kURBkc6RXEuKnG_fklkLU7wX1X1zS_r5ZYmlePOGx3G6VonnaNGTrSwOSCKKi8XJqrbFDA7gtvvOOYoOmmNWV4yG0i_O0rl-0k6n";

       // stub the model functions for DB
      findDoc = sinon.stub(Gcm, 'find');
      axiosPost = sinon.stub(axios, 'post');


       Gcm.remove({});
        Gcm.create({regId: regID}).then(()=>{
            done();

        });

    });

    it('should verify and return the message id',()=>{

      findDoc.resolves(regID);
      axiosPost.resolves(response);

      return jobs.verifyInDBandNotify(regID)
      .should.eventually.have.nested.include(response);

    });


    afterEach((done)=>{
      axiosPost.restore();
      findDoc.restore();
        Gcm.remove({}).then(()=>{
            done();

        })
    })
});
