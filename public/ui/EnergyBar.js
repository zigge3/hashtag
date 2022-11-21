import variables from "../variables";

export default class Energy {
  constructor(options) {
    Object.assign(this, options);
  }

  position = [0, 0];
  barSize = [100, 10];
  object = null;
  offset = [25, 25];
  drawType = variables.DRAW_TYPES.CUSTOM;

  draw = (camera) => {
    const { ctx } = camera;
    const {
      position: [x, y],
      getRelativePosition,
    } = camera;
    const [ox, oy] = this.offset;
    console.log(this);
    const [sx, sy] = this.barSize;
    ctx.beginPath();
    ctx.strokeStyle = "black";
    ctx.rect(...getRelativePosition([x - ox, y - oy]), sx, sy);
    ctx.stroke();
  };
}
