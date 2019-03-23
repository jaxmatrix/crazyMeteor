//Debugging
let reff = false;
let height = 800 ;
let width = 800;
let action = false;
let gameOver = false;
let g;
let time = new Date();
let now;
let SPACE = 32;
let r;
let m = [];


function setup(){
  createCanvas(width,height);
  angleMode(DEGREES);
  rectMode(CENTER);
  /*
  frameRate(30);
  r = new rocket(100,100,10,10,'rgb(25,25,100)')
  r.draw();

  for(i=0;i<10;i++){
    let x=new meteor(random(width),random(height),random(6,20),random(360),random(6));
    x.draw();
    m.push(x);
  }

  */
  g = new game();
  g.setup(()=>{

    frameRate(30);
    // Time Stamping
    console.log("Setting Start Time");
    now = new Date().getTime()/1000;

    action = true;
    r = new rocket(width/2,height/2,10,10,'rgb(25,25,100)')
    r.draw();
    r.onCollision(()=>{
        action = false;
        g.gameOver()
      });

    for(i=0;i<10;i++){
      let x=new meteor(random(width),random(height),random(6,20),random(360),random(6));
      x.draw();
      m.push(x);
    }
  },
  ()=>{
    console.log("Game under progress");
    background(240);
    r.move();
    m.forEach((rock)=>{
      rock.move();
      r.collision(rock);
      });
    },
    ()=>{
          //r = null;
          //m = [];
          noLoop();
          gameOver = true;
          timeComment("GAME OVER ::" + gameOver)
    });

}

/*
Control for space
*/

/*
if(keyIsDown(SPACE)){
  gameHadler()
}
*/
function mouseClicked(){
  gameHandler();
}

function gameHandler(){
  if(!action){
    timeComment("Making Action");
    g.set();
    loop();
  }

  if(gameOver){
    timeComment("RESET");
    reset();
    gameOver = false;
    g.home();
    action = false;
  }
  console.log("Mouse Clicked");
}

function reset(){
  r = null;
  m = [];
}

function draw(){
  if(!gameOver){
    timeComment("Working Out");
    g.start()
  }

}

class game{
  constructor(){
    this.over = false;
    this.score = 0;
  }

  home(){
    background(240);
    push();
    fill(0);
    translate(width/2,height/2);
    rect(0,0,width/2,height/2,0.2*width);
    fill(100);
    textAlign(CENTER,CENTER)
    textSize(height/4);
    text("Start",0,0);
    pop();
  }

 setup(set,play,endGame){
   //Disable Animation
    this.home();
    this.set = set;
    this.play = play;
    this.endGame = endGame;
  }

  start(){
    timeComment("onGoing");
    if(action && !gameOver){
      this.play();
      this.updateScore();
    }
  }

  updateScore(){
    this.score += 1;
    timeComment(this.score)
  }

  gameOver(cleanup){
    //console.log("Game is over");
    push();
    textAlign(CENTER,CENTER)
    translate(width/2,height/2);
    textSize(50);
    text("Your Score :" + this.score,0,0);
    pop();

    this.score = 0;

    timeComment("Ending Game");
    this.endGame();

  }
}

class rocket{
  constructor(x,y,dir,vel,color='rgb(0,255,0)'){
    this.pos = createVector(x,y)
    this.color = color;
    this.velocity = vel;
    this.direction = dir;
    this.acc = 0;
    this.alert = false;
    this.r = 6;
    this.learning = 0;
  }

  draw(){
    let h = 10;
    let w = 6;
    push();

    //Shifting and rotating origin
    translate(this.pos.x,this.pos.y);
    rotate(this.direction);

    //Rocket
    fill(this.color);
    if(reff){
      this.guides(400);
    }

    beginShape();
    vertex(0,-h);
    vertex(w,h);
    vertex(-w,h);
    endShape(CLOSE);

    //flame
    fill('rgb(255,0,0)');
    beginShape();
    vertex(w/2,h);
    vertex(0,h+w/2);
    vertex(-w/2,h);
    endShape(CLOSE);

    pop();

  }

  guides(s=100){
    let color = (this.alert)?'rgb(255,0,0,)':'rgb(0,255,0)';

    push();
    stroke('rgb(0,255,0)');
    line(0,-s,0,s);
    line(s,0,-s,0);
    pop();
  }
  onCollision(f){
    this.cb = f;
  }

  forwardAcc(){
    this.acc+=0.2
  }

  backwardAcc(){
    this.acc-=0.2;
  }

  turnRight(){
    this.direction+=10;

    if(this.direction>=360){
      this.direction -= 360;
    }
  }

  turnLeft(){
    this.direction-=10;

    if(this.direction<0){
      this.direction += 360;
    }
  }

  move(){
    let v = createVector(sin(this.direction),-cos(this.direction)).mult(this.velocity+this.acc)
    this.pos.add(v);

    if(this.pos.x < 0 || this.pos.x > width || this.pos.y > height || this.pos.y < 0){
      this.cb();
      timeComment("collision")
      this.alert = true;
    }
    else {
      alert = false;
    }

    //console.log(this.velocity);
    if(keyIsPressed === true){
      this.color = 'rgb(0,255,0)';
      console.log(this.color,key);
    }
    else {
      this.color = 'rgb(10,10,100)';
    }

    //Acceleration of the rocket
    /*
        KeyCode : W : 87
                  S : 83
                  ArrowLeft : 37
                  ArrowRight : 39

    */

    const W = 87, S = 83, LA = 65, RA = 68;

    if(keyIsDown(W)){
      this.forwardAcc()
      console.log(key);
    }

    else if(keyIsDown(S)){
      this.backwardAcc()
      console.log(key);
    }

    //turn Rocket
    if(keyIsDown(RA)){
      this.turnRight()
      console.log(key);
    }

    else if(keyIsDown(LA)){
      this.turnLeft()
      console.log(key);
    }
    this.draw()
  }

  collision(other){
    let d = dist(this.pos.x,this.pos.y,other.pos.x,other.pos.y);
    if(d <= this.r + other.r){
      console.log("collision");
      this.alert = true;
      this.cb();
    }
    else {
      if(d <= this.r + other.informationRadius){
        this.learning = 3;
      }
      this.alert=false;
    }

  //  sensors(){}

  }

}

class meteor{
  constructor(x,y,r=5,dir=0,vel=5){
    this.pos = createVector(x,y);
    this.velocity = vel;
    this.direction = dir;
    this.r = r;
    this.informationRadius = r*4;
  }

  draw(){
    push();
    translate(this.pos.x,this.pos.y);
    fill('rgba(0,150,0,0.2)');
    circle(0,0,this.informationRadius);
    fill(255,0,0);
    circle(0,0,this.r);

    //Inforamation Field
    pop();
  }

  move(){
    this.direction += random(-30,30);
    this.velocity += random(-3,3);
    let vi =this.velocity;
    let vmax = 9
    if( vi > vmax ){
      this.velocity = vmax;
    }
    else if( vi < -vmax){
      this.velocity = -vmax;
    }
    let v = createVector(sin(this.direction),-cos(this.direction)).mult(this.velocity)
    this.pos.add(v);

    if(this.pos.x <= 0){
      this.pos.x = width;
    }
    else if(this.pos.x >= width){
      this.pos.x = 0;
    }

    if(this.pos.y <= 0){
      this.pos.y = height;
    }
    else if(this.pos.y >= height){
      this.pos.y = 0;
    }

    this.draw();
    //console.log("Meteor Velocity",this.velocity);
  }
}

class radar{

}

class sensor{
  constructor(origin,reffAngle,dir,range){
    this.origin = origin;
    this.dir = dir;
    this.active = false;
    this.range = range;
    this.reffAngle = reffAngle;
    this.rotation = 0;
    //Defining private functipn
    function globalToLocal(pos){

      let shift = pos.sub(this.origin)
      rotation = shift.heading() - (this.reffAngle + this.dir);
      let newC = createVector(sin(rotation),-cos(rotation)).mult(shift.mag());
      return new Promise(function(resolve,failure){
        if(newPos != null){
          resolve(newC);
        }
        else {
          failure();
        }
      });
    }

    function getNearestInterceptAlongTheDirectionOfVector(pos,r){
      let D = sqrt(r*r - pos.x*pos.x)
      let Y = [
        -(pos.y + D ),
        -(pos.y - D )
      ]

      let nearest = 0;
      for (var c in Y){
        nearest = (abs(nearest) <= abs(c)) ? c : nearest;
      }

      return new Promise((resolve,reject)=>{
        if(abs(nearest) > 0){
          resolve(nearest)
        }
        else {
          reject()
        }
      });
    }

    function drawInteraction(posInMinusY){
      pop();
      translate(this.origin);
      rotate(this.dir + this.reffAngle);
      fill('rgb(28, 82, 12)');
      circle(0,posInMinusY,10);
      push();
    }

  }


  deactivate(){
    this.active = false;
  }

  activation(activator,d,neuron){
    this.active = true;
    globalToLocal(activator.pos).then((pos)=>{
      getNearestInterceptAlongTheDirectionOfVector(pos,activator.r).then((nearest)=>{
        neuron.set(abs(nearest)).then(()=>{
          this.deactivate();
        },timeComment("Failed to set Neuron " + this.dir ));
        drawInteraction(nearest);
      },timeComment("Failed to compute :: intercept"));
    },timeComment("Failed to compute :: gtl "));
  }

  activate(activator,d,neuron){

  }
  /*

  function globalToLocal(o){

  }
  */
}

function globalToLocal(){

}

//Generic objects
class Box{
  constructor(x,y,height,width,color='rgb(0,0,0)',stroke=''){
    this.pos = createVector(x,y);
    this.h = height;
    this.w = width;
    this.color = color;
    this.stroke = stroke;
    draw()
  }

  draw(){
    push();
    fill(this.color);
    storke(this.stroke);
    translate(this.pos.x,this.pos.y);
    rect(0,0,this.w,this.h);
    pop();
  }
}

class Circle{
  constructor(x,y,height,width,color='rgb(0,0,0)',stroke=''){
    this.pos = createVector(x,y);
    this.h = height;
    this.w = width;
    this.color = color;
    this.stroke = stroke;
    draw()
  }

  draw(){
    push();
    fill(this.color);
    storke(this.stroke);
    translate(this.pos.x,this.pos.y);
    circle(0,0,this.r);
    pop();
  }
}

//Event handling
function keyReleased(){
  key='';
}

function mouseIsClicked(box,success,fail){
  if(
     mouseX > box.pos.x - box.width/2 &&
     mouseX < box.pos.x + box.width/2 &&
     mouseY > box.pos.y - box.height/2 &&
     mouseX < box.pos.y + box.height/2
  )
  {
    success();
  }
  else {
    fail();
  }
}

function timeComment(comment,){
  let t = new Date().getTime()/1000;
  console.log(comment,t-now);
}
