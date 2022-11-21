import InputHandler from "./InputHandler";
import WorldObject from "./WorldObject";

export default class EditorCharacter {
  constructor(options) {
    Object.assign(this, options);
    this.inputHandler = new InputHandler();
    this.world.objects.push(
      new WorldObject({
        position: [0, 0],
        size: [100, 100],
      })
    );
  }

  update = () => {
    this.checkInputs();
  };

  checkInputs = () => {
    const { inputs } = this.inputHandler;
    const {
      camera: { cameraScale },
    } = this;
    if (inputs.mouseDown) {
      this.mouseDown = true;
      console.log(inputs.mouse);
    } else if (!inputs.mouseDown && this.mouseDown) {
      const x = window.innerWidth - window.innerWidth * cameraScale;
      const y = window.innerHeight - window.innerHeight * cameraScale;
      console.log(x);
      this.mouseDown = false;
      this.world.objects.push(
        new WorldObject({
          position: [inputs.mouse[0] - x, inputs.mouse[1] - y],
          size: [100, 100],
        })
      );
    }
  };
  position = [0, 0];
  size = [0, 0];
  mouseDown = false;
  ui = [];
  camera = null;
}
