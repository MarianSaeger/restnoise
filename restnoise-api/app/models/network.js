'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var NetworkSchema = new Schema( {
    name: {type: String, index: {unique: true}, required : true},
    defaultoutputmodule: {type: String, required : true},
    modules: Schema.Types.Mixed,
    description: {type: String, required : false}

});


function VertexStack(vertices) {
    this.vertices = vertices || [];
}
VertexStack.prototype.contains = function(vertex) {
    for ( var i in this.vertices ) {
        if ( vertex.name && vertex.name==this.vertices[i].name ) {
            return true;
        }
    }
    return false;
}

NetworkSchema.methods.tarjan = function() {
    if ( ! this.modules ) { return []; };
    var graph = JSON.parse(JSON.stringify(this.modules));
    for ( var modulename in graph ) {
        graph[modulename].name = modulename;
    }
    var index = 0;
    var stack = new VertexStack();

    var scc = [];


    function strongconnect(vertex) {

        vertex.index = index;
        vertex.lowlink = index;
        index = index + 1;
        stack.vertices.push( vertex );

        var vertexconnections = [];

        for ( var pname in vertex ) {
            if ( pname.match(/Module/gi) ) {
                if ( Array.isArray( vertex[pname] ) ) {
                    vertexconnections = vertexconnections.concat(vertex[pname]);
                } else {
                    vertexconnections.push( vertex[pname] )
                }

            }
        }
        for ( var i in vertexconnections ) {
            var v = vertex;
            var w = graph[vertexconnections[i]];
            if ( w.index == undefined ) {
                strongconnect( w );
                v.lowlink = Math.min(v.lowlink, w.lowlink);
            } else if ( stack.contains(w) ) {
                v.lowlink = Math.min(v.lowlink, w.index);
            }
        }

        if ( vertex.lowlink == vertex.index ) {
            var vertices = [];
            var w2 = null;
            if ( stack.vertices.length>0 ) {
                do {
                    w2 = stack.vertices.pop();
                    vertices.push(w2);
                } while ( !(vertex.name== w2.name))
            }

            if ( vertices.length>1) {
                scc.push(vertices);
            }
        }
    }


    for ( var modulename in graph ) {
        if ( graph[modulename].index == undefined ) {
            strongconnect( graph[modulename] );
        }
    }

    return scc;

}



var Network = mongoose.model('Network', NetworkSchema);




module.exports = Network;
