const KEYS = {
  up: "w",
  left: "a",
  down: "s",
  right: "d",
  large: "x",
  small: "z",
  swap: "c",
  scan: "v",
  attack: " ",
};

export default class InputHandler {
  constructor() {
    document.addEventListener("keydown", (e) => {
      const { key } = e;
      e.preventDefault();
      Object.keys(KEYS).forEach((input) => {
        if (KEYS[input] === key) {
          this.inputs[input] = true;
        }
      });
    });

    document.addEventListener("keyup", (e) => {
      const { key } = e;
      Object.keys(KEYS).forEach((input) => {
        if (KEYS[input] === key) {
          this.inputs[input] = false;
        }
      });
    });

    document.addEventListener("mousedown", (e) => {
      this.inputs.mouseDown = true;
    });
    document.addEventListener("mousemove", (e) => {
      this.inputs.mouse = [e.offsetX, e.offsetY];
    });
    document.addEventListener("mouseup", (e) => {
      this.inputs.mouseDown = false;
    });
  }

  consumeInput = (input) => {
    this.inputs[input] = false;
  };

  inputs = {
    up: false,
    left: false,
    down: false,
    right: false,
    large: false,
    small: false,
    swap: false,
    attack: false,
    mouseDown: false,
    mouse: [0, 0],
    scan: false,
  };
}
