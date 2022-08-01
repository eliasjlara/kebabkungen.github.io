const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

const cross = document.querySelector(".close");
const resultMenu = document.querySelector(".resultMenu");
const gameOverlay = document.querySelector(".gameOverlay");
const startOverlay = document.querySelector(".startOverlay");

gameOverlay.style.display = "none";

resultMenu.style.display = "none";

if (getCookie("win") === "true") {
  startOverlay.style.display = "none";
  gameOverlay.style.display = "flex";
}

cross.addEventListener("click", () => {
  resultMenu.style.display = "none";
});

let vh = window.innerHeight * 0.01;
let wh = window.innerWidth * 0.01;

canvas.width = innerWidth;
canvas.height = innerHeight;

var close = false;

mapSize = 16;

var yOffset = 0;
var day = 4;
var maxMoves = 35;

document.getElementById("maxMovesP").innerHTML = "Get under " + "<u>" + maxMoves + "</u>";
document.getElementById("dayP").innerHTML = "Day - " + day;
document.getElementById("dayDiv").innerHTML = "Day - " + day;

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function setCookie(cname, value) {
  document.cookie = cname + "=" + value + ";" + ";path=/";
}

if (getCookie("firstVisit") === "false") {
  (function () {
    var cookies = document.cookie.split("; ");
    for (var c = 0; c < cookies.length; c++) {
      var d = window.location.hostname.split(".");
      while (d.length > 0) {
        var cookieBase =
          encodeURIComponent(cookies[c].split(";")[0].split("=")[0]) +
          "=; expires=Thu, 01-Jan-1970 00:00:01 GMT; domain=" +
          d.join(".") +
          " ;path=";
        var p = location.pathname.split("/");
        document.cookie = cookieBase + "/";
        while (p.length > 0) {
          document.cookie = cookieBase + p.join("/");
          p.pop();
        }
        d.shift();
      }
    }
  })();

  setCookie("firstVisit" === "true");
}

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
  ["#", " ", " ", " ", "0", "0", "0", "0", "0", " ", " ", " ", " ", " ", " ", "#"],
  ["#", " ", "S", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", " ", " ", "#"],
  ["#", " ", "0", "0", "0", "0", " ", "0", "0", "0", "0", "0", "0", " ", " ", "#"],
  ["#", " ", " ", "0", "0", "0", "0", "0", " ", " ", " ", " ", "0", " ", " ", "#"],
  ["#", " ", " ", "0", "0", "0", "0", "0", "0", "0", " ", " ", "0", " ", " ", "#"],
  ["#", " ", " ", "0", "0", "0", "0", "0", "0", "0", " ", "0", "0", " ", " ", "#"],
  ["#", " ", " ", "0", "0", "0", "0", " ", "0", "0", "0", "0", "0", " ", " ", "#"],
  ["#", " ", " ", "0", "0", "0", "0", " ", " ", " ", "0", "0", "0", " ", " ", "#"],
  ["#", " ", " ", "0", " ", " ", "0", " ", " ", " ", "0", "0", "0", " ", " ", "#"],
  ["#", " ", " ", "0", " ", " ", "0", " ", " ", " ", "0", "0", " ", " ", " ", "#"],
  ["#", " ", " ", "0", "0", "0", "0", " ", " ", " ", " ", " ", " ", " ", " ", "#"],
  ["#", " ", " ", " ", " ", " ", "0", " ", " ", " ", " ", " ", " ", " ", " ", "#"],
  ["#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "#"],
  ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
];

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
              y:
                canvas.height -
                Boundary.height * (16 + 1) +
                Boundary.height * (i + 1) -
                yOffset,
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
              y:
                canvas.height -
                Boundary.height * (16 + 1) +
                Boundary.height * (i + 1) -
                yOffset,
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
              y:
                canvas.height -
                Boundary.height * (16 + 1) +
                Boundary.height * (i + 1) -
                yOffset,
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
              y:
                canvas.height -
                Boundary.height * (16 + 1) +
                Boundary.height * (i + 1) -
                yOffset,
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
      circle.position.y - circle.radius + circle.velocity.y <=
        rectangle.position.y + rectangle.height &&
      circle.position.x + circle.radius + circle.velocity.x >= rectangle.position.x &&
      circle.position.y + circle.radius + circle.velocity.y >= rectangle.position.y &&
      circle.position.x - circle.radius + circle.velocity.x <=
        rectangle.position.x + rectangle.width
    );
  }
}

var winCon = 0;
boundaries.forEach((boundary) => {
  if (boundary.image === ground) {
    winCon += 1;
  }
});

if (getCookie("win") === "true") {
  var tutClear = true;
} else {
  var tutClear = false;
}

const speed = squareSize;
var moves = 0;

const path = new Path2D();
const pathTest = new Path2D();

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
    };
  } else {
    tut.onload = function () {
      c.drawImage(
        tut,
        innerWidth / 2 -
          (innerHeight - ((innerHeight / 2 - wh * 50) / 2 + 45 * vh + 200)) / 2,
        (innerHeight / 2 - wh * 50) / 2 + 48 * vh + 70,
        innerHeight - ((innerHeight / 2 - wh * 50) / 2 + 45 * vh + 200),
        innerHeight - ((innerHeight / 2 - wh * 50) / 2 + 45 * vh + 200)
      );
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

  if (tutClear === true) {
    if (innerWidth > innerHeight) {
      c.clearRect(0, 0, innerWidth, innerHeight - squareSize * mapSize);
    } else {
    }
  }

  if (winCon !== 0) {
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
      c.clearRect(
        player.position.x - squareSize / 2,
        player.position.y - squareSize / 2,
        squareSize,
        squareSize
      );

      if (innerWidth > innerHeight) {
        c.clearRect(
          innerWidth / 2 - 60,
          innerHeight - squareSize * mapSize - 2 * vh - 60,
          1000,
          60
        );
      } else {
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
          between(
            player.position.x - squareSize / 2,
            boundary.position.x - 2,
            boundary.position.x + 2
          ) &&
          between(
            player.position.y - squareSize / 2,
            boundary.position.y - 2,
            boundary.position.y + 2
          ) &&
          boundary.image === ground
        ) {
          player.position.x = boundary.position.x + squareSize / 2;
          player.position.y = boundary.position.y + squareSize / 2;
          boundary.image = paintImg;
          winCon -= 1;
        }
      });

      setCookie("moves", moves);

      if (winCon === 0) {
        setCookie("win", "true");
        resultMenu.style.display = "flex";
      }

      console.log(moves);

      player.update();
    }
  }
  if (innerWidth > innerHeight) {
    document.getElementById("swipesDiv").innerHTML = "Moves " + moves + "/" + maxMoves;
  } else {
    document.getElementById("swipesDiv").innerHTML = moves + "/" + maxMoves;
  }

  document.getElementById("moveP").innerHTML =
    "You made it <br /> in " + moves + " moves";

  if (parseInt(getCookie("moves")) > maxMoves) {
    document.getElementById("winP").innerHTML = "You are <br/> not M.A.T.S";
    document.getElementById("copy").style.backgroundColor = "red";
    document.getElementById("resultsH").style.color = "red";
  }
}

if (innerWidth > innerHeight) {
  document.getElementById("swipesDiv").innerHTML =
    "Moves " + parseInt(getCookie("moves")) + "/" + maxMoves;
} else {
  document.getElementById("swipesDiv").innerHTML =
    parseInt(getCookie("moves")) + "/" + maxMoves;
}

if (getCookie("win") === "true") {
  document.getElementById("moveP").innerHTML =
    "You made it <br /> in " + parseInt(getCookie("moves")) + " moves";

  if (parseInt(getCookie("moves")) > maxMoves) {
    document.getElementById("copy").style.backgroundColor = "red";
    document.getElementById("resultsH").style.color = "red";
  }

  boundaries.forEach((boundary) => {
    if (boundary.image === ground) {
      boundary.image = paintImg;
    }
  });

  setTimeout(() => {
    let count = boundaries.forEach((boundary) => {
      boundary.draw();
    });
  }, 50);

  if (parseInt(getCookie("moves")) > maxMoves) {
    document.getElementById("winP").innerHTML = "You are <br/> not M.A.T.S";
  }

  resultMenu.style.display = "flex";
} else {
  animate();
}

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
  {
    passive: false,
  }
);

document.addEventListener("touchmove", handleTouchMove, {
  passive: false,
});

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
  return {
    x: x,
    y: y,
  };
}

document.getElementById("copy").onclick = function () {
  document.getElementById("copyP").innerHTML = "Copied!";

  if (moves <= maxMoves) {
    var copyText =
      "M.A.T.S.\n" +
      "Day-" +
      day +
      ": " +
      getCookie("moves") +
      "/" +
      maxMoves +
      "\n\n" +
      "🟩⬜️⬜️🟫⬜️\n🟩⬜️🟦🟫⬜️\n🟩🟩🟩⬜️⬜️" +
      "\n\n" +
      "https://kebabkungen.github.io";
  } else {
    var copyText =
      "M.A.T.S.\n" +
      "Day-" +
      day +
      ": " +
      getCookie("moves") +
      "/" +
      maxMoves +
      "\n\n" +
      "🟥⬜️⬜️🟫⬜️\n🟥⬜️🟦🟫⬜️\n🟥🟥🟥⬜️⬜️" +
      "\n\n" +
      "https://kebabkungen.github.io";
  }

  navigator.clipboard.writeText(copyText);
};

document.addEventListener(
  "click",
  function (e) {
    const XY = getXY(canvas, e);
    //use the shape data to determine if there is a collision

    if (tutClear === false) {
      c.clearRect(0, 0, innerWidth, innerHeight);
      tutClear = true;

      gameOverlay.style.display = "flex";

      startOverlay.style.display = "none";
    }
  },
  false
);
