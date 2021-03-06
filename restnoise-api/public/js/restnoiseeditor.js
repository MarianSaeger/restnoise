var makeeditor = function(networkid) {

    jsPlumb.ready(function () {

        var modules = {};

        $.ajax({
            url: '/networks/'+networkid,
            success: function (result) {
                $.ajax({
                    url: '/networks/'+networkid+'?format=graph',
                    success: function (layoutdata) {


                        modules = result.modules;

                        for (var modulename in modules) {
                            $('#flowchart-demo').append("<div class='window' style='top:" + layoutdata[modulename].y + ";left:" + layoutdata[modulename].x + "' id='module_" + modulename + "'>" + modulename + ":" + modules[modulename].type + "<br /><img src='/networks/"+networkid+"/modules/" + modulename + "?format=jpg&height=128&width=128&EnableLight=false&gradient=grayscale'/></div>");
                        }

                        var instance = jsPlumb.getInstance({
                            // default drag options
                            DragOptions: { cursor: 'pointer', zIndex: 2000 },
                            // the overlays to decorate each connection with.  note that the label overlay uses a function to generate the label text; in this
                            // case it returns the 'labelText' member that we set on each connection in the 'init' method below.
                            ConnectionOverlays: [
                                [ "Arrow", { location: 1 } ],
                                [ "Label", {} ]
                            ],
                            Container: "flowchart-demo"
                        });
                        // this is the paint style for the connecting lines..
                        var connectorPaintStyle = {
                                lineWidth: 4,
                                strokeStyle: "#61B7CF",
                                joinstyle: "round",
                                outlineColor: "white",
                                outlineWidth: 2
                            },
                        // .. and this is the hover style.
                            connectorHoverStyle = {
                                lineWidth: 4,
                                strokeStyle: "#216477",
                                outlineWidth: 2,
                                outlineColor: "white"
                            },
                            endpointHoverStyle = {
                                fillStyle: "#216477",
                                strokeStyle: "#216477"
                            },
                        // the definition of source endpoints (the small blue ones)
                            sourceEndpoint = {
                                endpoint: "Dot",
                                paintStyle: {
                                    strokeStyle: "#7AB02C",
                                    fillStyle: "transparent",
                                    radius: 4,
                                    lineWidth: 2
                                },
                                isSource: true,
                                connector: [ "Flowchart", { stub: [2, 3], gap: 0, cornerRadius: 2, alwaysRespectStubs: true } ],
                                connectorStyle: connectorPaintStyle,
                                hoverPaintStyle: endpointHoverStyle,
                                connectorHoverStyle: connectorHoverStyle,
                                dragOptions: {}

                            },
                        // the definition of target endpoints (will appear when the user drags a connection)
                            targetEndpoint = {
                                endpoint: "Dot",
                                paintStyle: { fillStyle: "#7AB02C", radius: 5 },
                                hoverPaintStyle: endpointHoverStyle,
                                maxConnections: -1,
                                dropOptions: { hoverClass: "hover", activeClass: "active" },
                                isTarget: true
                            },
                            init = function (connection) {
                                connection.getOverlay("label").setLabel(connection.sourceId.substring(15) + "-" + connection.targetId.substring(15));
                                connection.bind("editCompleted", function (o) {
                                    if (typeof console != "undefined")
                                        console.log("connection edited. path is now ", o.path);
                                });
                            };
                        var _addEndpoints = function (toId) {



                            for (var pname in modules[toId]) {
                                if (pname.match(/Module/gi)) {
                                    if (Array.isArray(modules[toId][pname])) {
                                        for ( var idx in modules[toId][pname] ) {
                                            var sourceUUID = modules[toId][pname][idx] + "_" + toId + "_" + pname;
                                            instance.addEndpoint("module_" + modules[toId][pname][idx], sourceEndpoint, { anchor: "Continuous", uuid: sourceUUID });

                                            var targetUUID = toId + "_" + pname + "_" + idx;
                                            instance.addEndpoint("module_" + toId, targetEndpoint, { anchor: "Continuous", uuid: targetUUID });
                                        }
                                    } else {
                                        var sourceUUID = modules[toId][pname] + "_" + toId + "_" + pname;
                                        instance.addEndpoint("module_" + modules[toId][pname], sourceEndpoint, { anchor: "Continuous", uuid: sourceUUID });

                                        var targetUUID = toId + "_" + pname;
                                        instance.addEndpoint("module_" + toId, targetEndpoint, { anchor: "Continuous", uuid: targetUUID });
                                    }
                                }
                            }

                        };
                        // suspend drawing and initialise.
                        instance.doWhileSuspended(function () {

                            for (var modulename in modules) {
                                _addEndpoints(modulename);
                            }

                            // listen for new connections; initialise them the same way we initialise the connections at startup.
                            instance.bind("connection", function (connInfo, originalEvent) {
                                init(connInfo.connection);
                            });
                            // make all the window divs draggable
                            instance.draggable(jsPlumb.getSelector(".flowchart-demo .window"), { grid: [20, 20] });


                            for (var modulename in modules) {
                                for (var pname in modules[modulename]) {
                                    if (pname.match(/Module/gi)) {
                                        if (Array.isArray(modules[modulename][pname])) {
                                            for ( var idx in modules[modulename][pname] ) {
                                                instance.connect({uuids: [modules[modulename][pname][idx] + "_" + modulename + "_" + pname, modulename + "_" + pname + "_" + idx], editable: false});
                                            }
                                        } else {
                                            instance.connect({uuids: [modules[modulename][pname] + "_" + modulename + "_" + pname, modulename + "_" + pname], editable: false});
                                        }
                                    }
                                }

                            }

                            instance.bind("click", function (conn, originalEvent) {
                                if (confirm("Delete connection from " + conn.sourceId + " to " + conn.targetId + "?"))
                                    jsPlumb.detach(conn);
                            });
                            instance.bind("connectionDrag", function (connection) {
                                console.log("connection " + connection.id + " is being dragged. suspendedElement is ", connection.suspendedElement, " of type ", connection.suspendedElementType);
                            });
                            instance.bind("connectionDragStop", function (connection) {
                                console.log("connection " + connection.id + " was dragged");
                            });
                            instance.bind("connectionMoved", function (params) {
                                console.log("connection " + params.connection.id + " was moved");
                            });
                        });
                        jsPlumb.fire("jsPlumbDemoLoaded", instance);

                    }});
            }});


    });
};