import { last } from "underscore";
import InputHandler from "./InputHandler";
import variables from "./variables";
import WorldObject from "./WorldObject";

export default class EditorCharacter {
  constructor(options) {
    Object.assign(this, options);
    const { tick } = options;
    this.inputHandler = new InputHandler(this.canvasRef.current);
    tick(this.doDraw);
  }
  setActiveObject = null;
  startPos = [0, 0];
  objects = [];
  deathTrigger = false;

  doDraw = () => {
    this.keyboardInputs();
    this.mouseInputs();
  };

  keyboardInputs = () => {
    const { inputs } = this.inputHandler;
    const x = window.innerWidth / 2 - this.position[0];
    const y = window.innerHeight / 2 - this.position[1];

    if (inputs.right) {
      this.position = [this.position[0] + 3, this.position[1]];
    }
    if (inputs.left) {
      this.position = [this.position[0] - 3, this.position[1]];
    }
    if (inputs.up) {
      this.position = [this.position[0], this.position[1] - 3];
    }
    if (inputs.down) {
      this.position = [this.position[0], this.position[1] + 3];
    }
    if (inputs.small) {
      this.inputHandler.consumeInput("small");
      const obj = this.objects.pop();
      this.world.remove(obj?.id);
    }
    if (inputs.swap) {
      this.inputHandler.consumeInput("swap");
      this.deathTrigger = !this.deathTrigger;
    }
    if (inputs.attack) {
      this.inputHandler.consumeInput("attack");
      this.world.print();
    }

    if (inputs.scan) {
      console.log([inputs.mouse[0] - x, inputs.mouse[1] - y]);
    }
  };

  mouseInputs = () => {
    const { inputs } = this.inputHandler;
    const x = window.innerWidth / 2 - this.position[0];
    const y = window.innerHeight / 2 - this.position[1];

    if (inputs.clicked) {
      this.mouseDown = false;
      this.inputHandler.consumeInput("clicked");
      const clicked = this.intersectedObjects({
        objects: this.world.objects.filter((obj) => !obj.isBackground),
        position: [inputs.mouse[0] - x, inputs.mouse[1] - y],
      });
      this.setObject(clicked);
    }
    if (inputs.mouseDown && !this.mouseDown) {
      this.mouseDown = true;
      this.startPos = inputs.mouse;
    } else if (!inputs.mouseDown && this.mouseDown) {
      this.mouseDown = false;
      const obj = new WorldObject({
        textureName: this.imgRef?.current,
        trigger: this.deathTrigger
          ? variables.TRIGGER_TYPES.DEATH_TRIGGER
          : undefined,
        position: [this.startPos[0] - x, this.startPos[1] - y],
        size: [
          inputs.mouse[0] - this.startPos[0],
          inputs.mouse[1] - this.startPos[1],
        ],
      });
      this.world.add(obj);
      this.objects.push(obj);
    } else if (this.mouseDown) {
      this.projectShape();
    }
  };

  projectShape = () => {
    const { ctx } = this.camera;
    const { inputs } = this.inputHandler;

    ctx.beginPath();
    if (this.deathTrigger) {
      ctx.strokeStyle = "red";
    } else {
      ctx.strokeStyle = "green";
    }

    ctx.rect(
      this.startPos[0],
      this.startPos[1],
      inputs.mouse[0] - this.startPos[0],
      inputs.mouse[1] - this.startPos[1]
    );
    ctx.stroke();
  };

  checkCollision = (posA, posB) => {
    const [r1X, r1Y, r1W, r1H] = posA;
    const [r2X, r2Y, r2W, r2H] = posB;
    const col =
      r1X < r2X + r2W && r1X + r1W > r2X && r1Y < r2Y + r2H && r1Y + r1H > r2Y;
    return col;
  };

  intersectedObjects = ({ objects, position }) => {
    console.log(position);
    return objects.find((obj) =>
      this.checkCollision([...position, 1, 1], [...obj.position, ...obj.size])
    );
  };

  position = [0, 0];
  size = [0, 0];
  mouseDown = false;
  ui = [];
  camera = null;
}
