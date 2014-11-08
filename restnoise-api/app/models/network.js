'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var NetworkSchema = new Schema( {
    name: {type: String, index: {unique: true}, required : true},
    defaultoutputmodule: {type: String, required : true},
    modules: Schema.Types.Mixed,

});

var Network = mongoose.model('Network', NetworkSchema);


module.exports = Network;
