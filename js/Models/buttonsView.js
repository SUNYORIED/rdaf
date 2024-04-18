/*
    *  This function takes in a list of ports that are to be embeded into the element, In progress, Not Started, and Acheived buttons are created.
    *  @param - {Object []}: portNameList, List of ports that are to be added to the element.
    *  @param - {Object}: element, Element to which the buttons are to be added.
    *  @param - {Object []}: tools, This array is used to store the buttons.
*/
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


/*
    * This function is used to embed the buttons in the element.
    * @param - {Object}: portName, Takes the name of the buttons.
    * @param - {Object}: element, Element to which the button is to be added.
*/
function buttonView(portName, element){
// Add custom tool buttons for each port
    var tool = [];
//Create the Button
    if(portName == "Activities"){
        var elementBBox = element.getBBox()
        var subTopicPort = createPort("RDaF Subtopic", 'Port 5')
        var ActivitiesPort = createPort("Activities", 'Port 3', parseInt(elementBBox.x) + parseInt(elementBBox.width) + 115, "30%");
        var considerationPort = createPort("Considerations", "Port 4", parseInt(elementBBox.x) + parseInt(elementBBox.width) + 115, "60%")
        element.addPort(ActivitiesPort);
        element.addPort(considerationPort)
        element.addPort(subTopicPort)
        const considerationbutton = createConsiderationButton(considerationPort)
        const activitiesbutton = createButton(ActivitiesPort)
        const subTopicButton = createSubTopicButton(subTopicPort)
        console.log()
        tool.push(considerationbutton)
        tool.push(activitiesbutton)
        //Push the circle buttons to the same list
        var portNameList = ['NT1', "PG1", "AC1"]
        tool.push(radioButtonView(portNameList, element, tool))
        tool.push(subTopicButton)
    }
    if(portName == "Definition"){
        var elementBBox = element.getBBox()
        var port = createPort(portName, 'Port 3');
        element.addPort(port);
        const definitionButton = createDefinitionButton(port)
        definitionButton.options.x = parseInt(elementBBox.x) + parseInt(elementBBox.width) - 70
        tool.push(definitionButton)
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

/*
    * This function is used to create the tools view inside the element view of the element.
    * @param - {Object}: element, Element to which the tools view is added.
    * @param - {Object []}: tool, This array is used to retrive the buttons that are to be added to the tools view.s
*/
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
