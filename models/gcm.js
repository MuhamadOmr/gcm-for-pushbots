/**
 * Created by MUHAMAD on 07/24/2017.
 */

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var Gcm = mongoose.model('Gcm',{

    regId: {
        type: String,
        required:true,
        unique:true,
    }

});

module.exports = {Gcm};