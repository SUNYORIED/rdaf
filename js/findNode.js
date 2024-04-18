/*
    * Creates Output, Participants, Methods, Resources, Roles, and considerations elements for Activities
    * @param - {Object} activity: Activity Node that extends the above elements.
    * @param - {Object []} arr: Array to store the elements.
    * @param - {Object} parentNode: Activity element
*/
function checkForActivitiesTarget(activity, arr, parentNode){
    const targetNode = activity['sunyrdaf:includes']
    if(activity['sunyrdaf:generates']){
        if(Array.isArray(activity['sunyrdaf:generates'])){
        activity['sunyrdaf:generates'].forEach(node =>{
            if(node['name'] == undefined){
            node = findNode(node)
            var outputElement = linkNodes(node, arr, parentNode, "Outputs")
            }else{
            var outputElement = linkNodes(node, arr, parentNode, "Outputs")
            }
        })
        }else{
        if(activity['sunyrdaf:generates']['name'] == undefined){
            activity['sunyrdaf:generates'] = findNode(activity['sunyrdaf:generates'])
            var outputElement = linkNodes(activity['sunyrdaf:generates'], arr, parentNode, "Outputs")
        }else{
            var outputElement = linkNodes(activity['sunyrdaf:generates'], arr, parentNode, "Outputs")
        }
        }
    }const nodeTypes = ["sunyrdaf:Method", "sunyrdaf:Participant", "sunyrdaf:Role", "sunyrdaf:Resource"]
    if(Array.isArray(activity['sunyrdaf:includes'])){
        activity['sunyrdaf:includes'].forEach(node =>{
            if(node['name']){
                if(node['@type'] == "sunyrdaf:Method" || node['@type'] == "https://data.suny.edu/vocabs/oried/rdaf/suny/Method"){
                    var methodElement = linkNodes(node, arr, parentNode, "Methods")
                }
                if(node['@type'] == "sunyrdaf:Participant" || node['@type'] == "https://data.suny.edu/vocabs/oried/rdaf/suny/Participant"){
                    var participantElement = linkNodes(node, arr, parentNode, "Participants")
                }
                if(node['@type'] == "sunyrdaf:Role" || node['@type'] == "https://data.suny.edu/vocabs/oried/rdaf/suny/Role"){
                    var roleElement = linkNodes(node, arr, parentNode, "Roles")
                }
                if(node['@type'] == "sunyrdaf:Resource" || node['@type'] == "https://data.suny.edu/vocabs/oried/rdaf/suny/Resource"){
                    var resourceElement = linkNodes(node, arr, parentNode, "Resources")
                }
                if(!nodeTypes.includes(node['@type'])){
                    var considerationElement = checkForConsiderations(node, arr, parentNode)         //Links the element to its consideration element
                }
            }else{
                node = findNode(node)

                if(node['@type'] == "sunyrdaf:Method" || node['@type'] == "https://data.suny.edu/vocabs/oried/rdaf/suny/Method"){
                    var methodElement = linkNodes(node, arr, parentNode, "Methods")
                }
                if(node['@type'] == "sunyrdaf:Participant" || node['@type'] == "https://data.suny.edu/vocabs/oried/rdaf/suny/Participant"){
                    var participantElement = linkNodes(node, arr, parentNode, "Participants")
                }
                if(node['@type'] == "sunyrdaf:Role" || node['@type'] == "https://data.suny.edu/vocabs/oried/rdaf/suny/Role"){
                    var roleElement = linkNodes(node, arr, parentNode, "Roles")
                }
                if(node['@type'] == "sunyrdaf:Resource" || node['@type'] == "https://data.suny.edu/vocabs/oried/rdaf/suny/Resource"){
                    var resourceElement = linkNodes(node, arr, parentNode, "Resources")
                }
                if(!nodeTypes.includes(node['@type'])){
                    var considerationElement = checkForConsiderations(node, arr, parentNode)         //Links the element to its consideration element
                }
            }
        })
    }else{
        if(targetNode['name'] == undefined){
            targetNode = findNode(targetNode)
            if(targetNode['@type'] == "sunyrdaf:Method" || targetNode['@type'] == "https://data.suny.edu/vocabs/oried/rdaf/suny/Method"){
                var methodElement = linkNodes(targetNode, arr, parentNode, "Methods")
                }
            if(targetNode['@type'] == "sunyrdaf:Participant" || targetNode['@type'] == "https://data.suny.edu/vocabs/oried/rdaf/suny/Participant"){
                var participantElement = linkNodes(targetNode, arr, parentNode, "Participants")
            }
            if(targetNode['@type'] == "sunyrdaf:Role" || targetNode['@type'] == "https://data.suny.edu/vocabs/oried/rdaf/suny/Role"){
                console.log(targetNode)
                var roleElement = linkNodes(targetNode, arr, parentNode, "Roles")
            }
            if(targetNode['@type'] == "sunyrdaf:Resource" || targetNode['@type'] == "https://data.suny.edu/vocabs/oried/rdaf/suny/Resource"){
                var resourceElement = linkNodes(targetNode, arr, parentNode, "Resources")
            }
            if(!nodeTypes.includes(targetNode['@type'])){
                var considerationElement = checkForConsiderations(targetNode, arr, parentNode)       //Links the element to its consideration element
            }
        }else{
            if(targetNode['@type'] == "sunyrdaf:Method" || targetNode['@type'] == "https://data.suny.edu/vocabs/oried/rdaf/suny/Method"){
                var methodElement = linkNodes(targetNode, arr, parentNode, "Methods")
            }
            if(targetNode['@type'] == "sunyrdaf:Participant" || targetNode['@type'] == "https://data.suny.edu/vocabs/oried/rdaf/suny/Participant"){
                console.log(targetNode)
                var participantElement = linkNodes(targetNode, arr, parentNode, "Participants")
            }
            if(targetNode['@type'] == "sunyrdaf:Role" || targetNode['@type'] == "https://data.suny.edu/vocabs/oried/rdaf/suny/Role"){
                var roleElement = linkNodes(targetNode, arr, parentNode, "Roles")
            }
            if(targetNode['@type'] == "sunyrdaf:Resource" || targetNode['@type'] == "https://data.suny.edu/vocabs/oried/rdaf/suny/Resource"){
                var resourceElement = linkNodes(targetNode, arr, parentNode, "Resources")
            }
            if(!nodeTypes.includes(targetNode['@type'])){
                var considerationElement = checkForConsiderations(targetNode, arr, parentNode)      //Links the element to its consideration element
            }
        }
    }
}

/*
    Finds the node from the data file.
    * @param - {Object} undefinedNode: Node that has name and id undefined.
*/
function findNode(undefinedNode){
    for (const nodes of duplicateFrame) {
        if(nodes['@id'] == undefinedNode){
        return nodes
        }
    }
}
