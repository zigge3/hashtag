import InputHandler from "./InputHandler";
import _ from "underscore";
import Texture from "./Texture";
import variables from "./variables";
const charList = [
  "kevin.png",
  "timmy.png",
  "moller.png",
  "maja.png",
  "johan.png",
];
const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

let targetUpdate = 4;
export default class Player {
  constructor(options) {
    if (options.timeScale) {
      targetUpdate = options.timeScale;
    }
    Object.assign(this, options);
    options.socket.on("is-hit", this.hit);
  }
  id = _.uniqueId();
  drag = 0.05;
  position = [0, 0];
  size = [50, 100];
  acceleration = [0.05, 5];
  maxSpeed = [3, 6];
  velocity = [0, 0];
  hitArea = [0, 50];
  isGrounded = false;
  isPlayer = true;
  hasVerticalMovement = false;
  inputHandler = new InputHandler();
  layer = 0;
  drawType = variables.DRAW_TYPES.TEXTURE;
  currentChar = 0;
  socket = null;
  faceingRight = true;

  update = ({ world, delta }) => {
    const { objects } = world;
    this.delta = delta;
    this.getInputs(delta);
    !this.hasVerticalMovement && this.setDrag();
    const [velX, velY] = this.velocity;
    const [gravX, gravY] = world.gravity.map((x) => x * (delta / 1000));
    this.velocity = [
      clamp(velX, -this.maxSpeed[0], this.maxSpeed[0]),
      Math.min(velY + gravY, this.maxSpeed[1]),
    ];
    const [posX, posY] = this.position;
    const newPos = [
      posX + velX * (delta / targetUpdate),
      posY + velY * (delta / targetUpdate),
    ];
    const collisionFound = [...objects, ...world.objects]
      .filter((a) => a.layer === this.layer)
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
      this.isGrounded = false;
      //Check down
      if (this.verticalCollision(collisionFound[0])) {
        if (this.velocity[1] > 0) this.isGrounded = true;
        this.setYVelocity(0);
      } else {
        this.setYPosition(newPos[1]);
      }

      if (this.horizontalCollision(collisionFound[0])) {
        if (this.velocity[0] > 0) {
          this.setXPosition(
            this.position[0] - distance.x - collisionFound[0].size[0]
          );
        } else if (this.velocity[0] < 0) {
          this.setXPosition(this.position[0] - distance.x + this.size[0]);
        }

        this.setXVelocity(0);
      } else {
        this.setXPosition(newPos[0]);
      }
    }
  };
  verticalCollision = (obj) => {
    const [velX, velY] = this.velocity;
    const { delta } = this;
    const [posX, posY] = this.position;
    return this.checkCollision(
      [posX, posY + velY * (delta / targetUpdate), ...this.size],
      [...obj.position, ...obj.size]
    );
  };

  horizontalCollision = (obj) => {
    const [velX, velY] = this.velocity;
    const { delta } = this;
    const [posX, posY] = this.position;
    return this.checkCollision(
      [posX + velX * (delta / targetUpdate), posY, ...this.size],
      [...obj.position, ...obj.size]
    );
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
    const [ax, ay] = this.acceleration;
    const { inputs } = this.inputHandler;
    if (inputs.right) {
      this.setXVelocity(x + ax);
      this.faceingRight = true;
      this.hasVerticalMovement = true;
    }
    if (inputs.left) {
      this.setXVelocity(x - ax);
      this.faceingRight = false;
      this.hasVerticalMovement = true;
    }
    if (inputs.up && this.isGrounded) {
      this.setYVelocity(-ay);
    }
    const [sx, sy] = this.size;
    if (inputs.small) {
      this.size = [sx - 0.1, sy + 0.1];
      this.setYPosition(this.position[1] - 0.1);
    }
    if (inputs.large) {
      this.size = [sx + 0.1, sy - 0.1];
    }

    if (inputs.swap) {
      this.currentChar++;
      this.inputHandler.consumeInput("swap");
      this.setCharacter();
    }

    if (inputs.attack) {
      this.attack();
      this.inputHandler.consumeInput("attack");
    }
  };

  attack = () => {
    this.socket.emit("attack", Player.toData(this));
  };

  setCharacter = () => {
    this.texture = new Texture(charList[this.currentChar % charList.length]);
  };

  hit = ({ attack, player }) => {
    if (this.position[0] > player.position[0]) {
      this.setXVelocity(10);
    } else {
      this.setXVelocity(-10);
    }
    this.setYVelocity(-4);

    this.velocity;
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

  static toData = (player) => {
    const {
      id,
      velocity,
      position,
      size,
      textureName,
      faceingRight,
      isPlayer,
      hitArea,
    } = player;

    return {
      id,
      faceingRight,
      velocity,
      position,
      size,
      textureName,
      isPlayer,
      hitArea,
    };
  };
}
