/**
 * Module dependencies.
 */
var scripts = require('scripts')
  , path = require('path')
  , fs = require('fs')
  , existsSync = fs.existsSync || path.existsSync // node <=0.6
  , debug = require('debug')('bootable-di');


/**
 * Route drawing phase.
 *
 * This phase will `require` a routes file, and invoke the exported function,
 * allowing the application to draw its routes.  Any annotated dependencies
 * (using `exports['@require']`) will be injected into the function when
 * invoked.
 *
 * This phase is typically the last phase before instructing the server to
 * listen.  Any initializers should be run prior to drawing routes, ensuring
 * that the application is fully prepared to handle requests.
 *
 * Examples:
 *
 *   app.phase(bootabledi.routes('routes.js'));
 *
 * @param {String|Object} options
 * @return {Function}
 * @api public
 */
module.exports = function(options, container) {
  if (!container) {
    try {
      container = require('electrolyte');
    } catch (_) {
      // workaround when `npm link`'ed for development
      var prequire = require('parent-require');
      container = prequire('electrolyte');
    }
  }
  
  if ('string' == typeof options) {
    options = { filename: options };
  }
  options = options || {};
  var filename = options.filename || 'routes'
    , extensions = options.extensions;
  
  return function routes() {
    var script = scripts.resolve(path.resolve(filename), extensions);
    if (!existsSync(script)) { return; }
    
    var mod = require(script);
    var deps = mod['@require'] || []
      , args = [];
    
    for (var i = 0, len = deps.length; i < len; ++i) {
      debug('create %s', deps[i]);
      var inst = container.create(deps[i], this);
      args.push(inst);
    }
    
    mod.apply(this, args);
  };
};
