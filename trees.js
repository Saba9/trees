var doAnimate = false;
var colors = [];
var gradient = [];
var colora;
var colorb;
function genGradient(colora, colorb, rate, rounds, array){
  if(rounds == 0){
    // We're done here....
  } else {
    var newcolor = [colora[0] * rate + colorb[0] * (1 - rate), colora[1] * rate + colorb [1] * (1-rate), colora[2] * rate + colorb[2] * (1 - rate)];
    array.push("rgb(" + Math.round(newcolor[0]) + ',' + Math.round(newcolor[1]) + ',' + Math.round(newcolor[2]) + ')');
    genGradient(newcolor, colorb, rate, rounds - 1, array)
  }
}
function randColor(){
  return '#' + Math.floor((Math.random()*16777215)).toString(16);
}
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
  context.stroke();
  context.strokeStyle="black"
}
function drawChildren(parentX,parentY,length,ratio,angle,parentAngle,generation, width, canvas,random){
  if(generation != 0){
    length *= ratio;
    width *= ratio;
    //angle = angle - (Math.random() % Math.PI / 20) * (Math.round(Math.random()) * 2 - 1);
    // Calculate endpoint of line segment diverging from base point at angle
      var x2 = parentX + Math.cos(parentAngle + angle) * length;
      var y2 = parentY + Math.sin(parentAngle + angle) * -1 * length;
      //angle = angle + (Math.random() % Math.PI / 20) * (Math.round(Math.random()) * 2 - 1) ;
      var x3 = parentX + Math.cos(parentAngle - angle) * length;
      var y3 = parentY + Math.sin(parentAngle - angle) * -1 * length;
  if(colors.length != 0){
    canvas[0].getContext("2d").strokeStyle = colors[Number($("#generations").val()) - generation];
  }
    drawLine(parentX,parentY,x2,y2,canvas,width,random)
  if(colors.length != 0){
    canvas[0].getContext("2d").strokeStyle = colors[Number($("#generations").val()) - generation];
  }
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
  var c1 = $('#colora').val().split(',');
  var c2 = $('#colorb').val().split(',');
  var c1 = [Number(c1[0]),Number(c1[1]),Number(c1[2])];
  var c2 = [Number(c2[0]),Number(c2[1]),Number(c2[2])];
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
  ctx.strokeStyle = 'rgb(' + c1[0] + ',' + c1[1] + ',' + c1[2] + ')';
  drawLine(centerX, canvas.height() - 150, centerX,canvas.height() - 150  - baseLength,canvas,baseWidth,randomColors);
  drawChildren(centerX, canvas.height() - 150 - baseLength,baseLength,parentToChildRatio,angle,Math.PI / 2,generations, baseWidth, canvas, randomColors);
}
$(document).ready(function(){
  $('#incrementBtn').click(function(e){
    increment($("#generations"))
    updateTree();
    e.preventDefault();
  })
  $('#decrementBtn').click(function(e){
    decrement($("#generations"))
    updateTree();
    e.preventDefault();
  })
  $("#colora, #colorb, #gradrate").change(function(){
  colors = [];
  var c1 = $('#colora').val().split(',');
  var c2 = $('#colorb').val().split(',');
  var c1 = [Number(c1[0]),Number(c1[1]),Number(c1[2])];
  var c2 = [Number(c2[0]),Number(c2[1]),Number(c2[2])];
  genGradient(c1,c2,Number($("#gradrate").val()),20,colors)
});
  $("#colora").change();
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
  canvas.draggable()
  $("#tree").attr("width",$(window).width() * .89)
  canvas.attr("width",$(window).width() *.89)
  canvas.attr("height",$(window).height())
  updateTree();
});

