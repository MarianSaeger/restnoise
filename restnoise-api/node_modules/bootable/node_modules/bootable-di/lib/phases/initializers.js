/**
 * Module dependencies.
 */
var path = require('path')
  , fs = require('fs')
  , existsSync = fs.existsSync || path.existsSync // node <=0.6
  , debug = require('debug')('bootable-di');


/**
 * Initializer execution phase.
 *
 * This phase will execute all initializer scripts in a directory, allowing the
 * application to initialize modules, including connecting to databases and
 * other network services.  Any annotated dependencies (using `exports['@require']`)
 * will be injected into the function when invoked.
 *
 * Examples:
 *
 *   app.phase(bootabledi.initializers());
 *
 *   app.phase(bootabledi.initializers('config/initializers'));
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
    options = { dirname: options };
  }
  options = options || {};
  var dirname = options.dirname || 'etc/init'
    , extensions = options.extensions || Object.keys(require.extensions).map(function(ext) { return ext; })
    , exts = extensions.map(function(ext) {
        if ('.' != ext[0]) { return ext; }
        return ext.slice(1);
      })
    , regex = new RegExp('\\.(' + exts.join('|') + ')$');

  return function initializers(done) {
    var dir = path.resolve(dirname);
    if (!existsSync(dir)) { return done(); }
  
    var self = this
      , files = fs.readdirSync(dir).sort()
      , idx = 0;
    function next(err) {
      if (err) { return done(err); }
  
      var file = files[idx++];
      // all done
      if (!file) { return done(); }
  
      if (regex.test(file)) {
        try {
          debug('initializer %s', file);
          var mod = require(path.join(dir, file))
            , deps = mod['@require'] || []
            , args = [];
            
          for (var i = 0, len = deps.length; i < len; ++i) {
            debug('create %s', deps[i]);
            var inst = container.create(deps[i], this);
            args.push(inst);
          }
          
          if (typeof mod == 'function') {
            var arity = mod.length;
            if (arity == deps.length + 1) {
              // Async initializer.  Exported function will be invoked, with next
              // being called when the initializer finishes.
              args.push(next);
              mod.apply(self, args);
            } else {
              // Sync initializer.  Exported function will be invoked, with next
              // being called immediately.
              mod.apply(self, args);
              next();
            }
          } else {
            // Initializer does not export a function.  Requiring the initializer
            // is sufficient to invoke it, next immediately.
            next();
          }
        } catch (ex) {
          next(ex);
        }
      } else {
        next();
      }
    }
    next();
  };
};
