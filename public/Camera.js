import variables from "./variables";

export default class Camera {
  constructor({ ctx, tick, target, world }) {
    this.ctx = ctx;
    tick(this.update);
    tick(this.render);
    ctx.scale(this.cameraScale, this.cameraScale);
    if (target) {
      this.append(target);
    }
  }
  cameraScale = 0.75;
  position = [0, 0];

  positionWithOffset = [0, 0];
  target = {
    position: [0, 0],
  };

  render = ({ world, player }) => {
    const { objects, players } = world;
    [...objects, ...players]
      .sort((a, b) => a.layer < b.layer)
      .forEach((obj) => {
        switch (obj.drawType) {
          case variables.DRAW_TYPES.BACKGROUND:
            this.drawBackground({ obj });
            break;
          case variables.DRAW_TYPES.TEXTURE:
            this.drawTexture({ obj });
            break;
          default:
            this.drawDefault({ obj });
            break;
        }
      });

    player.ui.forEach((ui) => {
      ui.draw(this);
    });
  };

  drawDefault = ({ obj }) => {
    const [px, py] = obj.position;
    const [sx, sy] = obj.size;
    const [cx, cy] = this.positionWithOffset;
    const { ctx } = this;
    ctx.beginPath();
    ctx.strokeStyle = "white";
    ctx.rect(px - cx, py - cy, sx, sy);
    ctx.stroke();
  };

  drawBackground = ({ obj }) => {
    const { ctx, cameraScale } = this;
    const { texture } = obj;
    if (texture.ready) {
      let x, y;
      if (window.innerHeight * texture.aspectRatio < window.innerWidth) {
        x = window.innerWidth / cameraScale;
        y = window.innerWidth / cameraScale / texture.aspectRatio;
      } else {
        x = (window.innerHeight / cameraScale) * texture.aspectRatio;
        y = window.innerHeight / cameraScale;
      }
      ctx.drawImage(texture.texture, 0, 0, x, y);
    }
  };

  getRelativePosition = (position) => {
    const [x, y] = position;
    const [px, py] = this.positionWithOffset;
    return [x - px, y - py];
  };

  drawTexture = ({ obj }) => {
    const { ctx } = this;
    const { texture, faceingRight } = obj;
    const [cx, cy] = this.positionWithOffset;
    if (texture && texture.ready) {
      const { size } = obj;
      const [px, py] = obj.position;
      const [x, y] = texture.size || size;
      const [ox, oy] = texture.offset;
      ctx.save();
      let flipped = 1;
      if (faceingRight === false) {
        ctx.scale(-1, 1);
        flipped = -1;
      }
      ctx.drawImage(
        texture.texture,
        flipped * (px - cx - ox) - (flipped === -1 ? x : 0),
        py - cy - oy,
        x,
        y
      );
      ctx.restore();
    }
  };

  append = (target) => {
    this.target = target;
    this.position = target.position;
  };

  update = () => {
    const { position } = this.target;
    this.position = position;
    this.positionWithOffset = [
      position[0] - window.innerWidth / 2,
      position[1] - window.innerHeight / 2,
    ];
  };
}
