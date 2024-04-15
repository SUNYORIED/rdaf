function createTextBlock(element, node, parentNode){
    var elementView = paper.findViewByModel(element)
    // Draw an HTML rectangle above the element.
    var div = document.createElement('div');
    //parentElementView.el.style.position = "relative"
    if(!node['name']){
        node = findNode(node)
    }
    div.style.position = 'absolute';
    div.style.background = 'white';
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


function subTopicTextBlock(subTopic, parentNode){
    var bbox = parentNode.getBBox();
    var paperRect1 = paper.localToPaperRect(bbox);
    // Draw an HTML rectangle above the element.
    var div = document.createElement('div');
    //nodeCellView.el.style.position = "relative"
    div.style.position = 'absolute';
    div.style.background = 'white';
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