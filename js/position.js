function updateAnchorConnection(element){
    var sourceLinks = graph.getConnectedLinks(element, {outbound: true})
        sourceLinks.forEach(links =>{
            links.source(element, {
                anchor: {
                    name: 'right',
                    args: {
                        rotate: false,
                        dx: 80,            //100 because the width of the element was increase by 100 (offset 100)
                        dy: 0
                    }
                }
            });

        })
}


//This function sets the vertices of the links using the Target and Source Elements
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
            var sourceMidX = parseInt(sourceBBox.x) + parseInt(sourceBBox.width) + 100
            var sourceMidY = parseInt(sourceBBox.y) + parseInt(sourceBBox.height)/2;
            var targetX = sourceMidX;
            var targetMidY = parseInt(targetBBox.y) + parseInt(targetBBox.height)/2;
            link.set('vertices', [
                {x: sourceMidX, y: sourceMidY},
                {x: targetX , y: targetMidY}
            ])
            // Different settings for the vertices from the Outcomes as multiple outcomes shares same activities
            if(sourceCell.attributes.name['first'] == "Outcomes"){
                if(targetCell.attributes.name['first'] == "Activities"){
                    var sourceBBox = sourceCell.getBBox();
                    var targetBBox = targetCell.getBBox();
                    var sourceMidX = parseInt(sourceBBox.x) + parseInt(sourceBBox.width) + 200
                    var sourceMidY = parseInt(sourceBBox.y) + parseInt(sourceBBox.height)/2;
                    var targetX = sourceMidX;
                    var targetMidY = parseInt(targetBBox.y) + parseInt(targetBBox.height)/2;
                    link.set('vertices', [
                        {x: sourceMidX, y: sourceMidY },
                        {x: targetX, y: targetMidY}
                    ])
                }else if(targetCell.attributes.name['first'] == "Considerations"){
                    var sourceBBox = sourceCell.getBBox();
                    var targetBBox = targetCell.getBBox();
                    var sourceMidX = parseInt(sourceBBox.x) + parseInt(sourceBBox.width) + 200
                    var sourceMidY = parseInt(sourceBBox.y) + parseInt(sourceBBox.height)/2;
                    var targetX = sourceMidX;
                    var targetMidY = parseInt(targetBBox.y) + parseInt(targetBBox.height)/2;
                    link.set('vertices', [
                        {x: sourceMidX, y: sourceMidY },
                        {x: targetX, y: targetMidY}
                    ])
                }
            }
        }
    }
    })


}

function setElementsPosition(element, position){

    if(element.attributes.name['first'] != "Activities" ){
        const parentElement = graph.getPredecessors(element)[0]
        if(parentElement){
            const parentPosition = parentElement.position().x
            const parentSize = parseInt(parentElement.size().width)
            var distance = parentPosition + parentSize
            if(distance != 400 && distance < 400){
            const difference = 400 - distance;
            distance = distance + difference
        }else{
            distance = distance + 300
        }
            element.set('position', { x: distance , y: position.y});
          //updateAnchorConnection(element)
        }
    }else{
        const parentElement = graph.getPredecessors(element)[0]
        const parentElement1 = graph.getPredecessors(element)
        if(Array.isArray(parentElement1)){
            parentElement1.forEach(outcomes =>{
            if(outcomes.attributes.name['first'] == "Outcomes"){
                const parentPosition = outcomes.position().x
                const parentSize = parseInt(outcomes.size().width)
                var distance = parentPosition + parentSize + 200
                // console.log(parentPosition, parentSize)
                // console.log(distance)
                if(distance != 300 && distance < 300){
                    const difference = 300 - distance;
                    distance = distance + difference
                }else{
                    distance = distance + 400
                }
                element.set('position', { x: distance , y: position.y });
                //updateAnchorConnection(element)
            }
            })
        }
        else{
            if(parentElement){
            const parentPosition = parentElement.position().x
            console.log(parentPosition)
            const parentSize = parseInt(parentElement.size().width)
            var distance = parentPosition + parentSize + 200
            console.log(element)
            // console.log(distance)
            if(distance != 300 && distance < 300){
                const difference = 300 - distance;
                distance = distance + difference
            }else{
                distance = distance + 400
                position.y += 50
            }
            element.set('position', { x: distance , y: position.y });
            //updateAnchorConnection(element)
            }
        }
    }

}



//This function sets the root elements to a fix position
function setRootToFix(){
    const rootCenter = { x: 200, y: (window.innerHeight)/2 };
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
