const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

mapSize = 16;

var yOffset = 0;
var day = 1;

if (innerWidth > innerHeight) {
  squareSize = (innerHeight - innerHeight / 4) / mapSize;
} else {
  squareSize = (innerWidth - innerWidth / 16) / mapSize;
  yOffset = innerHeight / 18;

  c.font = "160px Times white";
  c.fillStyle = "white";
  c.textAlign = "center";
  c.fillText("M.A.T.S", innerWidth / 2, 180);

  c.font = "120px Times white";
  c.fillStyle = "white";
  c.textAlign = "center";
  c.fillText("Day - 1", innerWidth / 2, 360);
}

class Boundary {
  static width = squareSize;
  static height = squareSize;
  constructor({ position, image, passable }) {
    this.position = position;
    this.width = squareSize;
    this.height = squareSize;
    this.image = image;
    this.passable = passable;
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
  ["#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "#"],
  ["#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "#"],
  ["#", " ", " ", "0", " ", "0", "0", " ", "0", "0", "0", " ", " ", " ", " ", "#"],
  ["#", " ", " ", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", " ", " ", "#"],
  ["#", " ", " ", "0", " ", "0", "0", "0", " ", " ", "0", " ", "0", " ", " ", "#"],
  ["#", " ", " ", "0", " ", " ", "0", "0", "0", "0", "0", " ", "0", " ", " ", "#"],
  ["#", " ", " ", "0", " ", " ", "0", " ", " ", "0", "0", " ", "0", " ", " ", "#"],
  ["#", " ", " ", "0", "0", "0", "0", " ", "0", "0", " ", "0", "0", " ", " ", "#"],
  ["#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "#"],
  ["#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "#"],
  ["#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "#"],
  ["#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "#"],
  ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
];

/* const map = [
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
]; */

const wall = new Image();
wall.src = "img/wall.png";
const ground = new Image();
ground.src = "img/ground.png";
const dark = new Image();
dark.src = "img/dark_wall.png";

const tut = new Image();
tut.src = "img/moveTut2.png";

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
  if (boundary.image === ground) {
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
    c.font = "80px Times white";
    c.fillStyle = "white";
    c.textAlign = "center";
    c.fillText("M.A.T.S", innerWidth / 2, 80);

    c.font = "60px Times white";
    c.fillStyle = "white";
    c.textAlign = "center";
    c.fillText("Day - " + day, innerWidth / 2, 160);

    c.font = "60px Times white";
    c.fillStyle = "white";
    c.textAlign = "center";
    c.fillText("Use w, a, s, d to move", innerWidth / 2, 260);

    c.font = "60px Times white";
    c.fillStyle = "white";
    c.textAlign = "center";
    c.fillText("Get under 30", innerWidth / 2, 340);

    c.font = "60px Times white";
    c.fillStyle = "white";
    c.textAlign = "center";
    c.fillText("Click to begin", innerWidth / 2, 420);

    tut.onload = function () {
      c.drawImage(tut, innerWidth / 2 - 350 / 2, 200, 350, 600);
    };
  } else {
    tut.onload = function () {
      c.drawImage(tut, innerWidth / 2 - innerWidth / 1.3 / 2, 420, innerWidth / 1.3, innerHeight / 1.3);
    };
    c.font = "100px Times white";
    c.fillStyle = "white";
    c.textAlign = "center";
    c.fillText("Swipe to move", innerWidth / 2, 600);

    c.font = "100px Times white";
    c.fillStyle = "white";
    c.textAlign = "center";
    c.fillText("Get under 30", innerWidth / 2, 740);

    c.font = "100px Times white";
    c.fillStyle = "white";
    c.textAlign = "center";
    c.fillText("Tap to begin", innerWidth / 2, 880);
  }
}

function between(x, min, max) {
  return x >= min && x <= max;
}

var shareText = "Share";

function animate() {
  requestAnimationFrame(animate);

  if (tutClear === true) {
    c.clearRect(player.position.x - squareSize / 2, player.position.y - squareSize / 2, squareSize, squareSize);

    if (innerWidth > innerHeight) {
      c.clearRect(innerWidth / 2 - 50, 100, 1000, 80);

      c.font = "60px Times white";
      c.fillStyle = "white";
      c.textAlign = "right";
      c.fillText("Swipes - " + moves + "/30", canvas.width / 2 - (mapSize / 2) * squareSize + squareSize * 16, 160);
    } else {
      c.clearRect(innerWidth / 6, 420, 1000, 160);

      c.font = "120px Times white";
      c.fillStyle = "white";
      c.textAlign = "center";
      c.fillText("Swipes - " + moves + "/30", innerWidth / 2, 540);
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

      if (winCon === 0 && moves <= 30) {
        if (innerWidth > innerHeight) {
          c.font = "120px Times White";

          c.fillStyle = "#372a2a";
          roundedRect(c, innerWidth / 2 - 200, innerHeight / 2 - innerHeight / 1.2 / 2, 400, innerHeight / 1.2, 15);

          c.font = "70px Times white";
          c.fillStyle = "white";
          c.textAlign = "center";
          c.fillText("Results", innerWidth / 2, 150);

          c.font = "50px Times white";
          c.fillStyle = "white";
          c.textAlign = "center";
          c.fillText("You made it", innerWidth / 2, 300);
          c.fillText("below 30.", innerWidth / 2, 360);
          c.fillText("You truly", innerWidth / 2, 480);
          c.fillText("are M.A.T.S", innerWidth / 2, 540);

          c.fillStyle = "green";
          roundedRect(c, innerWidth / 2 - 100, 650, 200, 50, 30);

          c.font = "30px Times white";
          c.fillStyle = "white";
          c.textAlign = "center";
          c.fillText(shareText, innerWidth / 2, 685);

          //create your shape data in a Path2D object
          path.rect(innerWidth / 2 - 100, 650, 200, 50);
          path.closePath();
        } else {
          c.font = "200px Times White";

          c.fillStyle = "#372a2a";
          roundedRect(c, 0, 0, innerWidth, innerHeight, 15);

          c.font = "200px Times white";
          c.fillStyle = "white";
          c.textAlign = "center";
          c.fillText("Results", innerWidth / 2, 325);

          c.font = "125px Times white";
          c.fillStyle = "white";
          c.textAlign = "center";
          c.fillText("You made it", innerWidth / 2, 650);
          c.fillText("below 30.", innerWidth / 2, 800);
          c.fillText("You truly", innerWidth / 2, 1050);
          c.fillText("are M.A.T.S", innerWidth / 2, 1200);

          c.fillStyle = "green";
          roundedRect(c, innerWidth / 2 - 325, innerHeight - 300, 650, 150, 30);

          c.font = "80px Times white";
          c.fillStyle = "white";
          c.textAlign = "center";
          c.fillText("Share results", innerWidth / 2, innerHeight - 195);

          //create your shape data in a Path2D object
          path.rect(innerWidth / 2 - 325, innerHeight - 300, 650, 150);
          path.closePath();
        }
        cancelAnimationFrame(AnimationId);
      } else if (winCon === 0 && moves > 30) {
        if (innerWidth > innerHeight) {
          c.font = "120px Times White";

          c.fillStyle = "#372a2a";
          roundedRect(c, innerWidth / 2 - 200, innerHeight / 2 - innerHeight / 1.2 / 2, 400, innerHeight / 1.2, 15);

          c.font = "70px Times white";
          c.fillStyle = "red";
          c.textAlign = "center";
          c.fillText("Results", innerWidth / 2, 150);

          c.font = "50px Times white";
          c.fillStyle = "white";
          c.textAlign = "center";
          c.fillText("You did not make", innerWidth / 2, 300);
          c.fillText("it below 30.", innerWidth / 2, 360);
          c.fillText("You are", innerWidth / 2, 480);
          c.fillText("not M.A.T.S", innerWidth / 2, 540);

          c.fillStyle = "red";
          roundedRect(c, innerWidth / 2 - 100, 650, 200, 50, 30);

          c.font = "30px Times white";
          c.fillStyle = "white";
          c.textAlign = "center";
          c.fillText(shareText, innerWidth / 2, 685);

          //create your shape data in a Path2D object
          path.rect(innerWidth / 2 - 100, 650, 200, 50);
          path.closePath();
        } else {
          c.font = "200px Times White";

          c.fillStyle = "#372a2a";
          roundedRect(c, 0, 0, innerWidth, innerHeight, 15);

          c.font = "200px Times white";
          c.fillStyle = "red";
          c.textAlign = "center";
          c.fillText("Results", innerWidth / 2, 325);

          c.font = "125px Times white";
          c.fillStyle = "white";
          c.textAlign = "center";
          c.fillText("You did not make", innerWidth / 2, 650);
          c.fillText("it below 30.", innerWidth / 2, 800);
          c.fillText("You are", innerWidth / 2, 1050);
          c.fillText("not M.A.T.S", innerWidth / 2, 1200);

          c.fillStyle = "red";
          roundedRect(c, innerWidth / 2 - 325, innerHeight - 300, 650, 150, 30);

          c.font = "80px Times white";
          c.fillStyle = "white";
          c.textAlign = "center";
          c.fillText("Share results", innerWidth / 2, innerHeight - 195);

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
        c.font = "80px Times white";
        c.fillStyle = "white";
        c.textAlign = "center";
        c.fillText("M.A.T.S", innerWidth / 2, 80);

        c.font = "60px Times white";
        c.fillStyle = "white";
        c.textAlign = "left";
        c.fillText("Day - " + day, canvas.width / 2 - (mapSize / 2) * squareSize, 160);
      } else {
        c.font = "160px Times white";
        c.fillStyle = "white";
        c.textAlign = "center";
        c.fillText("M.A.T.S", innerWidth / 2, 180);

        c.font = "120px Times white";
        c.fillStyle = "white";
        c.textAlign = "center";
        c.fillText("Day - 1", innerWidth / 2, 360);
      }
    }

    if (c.isPointInPath(path, XY.x, XY.y)) {
      var copyText =
        "       M.A.T.S. \n    Day-" +
        day +
        ": " +
        moves +
        "/30" +
        "\n\n" +
        "🟩⬜️⬜️🟫⬜️\n🟩⬜️🟦🟫⬜️\n🟩🟩🟩⬜️⬜️";

      navigator.clipboard.writeText(copyText);

      shareText = "Copied!";
    }
  },
  false
);
