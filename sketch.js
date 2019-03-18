//Debugging
let reff = true;
let height = 320;
let width = 640;

let r;
let m = [];
function setup(){
  createCanvas(width,height);


  angleMode(DEGREES);
  rectMode(CENTER);

  frameRate(30);

  r = new rocket(100,100,10,10,'rgb(25,25,100)')
  r.draw();

  for(i=0;i<10;i++){
    let x=new meteor(random(width),random(height),random(6,20),random(360),random(6));
    x.draw();
    m.push(x);
  }

  /*
  g = new game();
  g.setup(()=>{
    console.log("Game Started");
  });
  */
}

function draw(){
  background(240);

  r.move();
  m.forEach((rock)=>{
    rock.move();
    r.collision(rock);
  });

}

class game{
  constructor(){
    this.over = false;
    this.score = 0;
  }

 setup(callback){
    push();
    fill(0);
    translate(width/2,height/2);
    rect(0,0,width/2,height/2,0.2*width);
    fill(100);
    textAlign(CENTER,CENTER)
    textSize(height/4);
    text("Start",0,0);
    pop();

    callback();
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

  move(){
    let v = createVector(sin(this.direction),-cos(this.direction)).mult(this.velocity+this.acc)
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

    if(keyIsDown(87)){
      this.acc += 0.2;
      console.log(key);
    }

    else if(keyIsDown(83)){
      this.acc -= 0.2;
      console.log(this.acc);
    }

    //turn Rocket
    if(keyIsDown(39)){
      this.direction += 10;
      console.log(key);
    }

    else if(keyIsDown(37)){
      this.direction -= 10
      console.log(key);
    }
    this.draw()
  }

  collision(other){
    let d = dist(this.pos.x,this.pos.y,other.pos.x,other.pos.y);
    if(d <= this.r + other.r){
      console.log("collision");
      this.alert = true;
    }
    else {
      this.alert=false;
    }
  }

}
class meteor{
  constructor(x,y,r=5,dir=0,vel=5){
    this.pos = createVector(x,y);
    this.velocity = vel;
    this.direction = dir;
    this.r = r;
  }

  draw(){
    push();
    translate(this.pos.x,this.pos.y);
    fill(255,0,0);
    circle(0,0,this.r);
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

function mouseIsClicked(box){
  if(
    mouseX > box.x - box.width

  ){}
}
