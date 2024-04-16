/*
This function takes the nodes and links it
* Create and add node for the JointJS graph and link it to its parent
* @param {Object} childNode - an object in the JSON-LD graph
* @param {Object[]} arr - the list of elements in the JointJS graph
* @param {Object} parentNode - the parent object in the JSON-LD graph
* @param {string} typeOfNode - the name of the type of node we are linking
* @return the newly created node
*/
function linkNodes(childNode, arr, parentNode, typeOfNode){
  if(typeOfNode == "Stages"){
    var stage = createStage(childNode['@id'], childNode['name'])
    stage.prop('name/first', "Stages")
    arr.push(stage)
    return stage;
  }
  if(typeOfNode == "Topics"){
    var topicElement = createTopics(childNode['@id'], childNode['name'])
    topicElement.prop('name/first', "Topics")
    var linkStageToTopics = makeLink(parentNode, topicElement)
    arr.push(topicElement, linkStageToTopics)
    return topicElement;
  }
  if(typeOfNode == "Outcomes"){
    var outcomeElement = createOutcomes(childNode['@id'], childNode['name'])
    outcomeElement.prop('name/first', "Outcomes")
    var linkTopicToOutcome = makeLink(parentNode, outcomeElement)
    arr.push(outcomeElement, linkTopicToOutcome)
    return outcomeElement;
  }
  if(typeOfNode == "Activities"){
    var activityElement;
    if(createdActivityElementIds.has(childNode['@id'])){
      console.warn(`Element with ID '${childNode['name']}' already exists. Skipping creation.`);
      if(multiParentElementIds[childNode['@id']]){
        activityElement = multiParentElementIds[childNode['@id']];
        activityElement.prop('name/first', "Activities")
        var linkOutcomeToActivity = makeLink(parentNode, activityElement)
        arr.push(activityElement, linkOutcomeToActivity)
      }
    }else{
      activityElement = createActivities(childNode['@id'], childNode['name'])
      activityElement.prop('name/first', "Activities")
      const portNameList = ['Participants', 'Methods', "Roles", "Resources", "Outputs", "RDaF Subtopic", "Considerations"]
      const buttonview = buttonView(portNameList, activityElement)
      var elementBBox = activityElement.getBBox()
      createdActivityElementIds.add(childNode['@id']);
      multiParentElementIds[childNode['@id']] = activityElement
      var linkOutcomeToActivity = makeLink(parentNode, activityElement)
      buttonview.tools[6].options.x = "85%"
      buttonview.tools[6].options.y = "85%"
      buttonview.tools[6].options.x = parseInt(elementBBox.x) + parseInt(elementBBox.width) - 115
      arr.push(activityElement, linkOutcomeToActivity)
    }
    return activityElement;
  }
  if(typeOfNode == "Considerations"){
    var considerationElement
    if (createdConsidearitonElementIds.has(childNode['@id'])) {
      if(multiParentElementIds[childNode['@id']]){
        considerationElement = multiParentElementIds[childNode['@id']];
        considerationElement.prop('name/first', "Considerations")
        var linkOutcomeToConsideration = makeLink(parentNode, considerationElement)
        arr.push(considerationElement, linkOutcomeToConsideration)
      }
    }else{
      considerationElement = createConsiderations(childNode['@id'], childNode['name'])
      considerationElement.prop('name/first', "Considerations")
      const embedButton = buttonView("Definition", considerationElement)
      createTextBlock(considerationElement, childNode['@id'], parentNode)
      createdConsidearitonElementIds.add(childNode['@id'])
      multiParentElementIds[childNode['@id']] = considerationElement
      var linkOutcomeToConsideration = makeLink(parentNode, considerationElement)
      arr.push(considerationElement, linkOutcomeToConsideration)
    }
    return considerationElement;
  }
  if(typeOfNode == "Subtopic"){
    var id = childNode['@id'];
    var parts = id.split("/");
    var category = parts[parts.length - 1];
    let description;
    if(childNode['name'] == undefined){
      description = category + ": " + childNode['description']
    }else if(childNode['description'] == undefined){
      description = category + ": " + childNode['name']
    }else{
      description = category + ": " + childNode['name'] + ": " + childNode['description']
    }
    return description
  }

  if(typeOfNode == "Outputs"){
    var outputElement;
    if(createdActivityTargets.has(childNode['@id'])){
      //console.warn(`Element with ID '${childNode['name']}' already exists. Skipping creation.`);
      if(multiParentElementIds[childNode['@id']]){
        outputElement = multiParentElementIds[childNode['@id']];
        outputElement.prop('name/first', "Outputs")
        var linkOutputToActivity = makeLink(parentNode, outputElement)
        arr.push(linkOutputToActivity)
      }
    }else{
      outputElement = createOutputs(childNode['@id'], childNode['name'])
      createdActivityTargets.add(childNode['@id'])
      multiParentElementIds[childNode['@id']] = outputElement
      outputElement.prop('name/first', "Outputs")
      var linkOutputToActivity = makeLink(parentNode, outputElement)
      createTextBlock(outputElement, childNode['@id'], parentNode)
      arr.push(outputElement, linkOutputToActivity)
    }
    return outputElement;
  }
  if(typeOfNode == "Methods"){
    let methodElement;
    if(createdActivityTargets.has(childNode['@id'])){
      //console.warn(`Element with ID '${childNode['name']}' already exists. Skipping creation.`);
      if(multiParentElementIds[childNode['@id']]){
        methodElement = multiParentElementIds[childNode['@id']];
        methodElement.prop('name/first', "Methods")
        var linkMethodToActivity = makeLink(parentNode, methodElement)
        arr.push(linkMethodToActivity)
      }
    }else{
      methodElement = createMethods(childNode['@id'], childNode['name'])
      methodElement.prop('name/first', "Methods")
      var linkMethodToActivity = makeLink(parentNode, methodElement)
      createdActivityTargets.add(childNode['@id'])
      multiParentElementIds[childNode['@id']] = methodElement
      createTextBlock(methodElement, childNode['@id'], parentNode)
      arr.push(methodElement, linkMethodToActivity)
    }
    return methodElement;
  }
  if(typeOfNode == "Participants"){
    let participantElement;
    if(createdActivityTargets.has(childNode['@id'])){
      //console.warn(`Element with ID '${childNode['name']}' already exists. Skipping creation.`);
      if((multiParentElementIds[childNode['@id']])){
        participantElement = multiParentElementIds[childNode['@id']];
        participantElement.prop('name/first', "Participants")
        var linkParticipantToActivity = makeLink(parentNode, participantElement)
        arr.push(participantElement,linkParticipantToActivity)
      }
    }else{
      participantElement = createParticipants(childNode['@id'], childNode['name'])
      participantElement.prop('name/first', "Participants")
      var linkParticipantToActivity = makeLink(parentNode, participantElement)
      createdActivityTargets.add(childNode['@id'])
      multiParentElementIds[childNode['@id']] = participantElement
      createTextBlock(participantElement, childNode['@id'], parentNode)
      arr.push(participantElement, linkParticipantToActivity)
    }
    return participantElement;
  }
  if(typeOfNode == "Roles"){
    let roleElement;
    if(createdActivityTargets.has(childNode['@id'])){
      //console.warn(`Element with ID '${childNode['name']}' already exists. Skipping creation.`);
      if((multiParentElementIds[childNode['@id']])){
        roleElement =  multiParentElementIds[childNode['@id']];
        createTextBlock(roleElement, childNode['@id'], parentNode)
        roleElement.prop('name/first', "Roles")
        var linkRoleToActivity = makeLink(parentNode, roleElement)
        arr.push(linkRoleToActivity)
      }
    }else{
      roleElement = createRoles(childNode['@id'], childNode['name'])
      roleElement.prop('name/first', "Roles")
      createTextBlock(roleElement, childNode['@id'], parentNode)
      createdActivityTargets.add(childNode['@id'])
      multiParentElementIds[childNode['@id']] = roleElement
      var linkRoleToActivity = makeLink(parentNode, roleElement)
      arr.push(roleElement, linkRoleToActivity)
    }
    return roleElement;
  }
  if(typeOfNode == "Resources"){
    let resourceElement;
    if(createdActivityTargets.has(childNode['@id'])){
      //console.warn(`Element with ID '${childNode['name']}' already exists. Skipping creation.`);
      if((multiParentElementIds[childNode['@id']])){
        resourceElement =  multiParentElementIds[childNode['@id']];
        resourceElement.prop('name/first', "Resources")
        var linkResourceToActivity = makeLink(parentNode, resourceElement)
        arr.push(linkResourceToActivity)
      }
    }else{
      resourceElement = createResources(childNode['@id'], childNode['name'])
      createdActivityTargets.add(childNode['@id'])
      multiParentElementIds[childNode['@id']] = resourceElement
      resourceElement.prop('name/first', "Resources")
      resourceElement.prop('resource/Link', childNode['@id'])
      var linkResourceToActivity = makeLink(parentNode, resourceElement)
      createTextBlock(resourceElement, childNode['@id'], parentNode)
      arr.push(resourceElement, linkResourceToActivity)
    }
    return resourceElement;
  }
}