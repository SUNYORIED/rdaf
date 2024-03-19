const { dia, elementTools, shapes, linkTools, util } = joint;

// Define custom shapes

const MyShape1 = dia.Element.define(
    'MyShape1',
    {
        size: {
            width: 100,
            height: 60,
        },
        attrs: {
            root: {
                title: 'Custom Shape 1',
            },
            body: {
                fill: '#ffffff',
                stroke: '#000000',
                strokeWidth: 2,
            },
            label: {
                fontSize: 14,
                fill: '#000000',
                textWrap: {
                    width: -10,
                    height: -10,
                    ellipsis: true,
                },
                textAnchor: 'middle',
                textVerticalAnchor: 'middle',
            },
        },
    },
    {
        markup: util.svg`
            <rect class="body" />
            <text class="label" />
        `,
    }
);

const MyShape2 = dia.Element.define(
    'MyShape2',
    {
        size: {
            width: 120,
            height: 80,
        },
        attrs: {
            root: {
                title: 'Custom Shape 2',
            },
            body: {
                fill: '#ffffff',
                stroke: '#ff0000',
                strokeWidth: 2,
            },
            label: {
                fontSize: 16,
                fill: '#ff0000',
                textWrap: {
                    width: -10,
                    height: -10,
                    ellipsis: true,
                },
                textAnchor: 'middle',
                textVerticalAnchor: 'middle',
            },
        },
    },
    {
        markup: util.svg`
            <rect class="body" />
            <text class="label" />
        `,
    }
);

// Create a graph and paper

const graph = new dia.Graph();
const paper = new dia.Paper({
    el: document.getElementById('graph-container'),
    model: graph,
    width: 2800,
    height: 1600,
    gridSize: 10,
    perpendicularLinks: true,
    defaultLink: new dia.Link({
        attrs: {
            line: {
                stroke: '#000000',
                strokeWidth: 2,
                targetMarker: {
                    type: 'path',
                    fill: '#000000',
                    d: 'M 10 -5 0 0 10 5 Z',
                },
            },
        },
    }),
});

// Define custom positions function

function positionShapes(graph) {
    const elements = graph.getElements();
    let x = 50;
    let y = 50;

    elements.forEach((element, index) => {
        // Check if the element is at an even index
        if (index % 2 === 0) {
            // Position using x and y
            element.position(x, y);
            x += 150; // Increase x for next shape
        } else {
            // Position using coordinates object
            element.position({
                x: x - 120, // Adjust x to overlap with the previous shape
                y: y + 100, // Increase y for next row of shapes
            });
        }
    });
}

// Add custom shapes to the graph

const shape1 = new MyShape1();
const shape2 = new MyShape2();

graph.addCell(shape1);
graph.addCell(shape2);

// Position the shapes

positionShapes(graph);

// Render the paper

