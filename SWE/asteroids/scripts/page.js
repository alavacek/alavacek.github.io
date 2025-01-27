/* ------------- Winter 2024 EECS 493 Assignment 3 Starter Code ------------ */

/* ------------------------ GLOBAL HELPER VARAIBLES ------------------------ */
// Difficulty Helpers
let astProjectileSpeed = 3;            // easy: 1, norm: 3, hard: 5

// Game Object Helpers
let currentAsteroid = 1;
const AST_OBJECT_REFRESH_RATE = 15;
const maxPersonPosX = 1218;
const maxPersonPosY = 658;
const PERSON_SPEED = 4;                // #pixels each time player moves by
const portalOccurrence = 15000;        // portal spawns every 15 seconds
const portalGone = 5000;               // portal disappears in 5 seconds
const shieldOccurrence = 10000;        // shield spawns every 10 seconds
const shieldGone = 5000;               // shield disappears in 5 seconds

// Movement Helpers
let LEFT = false;
let RIGHT = false;
let UP = false;
let DOWN = false;

// TODO: ADD YOUR GLOBAL HELPER VARIABLES (IF NEEDED)
var selectedButtonMode = "Normal";
var score = 0;
var level = 1;
var dangerLevel = 20;
var activeGame = false;
var gameHasEnded = false;

var pos_x = 640;
var pos_y = 360;
var player;
var hasShield = false;
var volume = 50;

var currentShield;
var currentPortal;
var activeShield;
var activePortal;

var shieldGameLoop;
var portalGameLoop;
/* --------------------------------- MAIN ---------------------------------- */
$(document).ready(function () {
  // jQuery selectors
  game_window = $('.game-window');
  game_screen = $("#actual-game");
  asteroid_section = $('.asteroidSection');
  // hide all other pages initially except landing page
  game_screen.hide();

  /* -------------------- ASSIGNMENT 2 SELECTORS BEGIN -------------------- */
  //Sliders
  var slider = document.getElementById("volumeSlider");
  var output = document.getElementById("volume");
  output.innerHTML = slider.value;
  slider.oninput = function() {
    output.innerHTML = this.value;
    volume = parseInt(this.value);
  }

  // Base button setting
  let referenceButton = document.getElementById('Normal');
  defaultBorderStyle = window.getComputedStyle(referenceButton).border;

  //Difficulty button
  $("#" + selectedButtonMode).css("border", "5px solid #FFE800");

  // Click event listeners for each button
  $("#Easy").click(function () {
    updateMode(this, "Easy");
  });

  $("#Normal").click(function () {
    updateMode(this, "Normal");
  });

  $("#Hard").click(function () {
    updateMode(this, "Hard");
  });
  /* --------------------- ASSIGNMENT 2 SELECTORS END --------------------- */

  // JQUERY SELECTORS (FOR ASSIGNMENT 3) HERE
  spawn_section = $('.spawn-section');
  player = document.getElementById('rocket');
  // Example: Spawn an asteroid that travels from one border to another
  // spawn(); // Uncomment me to test out the effect!
});


/* ---------------------------- EVENT HANDLERS ----------------------------- */
// Keydown event handler
document.onkeydown = function (e) {
  if (e.key == 'ArrowLeft') LEFT = true;
  if (e.key == 'ArrowRight') RIGHT = true;
  if (e.key == 'ArrowUp') UP = true;
  if (e.key == 'ArrowDown') DOWN = true;
}

// Keyup event handler
document.onkeyup = function (e) {
  if (e.key == 'ArrowLeft') LEFT = false;
  if (e.key == 'ArrowRight') RIGHT = false;
  if (e.key == 'ArrowUp') UP = false;
  if (e.key == 'ArrowDown') DOWN = false;
}


/* ------------------ ASSIGNMENT 2 EVENT HANDLERS BEGIN ------------------ */

function showSettings() {
  let settings =
    document.getElementById("settings");

    settings.style.display = "inline";

}

function showTutorial() {
  let mainMenu =
    document.getElementById("main-menu");
  mainMenu.style.display = "none";

  let tutorial =
    document.getElementById("tutorial");
  tutorial.style.display = "inline";

}

function closeSettings(){
  let settings =
  document.getElementById("settings");

  settings.style.display = "none";
}

// Function to update the border for the clicked button and update the variable
function updateMode(clickedButton, buttonMode) {
  document.getElementById('Easy').style.border = defaultBorderStyle;
  document.getElementById('Normal').style.border = defaultBorderStyle;
  document.getElementById('Hard').style.border = defaultBorderStyle;

  $(clickedButton).css("border", "none");
  $(clickedButton).css("border", "5px solid #FFE800");

  // Update selectedButtonMode
  selectedButtonMode = buttonMode;
  }

/* ------------------- ASSIGNMENT 2 EVENT HANDLERS END ------------------- */

// MORE FUNCTIONS OR EVENT HANDLERS (FOR ASSIGNMENT 3) HERE
function restartGame() {
  var gameover = document.getElementById('game-over');
  gameover.style.display = "none";

  let tutorial =
    document.getElementById("tutorial");
  tutorial.style.display = "none";

  let actualGame =
    document.getElementById("actual-game");
  actualGame.style.display = "none";

  let getReady =
    document.getElementById("get-ready");
  getReady.style.display = "none";

  let mainMenu =
    document.getElementById("main-menu");
  mainMenu.style.display = "inline";

  player.style.display = "none";

  hasShield = false;
  activeGame = false;
  gameHasEnded = false;
  activeShield = false;
  activePortal = false;

  let asteroids = document.getElementById("asteroidSection");
  while(asteroids.firstChild) {
    asteroids.removeChild(asteroids.firstChild);
  }

  let spawnSection = document.getElementById("spawn-section");
  while(spawnSection.firstChild) {
    spawnSection.removeChild(spawnSection.firstChild);
  }
}

function startGame(){
  let tutorial =
    document.getElementById("tutorial");
  tutorial.style.display = "none";

  let actualGame =
    document.getElementById("actual-game");
  actualGame.style.display = "inline";

  let getReady =
    document.getElementById("get-ready");
  getReady.style.display = "inline";

  player.style.display = "none";

  let danger =
    document.getElementById("danger");
  if (selectedButtonMode === "Easy")
  {
    danger.textContent = 10;
    dangerLevel = 10;
  }
  else if (selectedButtonMode === "Normal")
  {
    danger.textContent = 20;
    dangerLevel = 20;
  }
  else
  {
    danger.textContent = 30;
    dangerLevel = 20;
  }

  level = 1;
  let levelText = document.getElementById("level");
  levelText.textContent = level;

  score = 0;
  let scoreText = document.getElementById("score");
  scoreText.textContent = score;

  setTimeout(gameLoop, 3000);

}

// Function to update the rocket's position
function updateRocketPosition() {
  if (UP)
  {
    pos_y -= (1 * PERSON_SPEED);
  }
  if (DOWN)
  {
    pos_y += (1 * PERSON_SPEED);
  }
  if (LEFT)
  {
    pos_x -= (1 * PERSON_SPEED);
  }
  if (RIGHT)
  {
    pos_x += (1 * PERSON_SPEED);
  }

  player.style.left = Math.min(Math.max(pos_x, 0), maxPersonPosX); + "px";
  player.style.top = Math.min(Math.max(pos_y, 0), maxPersonPosY); + "px";
}

// Function to update rocket's sprite
function updateRocketSprite() {
  var rocketImage = player.querySelector('img');
  if (hasShield)
  {
    if (UP)
    {
      rocketImage.src = 'src/player/player_shielded_up.GIF';
    }
    if (DOWN)
    {
      rocketImage.src = 'src/player/player_shielded_down.GIF';
    }
    if (LEFT)
    {
      rocketImage.src = 'src/player/player_shielded_left.GIF';
    }
    if (RIGHT)
    {
      rocketImage.src = 'src/player/player_shielded_right.GIF';
    }

    if (!RIGHT && !LEFT && !DOWN && !UP)
    {
      rocketImage.src = 'src/player/player_shielded.GIF';
    }
  }
  else if (activeGame)
  {
    if (UP)
    {
      rocketImage.src = 'src/player/player_up.GIF';
    }
    if (DOWN)
    {
      rocketImage.src = 'src/player/player_down.GIF';
    }
    if (LEFT)
    {
      rocketImage.src = 'src/player/player_left.GIF';
    }
    if (RIGHT)
    {
      rocketImage.src = 'src/player/player_right.GIF';
    }

    if (!RIGHT && !LEFT && !DOWN && !UP)
    {
      rocketImage.src = 'src/player/player.GIF';
    }
  }

}

function gameLoop() {
  console.log("new game");
  //Turn off get-ready
  let getReady =
    document.getElementById("get-ready");
  getReady.style.display = "none";

  // Set Player
  pos_x = 640;
  pos_y = 360;
  player.style.top = "360px";
  player.style.right = "640px";
  player.style.display = "inline";
  hasShield = false;

  activeGame = true;
  var spawnRate = 1000;
  if (selectedButtonMode === "Easy")
  {
    spawnRate = 1000;
    astProjectileSpeed = 1;
  }
  else if (selectedButtonMode === "Normal")
  {
    spawnRate = 800;
    astProjectileSpeed = 3;
  }
  else
  {
    spawnRate = 600;
    astProjectileSpeed = 5;
  }

  // Game Loops
  // Asteroid collision loop
  let asteroidGameLoop = setInterval(() => {
    astProjectileSpeed = astProjectileSpeed + ((level - 1) * 0.2);
    spawn();

    if (!activeGame) {
      clearInterval(asteroidGameLoop);
    }
  }, spawnRate);

  // Update score loop
  let scoreLoop = setInterval(() => {
    score = score + 40;
    let scoreText = document.getElementById("score");
    scoreText.textContent = score;

    if (!activeGame) {
      clearInterval(scoreLoop);
    }
  }, 500);

  // player movement loop
  let playerGameLoop = setInterval(() => {

    updateRocketPosition();
    updateRocketSprite();

    if (!activeGame) {
      clearInterval(playerGameLoop);
    }
  }, 8);

  // shield spawn and despawn loop
  shieldGameLoop = setInterval(() => {
    if (activeGame)
    {
      //spawn
      currentShield = new Shield();
      activeShield = true;

      //wait 5 seconds, despawn
      setTimeout(removeShield, shieldGone)
      if (!activeGame) {
        removeShield();
        clearInterval(shieldGameLoop);
      }
    }
    
  }, shieldOccurrence);

  //shield collision loop
  let shieldCollideLoop = setInterval(() => {
    if (activeShield)
    {
      let player_id = $('#rocket');
      let shield_id = currentShield.id;
      
      if (activeGame && isColliding(shield_id, player_id))
      {
        hasCollided = true;
        removeShield();

        hasShield = true;
  
        //collect shield sound
        var collectSound = new Audio('src/audio/collect.mp3');
        collectSound.loop = false;
        collectSound.volume = (volume / 100);
        collectSound.play();
  
      }
  
      if (!activeGame) {
        clearInterval(shieldCollideLoop);
      }
    }

  }, 15);

  // portal spawn and despawn loop
  portalGameLoop = setInterval(() => {
    if (activeGame)
    {    
      //spawn
      currentPortal = new Portal();
      activePortal = true;

      //wait 5 seconds, despawn
      setTimeout(removePortal, portalGone)

      if (!activeGame) {
        removePortal();
        clearInterval(portalGameLoop);
      }
    }
  }, portalOccurrence);

  //portal collision loop
  let portalCollideLoop = setInterval(() => {
    if (activePortal)
    {
      let player_id = $('#rocket');
      let portal_id = currentPortal.id;
      
      if (activeGame && isColliding(portal_id, player_id))
      {
        removePortal();
  
  
        //collect portal sounds
        var collectSound = new Audio('src/audio/collect.mp3');
        collectSound.loop = false;
        collectSound.volume = (volume / 100);
        collectSound.play();
  
        level = level + 1;
        dangerLevel = dangerLevel + 2;
        astProjectileSpeed = astProjectileSpeed * 0.5;
  
        let danger = document.getElementById("danger");
        danger.textContent = dangerLevel;
  
        let levelText = document.getElementById("level");
        levelText.textContent = level;
        }

        if (!activeGame) {
          clearInterval(portalCollideLoop);
        }
    }


  }, 15);

}

function endGame() {
  clearInterval(portalGameLoop);
  clearInterval(shieldGameLoop);
  //die sound
  var dieSound = new Audio('src/audio/die.mp3');
  dieSound.loop = false;
  dieSound.volume = (volume / 100);
  dieSound.play();

  var rocketImage = player.querySelector('img');
    // Change the image source
    rocketImage.src = 'src/player/player_touched.GIF';

  setTimeout(showGameOver, 2000)
}

function showGameOver()
{
  var scoreText = document.getElementById('score-display');
  scoreText.textContent = score;

  var gameover = document.getElementById('game-over');
  gameover.style.display = "block";
}

function removeShield() {
  if (activeShield)
  {
    var shield = document.getElementById('shield');
    shield.parentNode.removeChild(shield);
    activeShield = false;
  }

}

function removePortal() {
  if (activePortal)
  {
    var portal = document.getElementById('portal');
    portal.parentNode.removeChild(portal);
    activePortal = false;
  }
}


class Shield {
  constructor() {
    /*------------------------Public Member Variables------------------------*/
    // create a new Shield div and append it to DOM so it can be modified later
    let objectString = "<div id = 'shield' class = 'curShield' > <img src = 'src/shield.GIF'/></div>";
    spawn_section.append(objectString);

    this.id = $('#shield');

    // current x, y position of this Shield
    this.cur_x = getRandomNumber(20, 1260); // number of pixels from right
    this.cur_y = getRandomNumber(20, 680);; // number of pixels from right

    /*------------------------Private Member Variables------------------------*/
    // spawn a Shield at a random location
    this.#spawnShield();
  }

  #spawnShield() {
    this.id.css("top", this.cur_y);
    this.id.css("right", this.cur_x);
  }

}

class Portal {
  constructor() {
    /*------------------------Public Member Variables------------------------*/
    // create a new Portal div and append it to DOM so it can be modified later
    let objectString = "<div id = 'portal' class = 'curPortal' > <img src = 'src/port.GIF'/></div>";
    spawn_section.append(objectString);

    this.id = $('#portal');

    // current x, y position of this Portal
    this.cur_x = getRandomNumber(20, 1260); // number of pixels from right
    this.cur_y = getRandomNumber(20, 680);; // number of pixels from right

    /*------------------------Private Member Variables------------------------*/
    // spawn a portal at a random location
    this.#spawnPortal();
  }

  #spawnPortal() {
    this.id.css("top", this.cur_y);
    this.id.css("right", this.cur_x);
  }

}





/* ---------------------------- GAME FUNCTIONS ----------------------------- */
// Starter Code for randomly generating and moving an asteroid on screen
class Asteroid {
  // constructs an Asteroid object
  constructor() {
    /*------------------------Public Member Variables------------------------*/
    // create a new Asteroid div and append it to DOM so it can be modified later
    let objectString = "<div id = 'a-" + currentAsteroid + "' class = 'curAsteroid' > <img src = 'src/asteroid.png'/></div>";
    asteroid_section.append(objectString);
    // select id of this Asteroid
    this.id = $('#a-' + currentAsteroid);
    currentAsteroid++; // ensure each Asteroid has its own id
    // current x, y position of this Asteroid
    this.cur_x = 0; // number of pixels from right
    this.cur_y = 0; // number of pixels from top

    /*------------------------Private Member Variables------------------------*/
    // member variables for how to move the Asteroid
    this.x_dest = 0;
    this.y_dest = 0;
    // member variables indicating when the Asteroid has reached the boarder
    this.hide_axis = 'x';
    this.hide_after = 0;
    this.sign_of_switch = 'neg';
    // spawn an Asteroid at a random location on a random side of the board
    this.#spawnAsteroid();
  }

  // Requires: called by the user
  // Modifies:
  // Effects: return true if current Asteroid has reached its destination, i.e., it should now disappear
  //          return false otherwise
  hasReachedEnd() {
    if (this.hide_axis == 'x') {
      if (this.sign_of_switch == 'pos') {
        if (this.cur_x > this.hide_after) {
          return true;
        }
      }
      else {
        if (this.cur_x < this.hide_after) {
          return true;
        }
      }
    }
    else {
      if (this.sign_of_switch == 'pos') {
        if (this.cur_y > this.hide_after) {
          return true;
        }
      }
      else {
        if (this.cur_y < this.hide_after) {
          return true;
        }
      }
    }
    return false;
  }

  // Requires: called by the user
  // Modifies: cur_y, cur_x
  // Effects: move this Asteroid 1 unit in its designated direction
  updatePosition() {
    // ensures all asteroids travel at current level's speed
    this.cur_y += this.y_dest * astProjectileSpeed;
    this.cur_x += this.x_dest * astProjectileSpeed;
    // update asteroid's css position
    this.id.css('top', this.cur_y);
    this.id.css('right', this.cur_x);
  }

  // Requires: this method should ONLY be called by the constructor
  // Modifies: cur_x, cur_y, x_dest, y_dest, num_ticks, hide_axis, hide_after, sign_of_switch
  // Effects: randomly determines an appropriate starting/ending location for this Asteroid
  //          all asteroids travel at the same speed
  #spawnAsteroid() {
    // REMARK: YOU DO NOT NEED TO KNOW HOW THIS METHOD'S SOURCE CODE WORKS
    let x = getRandomNumber(0, 1280);
    let y = getRandomNumber(0, 720);
    let floor = 784;
    let ceiling = -64;
    let left = 1344;
    let right = -64;
    let major_axis = Math.floor(getRandomNumber(0, 2));
    let minor_aix = Math.floor(getRandomNumber(0, 2));
    let num_ticks;

    if (major_axis == 0 && minor_aix == 0) {
      this.cur_y = floor;
      this.cur_x = x;
      let bottomOfScreen = game_screen.height();
      num_ticks = Math.floor((bottomOfScreen + 64) / astProjectileSpeed) || 1;

      this.x_dest = (game_screen.width() - x);
      this.x_dest = (this.x_dest - x) / num_ticks + getRandomNumber(-.5, .5);
      this.y_dest = -astProjectileSpeed - getRandomNumber(0, .5);
      this.hide_axis = 'y';
      this.hide_after = -64;
      this.sign_of_switch = 'neg';
    }
    if (major_axis == 0 && minor_aix == 1) {
      this.cur_y = ceiling;
      this.cur_x = x;
      let bottomOfScreen = game_screen.height();
      num_ticks = Math.floor((bottomOfScreen + 64) / astProjectileSpeed) || 1;

      this.x_dest = (game_screen.width() - x);
      this.x_dest = (this.x_dest - x) / num_ticks + getRandomNumber(-.5, .5);
      this.y_dest = astProjectileSpeed + getRandomNumber(0, .5);
      this.hide_axis = 'y';
      this.hide_after = 784;
      this.sign_of_switch = 'pos';
    }
    if (major_axis == 1 && minor_aix == 0) {
      this.cur_y = y;
      this.cur_x = left;
      let bottomOfScreen = game_screen.width();
      num_ticks = Math.floor((bottomOfScreen + 64) / astProjectileSpeed) || 1;

      this.x_dest = -astProjectileSpeed - getRandomNumber(0, .5);
      this.y_dest = (game_screen.height() - y);
      this.y_dest = (this.y_dest - y) / num_ticks + getRandomNumber(-.5, .5);
      this.hide_axis = 'x';
      this.hide_after = -64;
      this.sign_of_switch = 'neg';
    }
    if (major_axis == 1 && minor_aix == 1) {
      this.cur_y = y;
      this.cur_x = right;
      let bottomOfScreen = game_screen.width();
      num_ticks = Math.floor((bottomOfScreen + 64) / astProjectileSpeed) || 1;

      this.x_dest = astProjectileSpeed + getRandomNumber(0, .5);
      this.y_dest = (game_screen.height() - y);
      this.y_dest = (this.y_dest - y) / num_ticks + getRandomNumber(-.5, .5);
      this.hide_axis = 'x';
      this.hide_after = 1344;
      this.sign_of_switch = 'pos';
    }
    // show this Asteroid's initial position on screen
    this.id.css("top", this.cur_y);
    this.id.css("right", this.cur_x);
    // normalize the speed s.t. all Asteroids travel at the same speed
    let speed = Math.sqrt((this.x_dest) * (this.x_dest) + (this.y_dest) * (this.y_dest));
    this.x_dest = this.x_dest / speed;
    this.y_dest = this.y_dest / speed;
  }
}

// Spawns an asteroid travelling from one border to another
function spawn() {
  let asteroid = new Asteroid();
  setTimeout(spawn_helper(asteroid), 0);
}

function spawn_helper(asteroid) {
  let astermovement = setInterval(function () {
    if (activeGame)
    {
        // update Asteroid position on screen
        asteroid.updatePosition();
      

      let player_id = $('#rocket');
      let asteroid_id = asteroid.id;
      
      if (isColliding(asteroid_id, player_id) && gameHasEnded === false)
      {
        if (hasShield)
        {
          hasShield = false;
          asteroid.id.remove();
        }
        else
        {
          gameHasEnded = true; //incase multiple collide over player at onces
          activeGame = false;
          endGame();
        }
      }
    }

    // determine whether Asteroid has reached its end position
    if (asteroid.hasReachedEnd()) { // i.e. outside the game boarder
      asteroid.id.remove();
      clearInterval(astermovement);
    }
  }, AST_OBJECT_REFRESH_RATE);
}

/* --------------------- Additional Utility Functions  --------------------- */
// Are two elements currently colliding?
function isColliding(o1, o2) {
  return isOrWillCollide(o1, o2, 0, 0);
}

// Will two elements collide soon?
// Input: Two elements, upcoming change in position for the moving element
function willCollide(o1, o2, o1_xChange, o1_yChange) {
  return isOrWillCollide(o1, o2, o1_xChange, o1_yChange);
}

// Are two elements colliding or will they collide soon?
// Input: Two elements, upcoming change in position for the moving element
// Use example: isOrWillCollide(paradeFloat2, person, FLOAT_SPEED, 0)
function isOrWillCollide(o1, o2, o1_xChange, o1_yChange) {
  const o1D = {
    'left': o1.offset().left + o1_xChange,
    'right': o1.offset().left + o1.width() + o1_xChange,
    'top': o1.offset().top + o1_yChange,
    'bottom': o1.offset().top + o1.height() + o1_yChange
  };
  const o2D = {
    'left': o2.offset().left,
    'right': o2.offset().left + o2.width(),
    'top': o2.offset().top,
    'bottom': o2.offset().top + o2.height()
  };
  // Adapted from https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
  if (o1D.left < o2D.right &&
    o1D.right > o2D.left &&
    o1D.top < o2D.bottom &&
    o1D.bottom > o2D.top) {
    // collision detected!
    return true;
  }
  return false;
}

// Get random number between min and max integer
function getRandomNumber(min, max) {
  return (Math.random() * (max - min)) + min;
}
