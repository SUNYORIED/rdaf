const { dia, elementTools, shapes, linkTools, util } = joint;
var graph;
var paper;
var root = [];
var models = [];
var duplicateFrame = [];
var createdConsidearitonElementIds = new Set();   //This set stores all the multi linked consideration element in which the definition button is already embedded, to prevent dup ids
var createdActivityElementIds = new Set();
var multiParentElementIds = {}
var createdActivityTargets = new Set();
var elementsAlreadyPositioned = new Set();
var scorecard = {}
var downloadButton;
var resetButton;
var errorBlock;
var resetErrorBlock;
var successButton;

//initialize
init();

function lastModifiedDate(){
  fetch('./data/json-ld/lastModified.json')
  .then(response => response.json())
  .then(data => {
    dateP = document.getElementById('last-modified-date')
    dateP.textContent = `Last Modified:${data['Last Modified Date']}`
    console.log(data['Last Modified Date']); // Access the parsed JSON data here
  })
  .catch(error => {
    console.error('Error:', error);
  });
}
lastModifiedDate()

function buildTheGraph(){
  var Elements = []
    fetch('./data/json-ld/graph.jsonld')
  .then(response => response.json())
   // specifying a frame allows you to set the shape of the graph you want to navigate
  .then(data => jsonld.frame(data,
    {
      "@context": {
          "name": "https://schema.org/name",
          "additionalType": "https://schema.org/additionalType",
          "description": "https://schema.org/description",
          "sunyrdaf": "https://data.suny.edu/vocabs/oried/rdaf/suny/",
          "sunyrdaf:includes": {
              "@type": "@id"
          },
          "sunyrdaf:resultsFrom": {
              "@type": "@id"
          },
          "sunyrdaf:generates": {
            "@type": "@id"
          },
          "sunyrdaf:extends": {
            "@type": "@id"
          },
          "sunyrdaf:Method":{
            "@type": "@id"
          },
          "sunyrdaf:Participant":{
            "@type": "@id"
          },
          "sunyrdaf:Activity":{
            "@type": "@id"
          },
      },
  }))
  .then(frame => {
  const frameArray = frame['@graph']
  duplicateFrame = frameArray
  createGlobalButtons()
  frameArray.forEach(node =>{
    if(node['additionalType'] == "RdAF Stage"){
      var stage = linkNodes(node, Elements, "", "Stages")
      createTextBlock(stage, node, stage)
      root.push(stage)
      topic = node['sunyrdaf:includes']
      if(Array.isArray(topic) && topic != undefined){
        topic.forEach(topicObj =>{
          var tools = [];
          if(topicObj){
            //Creates the topic
            var topicElement = linkNodes(topicObj, Elements, stage, "Topics")
            const width = topicElement.size().width
            const height = topicElement.size().height
            topicElement.size(width + 200, height)
            var topicElementPosition = topicElement.getBBox()
            Elements.push(topicElement)
            if(topicObj["sunyrdaf:includes"]){
              //Creates the consideration button if a topic includes consideration
              var port3 = createPort('Considerations', 'out', "100%", 40);
              // Add custom tool buttons for each port
              topicElement.addPort(port3);        // Adds a port to the element
              const considerationButton = createConsiderationButton(port3)
              considerationButton.options.x = parseInt(topicElementPosition.x) + parseInt(topicElementPosition.width) - 115
              tools.push(considerationButton)       //Create the button
            }
            var port2 = createPort('Outcomes', 'out', "100%", 20);
            // Add custom tool buttons for each port
            topicElement.addPort(port2);
            const outcomeButton = createButton(port2)
            outcomeButton.options.x = parseInt(topicElementPosition.x) + parseInt(topicElementPosition.width) - 115
            tools.push(outcomeButton)//Creates the Outcome button
            graph.addCells(topicElement);
            toolsView = new joint.dia.ToolsView({ tools: tools});
            topicElement.findView(paper).addTools(toolsView);
            checkOutcomes(topicObj, Elements, topicElement)
            createTextBlock(topicElement,topicObj, stage )
          }
        })
      }else{
        if(topic){
          tools = []
          var topicElement = linkNodes(topic, Elements, stage, "Topics")
          const width = topicElement.size().width
          const height = topicElement.size().height
          topicElement.size(width + 200, height)
          var topicElementPosition = topicElement.getBBox()
          var port3 = createPort('Considerations', 'out', "100%", 40);
          // Add custom tool buttons for each port
          topicElement.addPort(port3);        // Adds a port to the element
          const considerationButton = createConsiderationButton(port3)
          considerationButton.options.x = parseInt(topicElementPosition.x) + parseInt(topicElementPosition.width) - 115
          tools.push(considerationButton)       //Create the button
          var port2 = createPort('Outcomes', 'out', "100%", 20);
          // Add custom tool buttons for each port
          topicElement.addPort(port2);
          const outcomeButton = createButton(port2)
          outcomeButton.options.x = parseInt(topicElementPosition.x) + parseInt(topicElementPosition.width) - 115
          tools.push(outcomeButton)//Creates the Outcome button
          graph.addCells(topicElement);
          toolsView = new joint.dia.ToolsView({ tools: tools});
          topicElement.findView(paper).addTools(toolsView);
          checkOutcomes(topic, Elements, topicElement)
          createTextBlock(topicElement,topic, stage )
        }
      }
    }
  });
  paper.setInteractivity(false);
  graph.addCells(Elements)
  // Perform layout after setting positions
  models = Elements
  layout = doLayout();
  })
}


/*
  Creates the Download button, Reset button and Success Messsage and then adds these element, and buttons to the graph.
*/
function createGlobalButtons(){
  errorBlock =  createErrorBlock("download")
  resetErrorBlock = createResetBlock("reset")
  successButton = createSuccessButton("Download Successful")
  downloadButton = createDownloadButton("Download Scores", "Download Scores")
  downloadButton.prop('name/first', "Download Scores")
  downloadButton.attr('label').refX = "5%"
  //downloadButton.set('hidden', true)
  resetButton = createResetButton("Reset Scores", "Reset Scores")
  resetButton.prop('name/first', "Reset Scores")
  resetButton.attr('label').refX = "15%"
  graph.addCells([downloadButton, resetButton])
}


/*
  * Create and link Outcome elements
  * @param {Object} topic - the JSON-LD topic node
  * @param {Object[]} arr - list of JointJS shapes created so far
  * @param {Object} parentNode - the JointJS shape that is the parent of this topic
  * @Returns creates the outcome elements.
*/
function checkOutcomes(topic, arr, parentNode){
  //Creates all the Outcomes that are generated by the topic
  for (const key in topic){
    if(key.startsWith('sunyrdaf')){
      if(key == "sunyrdaf:generates"){
        if(Array.isArray(topic[key])){
          topic[key].forEach(outcome =>{
            const outcomeElement = linkNodes(outcome, arr, parentNode, "Outcomes")
            //Check for activities in the outcome
            checkForActivities(outcome, arr, outcomeElement)
            createTextBlock(outcomeElement, outcome, parentNode)
          })
        }else{ //Condition if the topic has generated only one outcome
          const outcomeElement = linkNodes(topic[key], arr, parentNode, "Outcomes")
          //Check for activities in the outcome
          checkForActivities(topic[key], arr, outcomeElement)
          createTextBlock(outcomeElement, topic[key], parentNode)
        }
      }else if(key == "sunyrdaf:includes"){
        //Creates consideration elements if a topic includes considerations
        checkForConsiderations(topic[key], arr, parentNode);
      }
    }
  }

}


/*
  * Create and link Consideration elements
  * @param {Object} outcome - the JSON-LD topic node
  * @param {Object[]} arr - list of JointJS shapes created so far
  * @param {Object} parentNode - the JointJS shape that is the parent of this topic
  * @Returns the consideration SVG element.
*/
function checkForConsiderations(node, arr, parentNode){

  if(Array.isArray(node)){
    //Condition to handle topics that includes multiple considerations
    node.forEach(considerations =>{
      if (considerations['name'] == undefined) {
        for (const nodes of duplicateFrame) {
            if (nodes['@id'] == considerations) {
                const considerationElement = linkNodes(nodes, arr, parentNode, "Considerations");
                createTextBlock(considerationElement, nodes, parentNode)
                if(considerationElement){
                  return considerationElement;
                }else{
                  console.error("Considerations undefined")
                }
            }
        }
      }else {
          const considerationElement = linkNodes(considerations, arr, parentNode, "Considerations");
          createTextBlock(considerationElement, considerations, parentNode)
          if(considerationElement){
            return considerationElement;
          }else{
            console.error("Considerations undefined")
          }
      }
    })
  }else{ //Condition to handle topics that includes a single considerations
    if(node['name'] == undefined){
      for (const nodes of duplicateFrame) {
          if (nodes['@id'] == node) {
              const considerationElement = linkNodes(nodes, arr, parentNode, "Considerations");
              createTextBlock(considerationElement, nodes, parentNode)
              if(considerationElement){
                return considerationElement;
              }else{
                console.error("Considerations undefined")
              }
          }
      }
    }else{
      const considerationElement = linkNodes(node, arr, parentNode, "Considerations")
      createTextBlock(considerationElement, node, parentNode)
      if(considerationElement){
        return considerationElement;
      }else{
        console.error("Considerations undefined")
      }
    }
  }
}

/*
 * Checks the target elements of an activity - Outputs, Methods, Considerations, Participants, Roles, and Resources
 * @param {Object} Outcome - the JSON-LD topic node
 * @param {Object[]} arr - list of JointJS shapes created so far
 * @param {Object} parentNode - the JointJS shape that is the parent of this topic
 */
function checkForActivities(outcome, arr, parentNode){
  const embedButton = buttonView("Activities", parentNode)
  for (const key in outcome){
    if(key.startsWith('sunyrdaf')){
      if(key == "sunyrdaf:resultsFrom"){
        if(outcome[key]['name'] == undefined){
          duplicateFrame.forEach(activity =>{
            if(activity['@id'] == outcome[key]){
              const activityElement = linkNodes(activity, arr, parentNode, "Activities")
              if(activity['sunyrdaf:extends']){
                var subTopic = checkForSubTopics(activity['sunyrdaf:extends'], arr, activityElement)
                subTopicTextBlock(subTopic, activityElement)    //Creates the textBlock for the SubTopic button in Activities
              }
              if(activity['sunyrdaf:generates']){
                checkForActivitiesTarget(activity, arr, activityElement)
              }
              if(activity['sunyrdaf:includes']){
                checkForActivitiesTarget(activity, arr, activityElement)
              }
            }
          })
        }else{
          var activity = outcome[key]
          const activityElement = linkNodes(activity, arr, parentNode, "Activities")
          if(activity['sunyrdaf:extends']){
            var subTopic = checkForSubTopics(activity['sunyrdaf:extends'], arr, parentNode)
            subTopicTextBlock(subTopic, activityElement)    //Creates the textBlock for the SubTopic button in Activities
          }
          if(activity['sunyrdaf:generates']){
            checkForActivitiesTarget(activity, arr, activityElement)
          }
          if(activity['sunyrdaf:includes']){
            checkForActivitiesTarget(activity, arr, activityElement)
          }
        }
      }else if(key == "sunyrdaf:includes"){
        const consideration = checkForConsiderations(outcome[key], arr, parentNode)
        if(consideration){
        }else{
          //Error displayed is Considerations Undefined (Just for Debugging)
        }
      }else if(key == "sunyrdaf:extends"){
        //Instead Of creating an element and a link for the subtopic, we have just used
        //the Name, description and the catalog number to define the subtopic into a textblock
        var subTopic = checkForSubTopics(outcome[key], arr, parentNode);
        if(subTopic != undefined){
          subTopicTextBlock(subTopic, parentNode)
        }
      }
    }
  }
}

/*
 * Create and link Subtopics elements
 * @param {Object} topic - the JSON-LD topic node
 * @param {Object[]} arr - list of JointJS shapes created so far
 * @param {Object} parentNode - the JointJS shape that is the parent of this topic
 * @Returns the subTopic description.
 */
function checkForSubTopics(node, arr, parentNode){
  if(node['name'] || node['description']){
    const subTopicDescription = linkNodes(node, arr, parentNode, "Subtopic")
    return subTopicDescription;
  }else {
    for (const nodes of duplicateFrame) {
      if (nodes['@id'] == node) {
        node = nodes
        const subTopicDescription = linkNodes(node, arr, parentNode, "Subtopic")
        return subTopicDescription;
      }
    }
  }
}


/*
  * This function creates the Layout of the graph.
  * Sets the position of the elements.
  * Laysout the elements from Left to Right.
  * Changes the size of the paper.
*/
function doLayout() {
  var counter = 0;
  // Apply layout using DirectedGraph plugin
  var visibleElements = []
  //Checks for the visible elements on the graph when an event occurs and adds it to the layout
  models.forEach(el =>{
    if(!el.get('hidden')){
      visibleElements.push(el)
      //This condition is set to show the download scores button when any one or more outcomes are open
      /*if(el.prop('name/first') == "Outcomes"){
        counter++;
        if(counter >= 1){
          downloadButton.set('hidden', false)
        }
      }
    }else{
      if(counter == 0){
        downloadButton.set('hidden', true)
      }*/
    }
  })
  layout = joint.layout.DirectedGraph.layout(visibleElements, {
    setVertices: false,
    rankDir: 'LR',
    marginX: 50, // Add margin to the left and right of the graph
    marginY: 0, // Add margin to the top and bottom of the graph
    resizeClusters: false,
    setPosition: (element, position) => {
      // Align elements to the left by setting their x-coordinate
      setElementsPosition(element, position)
    }
  });
  changePaperSize();
  setRootToFix();       //Sets the position of the root elements
  setLinkVertices();    //Sets the vertices that is, marks the points where the links should route from
}



function init(){
// Create a new directed graph


graph = new dia.Graph({}, { cellNamespace: shapes });

// Create a new paper, which is a wrapper around SVG element
paper = new dia.Paper({
  el: document.getElementById('graph-container'),
  model: graph,
  interactive: { vertexAdd: false }, // disable default vertexAdd interaction,
  width: window.innerWidth, //window.innerWidth,
  height: window.innerHeight,//window.innerHeight,
  gridSize: 10,
  perpendicularLinks: true,
  drawGrid: true,
  embeddingMode: true,
  background: {
    color: '#f9f9f9'
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
  async: true,
  //Viewport function supports collapsing/uncollapsing behaviour on paper
  viewport: function(view) {
    // Return true if model is not hidden
    return !view.model.get('hidden');
  }
});
  var paperElement = document.getElementById('graph-container');
  paperElement.style.border = "5px solid #000000";
  buildTheGraph();
}



