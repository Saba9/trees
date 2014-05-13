var doAnimate = false;
var sin = [];
var cos = [];
function cacheTrig(){
  for(var i=0; i < Math.pi; i += (Math.pi / 180)){
    sin.push(Math.sin(i));
    cos.push(Math.cos(i));
  }
}
cacheTrig();
console.log(sin);
function drawLine(x1,y1,x2,y2,canvas,width,randomize){
  // Handle JQuery Variables
  var context
  if(canvas.jquery){
    context = canvas[0].getContext("2d");
  } else {
    context = canvas.getContext("2d");
  }
  if(randomize){
    context.strokeStyle='#'+Math.floor(Math.random()*16777215).toString(16);
  }
  context.beginPath();
  context.moveTo(x1,y1);
  context.lineTo(x2,y2);
  context.lineWidth = width == 'undefined' ? '5' : width
  //context.strokeStyle=color;
  context.stroke();
  context.strokeStyle="black"
}
function drawChildren(parentX,parentY,length,ratio,angle,parentAngle,generation, width, canvas,random){
  if(generation != 0){
    length *= ratio;
    width *= ratio;
    //angle = angle - Math.random() % Math.PI / 4;
    // Calculate endpoint of line segment diverging from base point at angle
    var x2 = parentX + Math.cos(parentAngle + angle) * length;
    var y2 = parentY + Math.sin(parentAngle + angle) * length;
    //angle = angle + Math.random() % Math.PI / 4 ;
    var x3 = parentX + Math.cos(parentAngle - angle) * length;
    var y3 = parentY + Math.sin(parentAngle - angle) * length;
    drawLine(parentX,parentY,x2,y2,canvas,width,random)
    drawLine(parentX,parentY,x3,y3,canvas,width,random)
    // Recurse!
    drawChildren(x2, y2, length, ratio, angle, parentAngle + angle, generation - 1, width, canvas, random);
    drawChildren(x3, y3, length, ratio, angle, parentAngle - angle, generation - 1, width, canvas, random);
  }
}
function increment(elem){
  elem.val(Math.round(Number(elem.val())) + 1)
}
function decrement(elem){
  elem.val(Math.round(Number(elem.val())) - 1)
}
var flag = false;
function animate(){
  window.setInterval(function(){
    if (doAnimate){
      angle = Number($("#angle").val());
      if(angle == 180)
        flag = true; 
      else if (angle == 0){
        flag = false;
      }
      if(!flag){
        increment($("#angle"))
      } else {
        decrement($("#angle"))
      }
      updateTree();
    }
  },1000/60)
}
function updateTree(){
  // Grab Canvas and Context
  canvas = $("#treeCanvas");
  ctx = canvas[0].getContext("2d");
  ctx.clearRect(0,0,canvas.width(),canvas.height())
  // Initialize Variables
  var centerX = canvas.width() / 2;
  var baseLength = Number($("#length").val());
  var baseWidth = $("#width").val();
  var parentToChildRatio = Number($("#ratio").val());
  var generations = Number($("#generations").val())
  var angle = Number($("#angle").val()) * (Math.PI / 180);
  var randomColors = $("#randomize").prop("checked");
  // Draw Root
  drawLine(centerX,100,centerX,baseLength + 100,canvas,baseWidth,randomColors);
  drawChildren(centerX,baseLength + 100,baseLength,parentToChildRatio,angle,Math.PI / 2,generations, baseWidth, canvas, randomColors);
}
$(document).ready(function(){
$("#animate").click(function(){
  doAnimate = !doAnimate;
  if(doAnimate){
    $("#animate").val("Stop Animation!");
  } else { 
    $("#animate").val("Animate!"); 
  }
})
$("#inputs").change(function(){
  updateTree();  
})
  animate();
  canvas = $("#treeCanvas");
  $("#tree").attr("width",$(window).width() * .89)
  canvas.attr("width",$(window).width() *.89)
  canvas.attr("height",$(window).height())
  updateTree();
});

