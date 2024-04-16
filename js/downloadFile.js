function downloadFile(model){
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
    const filename = getFileName(data['Outcome ID'])
    const csvFormatData = csvFormat(data)
    const file = downloadCSVFile(csvFormatData, filename)
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
    const csvData = json2csv.parse(data)
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
    const a = document.createElement('a')
    // Passing the blob downloading url
    a.setAttribute('href', url)
    // Setting the anchor tag attribute for downloading
    // and passing the download file name
    a.setAttribute('download', filename);

    // Performing a download with click
    a.click()
}

function getFileName(url){
    // Split the string by "/"
    const parts = url.split("/");
    // Extract the last part of the URL
    const outcomeNumber = parts[parts.length - 1];
    //Replace the Outcome.# with outcome_#
    const filename = outcomeNumber.replace(/\./g, "_");
    return filename
}