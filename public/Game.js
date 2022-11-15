import Camera from "./Camera";
import InputHandler from "./InputHandler";
import Player from "./Player";
import World from "./World";
import WorldObject from "./WorldObject";

export default class Game {
  constructor(props) {
    const { canvas, socket } = props;
    this.inputHandler = new InputHandler();
    //Setup canvas
    const ctx = canvas.getContext("2d");
    this.ctx = ctx;
    this.socket = socket;

    ctx.width = canvas.width;
    ctx.height = canvas.height;
    this.world = new World({
      tick: this.addTick,
    });

    const player = new Player();
    this.player = player;
    socket.emit("add-player", player.toData());
    socket.on("player-added", (id) => {
      player.id = id;
      setInterval(() => {
        socket.emit("player-tick", player.toData());
      }, 100);
    });
    const camera = new Camera({
      ctx,
      tick: this.addTick,
    });

    camera.append(player);
    this.world.objects.push(player);
    socket.on("update", this.syncWorld);
    //Start game loop

    this.update();
  }
  listeners = [];

  //Game props
  world = null;
  running = true;

  last = performance.now();

  syncWorld = (players) => {
    const { objects } = this.world;
    console.log(objects);
    players
      .filter((player) => player.id !== this.player.id)
      .forEach((player) => {
        const obj = objects.find((o) => {
          return o.id === player.id;
        });
        if (obj) {
          const [x1, y1] = player.position;
          const [x2, y2] = obj.position;
          const diff = x2 - x1 + y2 - y1;
          if (diff > 2 || obj.t > 15) {
            obj.position = player.position;
            obj.t = 0;
          } else {
            obj.t += 1;
          }

          obj.velocity = player.velocity;
        } else {
          console.log("object added");
          objects.push(
            new WorldObject({
              ...player,
              size: [100, 100],
            })
          );
        }
      });
  };

  //Updates objects in game world
  tick = (options) => {
    this.listeners.forEach((func) => func(options));
  };

  addTick = (func) => {
    this.listeners.push(func);
  };

  drawInputs = () => {
    const { ctx } = this;
    ctx.fillStyle = "white";
    ctx.font = "20px serif";
    ctx.fillText(JSON.stringify(this.inputHandler.inputs), 100, 100);
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
