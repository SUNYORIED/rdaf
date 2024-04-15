
/*
There is not button set on the Stages yet so this is an event handler for when clicked on any of the stages
*/
paper.on('element:pointerdown', function(cellView, evt) {
    const model = cellView.model
    evt.stopPropagation()
    evt.preventDefault()
    if(model['id'] == "https://data.suny.edu/entities/oried/rdaf/nist/E" || model['id'] == "https://data.suny.edu/entities/oried/rdaf/nist/P" || model['id'] == "https://data.suny.edu/entities/oried/rdaf/nist/GA"){
        toggleBranch(model);
    }
    if(model.attributes.name && model.attributes.name['first'] == 'Resources'){
        const url = model.attributes.resource['Link']
        window.open(url, '_blank')
    }
})

graph.on('change:position', function(element, position) {
    //console.log('Element ' + element.id + 'moved to ' + position.x + ',' + position.y);
});



function toggleBranch(child) {
    if(child.isElement()){
        //retrives the value of the collapsed attribute from the root model.
        var shouldHide = child.get('collapsed');
        child.set('collapsed', !shouldHide);
        const links = openBranch(child, shouldHide)
    }
}

function openBranch(child, shouldHide){
    // TODO: openBranch should only open the next level of the tree, not the
    // full tree - this might also help with the initial layout
    //Finds the outgoing links to the element the user is interacting with
    const findTarget = graph.getConnectedLinks(child, {outbound:true})
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
                console.error("Element Undefined")
            }
        }
    })
    doLayout();
}


/*
    This function takes and element and routes through all of its child element and hides all the elements
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
            console.error("Element already closed")
        }
    });



}



/*
    This function handles the event when a button is clicked. Collapse and hide the child nodes
    for now its just closes the first connected childs but later when we create the child (participants, roles, methods, etc. ) for activities we can use
    the above close the Rest to close the rest of the tree
*/
function toggelButton(node, typeOfPort){
    var shouldHide = node.get('collapsed');
    node.set('collapsed', !shouldHide);
    defaultEvent(node, typeOfPort)
}


function defaultEvent(node, typeOfPort){
    if(node){ // === True
        const OutboundLinks = graph.getConnectedLinks(node, {outbound:true})
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

// Function to animate showing or hiding an element
function animateElement(element, show) {
    const duration = 1000; // Animation duration in milliseconds
    const startValue = show ? 0 : 1;
    const endValue = show ? 1 : 0;
    const property = 'opacity';
    const elementView = paper.findViewByModel(element)
    const htmlEl = elementView.$el[0]
    htmlEl.style[property] = startValue;
    htmlEl.animate(
        { [property]: [startValue + 0.3, endValue] },
        { duration: duration, fill: 'forwards' }
    );
}


function animateElementClose(element, show){
    const duration = 1000; // Animation duration in milliseconds
    const startValue = show ? 0 : 1;
    const endValue = show ? 1 : 0;
    const property = 'opacity';
    const elementView = paper.findViewByModel(element)
    const htmlEl = elementView.$el[0]
    htmlEl.style.opacity = startValue;
    htmlEl.animate(
        { opacity: [startValue + 0.3, endValue] },
        { duration: duration, fill: 'forwards' }
    );
}


//This function handles the event for the 3 buttons on the outcomes node
function radioButtonEvents(elementView, port){
    var circleElements = elementView._toolsView.$el[0].querySelectorAll('circle')
    circleElements.forEach(circleElement =>{
    //Still need to wrap around this event because we just need to set one button at a time not all should be selected.
    var activityButton = elementView._toolsView.tools[1].el
    var considerationButton = elementView._toolsView.tools[0].$el[0]
    const outboundLinks = (graph.getConnectedLinks(elementView.model, {outbound: true}))
    var buttons = removeUnwantedButton(elementView, outboundLinks, activityButton, considerationButton)
    activityButton = buttons[0]
    considerationButton = buttons[1]
    //Change the color of the element when clicked
    if(circleElement.id == `${port.id}`){
        if(circleElement.id.startsWith('A')){
            //When clicked on Achieved, hide the activity button
            if((activityButton && activityButton.style.visibility == "visible")){
                var rectElement = (elementView.el.querySelector('rect'))
                var width = parseInt(rectElement.getAttribute('width')) - 115
                activityButton.style.visibility = "hidden"
                rectElement.setAttribute('width', width)
                //This condition is applied when user wants to hide all the elements including Activities and Considerations
                if((considerationButton && considerationButton.style.visibility == "visible")){
                    var rectElement = (elementView.el.querySelector('rect'))
                    if(activityButton){
                        var width = parseInt(rectElement.getAttribute('width'))
                    }else{
                        var width = parseInt(rectElement.getAttribute('width')) - 115
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
                var width = parseInt(rectElement.getAttribute('width'))
                rectElement.setAttribute('width', width)
            }
            circleElement.setAttribute('fill', 'Green')
        }
        else if(circleElement.id.startsWith('P')){
            //When clicked on In Progress button, show the activity button
            if(considerationButton && considerationButton.style.visibility == "hidden"){
                var rectElement = (elementView.el.querySelector('rect'))
                if(activityButton){
                    var width = parseInt(rectElement.getAttribute('width'))
                }else{
                    var width = parseInt(rectElement.getAttribute('width')) + 115
                }
                rectElement.setAttribute('width', width)
                considerationButton.style.visibility = "visible"
            }
            if(activityButton && activityButton.style.visibility == "hidden"){
                var rectElement = (elementView.el.querySelector('rect'))
                var width = parseInt(rectElement.getAttribute('width')) + 115
                rectElement.setAttribute('width', width)
                activityButton.style.visibility = "visible"
            }else{
                var rectElement = (elementView.el.querySelector('rect'))
                var width = parseInt(rectElement.getAttribute('width'))
                rectElement.setAttribute('width', width)
            }
            circleElement.setAttribute('fill', '#D86C00')
        }
        else if(circleElement.id.startsWith('N')){
            //When clicked on Not Started Button, show the activity button
            if(considerationButton && considerationButton.style.visibility == "hidden"){
                var rectElement = (elementView.el.querySelector('rect'))
                if(activityButton){
                    var width = parseInt(rectElement.getAttribute('width'))
                }else{
                    var width = parseInt(rectElement.getAttribute('width')) + 115
                }
                rectElement.setAttribute('width', width)
                considerationButton.style.visibility = "visible"
            }
            if(activityButton && activityButton.style.visibility == "hidden"){
                var rectElement = (elementView.el.querySelector('rect'))
                var width = parseInt(rectElement.getAttribute('width')) + 115
                rectElement.setAttribute('width', width)
                activityButton.style.visibility = "visible"
            }else{
                var rectElement = (elementView.el.querySelector('rect'))
                var width = parseInt(rectElement.getAttribute('width'))
                rectElement.setAttribute('width', width)
            }
            circleElement.setAttribute('fill', '#AB0606')
        }
    }else{
        //unhighlights the rest of the elements that the user is not interacting with
        circleElement.setAttribute('fill', 'white')
    }
    })
}



function removeUnwantedButton(elementView, outboundLinks, activityButton, considerationButton){
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
