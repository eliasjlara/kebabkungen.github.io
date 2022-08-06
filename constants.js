const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

const cross = document.querySelector(".close");
const resultMenu = document.querySelector(".resultMenu");
const gameOverlay = document.querySelector(".gameOverlay");
const startOverlay1 = document.querySelector(".startOverlay1");
const startOverlay2 = document.querySelector(".startOverlay2");

let vh = window.innerHeight * 0.01;
let wh = window.innerWidth * 0.01;

canvas.width = innerWidth;
canvas.height = innerHeight;

mapSize = 16;
var tut1Clear = false;

if (innerWidth > innerHeight) {
  squareSize = (innerHeight - innerHeight / 4) / mapSize;
} else {
  squareSize = (wh * 100) / 16;
  yOffset = innerHeight / 2 - wh * 50;

  innerHeight - (vh * 5 + squareSize * 16 + vh * 3);

  document.getElementById("clickTutDiv").innerHTML = "Tap to continue";
  document.getElementById("clickTutDiv2").innerHTML = "Tap to begin";
  document.getElementById("moveTutDiv").innerHTML = "Swipe to move";
  document.getElementById("aimTutDiv").innerHTML = "Swipe to aim";
  document.getElementById("bombTutDiv").innerHTML = "Tap to bomb";
}

var close = false;

var yOffset = 0;
var day = 9;
var maxMoves = 65;

document.getElementById("maxMovesP").innerHTML = "Get under " + "<u>" + maxMoves + "</u>";
document.getElementById("dayP").innerHTML = "Day - " + day;
document.getElementById("dayP2").innerHTML = "Day - " + day;
document.getElementById("dayDiv").innerHTML = "Day - " + day;

const ball = new Image();
ball.src = "img/ball.png";

const paintImg = new Image();
paintImg.src = "img/paint.png";

const wall = new Image();
wall.src = "img/wall.png";
const ground = new Image();
ground.src = "img/ground.png";
const dark = new Image();
dark.src = "img/dark_wall.png";
const bomb = new Image();
bomb.src = "img/bomb.png";
const bombBall = new Image();
bombBall.src = "img/bombBall.png";
const bombFire = new Image();
bombFire.src = "img/bombFire.png";
const arrowUp = new Image();
arrowUp.src = "img/arrowUp.png";
const arrowLeft = new Image();
arrowLeft.src = "img/arrowLeft.png";
const arrowRight = new Image();
arrowRight.src = "img/arrowRight.png";
const arrowDown = new Image();
arrowDown.src = "img/arrowDown.png";
const explosion = new Image();
explosion.src = "img/explosion.png";

const boundaries = [];

const keys = {
  w: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
  s: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  b: {
    pressed: false,
  },
};

let lastKey = "";

startPos = {
  x: 0,
  y: 0,
};

var winCon = 0;

const speed = squareSize;
var moves = 0;

var shareText = "Copy results";

var moving = false;
var moveCount = false;

if (innerWidth > innerHeight) {
  squareSize = (innerHeight - innerHeight / 4) / mapSize;
} else {
  squareSize = (wh * 100) / 16;
  yOffset = innerHeight / 2 - wh * 50;
}

const map = [
  ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
  ["#", " ", "B", "0", "0", "0", "0", "0", "0", " ", " ", " ", " ", " ", " ", "#"],
  ["#", "0", "0", "0", "0", "0", "0", "0", "0", "0", " ", " ", " ", " ", " ", "#"],
  ["#", "0", " ", " ", "0", " ", " ", " ", "0", "0", "0", " ", " ", " ", " ", "#"],
  ["#", "0", " ", " ", "0", "B", " ", " ", "0", "0", "0", "0", " ", " ", " ", "#"],
  ["#", "S", "0", "0", "0", "0", "B", " ", " ", "0", "0", "0", "0", " ", " ", "#"],
  ["#", " ", "#", "#", "#", "#", " ", " ", " ", " ", "B", "0", "0", "0", "0", "#"],
  ["#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "0", "0", "0", "0", "#"],
  ["#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "#", "#", "#", "#", "#"],
  ["#", " ", "0", "0", "0", "0", "0", "0", "0", "0", " ", "0", "0", "0", "0", "#"],
  ["#", "#", "0", " ", " ", "0", "0", "#", "0", "0", " ", "0", " ", " ", "0", "#"],
  ["#", "#", "0", " ", " ", "0", "0", " ", "0", "0", "0", "0", "0", "0", "0", "#"],
  ["#", " ", "0", "0", "0", "0", "0", " ", " ", " ", " ", " ", " ", " ", " ", "#"],
  ["#", " ", " ", " ", " ", "0", "0", "#", " ", " ", "0", "0", "0", " ", " ", "#"],
  ["#", " ", " ", " ", " ", " ", "0", "0", "0", "0", "0", "0", "B", " ", " ", "#"],
  ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
];
