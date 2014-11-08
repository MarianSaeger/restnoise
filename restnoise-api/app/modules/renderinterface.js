'use strict';
var exec = require('child_process').exec;
var fs = require('fs');
var gm = require("gm");
var im = gm.subClass(({imageMagick: true }));
var crypto = require("crypto");

var Gradients = {
    default: [
        [ -1, 0, 0, 255, 255 ],
        [ -0.8, 32, 160, 0, 255 ],
        [ -0.25, 224, 224, 0, 255 ],
        [ 0.25, 128, 128, 128, 255 ],
        [ 1, 255, 255, 255, 255 ]
    ],

    grayscale : [
      [-1, 0, 0, 0, 255 ],
      [1,255,255,255,255]
    ],

    realistic: [

        [-16384.0 , 0, 0, 0, 255],
        [    -256 , 6, 58, 127, 255],
        [    -1.0 , 14, 112, 192, 255],
        [     0.0 , 70, 120, 60, 255],
        [  1024.0 , 110, 140, 75, 255],
        [  2048.0 , 160, 140, 111, 255],
        [  3072.0 , 184, 163, 141, 255],
        [  4096.0 , 255, 255, 255, 255],
        [  6144.0 , 128, 255, 255, 255],
        [ 16384.0 , 0, 0, 255, 255]
    ]
}


function randomFileName() {
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

    return 'tmpfile_'+randomHash(4);
}

function renderNetwork( network, rendermodulename, maptype, substitutevariables, gradient, gradientscale, callback ) {

    console.log(gradient,gradientscale);

    for( var idx in gradient ) {
        gradient[idx][0] = gradient[idx][0] * gradientscale;
    }

    var rndfilename = network["name"]+"_"+rendermodulename+".bmp";
    substitutevariables["tmpfile"] = "\""+rndfilename+"\"";

    var modules = attachRenderNodes( network["modules"], rendermodulename, gradient, maptype );
    var substitutionresult = substituteVariables( modules, substitutevariables );

    modules = substitutionresult.modules;


    if ( Object.keys(substitutionresult.missingvars).length > 0 ) {
        return callback({ error: "Missing vars! The contained vars have no default values and are not declared.", msg:Object.keys(substitutionresult.missingvars)});
    }

    // Determine hash of network, maybe we got it already
    var nw_stringified = JSON.stringify( modules );
    var md5sum = crypto.createHash('md5');
    md5sum.update(nw_stringified);
    var chksum = md5sum.digest('hex');
    console.log("md5",chksum);

    // Check if file exists already
    var target_filename = network["name"]+"_"+chksum+".jpg";

    if ( fs.existsSync( "public/"+target_filename ) ) {
        return callback("public/"+target_filename);
    }

    fs.writeFileSync("./"+rndfilename+".conf", JSON.stringify( modules ) );

    var child = exec('python /Users/msaeger/projects/mercurial/noise-server/server.py --network ./'+rndfilename+'.conf', function( error, stdout, stderr)
    {
        if ( error != null ) {

            // error handling & exit
            console.log(stderr);
            console.log(stdout);
            return callback({ error: "Error occured while rendering!", msg:error});
        }
        console.log(stdout);


        im(rndfilename).write("public/"+target_filename, function () {
            callback("public/"+target_filename);
            setTimeout(function() {
                    //fs.unlink(rndfilename+".jpg", function(){} );
                    fs.unlink(rndfilename, function(){} );
                    fs.unlink(rndfilename+".conf", function(){} );
                }
                , 5000 );
        } );
    });
}


function attachRenderNodes( modules, rendermodulename, fancyGradientPoints, maptype ) {


    // Attach render structure
    modules["renderer"] = {
        "LightContrast" : 1.0/345600,
        "LightIntensity" : 2.0,
        "LightElev":45.0,
        "LightAzimuth":135.0,
        "GradientPoints" : fancyGradientPoints,
        "DestFilename" : "var:tmpfile",
        "SourceNoiseMap" : "heightMap",
        "type" : "RendererImageNetwork"
    };
    modules["heightMapBuilder"] = {
        "Bounds" : [ "var:bound0,1.0", "var:bound1,2.0", "var:bound2,3.0", "var:bound3,4.0" ],
        "DestSize" : [ "var:width,512", "var:height,256" ],
        "DestNoiseMap" : "heightMap",
        "SourceModule" : rendermodulename,
        "type" : maptype
    };
    modules["heightMap"] = {
        "type" : "NoiseMap"
    };

    return modules;
}


function substituteVariables( modules, substitutevariables ) {
    var nw_stringified = JSON.stringify( modules );
    var missingvars = {};


    nw_stringified = nw_stringified.replace(/\"var:([^,\"]*),([^\"]*)\"/g, function(completematch,varname,defaultvalue) {
        if ( substitutevariables.hasOwnProperty( varname ) ) {
            return substitutevariables[varname]
        } else {
            return defaultvalue
        }

    } );
    nw_stringified = nw_stringified.replace(/\"var:([^\"]*)\"/g, function(completematch,varname) {
        if ( substitutevariables.hasOwnProperty( varname ) ) {
            return substitutevariables[varname]
        } else {
            missingvars[varname] = 1;
            return "MISSING VAR: "+varname;
        }

    } );


    modules = JSON.parse( nw_stringified );
    return { modules : modules, missingvars : missingvars };;
}

function getGradient( gradientid ) {
    return JSON.parse( JSON.stringify( Gradients[gradientid] ) );
}

module.exports = {
    attachRenderNodes : attachRenderNodes,
    renderNetwork : renderNetwork,
    substituteVariables : substituteVariables,
    getGradient : getGradient
};
