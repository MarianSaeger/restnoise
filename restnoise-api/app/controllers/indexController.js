'use strict';

var locomotive = require('locomotive');
var Controller = locomotive.Controller;

var indexController = new Controller();

indexController.main = function() {
  this.title = 'Flare Locomotive';
  this.render();
};

module.exports = indexController;
