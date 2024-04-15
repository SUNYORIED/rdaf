const { dia, elementTools, shapes, linkTools, util } = joint;

graph = new dia.Graph({}, { cellNamespace: shapes });

    // Create a new paper, which is a wrapper around SVG element
paper = new dia.Paper({
    interactive: { vertexAdd: false }, // disable default vertexAdd interaction
    el: document.getElementById('graph-container'),
    model: graph,
    interactive: { vertexAdd: false }, // disable default vertexAdd interaction,
    width: window.innerWidth, //window.innerWidth,
    height: window.innerHeight,//window.innerHeight,
    gridSize: 10,
    perpendicularLinks: true,
    drawGrid: true,
    background: {
        color: '#f9f9f9'
    },
    defaultLinkAnchor: {
        name: 'connectionLength'
    },
    interactive: {
        linkMove: false,
        labelMove: false
    },
    connectionPoint: {
        name: 'boundary',
        args: {
            sticky: true
        }
    },
});

// Create two elements
var rect1 = new joint.shapes.standard.Rectangle();
rect1.position(100, 100);
rect1.resize(100, 40);

var rect2 = new joint.shapes.standard.Rectangle();
rect2.position(300, 100);
rect2.resize(100, 40);

// Add the elements to the graph
graph.addCell(rect1);
graph.addCell(rect2);

// Create ports for the elements
rect1.addPort({ id: 'port1' });
rect2.addPort({ id: 'port2' });
rect2.addPort({ id: 'port3' });
rect1.addPort({ id: 'port4' })

// Create a link between the ports of the elements
var link = new joint.shapes.standard.Link({
    source: { id: rect1.id, port: 'port1' },
    target: { id: rect2.id, port: 'port2'}
});

var link2 = new joint.shapes.standard.Link({
    source: { id: rect1.id, port: 'port4' },
    target: { id: rect2.id, port: 'port3'}
});




// Add the link to the graph
graph.addCell([link, link2]);
