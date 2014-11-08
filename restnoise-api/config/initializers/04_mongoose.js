'use strict';
var mongoose = require('mongoose');

module.exports = function () {
    mongoose.connect('mongodb://' + global.SETTINGS.mongodbhost + '/' + global.SETTINGS.mongodbdatabase, {
        replset: {rs_name: global.SETTINGS.mongodbreplset }
    });

};
