/*
    * Event handler for a click on an element.
    * @param - {object}: cellView, CellView of the element clicked.
*/
paper.on('element:pointerdown', function(cellView, evt) {
    const model = cellView.model
    evt.stopPropagation()
    evt.preventDefault()
    const stageType = [
        "https://data.suny.edu/entities/oried/rdaf/nist/S.1",
        "https://data.suny.edu/entities/oried/rdaf/nist/S.2",
        "https://data.suny.edu/entities/oried/rdaf/nist/S.3",
        "https://data.suny.edu/entities/oried/rdaf/nist/S.4",
        "https://data.suny.edu/entities/oried/rdaf/nist/S.5",
        "https://data.suny.edu/entities/oried/rdaf/nist/S.6"
    ]
    if(stageType.includes(model['id'])){
        toggleBranch(model);
    }
    if(model.attributes.name && model.attributes.name['first'] == 'Resources'){
        const url = model.attributes.resource['Link']
        window.open(url, '_blank')
    }
    if(model.id == "Download Scores"){
        FindOpenOutcomes()
    }
    if(model.id == "Reset Scores"){
        FindOpenOutcomesAndReset()
    }
})




/*
    * This funciton is triggred when the user clicks on button to open and close its child element.
    * @param - {Object}: element, Element on which the click is detected
*/
function toggleBranch(element) {
    if(element.isElement()){
        //retrives the value of the collapsed attribute from the root model.
        var shouldHide = element.get('collapsed');
        element.set('collapsed', !shouldHide);
        const links = openBranch(element, shouldHide)
    }
}

/*
    * This function opens the child elements of the element passed in.
    * @param - {Object}: element, JointJS element.
*/
function openBranch(element, shouldHide){
    //Finds the outgoing links to the element the user is interacting with
    const findTarget = graph.getConnectedLinks(element, {outbound:true})
    //Using each link that is connected find the target Elements and play with them
    findTarget.forEach(targetLink =>{
        //elements connected to the child, those in the 1st rank of the graph
        //Target Elements only allow access to the first connected Element of the parent.
        const element = targetLink.getTargetElement()
        if(element){
            animateElement(element, true);
            animateElement(targetLink, true)
            element.set('hidden', shouldHide)
            element.set('collapsed', !shouldHide)
            //Make the links visible
            targetLink.set('hidden', shouldHide)
            if(!element.get('collapsed')){
                //This condition closes all the nodes when the user intereacts with the parentNode
                const subElementsLinks = graph.getConnectedLinks(element, {outbound:true})
                subElementsLinks.forEach(subLinks =>{
                    subLinks.set('hidden', shouldHide)
                    subLinks.set('collapsed', false)
                });
                const successrorCells = graph.getSubgraph([
                    ...graph.getSuccessors(element),
                ])
                successrorCells.forEach(function(successor) {
                    successor.set('hidden', shouldHide);
                    successor.set('collapsed', false);
                });
            }else{
                //console.error("Element Undefined")
            }
        }
    })
    doLayout();
}


/*
    This function takes and element and routes through all of its child element and hides all the elements
    * @param - {Object}, element: Element whose child elements are to be hidden.
*/
function closeTheRest(element){
    //This condition closes all the nodes when the user intereacts with the parentNode
    const subElementsLinks = graph.getConnectedLinks(element, {outbound:true})
    const successrorCells = graph.getSubgraph([
        ...graph.getSuccessors(element),
    ])
    subElementsLinks.forEach(subLinks =>{
        if(subLinks != undefined && !subLinks.get('hidden')){
            subLinks.set('hidden', true)
            subLinks.set('collapsed', false)
            successrorCells.forEach(function(successor) {
                if(successor != undefined){
                    successor.set('hidden', true);
                    successor.set('collapsed', false);
                }else{
                    console.error("Element already closed")
                }
            });
            const graphLinks = (graph.getLinks())
            graphLinks.forEach(links =>{
                if(!links.get('hidden') && links.getTargetElement()){
                    if(links.getTargetElement().get('hidden')){
                        links.getTargetElement().set('hidden', false)
                        links.set('collapsed', true)
                    }
                }
            })
        }else{
            //console.error("Element already closed")
        }
    });
}



/*
    This function handles the event when a button is clicked. opens and hide the child nodes.
    * @param - {Object}: element, JointJS element.
    * @param - {Object}: typeOfPort, Type of element that is to be closed and opened.
*/
function toggelButton(element, typeOfPort){
    var shouldHide = element.get('collapsed');
    if(typeOfPort == "Okay"){
        const button = (element.findView(paper)._toolsView.tools[0].$el[0].querySelectorAll('rect')[0])
        button.setAttribute('fill', '#FF9292')
        element.set('hidden',true)
    }else{
        element.set('collapsed', !shouldHide);
        openAndCloseEvent(element, typeOfPort)
    }
}


/*
    * This function takes the element and the type of the port from the above function and opens and closes its child element.
    * @param - {Object}: element, JointJS element.
    * @param - {Object}: typeOfPort, Type of element that is to be closed and opened.
*/
function openAndCloseEvent(element, typeOfPort){
    if(element){ // === True
        const OutboundLinks = graph.getConnectedLinks(element, {outbound:true})
        if(Array.isArray(OutboundLinks)){
            OutboundLinks.forEach(links =>{
                var targetElement = links.getTargetElement()
                if(links && !links.get('collapsed')){                                   //Used links to check the conditions because multiple parent element exists for a single element
                    if(targetElement.prop('name/first') == typeOfPort){
                        // Animate showing the element
                        animateElement(targetElement, true);
                        animateElement(links, true)
                        targetElement.set('hidden', false)
                        targetElement.set('collapsed', true)
                        links.set('hidden', false)
                        links.set('collapsed', true)
                        if(typeOfPort == "Outcomes"){
                        //Using the html element (Activity button) to hide and show the particular button from the entire ElementView
                            var elementView = targetElement.findView(paper)
                            if(elementView.hasTools()){
                                //Query's for the Activity Button on the and hides it
                                const Actbutton = elementView._toolsView.tools[1].$el[0]
                                const ConsiderationButtton = elementView._toolsView.tools[0].$el[0]
                                Actbutton.style.visibility = "hidden"
                                ConsiderationButtton.style.visibility = "hidden"
                                const circleElement = elementView._toolsView.$el[0].querySelectorAll('circle')
                                //If the user has selected Not Started or In progress on Outcome, Below condition checks the status while opening and closing the outcome
                                circleElement.forEach(circle =>{
                                    if(circle.getAttribute('fill') == "#AB0606" || circle.getAttribute('fill') == "#D86C00"){
                                        Actbutton.style.visibility = "visible"
                                        ConsiderationButtton.style.visibility = "visible"
                                    }
                                })
                            }
                        }
                    }
                }else{
                    if(targetElement.prop('name/first') == typeOfPort && links != undefined){
                        //Make the links visible
                        targetElement.set('hidden', true)
                        targetElement.set('collapsed', false)
                        //Make the links visible
                        links.set('hidden', true)
                        links.set('collapsed', false)
                        //This condition listens to the events on elements that has more than on parent
                        const orphanLink = graph.getConnectedLinks(targetElement, {inbound:true})
                        if(orphanLink.length > 1){
                            orphanLink.forEach(links =>{
                                if(links.get('collapsed') && links != undefined && targetElement != undefined){
                                    targetElement.set('hidden', false)
                                    targetElement.set('collapsed', true)
                                    links.set('hidden', false)
                                }
                            })
                        }
                        if(targetElement != undefined){
                            closeTheRest(targetElement)
                        }else{
                            console.error("element or link already closed")
                        }
                        if(typeOfPort == "Outcomes"){
                            //Using the html element (Activity button) instead to hide and show the particular button from the entire ElementView
                            var elementView = targetElement.findView(paper)
                            if(elementView.hasTools()){
                                //Query's for the Activity Button on the and hides it
                                const Actbutton = elementView._toolsView.tools[1].$el[0]
                                const ConsiderationButtton = elementView._toolsView.tools[0].$el[0]
                                Actbutton.style.visibility = "hidden"
                                ConsiderationButtton.style.visibility = "hidden"
                                const circleElement = elementView._toolsView.$el[0].querySelectorAll('circle')
                                //If the user has selected Not Started or In progress on Outcome, Below condition checks the status while opening and closing
                                circleElement.forEach(circle =>{
                                    if(circle.getAttribute('fill') == "#AB0606" || circle.getAttribute('fill') == "#D86C00"){
                                        Actbutton.style.visibility = "visible"
                                        ConsiderationButtton.style.visibility = "visible"
                                    }
                                })
                            }
                        }
                    }
                }
            })
        }
        doLayout()
    }else{
        console.error("Parent node is undefined")
    }
}

/*
    * Function to animate showing or hiding an element.
    * @param - {Object}: element, JointJS element.
    * @param - {Object bool}: show, indicates whether the element is open or closed.
*/
function animateElement(element, show) {
    const duration = 1000; // Animation duration in milliseconds
    const startValue = show ? 0 : 1;
    const endValue = show ? 1 : 0;
    const property = 'opacity';
    const elementView = paper.findViewByModel(element)
    const htmlEl = elementView.$el[0]
    htmlEl.style[property] = startValue;
    htmlEl.animate(
        { [property]: [startValue + 0.1, endValue] },
        { duration: duration, fill: 'forwards' }
    );
}



/*
    * This function handles the event for the 3 buttons on the outcomes node.
    * @param - {Object}: elementView, Element View of the Outcomes.
    * @param - {Object}: port, Used to retrive the port ID of the button.
*/
function radioButtonEvents(elementView, port){
    var circleElements = elementView._toolsView.$el[0].querySelectorAll('circle')
    var score = getScore(elementView.model)
    circleElements.forEach(circleElement =>{
        //Still need to wrap around this event because we just need to set one button at a time not all should be selected.
        var activityButton = elementView._toolsView.tools[1].el
        var considerationButton = elementView._toolsView.tools[0].$el[0]
        const outboundLinks = (graph.getConnectedLinks(elementView.model, {outbound: true}))
        var buttons = removeUnwantedButton(outboundLinks, activityButton, considerationButton)
        activityButton = buttons[0]
        considerationButton = buttons[1]
        //Change the color of the element when clicked
        if(circleElement.id == `${port.id}`){
            if(circleElement.id.startsWith('A')){
                circleElement.setAttribute('Score', 2)
                score = 2
                //When clicked on Achieved, hide the activity button
                if((activityButton && activityButton.style.visibility == "visible")){
                    var rectElement = (elementView.el.querySelector('rect'))
                    var width = parseFloat(rectElement.getAttribute('width')) - 115
                    activityButton.style.visibility = "hidden"
                    rectElement.setAttribute('width', width)
                    //This condition is applied when user wants to hide all the elements including Activities and Considerations
                    if((considerationButton && considerationButton.style.visibility == "visible")){
                        var rectElement = (elementView.el.querySelector('rect'))
                        if(activityButton){
                            var width = parseFloat(rectElement.getAttribute('width'))
                        }else{
                            var width = parseFloat(rectElement.getAttribute('width')) - 115
                        }
                        considerationButton.style.visibility = "hidden"
                        rectElement.setAttribute('width', width)
                    }
                    const OutboundLinks = graph.getConnectedLinks(elementView.model, {outbound:true})
                    OutboundLinks.forEach(links =>{
                        //Make the links visible
                        links.getTargetElement().set('hidden', true)
                        links.getTargetElement().set('collapsed', false)
                        //Make the links visible
                        links.set('hidden', true)
                        links.set('collapsed', false)
                        //This condition listens to the events on elements that has more than on parent
                        const orphanLink = graph.getConnectedLinks(links.getTargetElement(), {inbound:true})
                        if(orphanLink.length > 1){
                            orphanLink.forEach(links =>{
                                if(!links.get('hidden')){
                                    links.getTargetElement().set('hidden', false)
                                    links.getTargetElement().set('collapsed', true)
                                    links.set('hidden', false)
                                }
                                closeTheRest(links.getTargetElement())
                            })
                        }else{
                            links.getTargetElement().set('hidden', true)
                            links.getTargetElement().set('collapsed', false)
                            links.set('hidden', true)
                            closeTheRest(links.getTargetElement())
                        }
                    })
                }else{
                    var rectElement = (elementView.el.querySelector('rect'))
                    var width = parseFloat(rectElement.getAttribute('width'))
                    rectElement.setAttribute('width', width)
                }
                circleElement.setAttribute('fill', 'Green')
            }
            else if(circleElement.id.startsWith('P')){
                circleElement.setAttribute('Score', 1)
                score = 1
                //When clicked on In Progress button, show the activity button
                if(considerationButton && considerationButton.style.visibility == "hidden"){
                    var rectElement = (elementView.el.querySelector('rect'))
                    if(activityButton){
                        var width = parseFloat(rectElement.getAttribute('width'))
                    }else{
                        var width = parseFloat(rectElement.getAttribute('width')) + 115
                    }
                    rectElement.setAttribute('width', width)
                    considerationButton.style.visibility = "visible"
                }
                if(activityButton && activityButton.style.visibility == "hidden"){
                    var rectElement = (elementView.el.querySelector('rect'))
                    var width = parseFloat(rectElement.getAttribute('width')) + 115
                    rectElement.setAttribute('width', width)
                    activityButton.style.visibility = "visible"
                }else{
                    var rectElement = (elementView.el.querySelector('rect'))
                    var width = parseFloat(rectElement.getAttribute('width'))
                    rectElement.setAttribute('width', width)
                }
                circleElement.setAttribute('fill', '#D86C00')
            }
            else if(circleElement.id.startsWith('N')){
                circleElement.setAttribute('Score', 0)
                score = 0
                //When clicked on Not Started Button, show the activity button
                if(considerationButton && considerationButton.style.visibility == "hidden"){
                    var rectElement = (elementView.el.querySelector('rect'))
                    if(activityButton){
                        var width = parseFloat(rectElement.getAttribute('width'))
                    }else{
                        var width = parseFloat(rectElement.getAttribute('width')) + 115
                    }
                    rectElement.setAttribute('width', width)
                    considerationButton.style.visibility = "visible"
                }
                if(activityButton && activityButton.style.visibility == "hidden"){
                    var rectElement = (elementView.el.querySelector('rect'))
                    var width = parseFloat(rectElement.getAttribute('width')) + 115
                    rectElement.setAttribute('width', width)
                    activityButton.style.visibility = "visible"
                }else{
                    var rectElement = (elementView.el.querySelector('rect'))
                    var width = parseFloat(rectElement.getAttribute('width'))
                    rectElement.setAttribute('width', width)
                }
                circleElement.setAttribute('fill', '#AB0606')
            }
        }else{
            //unhighlights the rest of the elements that the user is not interacting with
            circleElement.setAttribute('fill', 'white')
            circleElement.setAttribute('Score', null)
        }
    })
    updateScorecard(elementView.model,score);
}




/*
    * This function removes activity, and consideration button from the outcomes which does not have an extention to an activity or a consideration.
    * @param - {Object []}: OutboundLinks, An array of links that goes out of the outcome.
    * @param - {Object}: activityButton, Activity button on an outcome.
    * @param - {Object}: considerationButton, Consideration button on an outcome.
*/
function removeUnwantedButton(outboundLinks, activityButton, considerationButton){
    var activitiesElements = []
    var considerationElement = []
    outboundLinks.forEach(links =>{
        if(links.getTargetElement().attributes.name['first'] == "Activities"){
            activitiesElements.push("Activities")
        }
        if(links.getTargetElement().attributes.name['first'] == "Considerations"){
            considerationElement.push("Considerations")
        }
    })
    if(Array.isArray(activitiesElements) && activitiesElements.length === 0){
        if(activityButton){
            activityButton.remove()
            activityButton = null
        }
    }

    if(Array.isArray(considerationElement) && considerationElement.length === 0){
        if(considerationButton){
            considerationButton.remove()
            considerationButton = null
        }
    }
    return [activityButton, considerationButton]
}
