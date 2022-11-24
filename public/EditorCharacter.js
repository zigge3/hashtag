import { last } from "underscore";
import InputHandler from "./InputHandler";
import WorldObject from "./WorldObject";

export default class EditorCharacter {
  constructor(options) {
    Object.assign(this, options);
    const { tick } = options;
    this.inputHandler = new InputHandler();
    this.world.objects.push(
      new WorldObject({
        position: [0, 0],
        size: [100, 100],
      })
    );
    tick(this.doDraw);
  }

  startPos = [0, 0];
  objects = [];

  doDraw = () => {
    this.keyboardInputs();
    this.mouseInputs();
  };

  keyboardInputs = () => {
    const { inputs } = this.inputHandler;
    if (inputs.right) {
      this.position = [this.position[0] + 1, this.position[1]];
    }
    if (inputs.left) {
      this.position = [this.position[0] - 1, this.position[1]];
    }
    if (inputs.up) {
      this.position = [this.position[0], this.position[1] - 1];
    }
    if (inputs.down) {
      this.position = [this.position[0], this.position[1] + 1];
    }
    if (inputs.small) {
      this.inputHandler.consumeInput("small");
      const obj = this.objects.pop();
      this.world.remove(obj?.id);
    }
    if (inputs.attack) {
      this.inputHandler.consumeInput("attack");
      this.world.print();
    }
  };

  mouseInputs = () => {
    const { inputs } = this.inputHandler;
    if (inputs.mouseDown && !this.mouseDown) {
      this.mouseDown = true;
      this.startPos = inputs.mouse;
    } else if (!inputs.mouseDown && this.mouseDown) {
      const x = window.innerWidth / 2 - this.position[0];
      const y = window.innerHeight / 2 - this.position[1];
      this.mouseDown = false;
      const obj = new WorldObject({
        textureName: this.imgRef?.current,
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
    ctx.strokeStyle = "red";
    ctx.rect(
      this.startPos[0],
      this.startPos[1],
      inputs.mouse[0] - this.startPos[0],
      inputs.mouse[1] - this.startPos[1]
    );
    ctx.stroke();
  };

  position = [0, 0];
  size = [0, 0];
  mouseDown = false;
  ui = [];
  camera = null;
}
