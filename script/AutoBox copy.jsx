var window = new Window("palette","",undefined);
window.orientation = "column";
var groupThree = window.add("group", undefined, "groupThree");
groupThree.orientation = "row";
var applyButton = groupThree.add("button", undefined, "Apply");

window.center();
window.show();

var comp = app.project.activeItem;

    var proj = app.project;
    var theComp = proj.activeItem;
    var selectedLayers1 = theComp.selectedLayers;

    function checkForTextLayers(layers)
    {
    var textLayers = [];
    for(var i=0;i < layers.length; i++)
    {
        if(layers[i].property("Source Text"))
        {
            textLayers.push(layers[i]);
        }
    }
        return textLayers;
    }

applyButton.onClick = function()
{
    if(app.project.activeItem == null){
        alert ("Select a comp")
        return false;
    }

    
    
    if(selectedLayers.length < 1){
        alert("Select a text layer");
        return false;
    }
    
    var checkedTextLayers = checkForTextLayers(selectedLayers1);
    if(checkedTextLayers.length < 1){
        alert("Select at least 1 text layer");
        return false;
    }

    alert("2");
  


    app.beginUndoGroup("Create Shape Layer");
    
    createBox(checkedTextLayers);

    app.endUndoGroup();

    
    
}


function createBox(layers)
{
   // var activeComp = layers[0].containingComp;

    for(var i=0; i<layers.length; i++)
    {
        alert("for loop");    
        // Create a new shape layer
            var shapeLayer = comp.layers.addShape();
            
            shapeLayer.name = "Text Box";
            
            // Add a rectangle shape to the shape layer
            
            var size = [200, 200];
            
            
            var shapeGroup = shapeLayer.content.addProperty("ADBE Vector Group");
            var pathGroup = shapeLayer.property("Contents").property("Group 1").property("Contents").addProperty("ADBE Vector Shape - Rect");
            
            //Add ex[ressions
            var codeSize = "aaaa"
            pathGroup.property("Size").expression = codeSize;
            
            
            //Chnage the index of the shape layer so it will go bellow Text Layer
            var maxIndex = -1;
            for (var i = 0; i < selectedLayers1.length; i++)
                {
                    maxIndex = Math.max(maxIndex,selectedLayers1[i].index);
                }
            var lastSelectedLayer = theComp.layer(maxIndex);
            
            shapeLayer.moveAfter(lastSelectedLayer);
         
    }
}


