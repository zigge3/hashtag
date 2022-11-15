export default class Camera {
  constructor({ ctx, tick }) {
    this.ctx = ctx;
    tick(this.update);
    tick(this.render);
  }

  position = [0, 0];
  target = null;

  render = ({ world }) => {
    const { objects } = world;
    const { ctx, position } = this;
    const cx = position[0] - window.innerWidth / 2;
    const cy = position[1] - window.innerHeight / 2;
    objects.forEach(({ size, position }) => {
      const [px, py] = position;
      const [sx, sy] = size;
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
