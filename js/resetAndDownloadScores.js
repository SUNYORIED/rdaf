let headersAdded = false;


//Check all the open outcomes and look for scores
function FindOpenOutcomes(){
    let data = []
    const elements = (graph.getElements())
    elements.forEach(el =>{
        if(!el.get('hidden')){
            if(el.prop('name/first') == "Outcomes"){
                const status = checkStatus(el)
                if(status == true){
                    const outcomes = el
                    const csvData = collectData(outcomes)
                    data.push(csvData)
                }
            }
        }
    })
    const csvFormatData = csvFormat(data)
    var filename = getFileName()
    const file = downloadCSVFile(csvFormatData, filename)
    return file
}


/*
    @param: {model}, JointJS element
    This function checks if an outcomes has a score yet or not
*/
function checkStatus(model){
    var elementView = paper.findViewByModel(model)
    var circleElements = elementView._toolsView.$el[0].querySelectorAll('circle')
    let status = [];
    circleElements.forEach(radioButton =>{
        const currentColor = radioButton.getAttribute('fill')
        if(currentColor != "white"){
            status.push(true)
        }else{
            status.push(false)
        }
    })
    for(const check of status){
        if(check == true){
            return true
        }
    }
}


function collectData(model){
    const outcomeID = model.id
    const outcomeName = model.attr('label/text')
    var score = getScore(model)
    if(score == 0){
        score = "Not Started"
    }else if(score == 1){
        score = "In Progress"
    }else if(score == 2){
        score = "Achieved"
    }else{
        score = "null"
    }
    const date = getDate();
    const subTopicName = document.getElementById(model.id).textContent
    const subTopicID = getSubTopic(model)
    const [topicID, topicName, topic] = getTopic(model)
    const [stageID, stageName] = getStage(topic)
    const data = {
        "Stage ID": stageID,
        "Stage Name": stageName,
        "Topic ID": topicID,
        "Topic Name": topicName,
        "Sub-Topic ID": subTopicID,
        "Sub-Topic Name": subTopicName + "\n",
        "Outcome ID": outcomeID,
        "Outcome Name": outcomeName,
        "Score": score,
        "Date": date
    }
    return data
}

function getDate(){
    var currentDate = new Date();
    var year = currentDate.getFullYear();
    var month = currentDate.getMonth() + 1; // Months are zero-based (0 for January)
    var day = currentDate.getDate();
    const date = month + "/" + day + "/" + year
    return date
}

function getTopic(model){
    var sourceLink = graph.getConnectedLinks(model, {inbound:true})[0]
    var sourceElement = sourceLink.get("source").id
    var sourceCell = graph.getCell(sourceElement)
    return [sourceElement, sourceCell.attr('label/text'), sourceCell]
}

function getStage(model){
    var sourceLink = graph.getConnectedLinks(model, {inbound:true})[0]
    var sourceElement = sourceLink.get("source").id
    var sourceCell = graph.getCell(sourceElement)
    return [sourceElement, sourceCell.attr('label/text')]
}

function getSubTopic(model){
    const node = findNode(model.id)
    const subTopicNode = node['sunyrdaf:extends']
    if(subTopicNode['@id']){
        return subTopicNode['@id']
    }else{
        return subTopicNode
    }
}


function csvFormat(data){
    let csvData;
    if(!headersAdded){
        csvData = json2csv.parse(data, {headers: true})
        headersAdded = true
    }else{
        csvData = json2csv.parse(data, {headers: false})
    }
    return csvData
}



function downloadCSVFile(csvData, filename){
    // Creating a Blob for having a csv file format
    // and passing the data with type
    filename = filename + '.csv'
    const blob = new Blob([csvData], { type: 'text/csv' });
    // Creating an object for downloading url
    const url = window.URL.createObjectURL(blob)
    // Creating an anchor(a) tag of HTML
    const anchor = document.createElement('a')
    // Passing the blob downloading url
    anchor.setAttribute('href', url)
    // Setting the anchor tag attribute for downloading
    // and passing the download file name
    anchor.setAttribute('download', filename);
    // Performing a download with click
    anchor.click()
}

function getFileName(){
    var input = prompt("Please enter the File Name:");
    filename = input
    // Check if the user provided input
    if (filename != null) {
        return filename
    } else {
        filename = "RDaF Navigator Scores"
        return filename
    }

}


/*
    This function finds all the open outcomes and resets all the socres
*/
function FindOpenOutcomesAndReset(){
    const elements = (graph.getElements())
    elements.forEach(el =>{
        if(!el.get('hidden')){
            if(el.prop('name/first') == "Outcomes"){
                const outcomes = el
                resetScore(outcomes)
            }
        }
    })
    doLayout()
}

/*
    * Listens to an onclick event on the reset Button
    * @param {Object} model - svg element from the graph
    * This function resets the color of the score cards and if any of its activities are open, it closes the rest of the graph.
    * Changes the color of the radio buttons to white and also hides the activity and consideration button
    *
*/
function resetScore(model){
    var elementView = paper.findViewByModel(model)
    var circleElements = elementView._toolsView.$el[0].querySelectorAll('circle')
    var activityButton = elementView._toolsView.tools[1].el
    var considerationButton = elementView._toolsView.tools[0].$el[0]
    var rectElement = (elementView.el.querySelector('rect'))
    circleElements.forEach(radioButtons =>{
        if(((radioButtons.id.startsWith('N') || radioButtons.id.startsWith('P')) && radioButtons.getAttribute('fill') != "white" && (model.getBBox().width != rectElement.getAttribute('width')))){
            var OriginalWidth = parseInt(rectElement.getAttribute('width')) - 115
            rectElement.setAttribute('width', OriginalWidth)
            return
        }
    })
    activityButton.style.visibility = "hidden"
    considerationButton.style.visibility = "hidden"
    circleElements.forEach(radioButtons =>{
        var currentColor = radioButtons.getAttribute('fill')
        if(radioButtons.id.startsWith('A')){
            radioButtons.setAttribute('fill', 'white')
        }else if(radioButtons.id.startsWith('P')){
            if(currentColor == "#D86C00"){
                closeTheRest(model)
                radioButtons.setAttribute('fill', 'white')
            }else{
                radioButtons.setAttribute('fill', 'white')
            }
        }else if(radioButtons.id.startsWith('N')){
            if(currentColor == "#AB0606"){
                closeTheRest(model)
                radioButtons.setAttribute('fill', 'white')
            }else{
                radioButtons.setAttribute('fill', 'white')
            }
        }
    })
}

function getScore(model) {
    return scorecard[model.id];
}

function updateScorecard(model,score) {
    scorecard[model.id] = score;
}