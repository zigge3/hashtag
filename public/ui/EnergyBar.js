import variables from "../variables";

export default class Energy {
  constructor(target) {
    this.target = target;
  }

  position = [0, 0];
  target = null;
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

    const [sx, sy] = this.barSize;
    ctx.beginPath();
    ctx.strokeStyle = "black";
    ctx.rect(...getRelativePosition([x - ox, y - oy]), sx, sy);
    ctx.stroke();
    ctx.beginPath();
    ctx.fillStyle = "yellow";
    const missingEnergy = this.target.energy / this.barSize[0];
    ctx.fillRect(
      ...getRelativePosition([x + 1 - ox, y - oy + 1]),
      missingEnergy * sx - 2,
      sy - 2
    );
    ctx.stroke();
  };
}
