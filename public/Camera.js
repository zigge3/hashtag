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
  cameraScale = 1;
  position = [0, 0];

  positionWithOffset = [0, 0];
  target = {
    position: [0, 0],
  };

  render = ({ world, player }) => {
    this.drawBackground({ texture: world.background, world });

    const { objects, players } = world;
    [...objects, ...players]
      .sort((a, b) => a.layer < b.layer)
      .forEach((obj) => {
        switch (obj.drawType) {
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

  drawBackground = ({ world }) => {
    const { ctx, cameraScale } = this;
    const texture = world.background;
    if (!world.objects.length) return;
    const sizeSorted = world.objects.sort(
      (a, b) => a.position[0] - b.position[0]
    );
    const offsetMulti = 1.2;
    const size =
      sizeSorted[sizeSorted.length - 1].position[0] - sizeSorted[0].position[0];
    const offset =
      Math.abs(sizeSorted[0].position[0] - this.position[0]) / size;
    if (texture.ready) {
      const x = window.innerWidth * offsetMulti;
      const y = x / texture.aspectRatio;
      const origin = sizeSorted[0].position[0];
      ctx.drawImage(texture.texture, origin * offset, 0, x * 1.5, y * 1.5);
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
