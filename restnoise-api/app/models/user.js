'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = {
    username: {type: String, index: {unique: true}},
    password: {type: String },
    ip: String
};
var User = mongoose.model('User', UserSchema);

module.exports = User;
