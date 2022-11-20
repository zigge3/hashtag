import Camera from "./Camera";
import InputHandler from "./InputHandler";
import Player from "./Player";

import World from "./World";
import WorldObject from "./WorldObject";

import variables from "./variables";

export default class Game {
  constructor(props) {
    const { canvas, socket, Character, timeScale } = props;
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

    const player = new Character({ position: [50, 0], timeScale, socket });
    this.player = player;
    socket.emit("add-player", Player.toData(player));
    socket.on("player-added", (id) => {
      player.id = id;
      socket.on("update", this.syncPlayers);
      socket.on("world-update", this.syncWorld);
      setInterval(() => {
        socket.emit("player-tick", Player.toData(player));
      }, variables.SYNC_INTERVAL);
    });
    const camera = new Camera({
      ctx,
      tick: this.addTick,
    });

    camera.append(player);
    this.world.players.push(player);

    //Start game loop

    this.update();
  }
  listeners = [];

  //Game props
  world = null;
  running = true;

  last = performance.now();

  syncPlayers = (players) => {
    const worldPlayers = this.world.players;
    players
      .filter((player) => player.id !== this.player.id)
      .forEach((player) => {
        const obj = worldPlayers.find((o) => {
          return o.id === player.id;
        });
        if (obj) {
          obj?.sync(player);
        } else {
          worldPlayers.push(new WorldObject(player));
        }
      });
    this.world.players = worldPlayers.filter(
      (obj) => obj.isStatic || players.find((player) => player.id === obj.id)
    );
  };

  syncWorld = (world) => {
    this.world.objects = [
      ...this.world.objects.filter((a) => a.isBackground),
      ...world.map((obj) => {
        return new WorldObject(obj);
      }),
    ];
  };

  //Updates objects in game world
  tick = (options) => {
    this.listeners.forEach((func) => func(options));
  };

  addTick = (func) => {
    this.listeners.push(func);
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
