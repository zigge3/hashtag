export default class Player {
  constructor() {}
  id = 1;
  position = [0, 0];
  size = [100, 100];
  velocity = [0, 0];

  update = ({ objects, world, delta }) => {
    const [velX, velY] = this.velocity;
    const [gravX, gravY] = world.gravity.map((x) => x * (delta / 1000));
    this.velocity = [velX + gravX, velY + gravY];

    const [posX, posY] = this.position;
    const newPos = [posX + velX, posY + velY];
    const objs = [...objects, ...world.objects];
    console.log(objs);
    const collisionFound = [...objects, ...world.objects]
      .filter((a) => a.id !== this.id)
      .reduce((acc, obj) => {
        return (
          acc +
          this.checkCollision(
            [...this.position, ...this.size],
            [...obj.position, ...obj.size]
          )
        );
      }, false);
    if (!collisionFound) this.position = newPos;
  };

  checkCollision = (posA, posB) => {
    const [r1X, r1Y, r1W, r1H] = posA;
    const [r2X, r2Y, r2W, r2H] = posB;
    const col =
      r1X < r2X + r2W && r1X + r1W > r2X && r1Y < r2Y + r2H && r1Y + r1H > r2Y;
    return col;
  };

  draw = ({ ctx }) => {
    ctx.beginPath();
    ctx.strokeStyle = "white";
    ctx.rect(...this.position, ...this.size);
    ctx.stroke();
  };
}
