'use strict';
var winston = require('winston');

module.exports = function () {
  winston.remove(winston.transports.Console);
  winston.add(winston.transports.Console, {colorize: true, json: false});
};
