'use strict';
var passport = require('passport');
// Draw routes.  Locomotive's router provides expressive syntax for drawing
// routes, including support for resourceful routes, namespaces, and nesting.
// MVC routes can be mapped to controllers using convenient
// `controller#action` shorthand.  Standard middleware in the form of
// `function(req, res, next)` is also fully supported.  Consult the Locomotive
// Guide on [routing](http://locomotivejs.org/guide/routing.html) for additional
// information.
module.exports = function routes() {

  // Protect post and put
  //this.post('*', passport.authenticate('basic', { session : false }) );
  //this.put('*', passport.authenticate('basic', { session : false }) );
  //this.delete('*', passport.authenticate('basic', { session : false }) );

  this.root('index#main');
  this.resources('networks',function() {
      this.resources('modules');
  });



};
