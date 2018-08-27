var biotic_components = [];
var abiotic_components = [];
var ambient_size = 300;

function make(color) {
  biotic_components.push({
    name: "life" + biotic_components.length,
    color: color,
    position: new_position(),
    step: 1,
    points: 0,
    purpose: null,
    objective: null,
    distraction: null,
    interval: null,
  })
}

function new_position(){
  return {
    x: Math.floor(Math.random()*(ambient_size-0+1)+0),
    y: Math.floor(Math.random()*(ambient_size-0+1)+0),
  }
}

function distance(pos1, pos2){
  var a = pos1.x - pos2.x;
  var b = pos1.y - pos2.y;
  return Math.sqrt( a*a + b*b );
}

// defining possibilities and finding the shortest path
function walk_decision(bc) {
  //x
  if (bc.position.x != bc.purpose.x) {
    var quantic_x = [bc.position.x + bc.step, bc.position.x - bc.step]; //+..-
    if ( distance({x:quantic_x[0], y:bc.position.y}, bc.purpose) <  distance({x:quantic_x[1], y:bc.position.y}, bc.purpose)) {
      bc.position.x += bc.step;
    } else {
      bc.position.x -= bc.step;
    }
  }
  //y
  if (bc.position.y != bc.purpose.y) {
    var quantic_y = [bc.position.y + bc.step, bc.position.y - bc.step]; //+..-
    if ( distance({x:bc.position.x, y:quantic_y[0]}, bc.purpose) <  distance({x:bc.position.x, y:quantic_y[1]}, bc.purpose)) {
      bc.position.y += bc.step;
    } else {
      bc.position.y -= bc.step;
    }
  }
}

function draw_life(bc){
  $('#' + bc.name).css({
    "top": bc.position.x + "px",
    "left": bc.position.y + "px",
    "background-color": bc.color
  }).text(bc.points);
}

function draw_purpose(bc){
  $('#t' + bc.name).css({
    "top": bc.purpose.x + "px",
    "left": bc.purpose.y + "px",
    "background-color": bc.color
  })
}

// achieved the purpose
function amem(bc){
  bc.points += 1;
  bc.purpose = new_position();
}

// Light!
function light() {
  $('#ambient').fadeIn().css({"display":"block", "width": ambient_size + "px", "height": ambient_size + "px"});
  $('#ambient').html("");
  for (var i = 0; i < biotic_components.length;i++){
    var bc = biotic_components[i];
    $('#ambient').append("<span class='life' id='" + bc.name + "'>:)</span>");
    $('#ambient').append("<span class='purpose' id='t" + bc.name + "'></span>");
    
    bc.interval = setInterval(function(bc){

      //has no purpose? make one
      if (!bc.purpose) bc.purpose = new_position();
      draw_purpose(bc);

      //walking to purpose
      walk_decision(bc)
      
      if (distance(bc.position, bc.purpose) == 0) amem(bc);

      draw_life(bc);

    }, 10, bc);
    
  } 
}

var lifes =["#D1C4E9", "#B39DDB", "#9575CD", "#7E57C2", "#673AB7", "#5E35B1", "#512DA8", "#4527A0", "#311B92"]

for(var i = 0; i < lifes.length; i++)
  make(lifes[i])

light();
