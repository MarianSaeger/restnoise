'use strict';
var mongoose = require('mongoose')
   ,config = require('config')
   ,winston = require('winston');


module.exports = function () {
    winston.info("Initializing Mongoose");
    winston.info("Mongoose settings:",config.get("mongoose"));
    mongoose.connect('mongodb://' + config.get("mongoose.host") + '/' + config.get("mongoose.database"), {
        replset: {rs_name: config.get("mongoose.replset") }
    });
    winston.info("Initialized Mongoose");
};
