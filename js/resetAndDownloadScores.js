let headersAdded = false;   //Boolean var to add a single header to the CSV file.


/*
    Finds the Open Outcomes on the graph and Checks it Score status.
    Stores the Status of the scores to the CSV file.
*/
function FindOpenOutcomes(){
    let data = []
    const elements = (graph.getElements())
    elements.forEach(el =>{
        if(!el.get('hidden')){
            if(el.prop('name/first') == "Outcomes"){
                const outcomes = el
                const csvData = collectData(outcomes)
                data.push(csvData)
                /*const status = checkStatus(el)
                if(status == true){
                    This is the condition set if only scored outcomes are to be downloaded.
                }*/
            }
        }
    })
    const csvFormatData = csvFormat(data)
    var filename = getFileName()
    var file;
    if(csvFormatData != undefined){
        file = downloadCSVFile(csvFormatData, filename)
        animateElement(successButton, true)
        //successButton.set('hidden', false)
        showMessage(successButton, 6000)
    }else{
        console.error("No Data to be downloaded.")
    }


    return file
}


/*
    @param - {Object}: model, JointJS element
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

/*
    * Starts collecting data from the outcome.
    * Data Collected: Stage ID, Stage Name, Topic ID, Topic Name, Sub-Topic ID, Sub-Topic Name, Outcome ID, Outcome Name, Score, Date.
    * @param - {Object}: model, JointJS element
*/
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

//This function return the current date.
function getDate(){
    var currentDate = new Date();
    var year = currentDate.getFullYear();
    var month = currentDate.getMonth() + 1; // Months are zero-based (0 for January)
    var day = currentDate.getDate();
    const date = month + "/" + day + "/" + year
    return date
}

/*
    * Returns the topic element linked to the Outcome
    * @param - {Object}: model, JointJS element.
*/
function getTopic(model){
    var sourceLink = graph.getConnectedLinks(model, {inbound:true})[0]
    var sourceElement = sourceLink.get("source").id
    var sourceCell = graph.getCell(sourceElement)
    return [sourceElement, sourceCell.attr('label/text'), sourceCell]
}

/*
    * Returns the Stage element linked to the Topic
    * @param - {Object}: model, JointJS element.
*/
function getStage(model){
    var sourceLink = graph.getConnectedLinks(model, {inbound:true})[0]
    var sourceElement = sourceLink.get("source").id
    var sourceCell = graph.getCell(sourceElement)
    return [sourceElement, sourceCell.attr('label/text')]
}

/*
    * Returns the sub-topic linked to the Outcome
    * @param - {Object}: model, JointJS element.
*/
function getSubTopic(model){
    const node = findNode(model.id)
    const subTopicNode = node['sunyrdaf:extends']
    if(subTopicNode['@id']){
        return subTopicNode['@id']
    }else{
        return subTopicNode
    }
}

/*
    * This function converts the raw JSON data to CSV format
    * @param - {Object []}: data, An Array of raw JSON data.
*/
function csvFormat(data){
    let csvData;
    var status = checkForScoresOnOutcome()
    if(data.length > 0 && status == true){
        if(!headersAdded){
            csvData = json2csv.parse(data, {headers: true})
            headersAdded = true
        }else{
            csvData = json2csv.parse(data, {headers: false})
        }
    }else{
        animateElement(errorBlock, true)
        var status = checkForScoresOnOutcome()
        if(status == true){
            errorBlock.set('hidden', true)
        }else{
            //animateElement(errorBlock, true)
            errorBlock.set('hidden', false)
        }
    }
    return csvData
}


/*
    * This function creates a CSV file and downloads it to the Downlads dir.
    * @param - {Object}: csvData, Data in CSV format to be written to the file.
    * @param - {Object}: filename, File name of the file.
*/
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

/*
    * This function asks the user to input the file name.
*/
function getFileName(){
    var filename = "Scores"
    return filename
}


/*
    This function finds all the open outcomes and resets all the socres
*/
function FindOpenOutcomesAndReset(){
    const elements = (graph.getElements())
    var counter = 0
    var status = checkForScoresOnOutcome()
    animateElement(resetErrorBlock, true)
    elements.forEach(el =>{
        const outcomes = el
        if(!el.get('hidden') && el.prop('name/first') == "Outcomes"){
            counter++
            if(status == true){
                resetScore(outcomes)
            }else{
                resetErrorBlock.set('hidden', false)
            }
        }
    })
    if(counter == 0){
        resetErrorBlock.set('hidden', false)
    }
    doLayout()
}

/*
    * Listens to an onclick event on the reset Button
    * @param - {Object}: model - svg element from the graph
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
    //Checks if (In Progress or Not Started Button is selected, Checks if the width of the model is equal to its initial width, check the color of the buttons).
    circleElements.forEach(radioButtons =>{
        if(((radioButtons.id.startsWith('N') || radioButtons.id.startsWith('P')) && radioButtons.getAttribute('fill') != "white" && (model.getBBox().width != rectElement.getAttribute('width')))){
            var OriginalWidth = parseInt(rectElement.getAttribute('width')) - 115
            rectElement.setAttribute('width', OriginalWidth)
            return
        }
    })
    //Hides the buttons on the outcome element
    activityButton.style.visibility = "hidden"
    considerationButton.style.visibility = "hidden"
    //Resets the color of the radio buttons to white
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

/*
    * Returns the score of the Outcome.
    * @param - {Object}: mode, JointJS element.
*/
function getScore(model) {
    return scorecard[model.id];
}

/*
    * Updates the score of the outcome, as per the users input.
    * @param - {Object}: model, JointJS element.
    * @param - {Object}: score, Score input by the user.
*/
function updateScorecard(model,score) {
    scorecard[model.id] = score;
}

function checkForScoresOnOutcome(){
    var counter = 0
    var counter2 = 0
    var numOfButton = 0
    var elements = graph.getElements()
    elements.forEach(el =>{
        if(!el.get("hidden")){
            if(el.prop('name/first') == "Outcomes"){
                counter2++
                var elementView = paper.findViewByModel(el)
                var circleElements = elementView._toolsView.$el[0].querySelectorAll('circle')
                circleElements.forEach(radioButton =>{
                    var currentColor = radioButton.getAttribute('fill')
                    if(currentColor == "white"){
                        counter++
                    }else{
                        counter = 0
                    }
                    numOfButton++
                })
            }
        }
    })
    if(numOfButton != counter){
        return true
    }else{
        return false
    }
}