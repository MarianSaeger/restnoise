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

    grayscale: [
        [-1, 0, 0, 0, 255 ],
        [1, 255, 255, 255, 255]
    ],

    jade: [
        [ -1.000, 24, 146, 102, 255 ],
        [  0.000, 78, 154, 115, 255 ],
        [  0.250, 128, 204, 165, 255 ],
        [  0.375, 78, 154, 115, 255 ],
        [  1.000, 29, 135, 102, 255 ]
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
            return parseInt(16 * Math.random(), 10).toString(16);
        else {
            var hash = '';
            for (var i = 0; i < count; i++)
                hash += randomHash(1);
            return hash;
        }
    }

    return 'tmpfile_' + randomHash(4);
}

function renderNetwork(network, rendermodulename, maptype, substitutevariables, gradient, gradientscale, callback) {



    for (var idx in gradient) {
        gradient[idx][0] = gradient[idx][0] * gradientscale;
    }



    var modules = attachRenderNodes(network["modules"], rendermodulename, gradient, maptype);

    // Determine hash of network (before substituting variables), maybe we got it already
    var nw_stringified = JSON.stringify(modules) + JSON.stringify(substitutevariables);
    var md5sum = crypto.createHash('md5');
    md5sum.update(nw_stringified);
    var chksum = md5sum.digest('hex');

    var rndfilename = network["name"] + "_" + chksum + ".bmp";
    substitutevariables["tmpfile"] = "\"" + rndfilename + "\"";

    var substitutionresult = substituteVariables(modules, substitutevariables);

    if (substitutionresult.error) {
        return callback(substitutionresult);
    }


    modules = substitutionresult.modules;


    if (Object.keys(substitutionresult.missingvars).length > 0) {
        return callback({ error: "Missing vars! The contained vars have no default values and are not declared.", msg: Object.keys(substitutionresult.missingvars)});
    }



    // Check if file exists already
    var target_filename = network["name"] + "_" + chksum + ".jpg";

    if (fs.existsSync("public/" + target_filename)) {
        return callback("public/" + target_filename);
    }

    fs.writeFileSync("./" + rndfilename + ".conf", JSON.stringify(modules));

    var child = exec('python ../rendernoise/rendernoise.py --network ./' + rndfilename + '.conf', function (error, stdout, stderr) {
        if (error != null) {

            // error handling & exit
            console.log(stderr);
            console.log(stdout);
            return callback({ error: "Error occured while rendering!", msg: error});
        }
        console.log(stdout);


        im(rndfilename).write("public/" + target_filename, function () {
            callback("public/" + target_filename);
            setTimeout(function () {
                    //fs.unlink(rndfilename+".jpg", function(){} );
                    fs.unlink(rndfilename, function () {
                    });
                    fs.unlink(rndfilename + ".conf", function () {
                    });
                }
                , 5000);
        });
    });
}


function attachRenderNodes(modules, rendermodulename, fancyGradientPoints, maptype) {


    // Attach render structure
    modules["renderer"] = {
        "LightContrast": "var:LightContrast,0.000002894",
        "LightIntensity": "var:LightIntensity,2.0",
        "LightElev": "var:LightElev,45.0",
        "LightAzimuth": "var:LightAzimuth,135.0",
        "EnableLight": "var:EnableLight,true",
        "GradientPoints": fancyGradientPoints,
        "DestFilename": "var:tmpfile",
        "SourceNoiseMap": "heightMap",
        "type": "RendererImageNetwork"
    };
    modules["heightMapBuilder"] = {
        "Bounds": [ "var:boundx0,-1.0", "var:boundx1,1.0", "var:boundy0,-1.0", "var:boundy1,1.0" ],
        "DestSize": [ "var:width,512", "var:height,256" ],
        "DestNoiseMap": "heightMap",
        "SourceModule": rendermodulename,
        "type": maptype
    };
    modules["heightMap"] = {
        "type": "NoiseMap"
    };

    return modules;
}


function substituteVariables(modules, substitutevariables) {
    var nw_stringified = JSON.stringify(modules);
    var missingvars = {};


    nw_stringified = nw_stringified.replace(/\"var:([^,\"]*),([^\"]*)\"/g, function (completematch, varname, defaultvalue) {
        if (substitutevariables.hasOwnProperty(varname)) {
            return substitutevariables[varname]
        } else {
            return defaultvalue
        }

    });
    nw_stringified = nw_stringified.replace(/\"var:([^\"]*)\"/g, function (completematch, varname) {
        if (substitutevariables.hasOwnProperty(varname)) {
            return substitutevariables[varname]
        } else {
            missingvars[varname] = 1;
            return "MISSING VAR: " + varname;
        }

    });


    try {
        modules = JSON.parse(nw_stringified);
    } catch(err) {
        return { error : "Could not substitute variables, maybe you have a typo?", msg : nw_stringified }
    }

    return { modules: modules, missingvars: missingvars };

}

function getGradient(gradientid) {
    return JSON.parse(JSON.stringify(Gradients[gradientid]));
}

module.exports = {
    attachRenderNodes: attachRenderNodes,
    renderNetwork: renderNetwork,
    substituteVariables: substituteVariables,
    getGradient: getGradient
};
