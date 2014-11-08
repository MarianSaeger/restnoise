'use strict';
var mongoose = require('mongoose');
var config = require('config');

module.exports = function () {

    mongoose.connect('mongodb://' + config.get("mongodb.host") + '/' + config.get("mongodb.database"), {
        replset: {rs_name: config.get("mongodb.replset") }
    });

};
