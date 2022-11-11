import Player from "./Player";
import World from "./World";

export default class Game {
  constructor(props) {
    const { canvas } = props;

    //Setup canvas
    const ctx = canvas.getContext("2d");
    this.ctx = ctx;
    ctx.width = canvas.width;
    ctx.height = canvas.height;

    //Start game loop

    this.update();
  }

  //Game props
  objects = [new Player()];
  world = new World();
  running = true;

  last = performance.now();

  //Updates objects in game world
  tick = () => {
    this.objects.forEach((obj) => obj?.update(this));
  };

  //Draw objects in game world
  drawObjects = () => {
    this.objects.forEach((obj) => obj?.draw(this));
  };

  drawWorld = () => {
    const { ctx } = this;
    this.world.objects.forEach((obj) => {
      ctx.beginPath();
      ctx.strokeStyle = "white";
      ctx.rect(...obj.position, ...obj.size);
      ctx.stroke();
    });
  };

  clearScreen = () => {
    const { ctx } = this;
    ctx.clearRect(0, 0, ctx.width, ctx.height);
  };

  //Game loop based on frame count
  update = () => {
    const now = performance.now();
    this.delta = now - this.last;
    this.last = now;
    if (this.running) {
      this.clearScreen();
      this.tick();
      this.drawWorld();
      this.drawObjects();

      requestAnimationFrame(this.update);
    }
  };

  //Closes game and stopping loops
  close = () => {
    this.running = false;
  };
}
