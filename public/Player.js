import InputHandler from "./InputHandler";
import _ from "underscore";
import Texture from "./Texture";
import variables from "./variables";
import Energy from "./ui/EnergyBar";
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
  acceleration = [0.05, 4];
  maxSpeed = [2, 7];
  velocity = [0, 0];
  hitArea = [0, 50];
  stagger = 1;
  attackCost = 25;
  jumpCost = 4;
  baseHit = [3, 3];
  energyRate = 100;
  energy = 100;
  maxEnergy = 100;
  triggedTriggers = [];
  ui = [new Energy(this)];
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
    this.regenerateEnergy(delta);
    !this.hasVerticalMovement && this.setDrag();
    const [velX, velY] = this.velocity;
    const [gravX, gravY] = world.gravity.map((x) => x * (delta / 1000));
    this.velocity = [velX, Math.min(velY + gravY, this.maxSpeed[1])];
    const [posX, posY] = this.position;
    const newPos = [
      posX + velX * (delta / targetUpdate),
      posY + velY * (delta / targetUpdate),
    ];
    this.doCollision({ objects, newPos });
    this.doTriggers({ objects });
  };

  doCollision = ({ objects, newPos }) => {
    const objs = [...objects]
      .filter((a) => a.layer === this.layer)
      .filter((a) => !a.trigger);
    const collisionFound = this.intersectedObjects({
      objects: objs,
      position: newPos,
    });

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
            this.position[0] - distance.x - collisionFound[0].size[0] - 1
          );
        } else if (this.velocity[0] < 0) {
          this.setXPosition(this.position[0] - distance.x + this.size[0] + 1);
        }

        this.setXVelocity(0);
      } else {
        this.setXPosition(newPos[0]);
      }
    }
  };

  doTriggers = ({ objects }) => {
    const objs = objects.filter((obj) => obj.trigger);
    const { DEATH_TRIGGER } = variables.TRIGGER_TYPES;
    const triggers = this.intersectedObjects({
      objects: objs,
      position: this.position,
    });
    this.triggedTriggers = this.triggedTriggers.filter((obj) =>
      triggers.find((trObj) => trObj.id === obj.id)
    );

    triggers.forEach((obj) => {
      if (this.triggedTriggers.find((trObj) => trObj.id === obj.id)) return;
      switch (obj.trigger) {
        case DEATH_TRIGGER:
          this.die();
          break;
      }
      this.triggedTriggers.push(obj);
    });
  };

  intersectedObjects = ({ objects, position }) => {
    return objects.reduce((acc, obj) => {
      if (
        this.checkCollision(
          [...position, ...this.size],
          [...obj.position, ...obj.size]
        )
      ) {
        acc.push(obj);
      }

      return acc;
    }, []);
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
      this.setXVelocity(Math.min(x + ax, this.maxSpeed[0]));
      this.faceingRight = true;
      this.hasVerticalMovement = true;
    }
    if (inputs.left) {
      this.setXVelocity(Math.max(x - ax, -this.maxSpeed[0]));
      this.faceingRight = false;
      this.hasVerticalMovement = true;
    }
    if (inputs.up && this.isGrounded) {
      if (this.drainEnergy(this.jumpCost)) {
        this.inputHandler.consumeInput("up");
        this.setYVelocity(-ay);
      }
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
      if (this.drainEnergy(this.attackCost)) {
        this.attack();
        this.inputHandler.consumeInput("attack");
      }
    }
  };

  attack = () => {
    this.socket.emit("attack", {
      player: Player.toData(this),
      damage: 0.1,
    });
  };

  drainEnergy = (cost) => {
    if (this.energy > cost) {
      this.energy -= cost;
      return true;
    } else {
      return false;
    }
  };

  setCharacter = () => {
    this.texture = new Texture(charList[this.currentChar % charList.length]);
  };

  regenerateEnergy = (delta) => {
    this.energy = Math.min(
      this.maxEnergy,
      this.energy + delta / this.energyRate
    );
  };

  hit = ({ attack, player }) => {
    this.stagger += attack.damage;
    if (this.position[0] > player.position[0]) {
      this.setXVelocity(this.baseHit[0] * this.stagger);
    } else {
      this.setXVelocity(-this.baseHit[0] * this.stagger);
    }
    this.setYVelocity(-this.baseHit[1] * this.stagger);
  };

  die = () => {};

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
