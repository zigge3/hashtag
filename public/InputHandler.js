const KEYS = {
  up: "w",
  left: "a",
  backwards: "s",
  right: "d",
  large: "x",
  small: "z",
  swap: "c",
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

    document.addEventListener("keyup", ({ key }) => {
      Object.keys(KEYS).forEach((input) => {
        if (KEYS[input] === key) {
          this.inputs[input] = false;
        }
      });
    });
  }

  consumeInput = (input) => {
    this.inputs[input] = false;
  };

  inputs = {
    up: false,
    left: false,
    backwards: false,
    right: false,
    large: false,
    small: false,
    swap: false,
    attack: false,
  };
}
