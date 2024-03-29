//AutoBox Script v1.0
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
var checkboxAnchorPoint = groupThree.add("checkbox", undefined, "Center Texts Anchor Point");
checkboxAnchorPoint.value = false;
var checkboxPermanentHeight = groupThree.add("checkbox", undefined, "Permanent height based on text line");
checkboxPermanentHeight.value = false;
//Buttons
var groupFour = window.add("group", undefined, "groupFour");
groupFour.orientation = "row";
var applyButton = groupFour.add("button", undefined, "Create Box");


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
    
     
    var boxControlsOffset;
    var boxControlsSlider;

    // Create a new shape layer
    var shapeLayer = comp.layers.addShape();
    
    shapeLayer.name = "Text Box";
    
    // Add a rectangle shape to the shape layer
  
    var shapeGroup = shapeLayer.property("Contents").addProperty("ADBE Vector Group");

    var pathGroup = shapeLayer.property("Contents").property("Group 1").property("Contents").addProperty("ADBE Vector Shape - Rect");
     //Add expressions
     if (!checkboxPermanentHeight.value){
    var codeSize = 'textSlider=effect("Text Layer")("Slider");\rs=thisComp.layer(index-textSlider);\rw=s.sourceRectAtTime().width;\rh=s.sourceRectAtTime().height;\roffset=effect("Offset")("Slider");\r[w+offset,h+offset]';
    pathGroup.property("Size").expression = codeSize;
    var codePosition = 'textSlider=effect("Text Layer")("Slider");\rs=thisComp.layer(index-textSlider);\rw=s.sourceRectAtTime().width/2;\rh=s.sourceRectAtTime().height/2;\rl=s.sourceRectAtTime().left;\rt=s.sourceRectAtTime().top;\r[w+l,h+t]';
    pathGroup.property("Position").expression = codePosition;
     }
     else {
        var codeSize = 'textSlider=effect("Text Layer")("Slider");\rs=thisComp.layer(index-textSlider);\rs1=thisComp.layer(index+1);\rw=s.sourceRectAtTime().width;\rh=s1.sourceRectAtTime().height;\roffset=effect("Offset")("Slider");\r[w+offset,h+offset]';
    pathGroup.property("Size").expression = codeSize;
    var codePosition = 'textSlider=effect("Text Layer")("Slider");\rs=thisComp.layer(index-textSlider);\rs1=thisComp.layer(index+1);\rw=s.sourceRectAtTime().width/2;\rh=s1.sourceRectAtTime().height/2;\rl=s.sourceRectAtTime().left;\rt=s1.sourceRectAtTime().top;\r[w+l,h+t]';
    pathGroup.property("Position").expression = codePosition;
     }
    var fillGroup = shapeLayer.property("Contents").property("Group 1").property("Contents").addProperty("ADBE Vector Graphic - Fill");
    //Parrenting properties of shape layer to the text layer
    if(checkboxScale.value){
    shapeLayer.property("ADBE Transform Group").property("ADBE Scale").expression = 'textSlider=effect("Text Layer")("Slider");\rthisComp.layer(index-textSlider).transform.scale';
    }
    if(checkboxPosition.value){
    shapeLayer.property("ADBE Transform Group").property("ADBE Position").expression = 'textSlider=effect("Text Layer")("Slider");\rthisComp.layer(index-textSlider).transform.position';
    }
    if(checkboxRotation.value){
    shapeLayer.property("ADBE Transform Group").property("ADBE Rotate Z").expression = 'textSlider=effect("Text Layer")("Slider");\rthisComp.layer(index-textSlider).transform.rotation';
    }
    shapeLayer.property("ADBE Transform Group").property("ADBE Anchor Point").expression = 'textSlider=effect("Text Layer")("Slider");\rthisComp.layer(index-textSlider).transform.anchorPoint';
    

    boxControlsOffset = shapeLayer.Effects.addProperty("ADBE Slider Control");
    boxControlsOffset.name = "Offset";

    boxControlsSlider = shapeLayer.Effects.addProperty("ADBE Slider Control");
    boxControlsSlider.name = "Text Layer";
    boxControlsSlider.property(1).setValue(1);
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
    if(checkboxAnchorPoint.value){
    lastSelectedLayer.property("ADBE Transform Group").property("ADBE Anchor Point").expression = 'a = thisLayer.sourceRectAtTime();\r  height = a.height;\rwidth = a.width;\r  top = a.top;\r  left = a.left;\r    x = left + width/2;\r   y = top + height/2;\r   [x,y];';
    }
    
    
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
