gameOverlay.style.display = "none";

resultMenu.style.display = "none";

if (getCookie("win") === "true") {
  startOverlay1.style.display = "none";
  startOverlay2.style.display = "none";
  gameOverlay.style.display = "flex";
}

if (innerWidth < innerHeight) {
  document.getElementById("restart").innerHTML = "";
}

cross.addEventListener("click", () => {
  resultMenu.style.display = "none";
  document.getElementById("reloadDiv").style.display = "";
});

prevArr = [];
posArr = [];
posOffsetArr = [];

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

function resetMap() {
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
        case "B":
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
              image: bomb,
              passable: true,
              start: false,
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

  winCon = 0;

  boundaries.forEach((boundary) => {
    if (boundary.image === ground || boundary.image === bomb) {
      winCon += 1;
    }
  });

  for (let i = 0; i < boundaries.length; i++) {
    const boundary = boundaries[i];
    if (boundary.start === true) {
      startPos = boundary.position;
      break;
    }
  }
}

resetMap();
setCookie("resets", trys);

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

if (getCookie("win") === "true") {
  var tutClear = true;
} else {
  var tutClear = false;
}

function between(x, min, max) {
  return x >= min && x <= max;
}

var bombing = false;

var imgCount = 0;

var isRunning = true;

var mapArr = [];

c.strokeStyle = "white";
c.lineWidth = 3;

c.beginPath();
c.moveTo(player.position.x, player.position.y);

function canvas_arrow(context, fromx, fromy, tox, toy) {
  var headlen = 10; // length of head in pixels
  var dx = tox - fromx;
  var dy = toy - fromy;
  var angle = Math.atan2(dy, dx);
  context.moveTo(fromx, fromy);
  context.lineTo(tox, toy);
  context.moveTo(tox, toy);

  context.lineTo(
    tox - headlen * Math.cos(angle - Math.PI / 6),
    toy - headlen * Math.sin(angle - Math.PI / 6)
  );
  context.moveTo(tox, toy);
  context.lineTo(
    tox - headlen * Math.cos(angle + Math.PI / 6),
    toy - headlen * Math.sin(angle + Math.PI / 6)
  );
}

paintOffset = 0;

function animate() {
  requestAnimationFrame(animate);

  if (winCon !== 0) {
    /*     if (paintBorder === true) {
      c.clearRect(0, yOffset + 1.5 * wh, wh * 100, wh * 100);

      c.beginPath();
      c.lineWidth = 1 * wh;
      c.strokeStyle = "rgba(255, 255, 255, 0.5)";
      c.rect(wh * 0.5, yOffset + 2 * wh, wh * 99, wh * 99);
      c.stroke();

      wh * 0.5, innerHeight - (squareSize * 16 + 2 * wh), wh * 99, wh * 99;
    } */

    if (tutClear === true) {
      c.clearRect(
        player.position.x - squareSize / 2,
        player.position.y - squareSize / 2,
        squareSize,
        squareSize
      );

      /*       if (innerWidth > innerHeight) {
        c.clearRect(
          innerWidth / 2 - 60,
          innerHeight - squareSize * mapSize - 2 * vh - 60,
          1000,
          60
        );
      } else {
        paintBorder = true;
      } */

      if (moving === false && bombing === false) {
        if (keys.w.pressed && lastKey === "w") {
          player.velocity.y = -speed;
          moving = true;
        } else if (keys.a.pressed && lastKey === "a") {
          player.velocity.x = -speed;
          moving = true;
        } else if (keys.s.pressed && lastKey === "s") {
          player.velocity.y = +speed;
          moving = true;
        } else if (keys.d.pressed && lastKey === "d") {
          player.velocity.x = +speed;
          moving = true;
        }
        moveCount = true;
      } else {
        if (bombing === false) {
          if (moveCount === true) {
            moves++;
            moveCount = false;
          }
        }
      }

      if (bombing === true) {
        moveCount = false;
        boundaries.forEach((boundary) => {
          if (
            between(
              player.position.y - squareSize / 2 - squareSize,
              boundary.position.y - 2,
              boundary.position.y + 2
            ) &&
            between(
              player.position.x - squareSize / 2,
              boundary.position.x - 2,
              boundary.position.x + 2
            ) &&
            boundary.image === wall
          ) {
            boundary.image = arrowUp;
          }

          if (
            between(
              player.position.x - squareSize / 2 - squareSize,
              boundary.position.x - 2,
              boundary.position.x + 2
            ) &&
            between(
              player.position.y - squareSize / 2,
              boundary.position.y - 2,
              boundary.position.y + 2
            ) &&
            boundary.image === wall
          ) {
            boundary.image = arrowLeft;
          }

          if (
            between(
              player.position.y - squareSize / 2 + squareSize,
              boundary.position.y - 2,
              boundary.position.y + 2
            ) &&
            between(
              player.position.x - squareSize / 2,
              boundary.position.x - 2,
              boundary.position.x + 2
            ) &&
            boundary.image === wall
          ) {
            boundary.image = arrowDown;
          }

          if (
            between(
              player.position.x - squareSize / 2 + squareSize,
              boundary.position.x - 2,
              boundary.position.x + 2
            ) &&
            between(
              player.position.y - squareSize / 2,
              boundary.position.y - 2,
              boundary.position.y + 2
            ) &&
            boundary.image === wall
          ) {
            boundary.image = arrowRight;
          }
        });
        if (keys.w.pressed && lastKey === "w") {
          boundaries.forEach((boundary) => {
            if (
              between(
                player.position.y - squareSize / 2 - squareSize,
                boundary.position.y - 2,
                boundary.position.y + 2
              ) &&
              between(
                player.position.x - squareSize / 2,
                boundary.position.x - 2,
                boundary.position.x + 2
              ) &&
              boundary.image === arrowUp
            ) {
              boundary.image = explosion;

              setTimeout(function () {
                boundary.image = ground;
              }, 300);

              boundary.passable = true;
              player.image = ball;
              bombing = false;
              winCon++;
            }
          });
        } else if (keys.a.pressed && lastKey === "a") {
          boundaries.forEach((boundary) => {
            if (
              between(
                player.position.x - squareSize / 2 - squareSize,
                boundary.position.x - 2,
                boundary.position.x + 2
              ) &&
              between(
                player.position.y - squareSize / 2,
                boundary.position.y - 2,
                boundary.position.y + 2
              ) &&
              boundary.image === arrowLeft
            ) {
              boundary.image = explosion;

              setTimeout(function () {
                boundary.image = ground;
              }, 300);
              boundary.passable = true;
              player.image = ball;
              bombing = false;
              winCon++;
            }
          });
        } else if (keys.s.pressed && lastKey === "s") {
          boundaries.forEach((boundary) => {
            if (
              between(
                player.position.y - squareSize / 2 + squareSize,
                boundary.position.y - 2,
                boundary.position.y + 2
              ) &&
              between(
                player.position.x - squareSize / 2,
                boundary.position.x - 2,
                boundary.position.x + 2
              ) &&
              boundary.image === arrowDown
            ) {
              boundary.image = explosion;

              setTimeout(function () {
                boundary.image = ground;
              }, 300);
              boundary.passable = true;
              player.image = ball;
              bombing = false;

              winCon++;
            }
          });
        } else if (keys.d.pressed && lastKey === "d") {
          boundaries.forEach((boundary) => {
            if (
              between(
                player.position.x - squareSize / 2 + squareSize,
                boundary.position.x - 2,
                boundary.position.x + 2
              ) &&
              between(
                player.position.y - squareSize / 2,
                boundary.position.y - 2,
                boundary.position.y + 2
              ) &&
              boundary.image === arrowRight
            ) {
              boundary.image = explosion;

              setTimeout(function () {
                boundary.image = ground;
              }, 300);
              boundary.passable = true;
              player.image = ball;
              bombing = false;

              winCon++;
            }
          });
        }
        keys.a.pressed = false;
        keys.d.pressed = false;
        keys.w.pressed = false;
        keys.s.pressed = false;
        //lastKey = "";
      } else {
        boundaries.forEach((boundary) => {
          if (
            between(
              player.position.y - squareSize / 2 - squareSize,
              boundary.position.y - 2,
              boundary.position.y + 2
            ) &&
            between(
              player.position.x - squareSize / 2,
              boundary.position.x - 2,
              boundary.position.x + 2
            ) &&
            boundary.image === arrowUp
          ) {
            boundary.image = wall;
          }

          if (
            between(
              player.position.x - squareSize / 2 - squareSize,
              boundary.position.x - 2,
              boundary.position.x + 2
            ) &&
            between(
              player.position.y - squareSize / 2,
              boundary.position.y - 2,
              boundary.position.y + 2
            ) &&
            boundary.image === arrowLeft
          ) {
            boundary.image = wall;
          }

          if (
            between(
              player.position.y - squareSize / 2 + squareSize,
              boundary.position.y - 2,
              boundary.position.y + 2
            ) &&
            between(
              player.position.x - squareSize / 2,
              boundary.position.x - 2,
              boundary.position.x + 2
            ) &&
            boundary.image === arrowDown
          ) {
            boundary.image = wall;
          }

          if (
            between(
              player.position.x - squareSize / 2 + squareSize,
              boundary.position.x - 2,
              boundary.position.x + 2
            ) &&
            between(
              player.position.y - squareSize / 2,
              boundary.position.y - 2,
              boundary.position.y + 2
            ) &&
            boundary.image === arrowRight
          ) {
            boundary.image = wall;
          }
        });
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
          moving = false;
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
        } else if (
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
          boundary.image === bomb
        ) {
          boundary.image = paintImg;
          winCon -= 1;

          player.image = bombBall;
        } else {
        }
      });

      setCookie("moves", moves);

      if (winCon === 0) {
        setCookie("win", "true");
        resultMenu.style.display = "flex";
        document.getElementById("reloadDiv").style.display = "none";

        var prevArrCookie = prevArr.join("|");
        var posArrCookie = posArr.join("|");
        var posOffsetArrCookie = posOffsetArr.join("|");

        /* setCookie("prevArrCookie", prevArrCookie);
        prevArrCookie = getCookie("prevArrCookie").split("|");
 */
        setCookie("prevArrCookie", prevArrCookie);
        setCookie("posArrCookie", posArrCookie);
        setCookie("posOffsetArrCookie", posOffsetArrCookie);

        prevArrCookie = getCookie("prevArrCookie").split("|");
        posArrCookie = getCookie("posArrCookie").split("|");
        posOffsetArrCookie = getCookie("posOffsetArrCookie").split("|");

        for (let i = 0; i < prevArrCookie.length; i += 2) {
          canvas_arrow(
            c,
            parseFloat(prevArrCookie[i]),
            parseFloat(prevArrCookie[i + 1]),
            parseFloat(posArrCookie[i]) + parseFloat(posOffsetArrCookie[i]),
            parseFloat(posArrCookie[i + 1]) + parseFloat(posOffsetArrCookie[i + 1])
          );
        }
        c.stroke();

        boundaries.forEach((boundary) => {
          if (boundary.image === paintImg) {
            mapArr.push("0");
            console.log("HÄR VA EN NOLLA");
          }
          if (boundary.image === dark) {
            mapArr.push("#");
          }
          if (boundary.image === wall) {
            mapArr.push(" ");
          }
        });

        var mapArrCookie = mapArr.join("|");
        setCookie("mapArrCookie", mapArrCookie);
      }

      var prevPos = { x: 0, y: 0 };
      prevPos.x = player.position.x;
      prevPos.y = player.position.y;

      player.update();

      var newArr = { x: 0, y: 0 };
      newArr.x = player.position.x;
      newArr.y = player.position.y;

      if (!(prevPos.x === player.position.x && prevPos.y === player.position.y)) {
        var arrowOffset = { x: 0, y: 0 };
        if (lastKey === "w") {
          arrowOffset.y = squareSize / 2;
        }
        if (lastKey === "a") {
          arrowOffset.x = squareSize / 2;
        }
        if (lastKey === "s") {
          arrowOffset.y = -squareSize / 2;
        }
        if (lastKey === "d") {
          arrowOffset.x = -squareSize / 2;
        }

        prevArr.push(prevPos.x);
        prevArr.push(prevPos.y);
        posArr.push(newArr.x);
        posArr.push(newArr.y);
        posOffsetArr.push(arrowOffset.x);
        posOffsetArr.push(arrowOffset.y);
        /* canvas_arrow(
          c,
          prevPos.x,
          prevPos.y,
          player.position.x + arrowOffset.x,
          player.position.y + arrowOffset.y
        ); */
      }
    }
  }
  if (innerWidth > innerHeight) {
    document.getElementById("swipesDiv").innerHTML = "Moves " + moves + "/" + maxMoves;
  } else {
    document.getElementById("swipesDiv").innerHTML = moves + "/" + maxMoves;
  }

  document.getElementById("moveP").innerHTML =
    "You made it <br /> in " +
    "<u>" +
    moves +
    "</u>" +
    " moves <br /> with " +
    "<u>" +
    trys +
    "</u>" +
    " restarts";

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
  document.getElementById("reloadDiv").style.display = "none";

  document.getElementById("moveP").innerHTML =
    "You made it <br /> in " + parseInt(getCookie("moves")) + " moves";

  if (parseInt(getCookie("moves")) > maxMoves) {
    document.getElementById("copy").style.backgroundColor = "red";
    document.getElementById("resultsH").style.color = "red";
  }

  var mapArrCookie = getCookie("mapArrCookie").split("|");

  mapArrCookie.forEach((e) => {
    console.log(e);
  });

  mapArrCookie.forEach((row, i) => {
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
              image: paintImg,
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
        case "B":
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
              image: bomb,
              passable: true,
              start: false,
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

  var prevArrCookie = getCookie("prevArrCookie").split("|");
  var posArrCookie = getCookie("posArrCookie").split("|");
  var posOffsetArrCookie = getCookie("posOffsetArrCookie").split("|");

  for (let i = 0; i < prevArrCookie.length; i += 2) {
    canvas_arrow(
      c,
      parseFloat(prevArrCookie[i]),
      parseFloat(prevArrCookie[i + 1]),
      parseFloat(posArrCookie[i]) + parseFloat(posOffsetArrCookie[i]),
      parseFloat(posArrCookie[i + 1]) + parseFloat(posOffsetArrCookie[i + 1])
    );
  }

  resultMenu.style.display = "flex";

  setTimeout(() => {
    c.stroke();
  }, 50);
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
      case "b":
        keys.b.pressed = true;
        lastKey = "b";
        break;
    }
  }
});

window.addEventListener("keyup", ({ key }) => {
  if (winCon !== 0) {
    switch (key) {
      case "w":
        keys.w.pressed = false;
        break;
      case "a":
        keys.a.pressed = false;
        break;
      case "s":
        keys.s.pressed = false;
        break;
      case "d":
        keys.d.pressed = false;
        break;
      case "b":
        if (player.image === bombBall) {
          player.image = bombFire;
          bombing = true;
        } else if (player.image === bombFire) {
          player.image = bombBall;
          bombing = false;
        }
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

  if (winCon !== 0 && bombing !== true) {
  }

  if (evt.target == canvas) {
    evt.preventDefault();
  }
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

  if (getCookie("moves") <= maxMoves) {
    var copyText =
      "M.A.T.S.\n" +
      "Day-" +
      day +
      ": " +
      getCookie("moves") +
      "/" +
      maxMoves +
      " " +
      "↻=" +
      getCookie("resets") +
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
      " " +
      "↻=" +
      getCookie("resets") +
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
    //const XY = getXY(canvas, e);
    //use the shape data to determine if there is a collision

    if (tutClear === false) {
      c.clearRect(0, 0, innerWidth, innerHeight);

      gameOverlay.style.display = "flex";

      startOverlay1.style.display = "none";

      if (tut1Clear === true) {
        startOverlay2.style.display = "none";
        tutClear = true;
      }

      tut1Clear = true;
    } else {
      if (player.image === bombBall) {
        player.image = bombFire;
        bombing = true;

        keys.a.pressed = false;
        keys.d.pressed = false;
        keys.w.pressed = false;
        keys.s.pressed = false;
        lastKey = "";
      } else if (player.image === bombFire) {
        player.image = bombBall;
        bombing = false;
      }
    }
  },
  false
);

document.getElementById("restart").onclick = function () {
  resetMap();
  resetMap();

  player.position.x = startPos.x + squareSize / 2;
  player.position.y = startPos.y + squareSize / 2;

  moves = 0;
  player.image = ball;

  keys.a.pressed = false;
  keys.d.pressed = false;
  keys.w.pressed = false;
  keys.s.pressed = false;
  lastKey = "";

  trys++;

  if (innerWidth < innerHeight) {
    document.getElementById("restartCountDiv").innerHTML = "&#x21bb; = " + trys;
  } else {
    document.getElementById("restartCountDiv").innerHTML = "Restarts - " + trys;
  }

  setCookie("resets", trys);
};
