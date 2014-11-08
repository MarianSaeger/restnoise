'use strict';

var locomotive = require('locomotive');
var Controller = locomotive.Controller,
    Network = require('../models/network.js');
var RenderInterface = require('../modules/renderinterface.js');


var networksController = new Controller();

function randomHash(count) {
    if (count === 1)
        return parseInt(16*Math.random(), 10).toString(16);
    else {
        var hash = '';
        for (var i=0; i<count; i++)
            hash += randomHash(1);
        return hash;
    }
}


networksController.create = function() {
    var self = this;

  var networkdata = self.req.body;
  if ( ! networkdata.name ) {
      networkdata.name = "network_"+randomHash(4);
  }

  var network = new Network( networkdata );
  var self = this;
  network.save( function( err ) {
    if ( err ) {
      return self.res.json( { error : "Network could not be created!", msg:err} );
    }
    return self.res.json( network );
  });

};

networksController.destroy = function() {
  var self = this;
  Network.findOne( { _id : this.params('id') }, function( err, location ) {
    if ( err ) {
      return self.res.json( { error : "Network does not exist!", msg:err} );
    }
    if ( location ) {
      location.remove( function( err, location ) {
        if ( err ) {
          return self.res.json( { error : "Network could not be removed!", msg:err} );
        }
        return self.res.json( { ok: 1} );
      });
    }
    else {
      return self.res.json( { error : "Network does not exist!"} );
    }
  });
};

networksController.update = function() {
    var self = this;
    var networkid = this.params('id');

    var what = { _id : networkid };
    // Does the id contain a :?
    if ( networkid.indexOf(':') != -1 ) {
        // We do not have a real object id here, but a "search"
        var key = networkid.split(':')[0];
        var value = networkid.split(':')[1];
        console.log(key, value);
        what = { };
        what[key] = value;
    }

    Network.findOne( what, function( err, network ) {
        if ( err ) {
            return self.res.json( { error : "Network does not exist!", msg:err} );
        }
        if ( network ) {
            for ( var k in self.req.body ) {
                network.modules[k] = self.req.body[k]
            }
            network.markModified('modules');

            network.save( function( err ) {
                if ( err ) {
                    return self.res.json( { error : "Network could not be created!", msg:err} );
                }
                return self.res.json( network );
            });

        }
        else {
            return self.res.json( { error : "Network does not exist!"} );
        }
    });
};


networksController.show = function() {


  var self = this;
  var networkid = this.params('id');
  var what = { _id : networkid }
    var format = this.params('format','json');
    var gradient = this.params('gradient','default');
    var gradientscale = this.params('gradientscale',1.0);
    gradientscale = parseFloat(gradientscale);
    var maptype = this.params('maptype', 'plane') == 'plane' ? "NoiseMapBuilderPlane" : "NoiseMapBuilderSphere";
  // Does the id contain a :?
  if ( networkid.indexOf(':') != -1 ) {
    // We do not have a real object id here, but a "search"
    var key = networkid.split(':')[0];
    var value = networkid.split(':')[1];
    console.log(key, value);
    what = { };
    what[key] = value;
  }

  Network.findOne( what, function( err, network ) {
    if ( err ) {
      return self.res.json( { error : "Network could not be read!", msg:err} );
    }
    if ( network ) {
        var rendermodulename = network["defaultoutputmodule"];


        if ( format == 'json') {
            return self.res.json( network );
        }
        if ( format != 'jpg' ) {
            return self.res.json( { error : "Format '"+format+"' is not suported. Valid formats are: 'json', 'jpg'" } );
        }

        RenderInterface.renderNetwork( network, rendermodulename, maptype, self.req.query, RenderInterface.getGradient( gradient ), gradientscale,
            function( result ) {
                if ( result.error ) {
                    return self.res.json( result );
                }

                return self.res.sendfile( result );
            });

    } else {
        return self.res.json({ error: "Network could not be found!"});
    }
  });
};

networksController.index = function() {
  var self = this;
    return self.res.json( {foo:"index"} );
    /*

    Network.find( function( err, networks ) {
    if ( err ) {
      return self.res.json( { error : "Locations could not be read!", msg:err} );
    }
    if ( networks ) {
      return self.res.json( networks );
    }
    return self.res.json( { error : "Locations could not be found!"} );
  });
  */
};


module.exports = networksController;
