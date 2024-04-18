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

// const a = document.createElement('a')
// a.href = "https://www.google.com/"
// a.textContent = "NIST RDaF Framework"

// const headerText =
//     ` SUNY RDaF Explorer Prototype
//     This tool prototypes a way to explore using the `



// function headerBlock(){
//     const div = document.createElement('div');
//     const p = document.createElement('p')
//     p.textContent = 'SUNY RDaF Explorer Prototype This tool prototypes a way to explore using the ';

//     // Create the anchor element
//     const a = document.createElement('a');
//     var link = document.createTextNode("This is link");

//     // Set the href attribute for the anchor element
//     link.href = 'https://www.google.com/';

//     // Set the text content for the anchor element
//     link.textContent = 'NIST RDaF Framework';

//     // Append the anchor element to the paragraph
//     a.appendChild(link);
//     p.appendChild(a)
//     // Append the rest of the text content to the paragraph
//     p.textContent += ' to guide campus discussions around research data management activities, particularly the Envision and and Plan stages of the RDaF Framework. It incorporates a downloadable scorecard, intended to be completed interactively as part of the discussion. To develop this prototype, we have taken the liberty of expressing the RDaF as a graph model, and extending it with SUNY-created Outcomes and Activities. See the Wiki for more information on the data model. Scoring individual Outcomes as either Not Started or In Progress will expand the model to show proposed Activities and related elements. Hover your mouse over the RDaF Subtopic on an Activity to see the details of the RDaF subtopic the Activity and Outcome extend.';


//     div.appendChild(p)
//     div.style.width = "500px"
//     div.style.border = "2px solid black"
//     div.style.margin = "20px"
//     div.style.right = "100px"
//     //paper.el.appendChild(div);
// }

// headerBlock()