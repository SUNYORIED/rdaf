/*
    This function sets the length and path of the link from the source element to the target
    Starts: From the ending x-coordinate of the source element
    ends: to the initial x-coordinate of the target element
    loops: depends on the position of the target element, (more the gap more loops, lesser the gap lesser the loops)
*/
function setLinkVertices(){
    models.forEach(function(link){
        if(!link.get('hidden')){
            if(link.attributes['type'] == "standard.Link"){
                var sourceElement = link.get('source').id;
                var targetElement = link.get('target').id;
                var sourceCell = graph.getCell(sourceElement)
                var targetCell = graph.getCell(targetElement);
                if(!sourceCell || !targetCell){
                    return;
                }
                var sourceBBox = sourceCell.getBBox();
                var targetBBox = targetCell.getBBox();
                var sourceMidX = parseInt(sourceBBox.x) + parseInt(sourceBBox.width) + 100     //Length of the x from S to T
                var sourceMidY = parseInt(sourceBBox.y) + parseInt(sourceBBox.height)/2;            //Point on the Y edge of the source element where to start from
                var targetX = sourceMidX;                                                           //Point where the link ends
                var targetMidY = parseInt(targetBBox.y) + parseInt(targetBBox.height)/2;            //Point where the link is attached in the end
                link.set('vertices', [
                    {x: sourceMidX, y: sourceMidY},
                    {x: targetX , y: targetMidY}
                ])
                const sourceButtonType = sourceCell.attributes.name['first']
                // Different settings for the vertices from the Outcomes as multiple outcomes shares same activities
                if(sourceButtonType == "Outcomes" && sourceButtonType != "Considerations"){
                    var sourceBBox = sourceCell.getBBox();
                    var targetBBox = targetCell.getBBox();
                    var sourceMidX = parseInt(sourceBBox.x) + parseInt(sourceBBox.width)
                    var distance = 2500
                    if(sourceMidX != distance && sourceMidX > distance){
                        var difference = sourceMidX - distance
                        sourceMidX -= difference
                    }else if(sourceMidX != distance && sourceMidX < distance){
                        var difference = distance - sourceMidX
                        sourceMidX += difference
                    }
                    if(parseInt(sourceBBox.width) > 1000){
                        distance = 2800
                        var difference = distance - sourceMidX
                        sourceMidX += difference
                    }
                    var sourceMidY = parseInt(sourceBBox.y) + parseInt(sourceBBox.height)/2;
                    var targetX = sourceMidX;
                    var targetMidY = parseInt(targetBBox.y) + parseInt(targetBBox.height)/2;
                    link.set('vertices', [
                        {x: sourceMidX, y: sourceMidY},
                        {x: targetX, y: targetMidY}
                    ])
                }
                if(sourceButtonType == "Activities"){
                    var sourceBBox = sourceCell.getBBox();
                    var targetBBox = targetCell.getBBox();
                    var sourceMidX = parseInt(sourceBBox.x) + parseInt(sourceBBox.width)
                    var distance
                    if(sourceBBox.width < 950){
                        distance  = 3900
                    }else{
                        distance = 4200
                    }
                    if(sourceMidX != distance && sourceMidX > distance){
                        var difference = sourceMidX - distance
                        sourceMidX -= difference
                    }else if(sourceMidX != distance && sourceMidX < distance){
                        var difference = distance - sourceMidX
                        sourceMidX += difference
                    }
                    var targetX = sourceMidX;
                    var targetMidY =  parseInt(targetBBox.y) + parseInt(targetBBox.height)/2;
                    //Sets the path of the source link accroding to the ports y coordinate
                    if(targetCell.prop("name/first") == "Methods"){
                        sourceMidY = parseInt(sourceBBox.y) + parseInt(sourceBBox.height)/10;
                    }
                    if(targetCell.prop("name/first") == "Roles"){
                        sourceMidY = parseInt(sourceBBox.y) + parseInt(sourceBBox.height)/4;
                    }
                    if(targetCell.prop("name/first") == "Participants"){
                        sourceMidY = (parseInt(sourceBBox.y) + parseInt(sourceBBox.height)) - (parseInt(sourceBBox.height)/2);
                    }
                    if(targetCell.prop("name/first") == "Resources"){
                        sourceMidY = (parseInt(sourceBBox.y) + parseInt(sourceBBox.height)) - (parseInt(sourceBBox.height)/4);
                    }
                    if(targetCell.prop("name/first") == "Outputs"){
                        sourceMidY = (parseInt(sourceBBox.y) + parseInt(sourceBBox.height)) - (parseInt(sourceBBox.height)/8);
                    }
                    if(targetCell.prop("name/first") == "Considerations"){
                        sourceMidY =(parseInt(sourceBBox.y) + parseInt(sourceBBox.height)) - (parseInt(sourceBBox.height)/12);
                    }
                    link.set('vertices', [
                        {x: sourceMidX, y: sourceMidY},
                        {x: targetX, y: targetMidY}
                    ])
                }
            }
        }
    })
}


/*
    Sets the position of a target element based on the position of the source element
*/
function setElementsPosition(element, position){
    if(element){
        var label = (element.attr('label'))
        if(element.attributes.name['first'] == "Topics" || element.attributes.name['first'] == "Outcomes" || element.attributes.name['first'] == "Considerations"){
            const parentElement = graph.getPredecessors(element)[0]
            const parentNodeType = parentElement.attributes.name['first']
            if(parentElement && (parentNodeType == "Stages" || parentNodeType == "Topics")){
                const parentPositionX = parentElement.position().x
                const parentSize = parseInt(parentElement.size().width)
                var distance = parentPositionX + parentSize
                if(distance != 400 && distance < 400){
                const difference = 400 - distance;
                distance = distance + difference
            }else{
                distance = distance + 300
            }
            label.refX = "5%"
            element.set('position', { x: distance , y: position.y});
            }
        }
        if(element.attributes.name['first'] == "Activities" || element.attributes.name['first'] == "Considerations"){
            var sourceLink = (graph.getConnectedLinks(element, {inbound:true}))
            let sourceElement
            sourceLink.forEach(link =>{
                if(!link.get('hidden')){
                    sourceElement = link.get('source').id
                    return;
                }
            })
            var sourceCell = graph.getCell(sourceElement)
            var parentElement = sourceCell
            const parentNodeType = parentElement.attributes.name['first']
            if(parentElement && parentNodeType == "Outcomes"){
                const parentPositionX = parentElement.position().x
                const parentSize = parseInt(parentElement.size().width)
                label.refX = "5%"
                element.set('position', { x: 3000 , y: position.y});
            }
        }
        const nodeType = element.attributes.name['first']
        if(nodeType == "Methods" || nodeType == "Participants" || nodeType == "Roles" || nodeType == "Resources" || nodeType == "Outputs" || nodeType == "Considerations"){
            var sourceLink = (graph.getConnectedLinks(element, {inbound:true}))
            let sourceElement
            sourceLink.forEach(link =>{
                if(!link.get('hidden')){
                    sourceElement = link.get('source').id
                    return;
                }
            })
            var sourceCell = graph.getCell(sourceElement)
            var parentElement = sourceCell
            const parentNodeType = parentElement.attributes.name['first']
            if(parentElement && (parentNodeType == "Activities")){
                const parentPositionX = parseInt(parentElement.position().x)
                const parentSize = parseInt(parentElement.size().width)
                var distance = parentPositionX + parentSize + 15
                distance = parseInt(distance)
                if(distance != 400 && distance < 400){
                    const difference = 400 - distance;
                    distance = distance + difference
                }else{
                    distance = distance + 300
                }

                label.refX = "5%"
                element.set('position', { x: 4000 , y: position.y + 100});
                if(parentElement.getBBox().width > 950){
                    element.set('position', { x: 4900 , y: position.y+100});
                }
            }
        }
    }
}



/*
    The initial size of the paper depends on the size of the screen
    It changes as the BBox of the elements changes
*/
function changePaperSize(){
    var sizeOfContentBox = paper.getContentBBox({useModelGeometry:true});           //Returns the Bounding box of the content that is visible on the page.
    var paperWidth = paper.options.width;   //Paper's initial width
    var paperHeight = paper.options.height; //Papers initial height
    if ((sizeOfContentBox.width) > paperWidth) {      //Change the width if any elements overflows on x
        paperWidth = sizeOfContentBox.width + 100; // Increase width by 100 units
    }
    if ((sizeOfContentBox.height) > paperHeight) {   //Change the height if any element overflows on y
        paperHeight = sizeOfContentBox.height + 150; // Increase height by 100 units
    }
    paper.setDimensions(paperWidth, paperHeight);
}



//This function sets the root elements to a fix position
function setRootToFix(){
    const rootCenter = { x: 200, y: (paper.options.height)/2 };
    // Calculate the total height of all root elements
    let totalHeight = 0;
    root.forEach(element => {
        totalHeight += element.size().height;
    });
    // Calculate the y-coordinate for the topmost root element
    let currentY = rootCenter.y - totalHeight / 2;
    root.forEach(el =>{
        const { width, height } = el.size();
        // Calculate the x-coordinate for the current root element
        const currentX = rootCenter.x - width;
        // Calculate the difference between the current position and the desired position
        const diff = el.position().difference({
            x: currentX,
            y: currentY
        });
        // Translate the element to the desired position
        el.translate(-diff.x, -diff.y);
        // Update the y-coordinate for the next root element
        currentY += height;
    })
}
