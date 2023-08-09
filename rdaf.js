function init() {

  // Since 2.2 you can also author concise templates with method chaining instead of GraphObject.make
  // For details, see https://gojs.net/latest/intro/buildingObjects.html
  const $ = go.GraphObject.make;  // for conciseness in defining templates

  myDiagram = new go.Diagram("myDiagramDiv",  // must name or refer to the DIV HTML element
    {
      initialContentAlignment: go.Spot.Left,
      allowSelect: false,  // the user cannot select any part
      // create a TreeLayout for the decision tree
      layout: $(go.TreeLayout, { arrangement: go.TreeLayout.ArrangementFixedRoots })
    });

  // custom behavior for expanding/collapsing half of the subtree from a node
  function buttonExpandCollapse(e, port,category) {
    var node = port.part;
    node.diagram.startTransaction("expand/collapse");
    var portid = port.portId;
    console.log(portid);
    node.findLinksOutOf(portid).each(l => {
      if (l.visible) {
        // collapse whole subtree recursively
        collapseTree(node, portid);
      } else {
        // only expands immediate children and their links
        l.visible = true;
        var n = l.getOtherNode(node);
        if (n !== null && (category == null || n.category === category)) {
          n.location = node.getDocumentPoint(go.Spot.TopRight);
          n.visible = true;
        }
      }
    });
    myDiagram.toolManager.hideToolTip();
    node.diagram.commitTransaction("expand/collapse");
  }

  function buttonExpandCollapseActivity(e, port) {
      buttonExpandCollapse(e,port,'activity')
  }

  function buttonExpandCollapseConsideration(e, port) {
      buttonExpandCollapse(e,port,'consideration')
  }

  // recursive function for collapsing complete subtree
  function collapseTree(node, portid) {
    node.findLinksOutOf(portid).each(l => {
      l.visible = false;
      var n = l.getOtherNode(node);
      if (n !== null) {
        n.visible = false;
        collapseTree(n, null);  // null means all links, not just for a particular portId
      }
    });
  }

  // get the text for the tooltip from the data on the object being hovered over
  function tooltipTextConverter(data) {
    var str = "";
    var e = myDiagram.lastInput;
    var currobj = e.targetObject;
    if (currobj !== null && (currobj.name === "ButtonA" ||
      (currobj.panel !== null && currobj.panel.name === "ButtonA"))) {
      str = data.aToolTip;
    } else {
      str = data.bToolTip;
    }
    return str;
  }

  // define tooltips for buttons
  var tooltipTemplate =
    $("ToolTip",
      { "Border.fill": "whitesmoke", "Border.stroke": "lightgray" },
      $(go.TextBlock,
        {
          font: "8pt sans-serif",
          wrap: go.TextBlock.WrapFit,
          desiredSize: new go.Size(200, NaN),
          alignment: go.Spot.Center,
          margin: 6
        },
        new go.Binding("text", "", tooltipTextConverter))
    );

  // define the Node template for non-leaf nodes
  myDiagram.nodeTemplateMap.add("topic",
    $(go.Node, "Auto",
      new go.Binding("text", "text"),
      // define the node's outer shape, which will surround the Horizontal Panel
      $(go.Shape, "Rectangle",
        { fill: "whitesmoke", stroke: "lightgray" }),
      // define a horizontal Panel to place the node's text alongside the buttons
      $(go.Panel, "Horizontal",
        $(go.TextBlock,
          { font: "30px Roboto, sans-serif", margin: 5 },
          new go.Binding("text", "text")),
        // define a vertical panel to place the node's two buttons one above the other
        $(go.Panel, "Vertical",
          { defaultStretch: go.GraphObject.Fill, margin: 3 },
          $("Button",  // button A
            {
              name: "ButtonA",
              click: buttonExpandCollapse,
              toolTip: tooltipTemplate
            },
            new go.Binding("portId", "a"),
            $(go.TextBlock,
              { font: '500 16px Roboto, sans-serif' },
              new go.Binding("text", "aText"))
          )  // end button A
        )  // end Vertical Panel
      )  // end Horizontal Panel
    ));  // end Node and call to add
  myDiagram.nodeTemplateMap.add("topic-multi",
    $(go.Node, "Auto",
      new go.Binding("text", "text"),
      // define the node's outer shape, which will surround the Horizontal Panel
      $(go.Shape, "Rectangle",
        { fill: "whitesmoke", stroke: "lightgray" }),
      // define a horizontal Panel to place the node's text alongside the buttons
      $(go.Panel, "Horizontal",
        $(go.TextBlock,
          { font: "30px Roboto, sans-serif", margin: 5 },
          new go.Binding("text", "text")),
        // define a vertical panel to place the node's two buttons one above the other
        $(go.Panel, "Vertical",
          { defaultStretch: go.GraphObject.Fill, margin: 3 },
          $("Button",  // button A
            {
              name: "ButtonA",
              click: buttonExpandCollapse,
              toolTip: tooltipTemplate
            },
            new go.Binding("portId", "a"),
            $(go.TextBlock,
              { font: '500 16px Roboto, sans-serif' },
              new go.Binding("text", "aText"))
          ),  // end button A
          $("Button",  // button B
            {
              name: "ButtonB",
              click: buttonExpandCollapse,
              toolTip: tooltipTemplate
            },
            new go.Binding("portId", "b"),
            $(go.TextBlock,
              { font: '500 16px Roboto, sans-serif' },
              new go.Binding("text", "bText"))
          )  // end button B
        )  // end Vertical Panel
      )  // end Horizontal Panel
    ));  // end Node and call to add

  myDiagram.nodeTemplateMap.add("activity",
    $(go.Node, "Auto",
      new go.Binding("text", "text"),
      // define the node's outer shape, which will surround the Horizontal Panel
      $(go.Shape, "Rectangle",
        { fill: "whitesmoke", stroke: "lightgray" }),
      // define a horizontal Panel to place the node's text alongside the buttons
      $(go.Panel, "Horizontal",
        $(go.TextBlock,
          { font: "30px Roboto, sans-serif", margin: 5 },
          new go.Binding("text", "text")),
        // define a vertical panel to place the node's two buttons one above the other
        $(go.Panel, "Vertical",
          { defaultStretch: go.GraphObject.Fill, margin: 3 },
          $("Button",  // button A
            {
              name: "ButtonA",
              click: buttonExpandCollapse,
              toolTip: tooltipTemplate
            },
            new go.Binding("portId", "a"),
            $(go.TextBlock,
              { font: '500 16px Roboto, sans-serif' },
              new go.Binding("text", "aText"))
          ),  // end button A
          $("Button",  // button B
            {
              name: "ButtonB",
              click: buttonExpandCollapse,
              toolTip: tooltipTemplate
            },
            new go.Binding("portId", "b"),
            $(go.TextBlock,
              { font: '500 16px Roboto, sans-serif' },
              new go.Binding("text", "bText"))
          ),  // end button B
          $("Button",  // button C
            {
              name: "ButtonC",
              click: buttonExpandCollapse,
              toolTip: tooltipTemplate
            },
            new go.Binding("portId", "c"),
            $(go.TextBlock,
              { font: '500 16px Roboto, sans-serif' },
              new go.Binding("text", "cText"))
          )  // end button C
        )  // end Vertical Panel
      )  // end Horizontal Panel
    ));  // end Node and call to add

  // define the Node template for leaf nodes
  myDiagram.nodeTemplateMap.add("consideration",
    $(go.Node, "Auto",
      new go.Binding("text", "text"),
      $(go.Shape, "Rectangle",
        { fill: "whitesmoke", stroke: "lightgray" }),
      $(go.TextBlock,
        {
          font: '13px Roboto, sans-serif',
          wrap: go.TextBlock.WrapFit, desiredSize: new go.Size(200, NaN), margin: 5
        },
        new go.Binding("text", "text"))
    ));

  // define the only Link template
  myDiagram.linkTemplate =
    $(go.Link, go.Link.Orthogonal,  // the whole link panel
      { fromPortId: "" },
      new go.Binding("fromPortId", "fromport"),
      $(go.Shape,  // the link shape
        { stroke: "lightblue", strokeWidth: 2 })
    );

  // create the model for the decision tree
  var model =
    new go.GraphLinksModel(
      { linkFromPortIdProperty: "fromport" });
  // set up the model with the node and link data
  makeNodes(model);
  myDiagram.model = model;

  // make all but the start node invisible
  myDiagram.nodes.each(n => {
    if (n.text !== "Topics") n.visible = false;
  });
  myDiagram.links.each(l => {
    l.visible = false;
  });
}

function makeNodes(model) {
  var nodeDataArray = [
    { key: "Start",
      text: "Topics",
      category: "topic-multi",
      a: "Topic-DG",
      aText: "Data Governance",
      aToolTip: "Policies, procedures, and processes to manage and monitor organizational requirements, regulatory and legal responsibilities and risks.",
      b: "Topic-DC",
      bText: "Data Culture & Reward Structure",
      bToolTip: "Practices and norms in an organization including the customs, arts, social institutions, and achievements. Practices designed to recognize the advantages and accomplishments of sharing data",
    },  // the root node
    { key: "Topic-DG",
      text: "Outcomes",
      category: "topic-multi",
      a: "Outcome-DGPolicy",
      aText: "Policy",
      aToolTip: "Data Governance Policies.",
      b: "Outcome-DGProcedures",
      bText: "Procedures",
      bToolTip: "Data Governance Procedures.",
    },
    { key: "Outcome-DGPolicy",
      category: "topic-multi",
      text: "Indicators",
      a: "Outcome-DGPolicy-MV",
      aText: "Mission and Vision",
      aToolTip: "A clearly articulated mission and vision for governance of research data.",
      b: "Outcome-DGRACI",
      bText: "RACI chart",
      bToolTip: "Clear articulation of roles and responsibilities for Research Data Management",
    },
    { key: "Indicator-MissionVision-Activities",
      a: "Indicator-MissionVision-A",
      text: "Activities",
      aText: "Expand/Collapse",
      aToolTip: "Mission Vision Activities",
      category: "topic"
    },
    { key: "Indicator-MissionVision-Considerations",
      a: "Indicator-MissionVision-B",
      text: "Considerations",
      aText: "Expand/Collapse",
      aToolTip: "Mission Vision Considerations",
      category: "topic"
    },
    { key: "Indicator-OtherIndicator",
      a: "Indicator-OtherIndicator-A",
      aText: "Activities",
      text: "Other Activities",
      category: "activity"
    },
    { key: "Activity-Vision",
      text: "Define organizational vision.",
      category: "activity",
      a: "AVP",
      aText: "Participants",
      b: "AVM",
      bText: "Methods",
      c: "AVC",
      cText: "Exemplars",
    },
    { key: "Consideration-Values",
      a: "Consideration-Values",
      text: "Organizational Values, including DEI",
      category: "consideration"
    },
    { key: "Consideration-POVData",
      a: "Consideration-POVData",
      text: "Purpose and value of data",
      category: "consideration"
    },
    { key: "Consideration-FAIRData",
      a: "Consideration-FAIRData",
      text: "Organization intent regarding FAIR Data",
      category: "consideration"
    },
    
	
  ];
   var linkDataArray = [
       { from: "Start", fromport: "Topic-DG", to: "Topic-DG" },
       { from: "Topic-DG", fromport: "Outcome-DGPolicy", to: "Outcome-DGPolicy" },
       { from: "Outcome-DGPolicy", fromport: "Outcome-DGPolicy-MV", to: "Indicator-MissionVision-Activities" },
       { from: "Outcome-DGPolicy", fromport: "Outcome-DGPolicy-MV", to: "Indicator-MissionVision-Considerations" },
       { from: "Indicator-MissionVision-Activities", fromport: "Indicator-MissionVision-A", to: "Activity-Vision" },
       { from: "Indicator-MissionVision-Considerations", fromport: "Indicator-MissionVision-B", to: "Consideration-Values" },
       { from: "Indicator-MissionVision-Considerations", fromport: "Indicator-MissionVision-B", to: "Consideration-POVData" },
       { from: "Indicator-MissionVision-Considerations", fromport: "Indicator-MissionVision-B", to: "Consideration-FAIRData" },
        
   ]
  model.nodeDataArray = nodeDataArray;
  model.linkDataArray = linkDataArray;
}

window.addEventListener('DOMContentLoaded', init);
