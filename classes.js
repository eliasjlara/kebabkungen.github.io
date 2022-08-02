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
