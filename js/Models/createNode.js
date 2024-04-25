
var PORT_WIDTH = 90;
const PORT_HEIGHT = 20;
const PORT_GAP = 20;

/*
  * This function creates a link two elements.
  * @param {Object} from, Joint JS element, source element.
  * @param {Object} to, Joint JS element, target element.
  * @Return the link between the source and target.
*/
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
      root:{
        title:"Link from " + from.prop('name/first') + " to " + to.prop('name/first')
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


/*
  * This function used to create the stage elements.
  * @param {Object} id, Identifier for the element.
  * @param {Object} name, label for the element.
  * @Return the Joint JS element.
*/
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

/*
  * This function used to create the Topic element.
  * @param {Object} id, Identifier for the element.
  * @param {Object} name, label for the element.
  * @Return the Joint JS element.
*/
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
  node.attr('root/title', "Topic")
  return node;
}

/*
  * This function used to create the Consideration element.
  * @param {Object} id, Identifier for the element.
  * @param {Object} name, label for the element.
  * @Return the Joint JS element.
*/
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
  node.attr('root/title', "Consideration")
  return node
}



/*
  * This function used to create the Outcome element.
  * @param {Object} id, Identifier for the element.
  * @param {Object} name, label for the element.
  * @Return the Joint JS element.
*/
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
  node.attr('root/title', "Outcomes")

  return node;
}


/*
  * This function used to create the Activity element.
  * @param {Object} id, Identifier for the element.
  * @param {Object} name, label for the element.
  * @Return the Joint JS element.
*/
function createActivities(id, name){
  const textWidth = name.length * 10; // Approximate width based on font size and average character width
  var width = Math.max(textWidth, 200); // Ensure a minimum width to accommodate shorter text
  if(width > 700){
    width = 800
    if(name.length > 60){
      for(var i = 0; i < name.length; i++){
        if(i > 50){
          if(name.charAt(i) == " "){
            var newName = name.slice(0, i) + '\n' + name.slice(i + 1);
            name = newName
            i = name.length + 1
          }
        }
      }
    }
  }else{
    width = (name.length * 10) + 170
  }
  const node =  new joint.shapes.standard.Rectangle({
      id: id,
      size: {
        width: width,
        height: 145
      },
      attrs: {
        label: {
        fontWeight: "bold",
        fontSize: 20,
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
        cursor: "pointer",
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
  node.attr('root/title', "Activity")
  return node
}


/*
  * This function used to create the Output element.
  * @param {Object} id, Identifier for the element.
  * @param {Object} name, label for the element.
  * @Return the Joint JS element.
*/
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
  node.attr('root/title', "Output")
  return node
}

/*
  * This function used to create the Participant element.
  * @param {Object} id, Identifier for the element.
  * @param {Object} name, label for the element.
  * @Return the Joint JS element.
*/
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
  node.attr('root/title', "Participant")
  return node
}


/*
  * This function used to create the Role element.
  * @param {Object} id, Identifier for the element.
  * @param {Object} name, label for the element.
  * @Return the Joint JS element.
*/
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
  node.attr('root/title', "Role")
  return node
}


/*
  * This function used to create the Method element.
  * @param {Object} id, Identifier for the element.
  * @param {Object} name, label for the element.
  * @Return the Joint JS element.
*/
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
  node.attr('root/title', "Method")
  return node
}


/*
  * This function used to create the Resource element.
  * @param {Object} id, Identifier for the element.
  * @param {Object} name, label for the element.
  * @Return the Joint JS element.
*/
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
  node.attr('root/title', "Resource")
  return node
}


/*
  * This function used to create the Download element, but it is used as a button.
  * @param {Object} id, Identifier for the element.
  * @param {Object} name, label for the element.
  * @Return the Joint JS element.
*/
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
  node.attr('root/title', 'Exports the scorecard as a CSV file with the following columns:\nStage ID, Stage Name, Topic ID, Topic Name, Subtopic ID,\nSubtopic Name, Outcome ID, Outcome Name, Score, Date of Download')
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
  node.attr('root/title', "Resets the Score on Outcomes")
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




