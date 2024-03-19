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
