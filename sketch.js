//Debugging
let reff = true;
let debug = false;
let stop = false;
let MeteorAlert = true;
if(debug){

}


/*
  Environement Setup

*/

let height = 800 ;
let width = 800;
let action = false;
let gameOver = false;
let g;
let time = new Date();
let now;
let SPACE = 32;
let r;
let radar;
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

    r = new Rocket(width/2,height/2,0,10,'rgb(25,25,100)');
    radar = new Radar(r,250,20);


    r.draw();
    r.onCollision(()=>{
        action = false;
        g.gameOver()
      });

    for(i=0;i<10;i++){
      let x=new Meteor(random(width),random(height),random(12,24),random(360),random(6));
      x.draw();
      m.push(x);
    }
  },
  ()=>{
    //console.log("Game under progress");
    background(240);
    radar.update();
    r.move();
    g.reff();
    m.forEach((rock)=>{
      rock.move();
      r.collision(rock);
      radar.checkCollision(rock)
      });
    radar.activateCollisionSensors();
    },
    ()=>{
          //r = null;
          //m = [];
          noLoop();
          gameOver = true;
          timeComment("GAME OVER ::" + gameOver)
    }).then(()=>{
      //radar = new Radar(250,10)
		});
}

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
    //timeComment("Working Out");
    g.start()
  }

  //radar.draw();
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

  reff(){
    push();
    stroke('rgba(0, 0, 0, 0.2)')
    for(let i = 0; i < height/10;i++){
      line(i*height/10,0,i*height/10,height);
      line(0,i*height/10,height,i*height/10)
    }
    pop();
  }

 setup(set,play,endGame){
   //Disable Animation
    this.home();
    this.set = set;
    this.play = play;
    this.endGame = endGame;

		return new Promise((resolve)=>{
			resolve();
		});
	}

  start(){
    //timeComment("onGoing");
    if(action && !gameOver){
      this.play();
      this.updateScore();
    }
  }

  updateScore(){
    this.score += 1;
    //timeComment(this.score)
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

class Rocket{

  constructor(x,y,dir,vel,color='rgb(0,255,0)',callback){
    timeComment("Rocket Created");
    this.pos = createVector(x,y)
    this.color = color;
    this.velocity = vel;
    this.direction = dir;
    this.acc = 0;
    this.alert = false;
    this.r = 6;
    this.learning = 0;
    this.features = [];
    this.features.push(callback);
	  this.additionalFeatures();
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
    if(reff && false){
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

  additionalFeatures(){
		timeComment("Additional Feature Added");

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

  ready(fn){
    fn(this);
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
      //onsole.log(this.color,key);
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
      //console.log(key);
    }

    else if(keyIsDown(S)){
      this.backwardAcc()
      //console.log(key);
    }

    //turn Rocket
    if(keyIsDown(RA)){
      this.turnRight()
      //console.log(key);
    }

    else if(keyIsDown(LA)){
      this.turnLeft()
      //console.log(key);
    }
    this.draw()
  }

  collision(other){
    let d = dist(this.pos.x,this.pos.y,other.pos.x,other.pos.y);
    if(d <= this.r + other.r){
      //console.log("collision");
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

class Meteor{
  constructor(x,y,r=5,dir=0,vel=5){
    this.pos = createVector(x,y);
    this.velocity = 0;
    this.direction = dir;
    this.r = r;
    this.informationRadius = r*4;
  }

  draw(){
    push();
    translate(this.pos.x,this.pos.y);
    fill('rgba(0,150,0,0.2)');
    (reff)?circle(0,0,this.informationRadius):null;
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

    if(!stop){
      this.pos.add(v)
    }

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

class Radar{
  constructor(rocket,range,nos){
    timeComment("Creating Radar");
    //timeComment(rocket);

    this.nos = nos;
    this.rocket = rocket;
    this.range = range;
    this.sensors = [];
    this.collidor = [];
    this.angles = [];
    this.collidorDistance = [];
    this.vector = []
    this.collidorOrder = [];
    this.sensorActivator = new SensorActivationHandler(this.nos);

    // delta theta
    let dt = 360/nos;

    //Adding sensor to the radar
    for (let i = 0; i<this.nos; i++){
      let s = new Sensor(this.rocket,i*dt,this.range);
      s.draw();
      this.sensors.push(s);
    }

    console.log("Sensor Table ::" ,this.sensors);
    //let dt = 360/nos;


  }

  checkCollision(meteor){
    let x = createVector(meteor.pos.x,meteor.pos.y)
    //console.log(x,meteor.pos)
    let d = x.sub(this.rocket.pos).mag()
    if( d < this.range){
      //Setup the collidor in the collision check engine
      this.collidor.push(meteor)
      this.collidorDistance.push(d);
      this.vector.push(x);
      if(false){
        push();
        stroke('rgb(255, 0, 0)');
        line(this.rocket.pos.x,this.rocket.pos.y,meteor.pos.x,meteor.pos.y);
        pop();
      }

    }

  }

  activateCollisionSensors(){
    let radar = this

    sortCollidor(radar).then(()=>{
      angleSubtendedByMeteor(radar).then(()=>{
        activateSensor(radar).then((d)=>{
          (debug)?console.log("Looking Sensor Acitivity",d):null;
          radar.sensorActivator.sensorFlushActivity(radar);

          (debug)?console.log("NEver coming up what the fuck"):null;
          //deactivate collidors
          radar.deactivateCollidor(radar);
        }).catch(ErrorHandler("Sensor Activation"));
      }).catch(ErrorHandler("Angle calculation problem"));
    }).catch(ErrorHandler("Sorting Collidor"));
  }


  draw(){
    if(reff) {
      push();
      translate(this.rocket.pos.x,this.rocket.pos.y);
      rotate(this.rocket.direction);
      fill('rgba(48, 194, 63, 0.43)')
      circle(0,0,this.range);
      pop();
    }

    for(let i = 0; i< this.nos;i++){
      let s = this.sensors[i];
      //console.log("Drawing Sensor ",this.sensors[i]);
      (reff)?s.update():null;
    }
  }

  update(){
    this.draw();
  }

  deactivateCollidor(){
    (debug )?console.log("Deactivating Sensor"):null;

    this.collidor = [];
    this.angles = [];
    this.collidorDistance = [];
    this.order = [];
    this.vector = [];
    this.collidorOrder = [];

    (debug )?console.log("Human Verification of Deactivation",this.collidor,this.angles,this.collidorDistance,this.order,this.vector,this.collidorOrder):null;
  }

}


//Private functions for class Radar

// Returns an array of the directions active given between the angles

function directionalIndex(radar,A1,A2){
  //directional idices
  let d = [];
  let dt = 360/radar.nos
  let nos = radar.collidor.length;
  // delta theta

  //calculation of the indexes

  //start indexes
  let start = ceil((A1+dt*0.1)/dt);
  let end = floor(A2/dt);
  (debug )?console.log("start,end",A1,A2,start,end):null;
  for(let i = start; i <= end; i++){

    d.push(((i>0)?i:radar.nos+i)%radar.nos);
  }
  return d

}

// get A1 and A2
function angleSubtendedByMeteor(radar){
  for(let i = 0; i < radar.collidor.length; i++){
    let meteor = radar.collidor[radar.collidorOrder[i]]
    //Deviation
    let devi = asin(meteor.r/radar.collidorDistance[i]);
    let directAngle = radar.vector[radar.collidorOrder[i]].heading() + 90 - radar.rocket.direction;
    // 0 - 360 angle sanitation;
    directAngle = (directAngle<0)? 360+directAngle:directAngle;

    let angle = [directAngle-devi, directAngle + devi];
    radar.angles.push(angle);
    (debug)?console.log("Angle Subtended , MainAngle", devi,directAngle):null;
  }

  (debug)?console.log("ANgle Subtended by Meteor ",radar.angles):null;
  return new Promise((resolve)=>{
    resolve();
  });
}




//by the end of this program we will have sorted array indexs and sorted
//collidor distance

function sortCollidor(radar){
  let cr = radar.collidorDistance;
  let i = 0;
  let m = [];

  (debug)?console.log("Collidor length",cr,cr.length):null;

  for (let k = 0 ; k < cr.length ; k++) m.push(k);

  //console.log("Order dummy" , m);

  while(i < cr.length){
    let x = findMaxAndPutForward(i)
    //console.log("Inserting X : ", x)
    i++;
  }

  function findMaxAndPutForward(start){
      let max = cr[start];
      let mm = m[start];
      let maxi = start;
      for(let j = start + 1; j < cr.length ; j++){
        if(cr[j] > max ){
          maxi = j;
          max = cr[j]
          mm = m[j]
        }

      }

        //console.log("(Max , Maxi)" , max , m[maxi]);
        //Moving forward
        for(let j = maxi; j >start; j--){
          cr[j] = cr[j-1];
          m[j] = m[j-1];
        }

        cr[start] = max;
        m[start] = mm;

        //console.log("Modified Cr :: ", cr, m);
        return m[maxi];
    }

  //console.log("Order of collidor :: " , m ,cr)
  radar.collidorOrder = m.reverse();
  radar.collidorDistance = cr.reverse();

  (debug )?console.log("Collidor sorted :: ",radar.collidorDistance , radar.collidorOrder):null;
  return new Promise((resolve)=>{
    resolve();
  });
}

//Here we will be activating the required sensor using the directional index function
//This will help us initialize sensors coming from nearest collidor

function activateSensor(radar){
  this.color = 'rgb(198, 80, 80)'
  let ar = radar.angles
  //let d = null;
  for(let i =0 ; i < ar.length ; i++){
    let d = directionalIndex(radar,ar[i][0],ar[i][1]);
    (debug )?console.log("Activation of Sensor",d):null;

    //Adding Meteor to the sensors
    radar.sensorActivator.registerActivity(radar,d,radar.collidorOrder[i]);
    //(debug)?console.log(d):null;
  }

  (debug  )?console.log("Angles Tables ::",radar.angles):null;
  return new Promise((resolve)=>{
    resolve();
  });

}

class SensorActivationHandler{
  constructor(nos){
    this.nos = nos;
    this.activity = [];
    //this.activator = []
    for(let i =0 ; i < nos; i++){
      this.activity.push([0, null]);
    }
  }

//D is the order array for the the activation
  registerActivity(radar,d,collidorIndex){
    let self = this;
    let meteor = radar.collidor[collidorIndex];
    (debug )?console.log("Meteor Matrix",d,meteor):null;
    d.forEach(function(e){
      self.activity[e] = (!self.activity[e][0])?[1,meteor]:self.activity[e];
    });
    (debug )?console.log("Registering meteor for sensor",self.activity):null;

    return new Promise((resolve)=>{
      resolve(self);
    });
  }

  sensorFlushActivity(radar){
    //(debug )?console.log("Activity Matrix Before",this.activity):null;
    for(let i = 0 ; i < this.activity.length ; i ++){
      if(this.activity[i][0]){
        radar.sensors[i].activate(this.activity[i][1]);
      }
    }
    (debug  )?console.log("FLUSING ACTIVITY OF SENSOR:",this.activity):null;


    this.activity = [];

    for(let i =0 ; i < radar.nos; i++){
      this.activity.push([0, null]);
    }

    //(debug )?console.log("Activity Matrix After",this.activity):null;

  }
}

class Sensor{
  constructor(rocket,dir,range,c='rgb(5, 70, 27)'){
    this.rocket = rocket;
    this.origin = this.rocket.pos;
    this.dir = dir;
    this.active = false;
    this.range = range;
    this.reffAngle = this.rocket.direction;
    this.rotation = 0;
    this.color = c;
    timeComment("Creating Sensor :: " + this.origin + "::" + this.reffAngle + "::" + this.dir + "::" + this.range);
    //Defining private functipn


  }

  draw(c){
    (debug)?console.log(this.dir,this.reffAngle):null;
    this.color = (c)?c:this.color;
    push();
    strokeWeight(1);
    translate(this.origin.x,this.origin.y);
    rotate(this.dir + this.reffAngle);
    stroke(this.color)
    line(0,0,0,-this.range);
    pop();

    //timeComment("Drawing Sensors");
  }

  update(c){
    this.reffAngle = this.rocket.direction;;
    this.draw(c);
  }

  deactivate(){
    this.active = false;
  }

  activate(activator,neuron=null){
    //this.color = 'rgb(195, 39, 39)';
    this.active = true;
    let self = this;
    globalToLocal(self,activator.pos).then((pos)=>{
      (debug)?console.log("global to local position:",this.origin, pos):null;
      getNearestInterceptAlongTheDirectionOfVector(pos,activator,this.dir).then((nearest)=>{
        /*
          neuron.set(abs(nearest)).then(()=>{
        },timeComment("Failed to set Neuron " + this.dir ));

        */
        (reff)?drawInteraction(self,nearest):null;
        //self.deactivate();
      },(er)=>{console.log("Intercept error",er)}/*timeComment("Failed to compute :: intercept")*/).catch(ErrorHandler("Intercept calculation"));
    },(e)=>{timeComment("Failed to compute :: gtl ::" + e )}).catch(ErrorHandler("GTL"));
  }

  /*

  function globalToLocal(o){

  }
  */
}

//Private function for sensor class

function globalToLocal(sensor,pos){
  //position copy-> as this is passed by reference and this changes when used
  let posC = createVector(pos.x,pos.y)
  let shift = posC.sub(sensor.origin)
  let rotation = (shift.heading() + 90 - (sensor.reffAngle + sensor.dir));
  let newC = createVector(cos(rotation),sin(rotation)).mult(shift.mag());
  (debug)?console.log("Checking Rotation as error" ,shift.x,shift.y,newC, rotation,sensor.dir):null;
  return new Promise(function(resolve,failure){
    if(newC){
      //console.log("changed positions")
      resolve(newC);
    }
    else {
      failure(newC);
    }
  });
}

function getNearestInterceptAlongTheDirectionOfVector(pos,meteor,dir=0){
  let r = meteor.r
  let unSqrtD = r*r - pos.y*pos.y
  let D = Math.sqrt(unSqrtD);
  (debug)?console.log("Checking value of the Delta",D):null;
  let Y = [
    -(pos.x + D ),
    -(pos.x - D )
  ]

  let nearest = (abs(Y[0])>=abs(Y[1]))?Y[1]:Y[0];

  (debug )?console.log("Nearest coordinate :: ",dir,meteor,pos,D,Y,nearest,unSqrtD):null;
  let er = {
    dir,meteor,pos,D,Y,nearest,unSqrtD
  }

  return new Promise((resolve,reject)=>{
    if(nearest != NaN ){
      resolve(nearest)
    }
    else {
      reject(er)
    }
  });
}

function drawInteraction(sensor,posInMinusY){
  push();
  translate(sensor.origin.x,sensor.origin.y);
  rotate(sensor.reffAngle+sensor.dir);
  strokeWeight(4);
  stroke('rgb(207, 63, 63)')
  line(0,0,0,-sensor.range)
  fill('rgb(28, 82, 12)');
  circle(0,posInMinusY,10);
  pop();
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

function ErrorHandler(area){
  (debug)?console.log("Failure Occured at ::",area):null;
}
