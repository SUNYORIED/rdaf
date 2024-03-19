
var PORT_WIDTH = 90;
const PORT_HEIGHT = 20;
const PORT_GAP = 20;


//Looking on How to prevent the links from overlapping the nearby elements, and how to set the length of the links
// Also how to increase the size of the paper when object overflow
function makeLink(from,to) {
    const link = new joint.shapes.standard.Link({
      source: { id: from.id, anchor:{name: "right",
        args: {
          rotate: true,
        }
      }},
      target: { id: to.id, anchor:{name: "left"},
        args: {
          rotate: true,
        }
      },

      attrs: {
        '.connection': { stroke: 'blue', 'stroke-width': 2, 'stroke-dasharray': '5,5' }, // Adjust the stroke style

      }
    });

    link.router('manhattan', {
        margin: 0,
        startDirections: ['right'],
        endDirections: ['left'],
        step: 5,
        padding: 10,
        perpendicular: true,
        maxAllowedDirectionChange:150,
        excludeEnds: ['source', 'target']
    });
    link.connector('rounded');
    link.vertices([{ x: 100, y: 120 }, { x: 150, y: 60 }]);
    link.set('hidden', true);
    return link
}



function createStage(id, name){
  const node = new joint.shapes.standard.Rectangle({
    id: id,
    size: {
      width: '150',
      height: 30
    },
    attrs: {
      label: {
        fontWeight: "bold",
        fontSize: 15,
        fontFamily: "sans-serif",
        fill: "#ffffff",
        paintOrder: "stroke",
        text: name,
        cursor: "pointer"
      },
      body: {
        strokeWidth: 2,
        fill: "grey",
        cursor: "pointer"
      },
      },
      NodeType:{
        type: "Stages"
      },
    })
      //node.set('hidden', true);
      return node
}


function createTopics(id, name){
  const textWidth = name.length * 10; // Approximate width based on font size and average character width
  const width = Math.max(textWidth, 100); // Ensure a minimum width to accommodate shorter text
  const node =  new joint.shapes.standard.Rectangle({
      id: id,
      //position: {
      //  x: 250,
      //  y: 500
      //},
      size: {
        width: width + 100,
        height: 65
      },
      NodeType:{
        type: "Topics"
      },
      attrs: {
        label: {
          fontWeight: "bold",
          fontSize: 20,
          fontFamily: "sans-serif",
          fill: "#ffffff",
          strokeWidth: 5,
          paintOrder: "stroke",
          text: name,
        },
        body: {
          strokeWidth: 2,
          fill: "#4d80b3",
          cursor: "grab"
        },
      },
      ports:{
        items: []
      },
      buttons:{
        x: "20%"
      }

    });
    node.set('hidden', true);
    node.set('collapsed', false)
    return node
}


function createConsiderations(id, name){
  if(typeof name == 'string'){
    var textWidth = name.length * 10
  }else{
    var textWidth = 200
  }
  const width = Math.max(textWidth, 200); // Ensure a minimum width to accommodate shorter text
  const node =  new joint.shapes.standard.Rectangle({
      id: id,
      //position: {
      //  x: 250,
      //  y: 500
      //},
      size: {
        width: width,
        height: 35
      },
      attrs: {
        label: {
          //fontWeight: "bold",
          fontSize: 15,
          fontFamily: "sans-serif",
          fill: "black",
          stroke: "#333333",
          paintOrder: "stroke",
          text: name,
        },
        body: {
          strokeWidth: 2,
          fill: "white",
          cursor: "grab"
        },
      },
      ports:{
        id: "Considerations",
        items: []
      }
    });
    node.set('hidden', true);
    node.set('collapsed', false)
    return node
}




function createOutcomes(id, name){
    const textWidth = name.length * 8; // Approximate width based on font size and average character width
    const width = Math.max(textWidth, 100); // Ensure a minimum width to accommodate shorter text
    const node =  new joint.shapes.standard.Rectangle({
        id: id,

        size: {
          width: width,
          height: 70
        },
        attrs: {
          label: {
            fontWeight: "bold",
            fontSize: 15,
            fontFamily: "sans-serif",
            fill: "black",

            paintOrder: "stroke",
            text: name,
          },
          body: {
            strokeWidth: 2,
            fill: "	#ffcccc",
            cursor: "grab"
          },
        },
        ports:{
          id: "Outcomes",
          items: []
        }
      });
      node.set('hidden', true);
      node.set('collapsed', false)
      return node;
}

function createActivities(id, name){

  const textWidth = name.length * 10; // Approximate width based on font size and average character width
  const width = Math.max(textWidth, 200); // Ensure a minimum width to accommodate shorter text
  const node =  new joint.shapes.standard.Rectangle({
      id: id,
      //position: {
      //  x: 250,
      //  y: 500
      //},
      size: {
        width: width,
        height: 200
      },
      attrs: {
        label: {
          //fontWeight: "bold",
          fontSize: 15,
          fontFamily: "sans-serif",
          fill: "black",
          stroke: "#333333",
          paintOrder: "stroke",
          text: name,
        },
        body: {
          strokeWidth: 2,
          fill: "#9999e6",
          cursor: "grab"
        },
      },
      ports:{
        id: "Activities",
        items: []
      }
    });
    node.set('hidden', true);
    node.set('collapsed', false)
    return node
}

function setPorts(el, ports) {
    let width = 0;
    const rdafPorts = ports.map((port, index) => {
      const x = index * (PORT_WIDTH + PORT_GAP);
      width = x + PORT_WIDTH;
      return {
        id: `${port}`,
        group: "rdaf",
        attrs: {
          portLabel: {
            text: `${port}`,

          }
        },
        args: {
          x: "90%",
          y: "50%"
        },
      };
    });
    if (rdafPorts.length > 0) {
      width += PORT_GAP;
    }

    width += 2 * PORT_WIDTH;

    el.prop(["ports", "items"], [...rdafPorts], {
      rewrite: true
    });

  }

let uniqueButtonIdCounter = 1;

function generateUniqueButtonId() {
    return 'button_' + uniqueButtonIdCounter++;
}


//Creates The ports on the Elements
function createPort(id,group, name) {
  var port = {
    id: id,
    label: {
      text: name,
      position: {
        name: 'left'
      },
      markup: [{
        tagName: 'text',
            selector: 'label'
        }]
    },
    attrs: {
        portBody: {
            magnet: true,
            width: 0,
            height: 0,
            x:240,
            y: 0,
            fill:  '#03071E'
        },
    },
    markup: [{
        tagName: 'rect',
        selector: 'portBody'
    }],
    x:"90%",
    y:"50%"
  };
  return port
}
