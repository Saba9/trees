var doAnimate = false;
function drawCircle(x,y,width,color, canvas){
  var context
  if(canvas.jquery){
    context = canvas[0].getContext("2d");
  } else {
    context = canvas.getContext("2d");
  }
  context.strokeStyle=color;
  context.beginPath();
  context.arc(x,y,width,0,2*Math.PI);
  context.stroke();
  context.strokeStyle="black"
}
function drawLine(x1,y1,x2,y2,canvas,width,color){
  // Handle JQuery Variables
  var context
  if(canvas.jquery){
    context = canvas[0].getContext("2d");
  } else {
    context = canvas.getContext("2d");
  }
  context.beginPath();
  context.moveTo(x1,y1);
  context.lineTo(x2,y2);
  context.lineWidth = width == 'undefined' ? '5' : width
  context.strokeStyle='#'+Math.floor(Math.random()*16777215).toString(16);
  context.stroke();
  context.strokeStyle="black"
}
function drawChildren(parentX,parentY,length,ratio,angle,parentAngle,generation, width, canvas,random){
  var random = random == "undefined" ? false : random;
  if(generation != 0){
    length *= ratio;
    width *= ratio;
    //angle = angle - Math.random() % Math.PI ;
    // Calculate endpoint of line segment diverging from base point at angle
    var x2 = parentX + Math.cos(parentAngle + angle) * length;
    var y2 = parentY + Math.sin(parentAngle + angle) * length;
    //angle = angle - Math.random() % Math.PI ;
    var x3 = parentX + Math.cos(parentAngle - angle) * length;
    var y3 = parentY + Math.sin(parentAngle - angle) * length;
    drawLine(parentX,parentY,x2,y2,canvas,width)
    drawLine(parentX,parentY,x3,y3,canvas,width)
    // Recurse!
    drawChildren(x2, y2, length, ratio, angle, parentAngle + angle, generation - 1, width, canvas, true);
    drawChildren(x3, y3, length, ratio, angle, parentAngle - angle, generation - 1, width, canvas, true);
  }
}
function increment(elem){
  elem.val(Number(elem.val()) + 1)
}
function animate(){
  window.setInterval(function(){
    if (doAnimate){
      increment($("#angle"));
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
  //var random = $("random").val() == "Disable Random Colors";
  // Draw Root
  drawLine(centerX,100,centerX,baseLength + 100,canvas,baseWidth);
  drawChildren(centerX,baseLength + 100,baseLength,parentToChildRatio,angle,Math.PI / 2,generations, baseWidth, canvas);
}
$(document).ready(function(){
$("#animate").click(function(){
  doAnimate = !doAnimate;
  console.log(doAnimate);
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
  $("#tree").attr("width",$(window).width())
  canvas.attr("width",$(window).width())
  canvas.attr("height",$(window).height())
  updateTree();
});
