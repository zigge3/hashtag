import InputHandler from "./InputHandler";
import _ from "underscore";

export default class Player {
  constructor() {}
  id = _.uniqueId();
  drag = 0.05;
  position = [0, 0];
  size = [100, 100];
  velocity = [0, 0];
  isGrounded = false;
  hasVerticalMovement = false;
  inputHandler = new InputHandler();

  update = ({ world, delta }) => {
    const { objects } = world;
    this.getInputs();
    !this.hasVerticalMovement && this.setDrag();
    const [velX, velY] = this.velocity;
    const [gravX, gravY] = world.gravity.map((x) => x * (delta / 1000));
    this.velocity = [velX, Math.min(velY + gravY, 7)];
    const [posX, posY] = this.position;
    const newPos = [posX + velX, posY + velY];
    const collisionFound = [...objects, ...world.objects]
      .filter((a) => a.id !== this.id)
      .reduce((acc, obj) => {
        if (
          this.checkCollision(
            [...newPos, ...this.size],
            [...obj.position, ...obj.size]
          )
        ) {
          acc.push(obj);
        }

        return acc;
      }, []);

    if (!collisionFound.length) {
      this.position = newPos;
    } else {
      const { x, y } = this.distance(
        [...this.position, ...this.size],
        [...collisionFound[0].position, ...collisionFound[0].size]
      );
      if (this.velocity[1] > 0 && Math.abs(y) < 7.1) {
        this.setYVelocity(0);
        this.isGrounded = true;
      } else {
        if (this.velocity[1] < 0.05) {
          this.setYVelocity(0);
        }
        this.isGrounded = false;
      }
    }
  };

  setDrag = () => {
    const [x] = this.velocity;
    if (x > 0) {
      this.setXVelocity(Math.max(x - this.drag, 0));
    } else if (x < 0) {
      this.setXVelocity(Math.min(x + this.drag, 0));
    }
  };

  getInputs = () => {
    this.hasVerticalMovement = false;
    const [x] = this.velocity;
    if (this.inputHandler.inputs.right) {
      this.setXVelocity(x + 0.1);
      this.hasVerticalMovement = true;
    }
    if (this.inputHandler.inputs.left) {
      this.setXVelocity(x - 0.1);
      this.hasVerticalMovement = true;
    }
    if (this.inputHandler.inputs.up && this.isGrounded) {
      this.setYVelocity(-7);
    }
  };

  checkCollision = (posA, posB) => {
    const [r1X, r1Y, r1W, r1H] = posA;
    const [r2X, r2Y, r2W, r2H] = posB;
    const col =
      r1X < r2X + r2W && r1X + r1W > r2X && r1Y < r2Y + r2H && r1Y + r1H > r2Y;
    return col;
  };

  distance = (posA, posB) => {
    const [r1X, r1Y, r1W, r1H] = posA;
    const [r2X, r2Y, r2W, r2H] = posB;
    return { x: r1X + r1W - (r2X + r2W), y: r1Y + r1H - r2Y };
  };

  draw = ({ ctx }) => {
    ctx.beginPath();
    ctx.strokeStyle = "white";
    ctx.rect(...this.position, ...this.size);
    ctx.stroke();

    ctx.fillStyle = "white";
    ctx.font = "20px serif";
    ctx.fillText(
      `x: ${this.velocity[0]} y: ${Math.round(this.velocity[1] * 100) / 100}`,
      ...this.position
    );
  };

  setXVelocity = (x) => {
    this.velocity = [x, this.velocity[1]];
  };

  setYVelocity = (y) => {
    this.velocity = [this.velocity[0], y];
  };

  toData = () => {
    const { velocity, position, inputHandler } = this;
    return { velocity, position, inputs: inputHandler.inputs };
  };
}
