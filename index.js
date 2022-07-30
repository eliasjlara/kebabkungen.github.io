const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

let vh = window.innerHeight * 0.01;
let wh = window.innerWidth * 0.01;

canvas.width = innerWidth;
canvas.height = innerHeight;

mapSize = 16;

var yOffset = 0;
var day = 2;
var maxMoves = 35;

if (innerWidth > innerHeight) {
  squareSize = (innerHeight - innerHeight / 4) / mapSize;
} else {
  squareSize = (wh * 97.5) / 16;
  yOffset = innerHeight / 2 - wh * 50;

  innerHeight - (vh * 5 + squareSize * 16 + vh * 3);
}

class Boundary {
  static width = squareSize;
  static height = squareSize;
  constructor({ position, image, passable, start }) {
    this.position = position;
    this.width = squareSize;
    this.height = squareSize;
    this.image = image;
    this.passable = passable;
    this.start = start;
  }

  draw() {
    c.drawImage(
      this.image,
      0,
      0,
      this.image.width,
      this.image.height,
      this.position.x,
      this.position.y,
      squareSize,
      squareSize
    );
  }
}

class Player {
  constructor({ position, velocity, image }) {
    this.position = position;
    this.velocity = velocity;
    this.image = image;
    this.radius = 1;
  }

  draw() {
    c.drawImage(
      this.image,
      0,
      0,
      this.image.width,
      this.image.height,
      this.position.x - squareSize / 2,
      this.position.y - squareSize / 2,
      squareSize,
      squareSize
    );
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}

const ball = new Image();
ball.src = "img/ball.png";

const paintImg = new Image();
paintImg.src = "img/paint.png";

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
};

let lastKey = "";

const map = [
  ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
  ["#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "#"],
  ["#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "#"],
  ["#", " ", " ", " ", "0", "0", "0", "0", "0", "0", "0", " ", " ", " ", " ", "#"],
  ["#", " ", " ", "0", "0", "0", "0", "0", "0", "0", "0", "0", " ", " ", " ", "#"],
  ["#", " ", " ", "0", " ", " ", "0", "0", "0", "0", "0", "0", "0", " ", " ", "#"],
  ["#", " ", " ", "0", "S", " ", "0", "0", " ", " ", " ", "0", "0", " ", " ", "#"],
  ["#", " ", " ", " ", " ", "0", "0", "0", "0", "0", "0", "0", "0", " ", " ", "#"],
  ["#", " ", " ", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", " ", " ", "#"],
  ["#", " ", " ", "0", " ", "0", "0", "0", " ", " ", "0", "0", "0", " ", " ", "#"],
  ["#", " ", " ", "0", " ", " ", "0", "0", "0", "0", "0", "0", "0", " ", " ", "#"],
  ["#", " ", " ", "0", " ", " ", "0", "0", "0", " ", "0", "0", "0", " ", " ", "#"],
  ["#", " ", " ", "0", "0", "0", "0", "0", "0", " ", "0", "0", "0", " ", " ", "#"],
  ["#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "#"],
  ["#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "#"],
  ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
];

/*const map = [
  ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
  ["#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "#"],
  ["#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "#"],
  ["#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "#"],
  ["#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "#"],
  ["#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "#"],
  ["#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "#"],
  ["#", " ", " ", " ", " ", " ", "0", "0", "0", "0", " ", " ", " ", " ", " ", "#"],
  ["#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "#"],
  ["#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "#"],
  ["#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "#"],
  ["#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "#"],
  ["#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "#"],
  ["#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "#"],
  ["#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "#"],
  ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
];*/

const wall = new Image();
wall.src = "img/wall.png";
const ground = new Image();
ground.src = "img/ground.png";
const dark = new Image();
dark.src = "img/dark_wall.png";

const tut = new Image();
tut.src = "img/tut3.png";

map.forEach((row, i) => {
  row.forEach((symbol, j) => {
    switch (symbol) {
      case " ":
        boundaries.push(
          new Boundary({
            position: {
              x: canvas.width / 2 - (mapSize / 2) * squareSize + Boundary.width * j,
              y: canvas.height - Boundary.height * (16 + 1) + Boundary.height * (i + 1) - yOffset,
            },
            image: wall,
            passable: false,
            start: false,
          })
        );
        break;
      case "0":
        boundaries.push(
          new Boundary({
            position: {
              x: canvas.width / 2 - (mapSize / 2) * squareSize + Boundary.width * j,
              y: canvas.height - Boundary.height * (16 + 1) + Boundary.height * (i + 1) - yOffset,
            },
            image: ground,
            passable: true,
            start: false,
          })
        );
        break;
      case "S":
        boundaries.push(
          new Boundary({
            position: {
              x: canvas.width / 2 - (mapSize / 2) * squareSize + Boundary.width * j,
              y: canvas.height - Boundary.height * (16 + 1) + Boundary.height * (i + 1) - yOffset,
            },
            image: ground,
            passable: true,
            start: true,
          })
        );
        break;
      case "#":
        boundaries.push(
          new Boundary({
            position: {
              x: canvas.width / 2 - (mapSize / 2) * squareSize + Boundary.width * j,
              y: canvas.height - Boundary.height * (16 + 1) + Boundary.height * (i + 1) - yOffset,
            },
            image: dark,
            passable: false,
            start: false,
          })
        );
        break;
    }
  });
});

startPos = {
  x: 0,
  y: 0,
};

for (let i = 0; i < boundaries.length; i++) {
  const boundary = boundaries[i];
  if (boundary.start === true) {
    startPos = boundary.position;
    break;
  }
}

const player = new Player({
  position: {
    x: startPos.x + squareSize / 2,
    y: startPos.y + squareSize / 2,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  image: ball,
});

function circleCollidesWithRectangle({ circle, rectangle }) {
  if (rectangle.passable === false) {
    return (
      circle.position.y - circle.radius + circle.velocity.y <= rectangle.position.y + rectangle.height &&
      circle.position.x + circle.radius + circle.velocity.x >= rectangle.position.x &&
      circle.position.y + circle.radius + circle.velocity.y >= rectangle.position.y &&
      circle.position.x - circle.radius + circle.velocity.x <= rectangle.position.x + rectangle.width
    );
  }
}

var winCon = 0;
boundaries.forEach((boundary) => {
  if (boundary.image === ground) {
    winCon += 1;
  }
});

var tutClear = false;

const speed = squareSize;
var moves = 0;

const path = new Path2D();

if (tutClear === false) {
  if (innerWidth > innerHeight) {
    tut.onload = function () {
      c.drawImage(
        tut,
        innerWidth / 2 - (innerHeight - 60 * vh) / 2,
        innerHeight - (47 * vh) / 2 - (innerHeight - 60 * vh) / 2,
        innerHeight - 60 * vh,
        innerHeight - 60 * vh
      );

      c.textBaseline = "bottom";

      c.font = "80px Times white";
      c.fillStyle = "white";
      c.textAlign = "center";
      c.fillText("M.A.T.S", innerWidth / 2, 15 * vh);

      c.font = "60px Times white";
      c.fillStyle = "white";
      c.textAlign = "center";
      c.fillText("Day - " + day, innerWidth / 2, 22 * vh);

      c.font = "60px Times white";
      c.fillStyle = "white";
      c.textAlign = "center";
      c.fillText("Use w, a, s, d to move", innerWidth / 2, 35 * vh);

      c.font = "60px Times white";
      c.fillStyle = "white";
      c.textAlign = "center";
      c.fillText("Get under " + maxMoves, innerWidth / 2, 44 * vh);

      c.font = "60px Times white";
      c.fillStyle = "white";
      c.textAlign = "center";
      c.fillText("Click to begin", innerWidth / 2, 53 * vh);
    };
  } else {
    tut.onload = function () {
      c.drawImage(
        tut,
        innerWidth / 2 - (innerHeight - ((innerHeight / 2 - wh * 50) / 2 + 45 * vh + 200)) / 2,
        (innerHeight / 2 - wh * 50) / 2 + 48 * vh + 50,
        innerHeight - ((innerHeight / 2 - wh * 50) / 2 + 45 * vh + 200),
        innerHeight - ((innerHeight / 2 - wh * 50) / 2 + 45 * vh + 200)
      );

      c.textBaseline = "middle";

      c.font = "160px Times white";
      c.fillStyle = "white";
      c.textAlign = "center";
      c.fillText("M.A.T.S", innerWidth / 2, (innerHeight / 2 - wh * 50) / 2);

      c.font = "140px Times white";
      c.fillStyle = "white";
      c.textAlign = "center";
      c.fillText("Day - " + day, innerWidth / 2, (innerHeight / 2 - wh * 50) / 2 + 10 * vh);

      c.font = "100px Times white";
      c.fillStyle = "white";
      c.textAlign = "center";
      c.fillText("Swipe to move", innerWidth / 2, (innerHeight / 2 - wh * 50) / 2 + 26 * vh);

      c.font = "100px Times white";
      c.fillStyle = "white";
      c.textAlign = "center";
      c.fillText("Get under " + maxMoves, innerWidth / 2, (innerHeight / 2 - wh * 50) / 2 + 34 * vh);

      c.font = "100px Times white";
      c.fillStyle = "white";
      c.textAlign = "center";
      c.fillText("Tap to begin", innerWidth / 2, (innerHeight / 2 - wh * 50) / 2 + 42 * vh);
    };
  }
}

function between(x, min, max) {
  return x >= min && x <= max;
}

var shareText = "Copy results";
paintBorder = false;

function animate() {
  requestAnimationFrame(animate);

  if (paintBorder === true) {
    c.clearRect(0, yOffset + 1.5 * wh, wh * 100, wh * 100);

    c.beginPath();
    c.lineWidth = 1 * wh;
    c.strokeStyle = "rgba(255, 255, 255, 0.5)";
    c.rect(wh * 0.5, yOffset + 2 * wh, wh * 99, wh * 99);
    c.stroke();

    wh * 0.5, innerHeight - (squareSize * 16 + 2 * wh), wh * 99, wh * 99;
  }

  if (tutClear === true) {
    c.clearRect(player.position.x - squareSize / 2, player.position.y - squareSize / 2, squareSize, squareSize);

    if (innerWidth > innerHeight) {
      c.clearRect(innerWidth / 2 - 60, innerHeight - squareSize * mapSize - 2 * vh - 60, 1000, 80);

      c.font = "60px Times white";
      c.fillStyle = "white";
      c.textAlign = "right";
      c.fillText(
        "Swipes - " + moves + "/" + maxMoves,
        canvas.width / 2 - (mapSize / 2) * squareSize + squareSize * 16,
        innerHeight - squareSize * mapSize - 2 * vh
      );
    } else {
      c.textBaseline = "middle";

      c.clearRect(0, innerHeight - (innerHeight / 2 - wh * 50) / 2 - 100, innerWidth / 2, 200);

      c.font = "100px Times white";
      c.fillStyle = "white";
      c.textAlign = "center";
      c.fillText(
        moves + "/" + maxMoves,
        innerWidth / 2 - innerWidth / 4,
        innerHeight - (innerHeight / 2 - wh * 50) / 2
      );

      paintBorder = true;
    }

    if (keys.w.pressed && lastKey === "w") {
      for (let i = 0; i < boundaries.length; i++) {
        const boundary = boundaries[i];
        if (
          circleCollidesWithRectangle({
            circle: {
              ...player,
              velocity: {
                x: 0,
                y: -speed,
              },
            },
            rectangle: boundary,
          })
        ) {
          player.velocity.y = 0;
          break;
        } else {
          player.velocity.y = -speed;
        }
      }
    } else if (keys.a.pressed && lastKey === "a") {
      player.velocity.x = -speed;
    } else if (keys.s.pressed && lastKey === "s") {
      for (let i = 0; i < boundaries.length; i++) {
        const boundary = boundaries[i];
        if (
          circleCollidesWithRectangle({
            circle: {
              ...player,
              velocity: {
                x: 0,
                y: speed,
              },
            },
            rectangle: boundary,
          })
        ) {
          player.velocity.y = 0;
          break;
        } else {
          player.velocity.y = speed;
        }
      }
    } else if (keys.d.pressed && lastKey === "d") {
      player.velocity.x = +speed;
    }

    let count = boundaries.forEach((boundary) => {
      boundary.draw();
      if (
        circleCollidesWithRectangle({
          circle: player,
          rectangle: boundary,
        })
      ) {
        player.velocity.x = 0;
        player.velocity.y = 0;
      }

      if (
        between(player.position.x - squareSize / 2, boundary.position.x - 2, boundary.position.x + 2) &&
        between(player.position.y - squareSize / 2, boundary.position.y - 2, boundary.position.y + 2) &&
        boundary.image === ground
      ) {
        player.position.x = boundary.position.x + squareSize / 2;
        player.position.y = boundary.position.y + squareSize / 2;
        boundary.image = paintImg;
        winCon -= 1;
      }

      if (winCon === 0 && moves <= maxMoves) {
        if (innerWidth > innerHeight) {
          c.font = "120px Times White";

          c.fillStyle = "#372a2a";
          roundedRect(c, innerWidth / 2 - (30 * wh) / 2, (15 * vh) / 2, 30 * wh, 85 * vh, 15);

          c.textBaseline = "top";

          c.font = "70px Times white";
          c.fillStyle = "white";
          c.textAlign = "center";
          c.fillText("Results", innerWidth / 2, 13 * vh);

          c.textBaseline = "bottom";

          c.font = "50px Times white";
          c.fillStyle = "white";
          c.textAlign = "center";
          c.fillText("You made it", innerWidth / 2, innerHeight / 2 - 14 * vh);
          c.fillText("in " + moves + " moves.", innerWidth / 2, innerHeight / 2 - 6 * vh);

          c.textBaseline = "top";

          c.fillText("You truly", innerWidth / 2, innerHeight / 2 + 6 * vh);
          c.fillText("are M.A.T.S", innerWidth / 2, innerHeight / 2 + 14 * vh);

          c.fillStyle = "green";
          roundedRect(
            c,
            innerWidth / 2 - (30 * wh) / 4,
            innerHeight - 13 * vh - (85 * vh) / 12,
            (30 * wh) / 2,
            (85 * vh) / 12,
            30
          );

          c.textBaseline = "middle";

          c.font = "30px Times white";
          c.fillStyle = "white";
          c.textAlign = "center";
          c.fillText(
            shareText,
            innerWidth / 2 - (30 * wh) / 4 + (30 * wh) / 2 / 2,
            innerHeight - 13 * vh - (85 * vh) / 12 / 2
          );

          path.rect(innerWidth / 2 - 100, innerHeight - 13 * vh - (85 * vh) / 12, (30 * wh) / 2, (85 * vh) / 12);
          path.closePath();
        } else {
          c.textBaseline = "bottom";

          c.font = "200px Times White";

          c.fillStyle = "#372a2a";
          roundedRect(c, 0, 0, innerWidth, innerHeight, 15);

          c.font = "160px Times white";
          c.fillStyle = "white";
          c.textAlign = "center";
          c.fillText("Results", innerWidth / 2, vh * 20);

          c.font = "125px Times white";
          c.fillStyle = "white";
          c.textAlign = "center";
          c.fillText("You made it", innerWidth / 2, vh * 35);
          c.fillText("in " + moves + " moves.", innerWidth / 2, vh * 45);
          c.fillText("You truly", innerWidth / 2, vh * 60);
          c.fillText("are M.A.T.S", innerWidth / 2, vh * 70);

          c.fillStyle = "green";
          roundedRect(c, innerWidth / 2 - 325, vh * 85 - 75, 650, 150, 30);

          c.textBaseline = "middle";

          c.font = "80px Times white";
          c.fillStyle = "white";
          c.textAlign = "center";
          c.fillText(shareText, innerWidth / 2, vh * 85);

          path.rect(innerWidth / 2 - 325, innerHeight - 300, 650, 150);
          path.closePath();
        }
        cancelAnimationFrame(AnimationId);
      } else if (winCon === 0 && moves > 30) {
        if (innerWidth > innerHeight) {
          c.font = "120px Times White";

          c.fillStyle = "#372a2a";
          roundedRect(c, innerWidth / 2 - (30 * wh) / 2, (15 * vh) / 2, 30 * wh, 85 * vh, 15);

          c.textBaseline = "top";

          c.font = "70px Times white";
          c.fillStyle = "red";
          c.textAlign = "center";
          c.fillText("Results", innerWidth / 2, 13 * vh);

          c.textBaseline = "bottom";

          c.font = "50px Times white";
          c.fillStyle = "white";
          c.textAlign = "center";
          c.fillText("You made it", innerWidth / 2, innerHeight / 2 - 14 * vh);
          c.fillText("in " + moves + " moves.", innerWidth / 2, innerHeight / 2 - 6 * vh);

          c.textBaseline = "top";

          c.fillText("You are", innerWidth / 2, innerHeight / 2 + 6 * vh);
          c.fillText("not M.A.T.S", innerWidth / 2, innerHeight / 2 + 14 * vh);

          c.fillStyle = "red";
          roundedRect(
            c,
            innerWidth / 2 - (30 * wh) / 4,
            innerHeight - 13 * vh - (85 * vh) / 12,
            (30 * wh) / 2,
            (85 * vh) / 12,
            30
          );

          c.textBaseline = "middle";

          c.font = "30px Times white";
          c.fillStyle = "white";
          c.textAlign = "center";
          c.fillText(
            shareText,
            innerWidth / 2 - (30 * wh) / 4 + (30 * wh) / 2 / 2,
            innerHeight - 13 * vh - (85 * vh) / 12 / 2
          );

          path.rect(innerWidth / 2 - 100, innerHeight - 13 * vh - (85 * vh) / 12, (30 * wh) / 2, (85 * vh) / 12);
          path.closePath();
        } else {
          c.textBaseline = "bottom";

          c.font = "200px Times White";

          c.fillStyle = "#372a2a";
          roundedRect(c, 0, 0, innerWidth, innerHeight, 15);

          c.font = "160px Times white";
          c.fillStyle = "red";
          c.textAlign = "center";
          c.fillText("Results", innerWidth / 2, vh * 20);

          c.font = "125px Times white";
          c.fillStyle = "white";
          c.textAlign = "center";
          c.fillText("You made it", innerWidth / 2, vh * 35);
          c.fillText("in " + moves + " moves.", innerWidth / 2, vh * 45);
          c.fillText("You are", innerWidth / 2, vh * 60);
          c.fillText("not M.A.T.S", innerWidth / 2, vh * 70);

          c.fillStyle = "red";
          roundedRect(c, innerWidth / 2 - 325, vh * 85 - 75, 650, 150, 30);

          c.textBaseline = "middle";

          c.font = "80px Times white";
          c.fillStyle = "white";
          c.textAlign = "center";
          c.fillText(shareText, innerWidth / 2, vh * 85);

          //create your shape data in a Path2D object
          path.rect(innerWidth / 2 - 325, innerHeight - 300, 650, 150);
          path.closePath();
        }
        cancelAnimationFrame(AnimationId);
      }
    });

    player.update();
  }
}

animate();

window.addEventListener("keydown", ({ key }) => {
  if (winCon !== 0) {
    switch (key) {
      case "w":
        keys.w.pressed = true;
        lastKey = "w";
        break;
      case "a":
        keys.a.pressed = true;
        lastKey = "a";
        break;
      case "s":
        keys.s.pressed = true;
        lastKey = "s";
        break;
      case "d":
        keys.d.pressed = true;
        lastKey = "d";
        break;
    }
  }
});

window.addEventListener("keyup", ({ key }) => {
  if (winCon !== 0) {
    switch (key) {
      case "w":
        keys.w.pressed = false;
        moves += 1;
        break;
      case "a":
        keys.a.pressed = false;
        moves += 1;
        break;
      case "s":
        keys.s.pressed = false;
        moves += 1;
        break;
      case "d":
        keys.d.pressed = false;
        moves += 1;
        break;
    }
  }
});

function getTouches(evt) {
  return (
    evt.touches || // browser API
    evt.originalEvent.touches
  ); // jQuery
}

var xDown = null;
var yDown = null;

document.addEventListener(
  "touchstart",
  function (evt) {
    const firstTouch = getTouches(evt)[0];
    xDown = firstTouch.clientX;
    yDown = firstTouch.clientY;
  },
  { passive: false }
);

document.addEventListener("touchmove", handleTouchMove, { passive: false });

function handleTouchMove(evt) {
  if (!xDown || !yDown) {
    return;
  }

  var xUp = evt.touches[0].clientX;
  var yUp = evt.touches[0].clientY;

  var xDiff = xDown - xUp;
  var yDiff = yDown - yUp;

  if (Math.abs(xDiff) > Math.abs(yDiff)) {
    /*most significant*/
    if (xDiff > 0) {
      keys.a.pressed = true;
      lastKey = "a";
    } else {
      keys.d.pressed = true;
      lastKey = "d";
    }
  } else {
    if (yDiff > 0) {
      keys.w.pressed = true;
      lastKey = "w";
    } else {
      keys.s.pressed = true;
      lastKey = "s";
    }
  }
  /* reset values */
  xDown = null;
  yDown = null;

  if (winCon !== 0) {
    moves += 1;
  }

  if (evt.target == canvas) {
    evt.preventDefault();
  }
}

function roundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x, y + radius);
  ctx.arcTo(x, y + height, x + radius, y + height, radius);
  ctx.arcTo(x + width, y + height, x + width, y + height - radius, radius);
  ctx.arcTo(x + width, y, x + width - radius, y, radius);
  ctx.arcTo(x, y, x, y + radius, radius);
  ctx.fill();
}

function getXY(canvas, event) {
  //adjust mouse click to canvas coordinates
  const rect = canvas.getBoundingClientRect();
  const y = event.clientY - rect.top;
  const x = event.clientX - rect.left;
  return { x: x, y: y };
}

document.addEventListener(
  "click",
  function (e) {
    const XY = getXY(canvas, e);
    //use the shape data to determine if there is a collision

    if (tutClear === false) {
      c.clearRect(0, 0, innerWidth, innerHeight);
      tutClear = true;

      if (innerWidth > innerHeight) {
        c.textBaseline = "middle";

        c.font = "80px Times white";
        c.fillStyle = "white";
        c.textAlign = "center";
        c.fillText("M.A.T.S", innerWidth / 2, (innerHeight - squareSize * mapSize) / 3);

        c.textBaseline = "bottom";

        c.font = "60px Times white";
        c.fillStyle = "white";
        c.textAlign = "left";
        c.fillText(
          "Day - " + day,
          canvas.width / 2 - (mapSize / 2) * squareSize,
          innerHeight - squareSize * mapSize - 2 * vh
        );
      } else {
        c.textBaseline = "middle";

        c.font = "160px Times white";
        c.fillStyle = "white";
        c.textAlign = "center";
        c.fillText("M.A.T.S", innerWidth / 2, (innerHeight / 2 - wh * 50) / 2);

        c.textBaseline = "middle";

        c.font = "100px Times white";
        c.fillStyle = "white";
        c.textAlign = "center";
        c.fillText("Day - " + day, innerWidth / 2 + innerWidth / 4, innerHeight - (innerHeight / 2 - wh * 50) / 2);
      }
    }

    if (c.isPointInPath(path, XY.x, XY.y)) {
      if (moves <= maxMoves) {
        var copyText =
          "M.A.T.S.\n" +
          "Day-" +
          day +
          ": " +
          moves +
          "/" +
          maxMoves +
          "\n\n" +
          "🟩⬜️⬜️🟫⬜️\n🟩⬜️🟦🟫⬜️\n🟩🟩🟩⬜️⬜️" +
          "\n\n" +
          "https://kebabkungen.github.io.";
      } else {
        var copyText =
          "M.A.T.S.\n" +
          "Day-" +
          day +
          ": " +
          moves +
          "/" +
          maxMoves +
          "\n\n" +
          "🟥⬜️⬜️🟫⬜️\n🟥⬜️🟦🟫⬜️\n🟥🟥🟥⬜️⬜️" +
          "\n\n" +
          "https://kebabkungen.github.io.";
      }

      navigator.clipboard.writeText(copyText);

      shareText = "Copied!";
    }
  },
  false
);
