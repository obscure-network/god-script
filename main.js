var biotic_components = [];
var abiotic_components = [];
var ambient_size = 300;
var deaths = [];

function make(color) {
  var _life ={
    name: "life" + makeid(),
    color: color,
    death: false,
    position: new_position(),
    step: 1,
    age: 0,
    purpose: new_position(),
    objective: null,
    distraction: false,
    family: [],
    interval: null,
  }
  biotic_components.push(_life);
  return _life;
}

function makeid() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
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
    "display": (bc.death ? "none":"block"),
    "top": bc.position.x + "px",
    "left": bc.position.y + "px",
    "background-color": bc.color
  }).text(bc.age);
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
  bc.age += 1;
  bc.purpose = new_position();
  $("#" + bc.name).addClass("yahoo");
  setTimeout('$("#' + bc.name + '").removeClass("yahoo");', 500);
}

function avgcolor(color1,color2){
    var avg  = function(a,b){ return (a+b)/2; },
        t16  = function(c){ return parseInt((''+c).replace('#',''),16) },
        hex  = function(c){ var t = (c>>0).toString(16);
                           return t.length == 2 ? t : '0' + t },
        hex1 = t16(color1),
        hex2 = t16(color2),
        r    = function(hex){ return hex >> 16 & 0xFF},
        g    = function(hex){ return hex >> 8 & 0xFF},
        b    = function(hex){ return hex & 0xFF},
        res  = '#' + hex(avg(r(hex1),r(hex2))) 
                   + hex(avg(g(hex1),g(hex2))) 
                   + hex(avg(b(hex1),b(hex2)));
    return res;
}

function life_rules(bc1, bc2){
  if( bc1.name == bc2.name ) return false; //do not fuck with yourself
  else if ( bc1.age < 18 || bc2.age < 18 ) return false; // +18
  else if ( bc1.age > 50 || bc2.age > 50 ) return false; // to old to fuck
  else if ( bc1.family.indexOf(bc2.name) != -1 || bc2.family.indexOf(bc1.name) != -1 ) return false; // incest prohibited
  return true;
}

function die(bc) {
  for (var i = 0; i < biotic_components.length; i++) {
    var _bc = biotic_components[i];
    if (_bc.name == bc.name){
      _bc.death = true;
      deaths.push(_bc);
      clearInterval(_bc.interval); // GHOST WTFF
      biotic_components.splice(i, 1);
    }
  }
}

function build_life(bc){
  $('#ambient').append("<span class='life' id='" + bc.name + "'>:)</span>");
  $('#ambient').append("<span class='purpose' id='t" + bc.name + "'></span>");
  
  //death age
  bc.death_age = Math.floor(Math.random()*(100-10+1)+10);
  
  bc.interval = setInterval(function(bc){
    if(bc.death) return;
    //has no purpose? make one
    if (!bc.purpose) bc.purpose = new_position();
    draw_purpose(bc);
    
    if (!bc.distraction) {
      for (var i = 0; i < biotic_components.length; i++) {
        var an_bc = biotic_components[i];
        if (life_rules(an_bc, bc)){
          
          if(distance(an_bc.position, bc.position) < 25){
            bc.distraction = true;
            an_bc.distraction = true;
            
            //Fuck and Babe
            var babe_color = avgcolor(an_bc.color, bc.color);
            var babe_bc = make(babe_color); //new babe
            build_life(babe_bc);
            
            // Build Family
            babe_bc.family.push(bc.name, an_bc.name);
            bc.family.push(an_bc.name,babe_bc.name);
            an_bc.family.push(bc.name, babe_bc.name);
            
            // set new purpose
            bc.purpose = new_position();
            an_bc.purpose = new_position();
            
            // Stop Distraction and go to purpose
            bc.distraction = false;
            an_bc.distraction = false;
          }
          
        }
      }
      
      //walking to purpose
      walk_decision(bc)
    }
    
    //death time?
    if (bc.age == bc.death_age)
      die(bc);
    
    if (distance(bc.position, bc.purpose) == 0) amem(bc);
    draw_life(bc);

  }, 10, bc);
}

setInterval(function(){
  $("#lifes").text(biotic_components.length)
  $("#deaths").text(deaths.length)
  if(biotic_components.length == 0) {
    $("#generation").text( Number($("#generation").text()) + 1 );
    light();
  }
}, 1000)

// Light!
function light() {
  biotic_components = [];
  deaths = [];
  var lifes =["#FF0000", "#0000ff", "#008000"];
  for(var i = 0; i < lifes.length; i++)
    make(lifes[i])
    
  $('#ambient').fadeIn().css({"display":"block", "width": ambient_size + "px", "height": ambient_size + "px"});
  $('#ambient').html("");
  for (var i = 0; i < biotic_components.length;i++){
    var bc = biotic_components[i];
    build_life(bc);
  } 
}