
var PORT_WIDTH = 90;
const PORT_HEIGHT = 20;
const PORT_GAP = 20;

//Looking on How to prevent the links from overlapping the nearby elements, and how to set the length of the links
// Also how to increase the size of the paper when object overflow
function makeLink(from,to) {
  const portName = to.prop('name/first')
  let color
  if(portName == "Methods"){
    color = "#04C3D6"
  }else if(portName == "Participants"){
    color = "#B70316"
  }else if(portName == "Roles"){
    color = "#09BD00"
  }else if(portName == "Resources"){
    color = "#B6BF30"
  }else if(portName == "Outputs"){
    color = "#0013FF"
  }else{
    color = '#640067'
  }

  const link = new joint.shapes.standard.Link({
    source: { id: from.id, port: portName},
    target: { id: to.id},
    attrs: {
      line: {
          stroke: color, // Change the color of the link to blue
          strokeWidth: 2, // Adjust the width of the link if needed
      },
    },
    vertices: []

});
  link.router('orthogonal', {
      margin: 0,
      startDirections: ['right'],
      endDirections: ['left'],
      step: 10,
      padding: 20,
      perpendicular: true,
      maxAllowedDirectionChange:0,
      excludeEnds: ['source', 'target'],
      excludeTypes: ['standard.Rectangle']
  });
  link.connector('normal');
  link.set('hidden', true);
  return link
}



function createStage(id, name){
  const node = new joint.shapes.standard.Rectangle({
    id: id,
    size: {
      width: 150,
      height: 30
    },
    attrs: {
      label: {
        fontWeight: "bold",
        fontSize: 15,
        fontFamily: "sans-serif",
        fill: "black",
        paintOrder: "stroke",
        text: name,
        "text-anchor":"start",
        cursor: "pointer",
        x:-70
      },
      body: {
        strokeWidth: 2,
        fill: "whitesmoke",
        cursor: "pointer",
        'rx': 4, // Horizontal border radius
        'ry': 4, // Vertical border radius,
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
        fontSize: 17,
        fontFamily: "sans-serif",
        fill: "black",
        paintOrder: "stroke",
        text: name,
        "text-anchor":"start",
        cursor: "pointer",
      },
      body: {
        strokeWidth: 2,
        fill: "whitesmoke",
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


function createConsiderations(id, name){
  if(typeof name == 'string'){
    var textWidth = name.length * 10
  }else{
    var textWidth = 200
  }
  const width = Math.max(textWidth, 200); // Ensure a minimum width to accommodate shorter text
  const node =  new joint.shapes.standard.Rectangle({
    id: id,
    size: {
      width: width + 50,
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
        type: 'TextBlock',
        text: name,
        "text-anchor":"start",
      },
      body: {
        strokeWidth: 2,
        fill: "#E2E3E5",
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
  const textWidth = name.length * 9.5; // Approximate width based on font size and average character width
  const width = Math.max(textWidth, 100); // Ensure a minimum width to accommodate shorter text
  const node =  new joint.shapes.standard.Rectangle({
    id: id,
    size: {
      width: width,
      height: 70
    },
    attrs: {
      label: {
        fontWeight: 'bold',
        fontSize: 18,
        fontFamily: "sans-serif",
        fill: "whitesmoke",
        paintOrder: "stroke",
        text: name,
        "text-anchor":"start",
        cursor: "pointer"
      },
      body: {
        type:'TextBlock',
        strokeWidth: 2,
        fill: "#007eb3",
        cursor: "pointer"
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
      size: {
        width: width + 170  ,
        height: 145
      },
      attrs: {
        label: {
        fontWeight: "bold",
        fontSize: 17,
        fontFamily: "sans-serif",
        fill: "whitesmoke",
        stroke: "#333333",
        paintOrder: "stroke",
        text: name,
        "text-anchor":"start",
      },
      body: {
        strokeWidth: 3,
        fill: "#007eb3",
        cursor: "grab",
        margin:10
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

function createOutputs(id, name){
  if(typeof name == 'string'){
    var textWidth = name.length * 8
  }else{
    var textWidth = 200
  }
  const width = Math.max(textWidth, 100); // Ensure a minimum width to accommodate shorter text
  const node =  new joint.shapes.standard.Rectangle({
    id: id,
    size: {
      width: width,
      height: 35
    },
    attrs: {
      label: {
      //fontWeight: "bold",
        fontSize: 15,
        fontFamily: "sans-serif",
        fill: "whitesmoke",
        stroke: "#333333",
        paintOrder: "stroke",
        type: 'TextBlock',
        text: name,
        "text-anchor":"start",
      },
      body: {
        strokeWidth: 2,
        fill: "#005C90",
        cursor: "grab"
      },
    },
    ports:{
      id: "Outputs",
      items: []
    }
  });
  node.set('hidden', true);
  node.set('collapsed', false)
  return node
}

function createParticipants(id, name){
  if(typeof name == 'string'){
    var textWidth = name.length * 9
  }else{
    var textWidth = 200
  }
  const width = Math.max(textWidth, 200); // Ensure a minimum width to accommodate shorter text
  const node =  new joint.shapes.standard.Rectangle({
    id: id,
    size: {
      width: width,
      height: 35
    },
    attrs: {
      label: {
      //fontWeight: "bold",
        fontSize: 15,
        fontFamily: "sans-serif",
        fill: "whitesmoke",
        stroke: "#333333",
        paintOrder: "stroke",
        type: 'TextBlock',
        text: name,
        "text-anchor":"start",
      },
      body: {
        strokeWidth: 2,
        fill: "#005C90",
        cursor: "grab"
      },
    },
    ports:{
      id: "Outputs",
      items: []
    }
  });
  node.set('hidden', true);
  node.set('collapsed', false)
  return node
}

function createRoles(id, name){
  if(typeof name == 'string'){
    var textWidth = name.length * 9
  }else{
    var textWidth = 200
  }
  const width = Math.max(textWidth, 200); // Ensure a minimum width to accommodate shorter text
  const node =  new joint.shapes.standard.Rectangle({
    id: id,
    size: {
      width: width,
      height: 35
    },
    attrs: {
      label: {
        fontSize: 15,
        fontFamily: "sans-serif",
        fill: "whitesmoke",
        stroke: "#333333",
        paintOrder: "stroke",
        type: 'TextBlock',
        text: name,
        "text-anchor":"start",
      },
      body: {
        strokeWidth: 2,
        fill: "#005C90",
        cursor: "grab"
      },
    },
    ports:{
      id: "Roles",
      items: []
    }
  });
  node.set('hidden', true);
  node.set('collapsed', false)
  return node
}

function createMethods(id, name){
  if(typeof name == 'string'){
    var textWidth = name.length * 9
  }else{
    var textWidth = 200
  }
  const width = Math.max(textWidth, 200); // Ensure a minimum width to accommodate shorter text
  const node =  new joint.shapes.standard.Rectangle({
    id: id,
    size: {
      width: width,
      height: 35
    },
    attrs: {
      label: {
        fontSize: 15,
        fontFamily: "sans-serif",
        fill: "whitesmoke",
        stroke: "#333333",
        paintOrder: "stroke",
        type: 'TextBlock',
        text: name,
        "text-anchor":"start",
      },
      body: {
        strokeWidth: 2,
        fill: "#005C90",
        cursor: "grab"
      },
    },
    ports:{
      id: "Methods",
      items: []
    }
  });
  node.set('hidden', true);
  node.set('collapsed', false)
  return node
}

function createResources(id, name){
  if(typeof name == 'string'){
    var textWidth = name.length * 9
  }else{
    var textWidth = 200
  }
  const width = Math.max(textWidth, 200); // Ensure a minimum width to accommodate shorter text
  const node =  new joint.shapes.standard.Rectangle({
    id: id,
    size: {
      width: width,
      height: 35
    },
    attrs: {
      label: {
        fontSize: 15,
        fontFamily: "sans-serif",
        fill: "black",
        stroke: "#333333",
        paintOrder: "stroke",
        type: 'TextBlock',
        text: name,
        cursor: "grab",
        "text-anchor":"start",
      },
      body: {
        strokeWidth: 2,
        fill: "#C8CDDA",
        cursor: "grab",
        'rx': 10, // Border radius
        'ry': 10, // Border radius
      },
    },
    ports:{
      id: "Resources",
      items: []
    }
  });
  node.set('hidden', true);
  node.set('collapsed', false)
  return node
}

function createDownloadButton(id, name){
  const node =  new joint.shapes.standard.Rectangle({
    id: id,
    size: {
      width: 130,
      height: 35
    },
    attrs: {
      label: {
        fontSize: 15,
        fontFamily: "sans-serif",
        fill: "black",
        stroke: "#333333",
        paintOrder: "stroke",
        type: 'TextBlock',
        text: name,
        cursor: "grab",
        "text-anchor":"start",
      },
      body: {
        strokeWidth: 2,
        fill: "#C8CDDA",
        cursor: "grab",
        'rx': 10, // Border radius
        'ry': 10, // Border radius
      },
    },
    ports:{
      id: "Download",
      items: []
    },
  });
  node.position(50, 10)
  node.attr('root/title', 'Download Button')
  return node
}

function createResetButton(id, name){
  const node =  new joint.shapes.standard.Rectangle({
    id: id,
    size: {
      width: 130,
      height: 35
    },
    attrs: {
      label: {
        fontSize: 15,
        fontFamily: "sans-serif",
        fill: "black",
        stroke: "#333333",
        paintOrder: "stroke",
        type: 'TextBlock',
        text: name,
        cursor: "grab",
        "text-anchor":"start",
      },
      body: {
        strokeWidth: 2,
        fill: "#C8CDDA",
        cursor: "grab",
        'rx': 10, // Border radius
        'ry': 10, // Border radius
      },
    },
    ports:{
      id: "Reset",
      items: []
    }
  });
  node.position(50, 60)
  node.attr('root/title', 'Reset Button')
  return node
}




//Creates The ports on the Elements
function createPort(id, name, x, y, color) {
if(x && y){
  var port = {
    id: id,
    label: {
      position:{
        name:'right'
      },
      text: name,
      markup: [{
        tagName: 'text',
            selector: 'label'
        }]
    },
    args: {
      x: x,
      y:y
    },
    attrs: {
        portBody: {
            width:0,
            height: 5,
            fill: color
        },
    },
    markup: [{
        tagName: 'rect',
        selector: 'portBody'
    }],
  };
  return port
}else{
  var port = {
    id: id,
    label: {
      text: name,
      markup: [{
        tagName: 'text',
            selector: 'label'
        }]
    },
    attrs: {
        portBody: {
            width: 0,
            height: 0,
            fill:  '#03071E'
        },
    },
    markup: [{
        tagName: 'rect',
        selector: 'portBody'
    }],
  };
  return port
  }
}




