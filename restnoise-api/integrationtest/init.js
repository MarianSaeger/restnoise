'use strict';
require('../test/init');

var locomotive = require('locomotive');
var bootable = require('bootable');

module.exports = {
    boot: function(_callback) {
        var app = new locomotive.Application();
        app.phase(locomotive.boot.controllers(__dirname + '/../app/controllers'));
        app.phase(locomotive.boot.views());

        // Add phases to configure environments, run initializers, draw routes, and
        // start an HTTP server.  Additional phases can be inserted as needed, which
        // is particularly useful if your application handles upgrades from HTTP to
        // other protocols such as WebSocket.
        app.phase(require('bootable-environment')(__dirname + '/../config/environments'));
        app.phase(bootable.initializers(__dirname + '/../config/initializers'));
        app.phase(locomotive.boot.routes(__dirname + '/../config/routes'));
        app.phase(locomotive.boot.httpServer(3000, '0.0.0.0'));
        app.boot('test', function() {
            _callback(app);
        });
    }
};
