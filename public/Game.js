import Camera from "./Camera";
import InputHandler from "./InputHandler";
import Player from "./Player";
import World from "./World";

export default class Game {
  constructor(props) {
    const { canvas } = props;
    this.inputHandler = new InputHandler();
    //Setup canvas
    const ctx = canvas.getContext("2d");
    this.ctx = ctx;
    ctx.width = canvas.width;
    ctx.height = canvas.height;
    this.world = new World({
      tick: this.addTick,
    });
    const player = new Player({
      tick: this.addTick,
    });

    const camera = new Camera({
      ctx,
      tick: this.addTick,
    });

    camera.append(player);
    this.world.objects.push(player);

    //Start game loop

    this.update();
  }
  listeners = [];

  //Game props
  world = null;
  running = true;

  last = performance.now();

  //Updates objects in game world
  tick = (options) => {
    this.listeners.forEach((func) => func(options));
  };

  addTick = (func) => {
    this.listeners.push(func);
  };

  //Draw objects in game world
  drawObjects = () => {
    this.objects.forEach((obj) => obj?.draw(this));
  };

  drawInputs = () => {
    const { ctx } = this;
    ctx.fillStyle = "white";
    ctx.font = "20px serif";
    ctx.fillText(JSON.stringify(this.inputHandler.inputs), 100, 100);
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

  //Game loop based on frame count
  update = () => {
    const { world } = this;
    const now = performance.now();
    const delta = now - this.last;
    this.last = now;
    if (this.running) {
      this.clearScreen();
      this.tick({ world, delta });
      this.drawInputs();

      requestAnimationFrame(this.update);
    }
  };

  clearScreen = () => {
    const { ctx } = this;
    ctx.clearRect(0, 0, ctx.width, ctx.height);
  };

  //Closes game and stopping loops
  close = () => {
    this.running = false;
  };
}
