/*
    CIRCLE BUTTON
*/
function radioButton(port, index, name){
  if(name == "Not Started"){
    var space = 100
    var buttonWidth = (index - 300) / 2
  }else if(name == "In Progress"){
    var space = 200
    var buttonWidth = (index - 300) / 2
  }else{
    var space = 300
    var buttonWidth = (index - 300) / 2
  }

    var button  = new joint.elementTools.Button({
      markup: [
        {
          tagName: 'circle',
          attributes: {
            'id': port.id,
            'r': 10,
            'fill': 'white', // Button background color
            'stroke': 'black', // Button border color
            'stroke-width': 2, // Button border width
            'cursor': 'pointer',
          }
        },
        {
          tagName: 'text',
          selector: 'label',
          textContent: name, // Text displayed on the button
          attributes: {
            'fill': 'black', // Text color
            'font-size': '15px',
            'font-family': 'Arial',
            'text-anchor': 'middle',
            'x':-45,
            'y': -10, // Adjust text position
            'cursor': 'pointer',
          }
          },
      ],
      x:buttonWidth + space, // Set position based on index
      y: 80 , // Adjust y position based on index
      offset: { x: -8, y: -8 },
      action: function(evt, elementView) {
        radioButtonEvents(elementView, port)
      },
    });
    return button;
}


//This function takes in a list of ports that are to be embeded into the element,
//Make sure the port Ids of the ports are always different
//Creates a set of 3 circle buttons that are required in the Activities
function radioButtonView(portNameList, element, tools){
  var port1 = createPort(portNameList[0], 'out');
  var port2 = createPort(portNameList[1],'out');
  var port3 = createPort(portNameList[2], 'out');
  element.addPort(port1)
  element.addPort(port2)
  element.addPort(port3)
  tools.push(radioButton(port1, element.size().width, 'Not Started'))
  tools.push(radioButton(port2, element.size().width, 'In Progress'))
  tools.push(radioButton(port3, element.size().width, "Achieved"))
}
var i = 0
/*
  BUTTONS VIEW: Adds the button to the tools View
*/
function buttonView(portName, element){
  // Add custom tool buttons for each port
  var tool = [];
  //Create the Button
  if(portName == "Considerations"){
    var considerationPort = createPort("Considerations", "Port 4", "100%", "60%")
    element.addPort(considerationPort)
    const button = createConsiderationButton(port)
    tool.push(button)
  }if(portName == "Activities"){
    var elementBBox = element.getBBox()
    var subTopicPort = createPort("RDaF Subtopic", 'Port 5')
    var downloadPort = createPort("Download", 'Port 6')
    var resetPort = createPort("Reset Score", "Port 7")
    var ActivitiesPort = createPort("Activities", 'Port 3', parseInt(elementBBox.x) + parseInt(elementBBox.width) + 115, "30%");
    var considerationPort = createPort("Considerations", "Port 4", parseInt(elementBBox.x) + parseInt(elementBBox.width) + 115, "60%")
    element.addPort(ActivitiesPort);
    element.addPort(considerationPort)
    element.addPort(subTopicPort)
    element.addPort(downloadPort);
    element.addPort(resetPort)
    const considerationbutton = createConsiderationButton(considerationPort)
    const activitiesbutton = createButton(ActivitiesPort)
    const subTopicButton = createSubTopicButton(subTopicPort)
    const downloadButton = createDownloadButton(downloadPort)
    const resetButton = createResetButton(resetPort)
    console.log()
    downloadButton.options.x = parseInt(subTopicButton.options.markup[0].attributes.width + 5)
    resetButton.options.x = parseInt(subTopicButton.options.markup[0].attributes.width + downloadButton.options.markup[0].attributes.width + 10)
    tool.push(considerationbutton)
    tool.push(activitiesbutton)
    tool.push(downloadButton)
    tool.push(resetButton)
    //Push the circle buttons to the same list
    var portNameList = ['NT1', "PG1", "AC1"]
    tool.push(radioButtonView(portNameList, element, tool))
    tool.push(subTopicButton)
  }
  if(portName == "Outcomes"){
    var port = createPort(portName, 'Port 3', "100%", "0");
    element.addPort(port);
    const outcomebutton = createButton(port)
    tool.push(outcomebutton)
  }
  if(portName == "Definition"){
    var port = createPort(portName, 'Port 3');
    element.addPort(port);
    tool.push(createDefinitionButton(port))
  }
  if(Array.isArray(portName)){
    portName.forEach(ports =>{
      var elementBBox = element.getBBox()
      if(ports == "Participants"){
        var port1 = createPort(ports, "Port3", "100%", 64);
        element.addPort(port1)
        const participantButton = createParticipantsButton(port1)
        participantButton.options.x = parseInt(elementBBox.x) + parseInt(elementBBox.width) - 115
        tool.push(participantButton)
      }
      if(ports == "Roles"){
        var port1 = createPort(ports, "Port3","100%", 42);
        element.addPort(port1)
        const rolesButton = createRolesButton(port1)
        rolesButton.options.x = parseInt(elementBBox.x) + parseInt(elementBBox.width) - 115
        tool.push(rolesButton)
      }
      if(ports == "Methods"){
        var port1 = createPort(ports, "Port3", "100%", 20);
        element.addPort(port1)
        const methodButton = createMethodButton(port1)
        methodButton.options.x = parseInt(elementBBox.x) + parseInt(elementBBox.width) - 115
        tool.push(methodButton)
      }
      if(ports == "Resources"){
        var port1 = createPort(ports, "Port3", "100%", 87);
        element.addPort(port1)
        const resourceButton = createResourcesButton(port1)
        resourceButton.options.x = parseInt(elementBBox.x) + parseInt(elementBBox.width) - 115
        tool.push(resourceButton)
      }
      if(ports == "Outputs"){
        var port1 = createPort(ports, "Port3", "100%", 112);
        element.addPort(port1)
        const outputButton = createOutputButton(port1)
        outputButton.options.x = parseInt(elementBBox.x) + parseInt(elementBBox.width) - 115
        tool.push(outputButton)
      }
      if(ports == "RDaF Subtopic"){
        var port1 = createPort(ports, "Port3");
        element.addPort(port1)
        tool.push(createSubTopicButton(port1))
      }
      if(ports == "Considerations"){
        var port1 = createPort(ports, "Port3", "100%", 137);
        element.addPort(port1)
        const considerationButton = createConsiderationButton(port1)
        considerationButton.options.x = parseInt(elementBBox.x) + parseInt(elementBBox.width) - 115
        tool.push(considerationButton)
      }
    })
  }
  var toolsView = createElementView(element, tool)
  return toolsView
}

function createElementView(element, tool){
  //Add the element to the graph
  graph.addCells(element);
  toolsView = new joint.dia.ToolsView({ tools: tool});
  //Create an element view
  var elementView = element.findView(paper)
  //Embed tthe tools view in to the element view
  elementView.addTools(toolsView);
  return toolsView
}




/*
    CONSIDERATION BUTTON
*/
function createConsiderationButton(port,pos) {
    var button  = new joint.elementTools.Button({
      markup: [
        {
          tagName: 'rect',
          selector: 'button',
          attributes: {
              'id': port.id,
              'width': 115,
              'height': 20,
              'fill': '#005C90', // Button background color
              'stroke': 'black', // Button border color
              'stroke-width': 2, // Button border width
              'cursor': 'pointer',
              'rx': 4, // Horizontal border radius
              'ry': 4, // Vertical border radius
          }
        },
          {
            tagName: 'text',
            selector: 'text',
            textContent: port.id, // Text displayed on the button
            attributes: {
              'fill': 'white', // Text color
              'font-size': '15px',
              'font-family': 'Arial',
              'font-weight':'bold',
              'text-anchor': 'middle',
              'x':56,
              'y': 15, // Adjust text position
              'cursor': 'pointer'
          }
        }
      ],
      x: "100%", // Button position X
      y: "50%", // Button position Y
      //ffset: { x: -8, y: -8 },
      action: function(evt,elementView) {
        //Event Handle for the button.
        toggelButton(this.model, `${port.id}`)
      },
    });
    return button;
}

function createSubTopicButton(port, pos){
  var button  = new joint.elementTools.Button({
    markup: [
      {
        tagName: 'rect',
        selector: 'button',
        attributes: {
            'id': port.id,
            'width': 105,
            'height': 20,
            'fill': 'whitesmoke', // Button background color
            'stroke': 'black', // Button border color
            'stroke-width': 2, // Button border width
            'cursor': 'pointer',
            'rx': 4, // Horizontal border radius
            'ry': 4, // Vertical border radius
        }
      },
        {
          tagName: 'text',
          selector: 'text',
          textContent: port.id, // Text displayed on the button
          attributes: {
            'fill': 'black', // Text color
            'font-size': '14px',
            'font-weight': 'bold',
            'font-family': 'Arial',
            'text-anchor': 'middle',
            'x':52,
            'y': 15, // Adjust text position
            'cursor': 'pointer'
        }
      }
    ],
    x: "0%", // Button position X
    y: "0%", // Button position Y
    offset: { x: -8, y: -8 },
    action: function(evt,elementView) {
      //Event Handle for the button.
    },
  });
  return button;
}


function createDownloadButton(port, pos){
  var button  = new joint.elementTools.Button({
    markup: [
      {
        tagName: 'rect',
        selector: 'button',
        attributes: {
            'id': port.id,
            'width': 90,
            'height': 20,
            'fill': 'whitesmoke', // Button background color
            'stroke': 'black', // Button border color
            'stroke-width': 2, // Button border width
            'cursor': 'pointer',
            'rx': 4, // Horizontal border radius
            'ry': 4, // Vertical border radius
        }
      },
        {
          tagName: 'text',
          selector: 'text',
          textContent: port.id, // Text displayed on the button
          attributes: {
            'fill': 'black', // Text color
            'font-size': '15px',
            'font-weight': 'bold',
            'font-family': 'Arial',
            'text-anchor': 'middle',
            'x':45,
            'y': 15, // Adjust text position
            'cursor': 'pointer'
        }
      }
    ],
    x: "20%", // Button position X
    y: "0%", // Button position Y
    offset: { x: -8, y: -8 },
    action: function(evt,elementView) {
      //Event Handle for the button.
      evt.stopPropagation()
      evt.preventDefault()
      toggelButton(this.model, `${port.id}`)
    },
  });
  return button;
}

function createResetButton(port, pos){
  var button  = new joint.elementTools.Button({
    markup: [
      {
        tagName: 'rect',
        selector: 'button',
        attributes: {
            'id': port.id,
            'width': 90,
            'height': 20,
            'fill': 'whitesmoke', // Button background color
            'stroke': 'black', // Button border color
            'stroke-width': 2, // Button border width
            'cursor': 'pointer',
            'rx': 4, // Horizontal border radius
            'ry': 4, // Vertical border radius
        }
      },
        {
          tagName: 'text',
          selector: 'text',
          textContent: port.id, // Text displayed on the button
          attributes: {
            'fill': 'black', // Text color
            'font-size': '15px',
            'font-weight': 'bold',
            'font-family': 'Arial',
            'text-anchor': 'middle',
            'x':45,
            'y': 15, // Adjust text position
            'cursor': 'pointer'
        }
      }
    ],
    x: "20%", // Button position X
    y: "0%", // Button position Y
    offset: { x: -8, y: -8 },
    action: function(evt,elementView) {
      //Event Handle for the button.
      evt.stopPropagation()
      evt.preventDefault()
      toggelButton(this.model, `${port.id}`)
    },
  });
  return button;
}




/*
    GENERIC BUTTONS
*/
function createButton(port,pos) {
  var button  = new joint.elementTools.Button({
    markup: [
      {
        tagName: 'rect',
        selector: 'button',
        attributes: {
          'id': port.id,
          'width': 115,
          'height': 20,
          'fill': '#005C90', // Button background color
          'stroke': 'black', // Button border color
          'stroke-width': 2, // Button border width
          'cursor': 'pointer',
          'rx': 4, // Horizontal border radius
          'ry': 4, // Vertical border radius
        }
      },
      {
          tagName: 'text',
          selector: 'text',
          textContent: port.id, // Text displayed on the button
          attributes: {
            'font-weight':'bold',
            'fill': 'white', // Text color
            'font-size': '15px',
            'font-family': 'Arial',
            'text-anchor': 'middle',
            'x': 55,
            'y': 15, // Adjust text position
            'cursor': 'pointer'
          }
      }
    ],
    x: "100%", // Button position X
    y: "20%", // Button position Y
    action: function(evt, elementView) {
      evt.stopPropagation()
      evt.preventDefault()
      toggelButton(this.model, `${port.id}`)
    },
  });
  return button;
}


function createDefinitionButton(port,pos) {
  var button  = new joint.elementTools.Button({
    markup: [
      {
        tagName: 'rect',
        selector: 'button',
        attributes: {
            'id': port.id,
            'width': 70,
            'height': 20,
            'fill': 'black', // Button background color
            'stroke': 'black', // Button border color
            'stroke-width': 2, // Button border width
            'cursor': 'pointer',
            'rx': 4, // Horizontal border radius
            'ry': 4, // Vertical border radius
        }
      },
        {
          tagName: 'text',
          selector: 'text',
          textContent: port.id, // Text displayed on the button
          attributes: {
            'font-weight':'bold',
            'fill': 'black', // Text color
            'font-size': '15px',
            'font-family': 'Arial',
            'text-anchor': 'middle',
            'fill': 'white',
            'x':35,
            'y': 15, // Adjust text position
            'cursor': 'pointer'
        }
      }
    ],
    x: "80%", // Button position X
    y: "45%", // Button position Y
    offset: { x: -8, y: -8 },
    action: function(evt,elementView) {
      //Event Handler for the button.
    },
  });
  return button;
}

function createMethodButton(port,pos) {
  var button  = new joint.elementTools.Button({
    markup: [
        {
          tagName: 'rect',
          selector: 'button',
          attributes: {
            'id': port.id,
            'width': 115,
            'height': 20,
            'fill': '#04C3D6', // Button background color
            'stroke': 'black', // Button border color
            'stroke-width': 2, // Button border width
            'cursor': 'pointer',
            'rx': 4, // Horizontal border radius
            'ry': 4, // Vertical border radius
        }
      },
      {
          tagName: 'text',
          selector: 'text',
          textContent: port.id, // Text displayed on the button
          attributes: {
          'font-weight':'bold',
            'fill': 'black', // Text color
            'font-size': '15px',
            'font-family': 'Arial',
            'text-anchor': 'middle',
            'x': 55,
            'y': 15, // Adjust text position
            'cursor': 'pointer'
        }
      }
    ],
    x: "85%", // Button position X
    y: "5%", // Button position Y
    action: function(evt, elementView) {
      toggelButton(this.model, `${port.id}`)
    },
  });
  return button;
}

function createRolesButton(port,pos) {
  var button  = new joint.elementTools.Button({
    markup: [
        {
            tagName: 'rect',
            selector: 'button',
            attributes: {
                'id': port.id,
                'width': 115,
                'height': 20,
                'fill': '#09BD00', // Button background color
                'stroke': 'black', // Button border color
                'stroke-width': 2, // Button border width
                'cursor': 'pointer',
                'rx': 4, // Horizontal border radius
                'ry': 4, // Vertical border radius
            }
        },
        {
            tagName: 'text',
            selector: 'text',
            textContent: port.id, // Text displayed on the button
            attributes: {
              'font-weight':'bold',
              'fill': 'black', // Text color
              'font-size': '15px',
              'font-family': 'Arial',
              'text-anchor': 'middle',
              'x': 55,
              'y': 15, // Adjust text position
              'cursor': 'pointer'
            }
        }
    ],
    x: "85%", // Button position X
    y: "20%", // Button position Y
    action: function(evt, elementView) {
      toggelButton(this.model, `${port.id}`)
    },
  });
  return button;
}

function createParticipantsButton(port,pos) {
  var button  = new joint.elementTools.Button({
    markup: [
        {
            tagName: 'rect',
            selector: 'button',
            attributes: {
                'id': port.id,
                'width': 115,
                'height': 20,
                'fill': '#B70316', // Button background color
                'stroke': 'black', // Button border color
                'stroke-width': 2, // Button border width
                'cursor': 'pointer',
                'rx': 4, // Horizontal border radius
                'ry': 4, // Vertical border radius
            }
        },
        {
            tagName: 'text',
            selector: 'text',
            textContent: port.id, // Text displayed on the button
            attributes: {
              'font-weight':'bold',
              'fill': 'white', // Text color
              'font-size': '15px',
              'font-family': 'Arial',
              'text-anchor': 'middle',
              'x': 55,
              'y': 15, // Adjust text position
              'cursor': 'pointer'
            }
        }
    ],
    x: "85%", // Button position X
    y: "37%", // Button position Y
    action: function(evt, elementView) {
      toggelButton(this.model, `${port.id}`)
    },
  });
  return button;
}

function createOutputButton(port,pos) {
  var button  = new joint.elementTools.Button({
    markup: [
        {
            tagName: 'rect',
            selector: 'button',
            attributes: {
                'id': port.id,
                'width': 115,
                'height': 20,
                'fill': '#0013FF', // Button background color
                'stroke': 'black', // Button border color
                'stroke-width': 2, // Button border width
                'cursor': 'pointer',
                'rx': 4, // Horizontal border radius
                'ry': 4, // Vertical border radius
            }
        },
        {
            tagName: 'text',
            selector: 'text',
            textContent: port.id, // Text displayed on the button
            attributes: {
              'font-weight':'bold',
              'fill': 'white', // Text color
              'font-size': '15px',
              'font-family': 'Arial',
              'text-anchor': 'middle',
              'x': 55,
              'y': 15, // Adjust text position
              'cursor': 'pointer'
            }
        }
    ],
    x: "85%", // Button position X
    y: "70%", // Button position Y
    action: function(evt, elementView) {
      toggelButton(this.model, `${port.id}`)
    },
  });
  return button;
}


function createResourcesButton(port,pos) {
  var button  = new joint.elementTools.Button({
    markup: [
        {
            tagName: 'rect',
            selector: 'button',
            attributes: {
                'id': port.id,
                'width': 115,
                'height': 20,
                'fill': '#B6BF30', // Button background color
                'stroke': 'black', // Button border color
                'stroke-width': 2, // Button border width
                'cursor': 'pointer',
                'rx': 4, // Horizontal border radius
                'ry': 4, // Vertical border radius
            }
        },
        {
            tagName: 'text',
            selector: 'text',
            textContent: port.id, // Text displayed on the button
            attributes: {
              'font-weight':'bold',
              'fill': 'black', // Text color
              'font-size': '15px',
              'font-family': 'Arial',
              'text-anchor': 'middle',
              'x': 55,
              'y': 15, // Adjust text position
              'cursor': 'pointer'
            }
        }
    ],
    x: "85%", // Button position X
    y: "53%", // Button position Y
    action: function(evt, elementView) {
      toggelButton(this.model, `${port.id}`)
    },
  });
  return button;
}