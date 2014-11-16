'use strict';

var locomotive = require('locomotive');
var Controller = locomotive.Controller;

var indexController = new Controller();

indexController.main = function() {
  this.title = 'RESTnoise';
  this.render();
};

module.exports = indexController;
