let obstacles = [];
let player;
let exitZone;
let gameWon = false;
let gameOver = false;

function setup() {
  createCanvas(600, 400);

  // Create initial 5 obstacles
  for (let i = 0; i < 5; i++) {
    let followsPlayer = (i == 0); // First obstacle follows player
    obstacles.push(new Obstacle(random(width), random(height), random(20, 60), random(20, 60), randomColor(), true, followsPlayer));
  }

  // Create player
  player = {
    x: 50,
    y: 50,
    size: 20
  };

  // Create exit zone
  exitZone = {
    x: width - 60,
    y: height - 60,
    w: 50,
    h: 50
  };
}

function draw() {
  background(220);

  // Draw exit area
  fill(0, 255, 0);
  rect(exitZone.x, exitZone.y, exitZone.w, exitZone.h);
  
  // Move and draw obstacles
  for (let obs of obstacles) {
    obs.update();
    obs.display();

    // Check collision with player
    if (dist(player.x, player.y, obs.x + obs.w/2, obs.y + obs.h/2) < (player.size/2 + max(obs.w, obs.h)/2)) {
      gameOver = true;
    }
  }
  
  // Draw player
  fill(0, 0, 255);
  ellipse(player.x, player.y, player.size);

  // Move player with arrow keys
  if (!gameOver) {  // Allow player to move even after winning
    if (keyIsDown(LEFT_ARROW)) player.x -= 3;
    if (keyIsDown(RIGHT_ARROW)) player.x += 3;
    if (keyIsDown(UP_ARROW)) player.y -= 3;
    if (keyIsDown(DOWN_ARROW)) player.y += 3;
  }

  // Check win condition
  if (!gameWon && player.x > exitZone.x && player.x < exitZone.x + exitZone.w &&
      player.y > exitZone.y && player.y < exitZone.y + exitZone.h) {
    gameWon = true;
  }

  // Display win or game over
  if (gameWon) {
    textSize(32);
    fill(0, 150, 0);
    textAlign(CENTER, CENTER);
    text("YOU WIN!", width / 2, 30);
  }
  
  if (gameOver) {
    textSize(48);
    fill(255, 0, 0);
    textAlign(CENTER, CENTER);
    text("GAME OVER", width / 2, height / 2);
    noLoop(); // Stop the game completely on game over
  }
}

function mousePressed() {
  // On click, add new moving obstacle
  obstacles.push(new Obstacle(mouseX, mouseY, random(20, 50), random(20, 50), randomColor(), true, false));
}

// Obstacle class
class Obstacle {
  constructor(x, y, w, h, col, moving, followsPlayer) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.col = col;
    this.moving = moving;
    this.followsPlayer = followsPlayer;
    this.speedX = random(-2, 2);
    this.speedY = random(-2, 2);
  }

  update() {
    if (this.followsPlayer) {
      // Move towards player
      let angle = atan2(player.y - (this.y + this.h/2), player.x - (this.x + this.w/2));
      this.x += cos(angle) * 2;
      this.y += sin(angle) * 2;
    } else if (this.moving) {
      // Random movement
      this.x += this.speedX;
      this.y += this.speedY;

      // Wrap around screen
      if (this.x > width) this.x = 0;
      if (this.x < 0) this.x = width;
      if (this.y > height) this.y = 0;
      if (this.y < 0) this.y = height;
    }
  }

  display() {
    fill(this.col);
    rect(this.x, this.y, this.w, this.h);
  }
}

// Helper function
function randomColor() {
  return color(random(255), random(255), random(255));
}
