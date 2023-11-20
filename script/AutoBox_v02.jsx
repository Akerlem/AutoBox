//v3_branch




var window = new Window("palette","",undefined);
window.orientation = "column";
var groupOne = window.add("group", undefined, "groupOne");
groupOne.orientation = "row";
var textParrent = groupOne.add("statictext", undefined, "Link properties to Text Layer");

var groupTwo = window.add("group", undefined, "groupTwo");
groupTwo.orientation = "row";
//Checkboxes
var checkboxPosition = groupTwo.add("checkbox", undefined, "Position");
checkboxPosition.value = true;
var checkboxScale = groupTwo.add("checkbox", undefined, "Scale");
checkboxScale.value = false;
var checkboxRotation = groupTwo.add("checkbox", undefined, "Rotation");
checkboxRotation.value = false;


var groupThree = window.add("group", undefined, "groupThree");
groupThree.orientation = "row";
var applyButton = groupThree.add("button", undefined, "Create Box");

window.center();
window.show();

applyButton.onClick = function()
{
    
    if(app.project.activeItem == null){
        alert ("Select a comp")
        return false;
    }

    var comp = app.project.activeItem;
//test
    var proj = app.project;
    var theComp = proj.activeItem;
    var selectedLayers = theComp.selectedLayers;
    
    if(selectedLayers.length < 1){
        alert("Select a text layer");
        return false;
    }
    var checkedTextLayers = checkForTextLayers(selectedLayers);
    if(checkedTextLayers.length < 1){
        alert("Select at least 1 text layer");
        return false;
    }
    //alert(checkedTextLayers);

    
    
    app.beginUndoGroup("Create Shape Layer");
    
     
    var boxControls;

    // Create a new shape layer
    var shapeLayer = comp.layers.addShape();
    
    shapeLayer.name = "Text Box";
    
    // Add a rectangle shape to the shape layer
  
    var shapeGroup = shapeLayer.property("Contents").addProperty("ADBE Vector Group");

    var pathGroup = shapeLayer.property("Contents").property("Group 1").property("Contents").addProperty("ADBE Vector Shape - Rect");
     //Add expressions
    var codeSize = 's=thisComp.layer(index-1);\rw=s.sourceRectAtTime().width;\rh=s.sourceRectAtTime().height;\roffset=effect("Offset")("Slider");\r[w+offset,h+offset]';
    pathGroup.property("Size").expression = codeSize;
    var codePosition = 's=thisComp.layer(index-1);\rw=s.sourceRectAtTime().width/2;\rh=s.sourceRectAtTime().height/2;\rl=s.sourceRectAtTime().left;\rt=s.sourceRectAtTime().top;\r[w+l,h+t]';
    pathGroup.property("Position").expression = codePosition;

    var fillGroup = shapeLayer.property("Contents").property("Group 1").property("Contents").addProperty("ADBE Vector Graphic - Fill");
    //Parrenting properties of shape layer to the text layer
    if(checkboxScale.value){
    shapeLayer.property("ADBE Transform Group").property("ADBE Scale").expression = 'thisComp.layer(index-1).transform.scale';
    }
    if(checkboxPosition.value){
    shapeLayer.property("ADBE Transform Group").property("ADBE Position").expression = 'thisComp.layer(index-1).transform.position';
    }
    if(checkboxRotation.value){
    shapeLayer.property("ADBE Transform Group").property("ADBE Rotate Z").expression = 'thisComp.layer(index-1).transform.rotation';
    }
    shapeLayer.property("ADBE Transform Group").property("ADBE Anchor Point").expression = 'thisComp.layer(index-1).transform.anchorPoint';
    
    
    //


    //Chnage the index of the shape layer so it will go bellow Text Layer
    var maxIndex = -1;
    for (var i = 0; i < selectedLayers.length; i++)
        {
            maxIndex = Math.max(maxIndex,selectedLayers[i].index);
        }
    var lastSelectedLayer = theComp.layer(maxIndex);
    
    shapeLayer.moveAfter(lastSelectedLayer);
    //Center anchor point for text layer
    lastSelectedLayer.property("ADBE Transform Group").property("ADBE Anchor Point").expression = 'a = thisLayer.sourceRectAtTime();\rheight = a.height;\rwidth = a.width;\rtop = a.top;\rleft = a.left;\rx = left + width/2;\ry = top + height/2;\r[x,y];';
    
    boxControls = shapeLayer.Effects.addProperty("ADBE Slider Control");
    boxControls.name = "Offset";
    
    app.endUndoGroup();
    


}

function checkForTextLayers(layers){
    var textLayers = [];
    for(var i=0;i < layers.length; i++){
        if(layers[i].property("Source Text")){
            textLayers.push(layers[i]);
        }
    }
    return textLayers;
    
}
