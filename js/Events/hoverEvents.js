let timeoutID;
//In order to see the effect of this function minimize the page to 25% because the subtopic elements are scattered througout the page
//Show the subtopic when the enters the cell view of the subtopic button
paper.on('cell:mouseover', function(cellView) {
    try {
        if(cellView.model.attributes.name['first'] == "Resources"){
            console.log("Here")
            const resourceElement = (cellView.el.querySelectorAll('rect')[0])
            resourceElement.setAttribute('fill', "#7490D7")
        }else if(cellView.model.attributes.name['first'] == "Stages"){
            var bbox = cellView.model.getBBox();
            var paperRect1 = paper.localToPaperRect(bbox);
            const stageElement = cellView.el.querySelectorAll('rect')[0]
            stageElement.setAttribute('fill', "#B0AEAC")
            var textBlock = document.getElementById(cellView.model.id)
            textBlock.style.left = ((paperRect1.x) + 100) + 'px';
            textBlock.style.top = ((paperRect1.y) + 40) + 'px';
            textBlock.style.backgroundColor = 'white'
            displayTextBlock(textBlock)
        }else if(cellView.model.attributes.name['first'] == "Download Scores"){
            const downloadElement = (cellView.el.querySelectorAll('rect')[0])
            downloadElement.setAttribute('fill', "#7490D7")
        }else if(cellView.model.attributes.name['first'] == "Reset Scores"){
            const resetElement = (cellView.el.querySelectorAll('rect')[0])
            resetElement.setAttribute('fill', "#7490D7")
        }
      //From the element view look for the element tools
        var toolsArray = cellView._toolsView.tools
        toolsArray.forEach(element => {
            if (element.childNodes && element.childNodes.button) {
                    const buttons = element.$el[0]
                    buttons.addEventListener('mouseover', function() {
                        // Your mouseover event handling code here
                        var bbox = cellView.model.getBBox();
                        var paperRect1 = paper.localToPaperRect(bbox);
                        if(element.childNodes.button.id == "RDaF Subtopic"){
                            // Set the position of the element according to the pointer and make it visible
                            element.childNodes.button.setAttribute('fill', 'lightgrey')
                            var textBlock = document.getElementById(cellView.model.id)
                            if(textBlock){
                                textBlock.style.left = ((paperRect1.x) + 10) + 'px';
                                textBlock.style.top = ((paperRect1.y) + 55) + 'px';
                                displayTextBlock(textBlock)
                            }
                        }
                        else if(element.childNodes.button.id == "Definition"){
                            // Set the position of the element according to the pointer and make it visible
                            element.childNodes.button.setAttribute('fill', 'darkgrey')
                            var textBlock = document.getElementById(cellView.model.id)
                            if(textBlock != null){
                                textBlock.style.left = (paperRect1.x + 10) + 'px';
                                textBlock.style.top = ((paperRect1.y) + 55) + 'px';
                                displayTextBlock(textBlock)
                            }
                        }
                        else if(element.childNodes.button.id == "Activities"){
                            element.childNodes.button.setAttribute('fill', '#004265')
                            var textBlock = document.getElementById("Activities" + cellView.model.id)
                            if(textBlock){
                                textBlock.style.left = (paperRect1.x + cellView.model.size().width - 20) + 'px';
                                textBlock.style.top = ((paperRect1.y) + 55) + 'px';
                                displayTextBlock(textBlock)
                            }
                        }else if(element.childNodes.button.id == "Okay"){
                            element.childNodes.button.setAttribute('fill', 'grey')
                        }
                        else if(element.childNodes.button.id == "Considerations"){
                            element.childNodes.button.setAttribute('fill', '#004265')
                            var textBlock = document.getElementById("Considerations" + cellView.model.id)
                            if(textBlock){
                                textBlock.style.left = (paperRect1.x + cellView.model.size().width/2) + 'px';
                                textBlock.style.top = ((paperRect1.y) + 60) + 'px';
                                displayTextBlock(textBlock)
                            }
                        }
                        else if(element.childNodes.button.id == "Outcomes"){
                            element.childNodes.button.setAttribute('fill', '#004265')
                            var textBlock = document.getElementById(cellView.model.id)
                            if(textBlock){
                                textBlock.style.left = (paperRect1.x + cellView.model.size().width - 20) + 'px';
                                textBlock.style.top = ((paperRect1.y) + 50) + 'px';
                                displayTextBlock(textBlock)
                            }
                        }
                        else if(element.childNodes.button.id == "Outputs"){
                            element.childNodes.button.setAttribute('fill', '#004265')
                            var textBlock = document.getElementById("Outputs" + cellView.model.id)
                            if(textBlock){
                                textBlock.style.left = (paperRect1.x) + 'px';
                                textBlock.style.top = ((paperRect1.y) + 130) + 'px';
                                displayTextBlock(textBlock)
                            }
                        }
                        else if(element.childNodes.button.id == "Participants"){
                            element.childNodes.button.setAttribute('fill', '#004265')
                            var textBlock = document.getElementById("Participants" + cellView.model.id)
                            if(textBlock){
                                textBlock.style.left = (paperRect1.x) + 'px';
                                textBlock.style.top = ((paperRect1.y) + 40) + 'px';
                                displayTextBlock(textBlock)
                            }
                        }
                        else if(element.childNodes.button.id == "Methods"){
                            element.childNodes.button.setAttribute('fill', '#004265')
                            var textBlock = document.getElementById("Methods" + cellView.model.id)
                            if(textBlock){
                                textBlock.style.left = (paperRect1.x) + 'px';
                                textBlock.style.top = ((paperRect1.y) + 40) + 'px';
                                displayTextBlock(textBlock)
                            }
                        }
                        else if(element.childNodes.button.id == "Roles"){
                            element.childNodes.button.setAttribute('fill', '#004265')
                            var textBlock = document.getElementById("Roles" + cellView.model.id)
                            if(textBlock){
                                textBlock.style.left = (paperRect1.x) + 'px';
                                textBlock.style.top = ((paperRect1.y) + 40) + 'px';
                                displayTextBlock(textBlock)
                            }
                        }
                        else if(element.childNodes.button.id == "Resources"){
                            element.childNodes.button.setAttribute('fill', '#004265')
                            var textBlock = document.getElementById("Resources" + cellView.model.id)
                            if(textBlock){
                                textBlock.style.left = (paperRect1.x) + 'px';
                                textBlock.style.top = ((paperRect1.y) + 40) + 'px';
                                displayTextBlock(textBlock)
                            }
                        }
                        else{
                            console.log()
                        }
                    });
            }else {
                console.log();
            }
        });
    } catch (error) {
        console.error();
    }
});

  //In order to see the effect of this function minimize the page to 25% because the subtopic elements are scattered througout the page
  //Hide the subtopic when the mouse pointer leaves the button
    paper.on('cell:mouseout', function(cellView) {
    try {

        if(cellView.model.attributes.name['first'] == "Resources"){
            const resourceElement = (cellView.el.querySelectorAll('rect')[0])
            resourceElement.setAttribute('fill', "#C8CDDA")
        }else if(cellView.model.attributes.name['first'] == "Stages"){
            const stageElement = cellView.el.querySelectorAll('rect')[0]
            stageElement.setAttribute('fill', "whitesmoke")
            var textBlock = document.getElementById(cellView.model.id)
            textBlock.style.visibility = "hidden"
        }else if(cellView.model.attributes.name['first'] == "Download Scores"){
            const downloadElement = (cellView.el.querySelectorAll('rect')[0])
            downloadElement.setAttribute('fill', "#C8CDDA")
        }else if(cellView.model.attributes.name['first'] == "Reset Scores"){
            const resetElement = (cellView.el.querySelectorAll('rect')[0])
            resetElement.setAttribute('fill', "#C8CDDA")
        }
        clearTimeout(timeoutID)
        //From the element View look for the element tools
        var toolsArray = cellView._toolsView.tools
        toolsArray.forEach(element => {
            if (element.childNodes && element.childNodes.button) {
                const buttons = element.$el[0]
                buttons.addEventListener('mouseout', function() {
                    // Set the position of the element according to the pointer and make it visible
                    //Look for any events on subtopic button
                    if(element.childNodes.button.id == "RDaF Subtopic"){
                        element.childNodes.button.setAttribute('fill', 'whitesmoke')
                        hideTextBlock(element.childNodes.button.id, cellView.model)
                    }
                    else if(element.childNodes.button.id == "Okay"){
                        element.childNodes.button.setAttribute('fill', '#FF9292')
                    }
                    else if(element.childNodes.button.id == "Definition"){
                        // Set the position of the element according to the pointer and make it visible
                        element.childNodes.button.setAttribute('fill', 'black')
                        hideTextBlock(element.childNodes.button.id, cellView.model)
                    }
                    else if(element.childNodes.button.id == "Activities"){
                        element.childNodes.button.setAttribute('fill', '#005C90')
                        hideTextBlock(element.childNodes.button.id, cellView.model)
                    }
                    else if(element.childNodes.button.id == "Considerations"){
                        element.childNodes.button.setAttribute('fill', '#005C90')
                        hideTextBlock(element.childNodes.button.id, cellView.model)
                    }
                    else if(element.childNodes.button.id == "Outcomes"){
                        element.childNodes.button.setAttribute('fill', '#005C90')
                        hideTextBlock(element.childNodes.button.id, cellView.model)
                    }
                    else if(element.childNodes.button.id == "Outputs"){
                        element.childNodes.button.setAttribute('fill', '#0013FF')
                        hideTextBlock(element.childNodes.button.id, cellView.model)
                    }
                    else if(element.childNodes.button.id == "Participants"){
                        element.childNodes.button.setAttribute('fill', '#B70316')
                        hideTextBlock(element.childNodes.button.id, cellView.model)
                    }
                    else if(element.childNodes.button.id == "Roles"){
                        element.childNodes.button.setAttribute('fill', '#09BD00')
                        hideTextBlock(element.childNodes.button.id, cellView.model)
                    }
                    else if(element.childNodes.button.id == "Resources"){
                        element.childNodes.button.setAttribute('fill', '#B6BF30')
                        hideTextBlock(element.childNodes.button.id, cellView.model)
                    }
                    else if(element.childNodes.button.id == "Methods"){
                        element.childNodes.button.setAttribute('fill', '#04C3D6')
                        hideTextBlock(element.childNodes.button.id, cellView.model)
                    }


                });
            }else {
                console.log();
            }
        });
    } catch (error) {
        console.error();
    }
})


// Function to animate showing or hiding an element
function animateTextBlock(htmlEl, show) {
    const duration = 1000; // Animation duration in milliseconds
    const startValue = show ? 0 : 1;
    const endValue = show ? 1 : 0;
    const property = 'opacity';
    htmlEl.style[property] = startValue;
    htmlEl.animate(
        { [property]: [startValue + 0.3, endValue] },
        { duration: duration, fill: 'forwards' }
    );
}

function hideTextBlock(buttonId, model){
    const allowedButtonIds = ["Outputs", "Roles", "Resources", "Participants", "Methods", "Considerations", "Activities"];
    if(allowedButtonIds.includes(buttonId)){
        var textBlock = document.getElementById(buttonId + model.id)
        if(textBlock){
            textBlock.style.visibility = "hidden"
        }else{
            console.log()
        }
    }else{
        var textBlock = document.getElementById(model.id)
        if(textBlock){
            textBlock.style.visibility = "hidden"
        }else{
            console.log()
        }
    }
}


function displayTextBlock(textBlock){
    clearTimeout(timeoutID)
    timeoutID = setTimeout(function() {
        animateTextBlock(textBlock, true)
        textBlock.style.visibility = "visible";
    }, 2000);
}

// Create a function to display a message
function showMessage(messageBlock, duration) {
    messageBlock.set('hidden', false)
    setTimeout(function() {
        messageBlock.set('hidden', true); // Remove the message after the specified duration
    }, duration);
}