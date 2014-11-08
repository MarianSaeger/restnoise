'use strict';

var fs = require('fs');

module.exports = function () {
    // Any files in this directory will be `require()`'ed when the application
    // starts, and the exported function will be invoked with a `this` context of
    // the application itself.  Initializers are used to connect to databases and
    // message queues, and configure sub-systems such as authentication.

    // Async initializers are declared by exporting `function(done) { /*...*/ }`.
    // `done` is a callback which must be invoked when the initializer is
    // finished.  Initializers are invoked sequentially, ensuring that the
    // previous one has completed before the next one executes.

    global.SETTINGS = {
        mongodbhost: 'localhost',
        mongodbdatabase: 'trader',
        mongodbreplset: ''
    };

    var configfile = __dirname + '/../config.json';

    if (fs.existsSync(configfile)) {
        var raw = fs.readFileSync(configfile);
        var json = JSON.parse(raw);
        if (json) {
            for(var key in json) {
                if(json.hasOwnProperty(key)) {
                    global.SETTINGS[key] = json[key];
                }
            }
        }

        if(typeof global.SETTINGS.mongodbhost === typeof []) {
            global.SETTINGS.mongodbhost = global.SETTINGS.mongodbhost.join(',');
        }
    }

};
