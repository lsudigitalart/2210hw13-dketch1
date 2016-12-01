var img;
var song;
var systems;

function preload() {
  img = loadImage('image.png');
  song = loadSound('song.mp3');
  systems = [];
}

function setup() {
    createCanvas(400, 250);
      song.play();
}

function draw() {
  background(255);
  image(img, 0, 0);
  for (i = 0; i < systems.length; i++) {
      systems[i].run();
      systems[i].addParticle();
    }
    if (systems.length==0) {
      fill(255);
      textAlign(CENTER);
      textSize(16);
      text("- click mouse to make snow!", width/2.4, height/1.3);
    }
  }

  function mousePressed() {
    this.p = new ParticleSystem(createVector(mouseX, mouseY));
    systems.push(p);
  }

  var Particle = function(position) {
    this.acceleration = createVector(0, 0.05);
    this.velocity = createVector(random(-1, 1), random(-.5, 1));
    this.position = position.copy();
    this.lifespan = 255.0;
  };

  Particle.prototype.run = function() {
    this.update();
    this.display();
  };

  Particle.prototype.update = function(){
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.lifespan -= 2;
  };

  Particle.prototype.display = function () {
    stroke(200, this.lifespan);
    strokeWeight(0);
    fill(255, this.lifespan);
    ellipse(this.position.x, this.position.y, 4, 4);
  };

  Particle.prototype.isDead = function () {
    if (this.lifespan < 0) {
      return true;
    } else {
      return false;
    }
  };

  var ParticleSystem = function (position) {
    this.origin = position.copy();
    this.particles = [];
  };

  ParticleSystem.prototype.addParticle = function () {
    if (int(random(0, 2)) == 0) {
      p = new Particle(this.origin);
    }
    else {
      p = new SnowParticle(this.origin);
    }
    this.particles.push(p);
  };

  ParticleSystem.prototype.run = function () {
    for (var i = this.particles.length - 1; i >= 0; i--) {
      var p = this.particles[i];
      p.run();
      if (p.isDead()) {
        this.particles.splice(i, 1);
      }
    }
  };

  function SnowParticle(origin) {
    Particle.call(this, origin);
    this.theta = 0.0;
  };

  SnowParticle.prototype = Object.create(Particle.prototype);
  SnowParticle.prototype.constructor = CrazyParticle;
  SnowParticle.prototype.update=function() {
    Particle.prototype.update.call(this);
    this.theta += (this.velocity.x * this.velocity.mag()) / 10.0;
  }

  SnowParticle.prototype.display=function() {
    Particle.prototype.display.call(this);
    push();
    translate(this.position.x, this.position.y);
    rotate(this.theta);
    stroke(255,this.lifespan);
    pop();
  }
