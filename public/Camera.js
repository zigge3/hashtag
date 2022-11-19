export default class Camera {
  constructor({ ctx, tick, target }) {
    this.ctx = ctx;
    tick(this.update);
    tick(this.render);
    if (target) {
      this.append(target);
    }
  }

  position = [0, 0];
  target = {
    position: [0, 0],
  };

  render = ({ world }) => {
    const { objects } = world;
    const { ctx, position } = this;
    const cx = position[0] - window.innerWidth / 2;
    const cy = position[1] - window.innerHeight / 2;
    objects
      .sort((a, b) => a.isBackground < b.isBackground)
      .forEach(({ size, position, texture, isBackground }) => {
        const [px, py] = position;
        const [sx, sy] = size;
        if (isBackground) {
          console.log("asdasd");
          ctx.fillStyle = "black";
          ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
        } else if (texture && texture.ready) {
          const [x, y] = texture.size || size;
          const [ox, oy] = texture.offset;
          ctx.drawImage(texture.texture, px - cx - ox, py - cy - oy, x, y);
        }
        ctx.globalAlpha = 1;

        ctx.beginPath();
        ctx.strokeStyle = "white";
        ctx.rect(px - cx, py - cy, sx, sy);
        ctx.stroke();
      });
  };

  append = (target) => {
    this.target = target;
    this.position = target.position;
  };

  update = () => {
    this.position = this.target.position;
  };
}
