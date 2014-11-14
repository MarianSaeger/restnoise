'use strict';

var locomotive = require('locomotive');
var Controller = locomotive.Controller,
    Network = require('../models/network.js');
var RenderInterface = require('../modules/renderinterface.js');


var networksController = new Controller();

function randomHash(count) {
    if (count === 1)
        return parseInt(16 * Math.random(), 10).toString(16);
    else {
        var hash = '';
        for (var i = 0; i < count; i++)
            hash += randomHash(1);
        return hash;
    }
}


networksController.create = function () {
    var self = this;

    var networkdata = self.req.body;
    if (!networkdata.name) {
        networkdata.name = "network_" + randomHash(4);
    }

    var network = new Network(networkdata);

    var tarjan_result = network.tarjan();

    if (tarjan_result.length > 0) {
        return self.res.send(400,{ error: "Loop detected! This is not allowed!", loops: tarjan_result });
    }
    network.save(function (err) {
        if (err) {
            return self.res.send(400,{ error: "Network could not be created!", msg: err});
        }
        return self.res.send(201,network);
    });

};

networksController.destroy = function () {
    var self = this;
    Network.findOne({ _id: this.params('id') }, function (err, location) {
        if (err) {
            return self.res.send(404,{ error: "Network not found!"});
        }
        if (location) {
            location.remove(function (err, location) {
                if (err) {
                    return self.res.send(400,{ error: "Network could not be removed!", msg: err});
                }
                return self.res.send(204,{ ok: 1});
            });
        }
        else {
            return self.res.send(404,{ error: "Network not found!"});
        }
    });
};

networksController.update = function () {
    var self = this;
    var networkid = this.params('id');

    var what = { _id: networkid };
    // Does the id contain a :?
    if (networkid.indexOf(':') != -1) {
        // We do not have a real object id here, but a "search"
        var key = networkid.split(':')[0];
        var value = networkid.split(':')[1];
        console.log(key, value);
        what = { };
        what[key] = value;
    }

    Network.findOne(what, function (err, network) {
        if (err) {
            return self.res.send(404,{ error: "Network not found!"});
        }
        if (network) {
            for (var k in self.req.body) {
                network.modules[k] = self.req.body[k]
            }

            var tarjan_result = network.tarjan();

            if (tarjan_result.length > 0) {
                return self.res.send(400,{ error: "Loop detected! This is not allowed!", loops: tarjan_result });
            }

            network.markModified('modules');

            network.save(function (err) {
                if (err) {
                    return self.res.send(400,{ error: "Network could not be updated!", msg: err});
                }
                return self.res.send(200,network);
            });

        }
        else {
            return self.res.send(404,{ error: "Network not found!"});
        }
    });
};


networksController.show = function () {


    var self = this;
    var networkid = this.params('id');
    var what = { _id: networkid }
    var format = this.params('format', 'json');
    var gradient = this.params('gradient', 'default');
    var gradientscale = this.params('gradientscale', 1.0);
    gradientscale = parseFloat(gradientscale);
    var maptype = this.params('maptype', 'plane') == 'plane' ? "NoiseMapBuilderPlane" : "NoiseMapBuilderSphere";
    // Does the id contain a :?
    if (networkid.indexOf(':') != -1) {
        // We do not have a real object id here, but a "search"
        var key = networkid.split(':')[0];
        var value = networkid.split(':')[1];
        console.log(key, value);
        what = { };
        what[key] = value;
    }

    Network.findOne(what, function (err, network) {
        if (err) {
            return self.res.send(404,{ error: "Network not found!"});
        }
        if (network) {
            var rendermodulename = network["defaultoutputmodule"];

            if (format == 'json') {
                return self.res.json(network);
            }
            if (format != 'jpg') {
                return self.res.send(415,{ error: "Format '" + format + "' is not suported. Valid formats are: 'json', 'jpg'" });
            }

            RenderInterface.renderNetwork(network, rendermodulename, maptype, self.req.query, RenderInterface.getGradient(gradient), gradientscale,
                function (result) {
                    if (result.error) {
                        return self.res.send(500,result);
                    }

                    return self.res.sendfile(result);
                });

        } else {
            return self.res.send(404,{ error: "Network not found!"});
        }
    });
};

networksController.index = function () {
    var self = this;

    return self.res.send(404,{foo:"bar"});

};


module.exports = networksController;
