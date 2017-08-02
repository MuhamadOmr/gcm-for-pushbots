/**
 * Created by MUHAMAD on 07/24/2017.
 */

var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/GCM');

module.exports = {mongoose};
