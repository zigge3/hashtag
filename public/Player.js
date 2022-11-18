import InputHandler from "./InputHandler";
import _ from "underscore";

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
const MAX_X = 5;
export default class Player {
  constructor() {}
  id = _.uniqueId();
  drag = 0.05;
  position = [0, 0];
  size = [50, 100];
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
    this.velocity = [clamp(velX, -MAX_X, MAX_X), Math.min(velY + gravY, 7)];
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
      this.isGrounded = false;
    } else {
      const distance = this.distance(
        [...this.position, ...this.size],
        [...collisionFound[0].position, ...collisionFound[0].size]
      );
      const newDistance = this.distance(
        [...newPos, ...this.size],
        [...collisionFound[0].position, ...collisionFound[0].size]
      );

      //Collision down
      if (this.downwardsCollision(distance, newDistance)) {
        this.setYPosition(this.position[1] - newDistance.y);
        this.setYVelocity(0);
        this.isGrounded = true;
        //Collision Up
      } else if (this.upwardsCollision(newDistance, collisionFound[0])) {
        this.isGrounded = false;
        if (this.isLedged(newDistance, collisionFound[0])) {
          this.setYVelocity(0);
          this.isGrounded = true;
        } else {
          this.setYPosition(newPos[1]);
          this.setXVelocity(0);
          this.isGrounded = false;
        }
      } else {
      }
    }
  };
  downwardsCollision = (distance, newDistance) =>
    distance.y <= 0 && newDistance.y > 0;
  upwardsCollision = (newDistance, obj) =>
    newDistance.y < obj.size[1] + this.size[1];
  rightCollision = (x) => {
    return x > this.size[0];
  };
  isLedged = (newDistance, obj) => {
    return this.size[1] + obj.size[1] - newDistance.y < 5;
  };
  leftCollision = (x, obj) => {
    return Math.abs(x) > obj.size[0];
  };

  setDrag = () => {
    const [x] = this.velocity;
    if (x >= 0) {
      this.setXVelocity(Math.max(x - this.drag, 0));
    } else {
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

  setXPosition = (x) => {
    this.position = [x, this.position[1]];
  };

  setYPosition = (y) => {
    this.position = [this.position[0], y];
  };

  toData = () => {
    const { velocity, position, inputHandler } = this;
    return { velocity, position, inputs: inputHandler.inputs };
  };
}
