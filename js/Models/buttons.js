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
    x: "100%", // Button position X
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


function createOkayButton(port) {
  var button  = new joint.elementTools.Button({
    markup: [
        {
            tagName: 'rect',
            selector: 'button',
            attributes: {
                'id': port.id,
                'width': 100,
                'height': 30,
                'fill': '#FF9292', // Button background color
                'stroke': 'lightgrey', // Button border color
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
              'fill': '#8C0000', // Text color
              'font-size': '15px',
              'font-family': 'Arial',
              'text-anchor': 'middle',
              'x': 50,
              'y': 20, // Adjust text position
              'cursor': 'pointer',
            }
        }
    ],
    x: "25%", // Button position X
    y: "70%", // Button position Y
    action: function(evt, elementView) {
      toggelButton(this.model, `${port.id}`)
    },
  });
  return button;
}

