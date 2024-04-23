/*
    * This function is used to creates HTML text block to describe the given element when hovered.
    * @param - {Object}: element, Element to which the text block is attached.
    * @param - {Object}: Node, graph object to retrive the description, id.
    * @param - {Object}: parentNode, this element is used to assign the ids to the HTML text blocks.
*/
function createTextBlock(element, node, parentNode){
    var elementView = paper.findViewByModel(element)
    // Draw an HTML rectangle above the element.
    var div = document.createElement('div');
    //parentElementView.el.style.position = "relative"
    if(!node['name']){
        node = findNode(node)
    }
    div.style.position = 'absolute';
    div.style.background = 'lightgrey';
    div.textContent = node['description']
    var length = element * 2
    div.style.width = 300 + 'px';
    div.style.height = (length) + 'px';
    div.style.border = "1px solid black";
    div.style.fontWeight = "bold"
    div.style.fontSize = "20px"
    div.id = element.id
    div.style.fontFamily = "Cambria"
    div.style.lineBreak = 0.5
    div.style.visibility = "hidden"
    div.style.backgroundColor = "lightgrey"
    if(element.attributes.name['first'] == "Outcomes"){
        div.id = "Activities" + element.id
        div.textContent = "Activities that results in " + element.attr('label')['text']
        var considerationDiv = div.cloneNode(true)
        considerationDiv.id = "Considerations" + element.id
        considerationDiv.textContent = "Consideration for " + element.attr('label')['text']
        paper.el.appendChild(considerationDiv);
        paper.el.appendChild(div);
    }
    if(element.attributes.name['first'] == "Topics"){
        var considerationDiv = div.cloneNode(true)
        considerationDiv.id = "Considerations" + element.id
        considerationDiv.textContent = "Consideration for " + element.attr('label')['text']
        paper.el.appendChild(considerationDiv);
    }
    if(element.attributes.name['first'] == "Outputs"){
        div.id = "Outputs" + parentNode.id
        div.textContent = "Outputs of  " + parentNode.attr('label')['text']
        paper.el.appendChild(div);
    }
    if(element.attributes.name['first'] == "Methods"){
        div.id = "Methods" + parentNode.id
        div.textContent = "Methods for  " + parentNode.attr('label')['text']
        paper.el.appendChild(div);
    }
    if(element.attributes.name['first'] == "Participants"){
        div.id = "Participants" + parentNode.id
        div.textContent = "Participants in  " + parentNode.attr('label')['text']
        paper.el.appendChild(div);
    }
    if(element.attributes.name['first'] == "Resources"){
        div.id = "Resources" + parentNode.id
        div.textContent = "Resources used by  " + parentNode.attr('label')['text']
        paper.el.appendChild(div);
    }
    if(element.attributes.name['first'] == "Roles"){
        div.id = "Roles" + parentNode.id
        div.textContent = "Roles involved in  " + parentNode.attr('label')['text']
        paper.el.appendChild(div);
    }
    if(node['description'] != null){
        paper.el.appendChild(div);
    }else{
        if(elementView){
            if(elementView.model.attributes.name['first'] == "Considerations"){
            elementView.removeTools()
            }
    }
        console.warn()
    }
}

/*
    * This function is used to creates HTML text block to describe the given element when hovered. A seperate funciton for Subtopics as there is no sub-topic element created
    * @param - {string}: subTopic, Description of the subtopic
    * @param - {Object}: parentNode, this element is used to assign the ids to the HTML text blocks.
*/
function subTopicTextBlock(subTopic, parentNode){
    var bbox = parentNode.getBBox();
    var paperRect1 = paper.localToPaperRect(bbox);
    // Draw an HTML rectangle above the element.
    var div = document.createElement('div');
    //nodeCellView.el.style.position = "relative"
    div.style.position = 'absolute';
    div.style.background = 'whitesmoke';
    div.textContent = subTopic
    var length = subTopic * 2
    div.style.width = ((paperRect1.width)/2) + 'px';
    div.style.height = (length) + 'px';
    div.style.border = "1px solid black";
    div.style.fontWeight = "bold"
    div.style.fontSize = "20px"
    div.id = parentNode.id
    div.style.fontFamily = "Cambria"
    div.style.lineBreak = 0.5
    div.style.visibility = "hidden"
    paper.el.appendChild(div);
}

/*
    *This function creates error text block to display errors if any.
    * @param {Object}, type: Represents the element where the error occurred from
    * @return, it returns the text block with an okay button embeded in it.
*/
function createErrorBlock(type){
    var errorRect = new joint.shapes.standard.Rectangle();
    errorRect.resize(220, 120);
    errorRect.position(230, 10);
    errorRect.attr('root/title', 'joint.shapes.standard.TextBlock');
    errorRect.attr('body/fill', '#FF9292');
    errorRect.attr('label/text', 'You must rate progress\n on one or more Outcomes\n in order to '+  type + ' scores.');
    errorRect.attr('label/fontSize', 15);
    errorRect.attr('label/fontFamily', "sans-serif");
    errorRect.attr('label/font-weight', "bold");
    errorRect.attr('label/fill', "#8C0000");
    errorRect.attr('body/stroke', "#FF9292")
    errorRect.attr('body/rx', '5')
    errorRect.attr('body/ry', '5')
    errorRect.prop('name/first', "Okay")
    errorRect.id = (type)
    // Styling of the label via `style` presentation attribute (i.e. CSS).
    errorRect.attr('label/style/color', 'red');
    graph.addCells(errorRect)

    var oKayButtonTools = []
    var okayPort = createPort("Okay", "Port 2","10%", "100%")
    errorRect.addPort(okayPort)
    var okayButton = createOkayButton(okayPort)
    oKayButtonTools.push(okayButton)
    toolsView = new joint.dia.ToolsView({ tools: oKayButtonTools});
    //Create an element view
    var elementView = errorRect.findView(paper)
    //Embed tthe tools view in to the element view
    elementView.addTools(toolsView);
    //return toolsView
    var label = (errorRect.attr('label'))
    label.refY = "40%"
    errorRect.set("hidden", true)
    return errorRect;
}



function createSuccessButton(type){
    var successButton = new joint.shapes.standard.Rectangle();
    successButton.resize(220, 40);
    successButton.position(50, 120);
    successButton.attr('root/title', 'joint.shapes.standard.TextBlock');
    successButton.attr('body/fill', '#A8FF9B');
    successButton.attr('label/text', 'Download Successful');
    successButton.attr('label/fontSize', 15);
    successButton.attr('label/fontFamily', "sans-serif");
    successButton.attr('label/font-weight', "bold");
    successButton.attr('label/fill', "#0B5900");
    successButton.attr('body/stroke', "#A8FF9B")
    successButton.attr('body/rx', '5')
    successButton.attr('body/ry', '5')
    successButton.prop('name/first', "Okay")
    successButton.id = (type)
    // Styling of the label via `style` presentation attribute (i.e. CSS).
    successButton.attr('label/style/color', 'red');
    graph.addCells(successButton)
    successButton.set("hidden", true)
    return successButton;
}


function createResetBlock(type){
    var errorRect = new joint.shapes.standard.Rectangle();
    errorRect.resize(220, 120);
    errorRect.position(230, 10);
    errorRect.attr('root/title', 'joint.shapes.standard.TextBlock');
    errorRect.attr('body/fill', '#FF9292');
    errorRect.attr('label/text', 'You must rate progress\n on one or more Outcomes\n in order to '+  type + ' scores.');
    errorRect.attr('label/fontSize', 15);
    errorRect.attr('label/fontFamily', "sans-serif");
    errorRect.attr('label/font-weight', "bold");
    errorRect.attr('label/fill', "#8C0000");
    errorRect.attr('body/stroke', "#FF9292")
    errorRect.attr('body/rx', '5')
    errorRect.attr('body/ry', '5')
    errorRect.prop('name/first', "Okay")
    errorRect.id = (type)
    // Styling of the label via `style` presentation attribute (i.e. CSS).
    errorRect.attr('label/style/color', 'red');
    graph.addCells(errorRect)

    var oKayButtonTools = []
    var okayPort = createPort("Okay", "Port 2","10%", "100%")
    errorRect.addPort(okayPort)
    var okayButton = createOkayButton(okayPort)
    oKayButtonTools.push(okayButton)
    toolsView = new joint.dia.ToolsView({ tools: oKayButtonTools});
    //Create an element view
    var elementView = errorRect.findView(paper)
    //Embed tthe tools view in to the element view
    elementView.addTools(toolsView);
    //return toolsView
    var label = (errorRect.attr('label'))
    label.refY = "40%"
    errorRect.set("hidden", true)
    return errorRect;
}
