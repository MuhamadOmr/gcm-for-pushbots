/**
 * Created by MUHAMAD on 07/26/2017.
 */
/**
 * Created by MUHAMAD on 07/24/2017.
 */

var mongoose = require('mongoose');

var Token = mongoose.model('Token',{

    token: {
        type: String,
        required:true,
        unique:true,
    }

});

module.exports = {Token};