import { Server } from "socket.io";
import _ from "underscore";
import varaibles from "../../public/variables";
import standard from "../../public/worlds/standard";

class Player {
  constructor(options) {
    Object.assign(this, options);
  }
  id = null;
  velocity = [];
  position = [];
  textureName = null;
  size = [0, 0];
  inputs = {
    up: false,
    down: false,
    left: false,
    right: false,
  };
}

class AttackObj {
  constructor(props) {
    Object.assign(this, props);
  }
  textureName = "pow.png";
  position = [0, 0];
  size = [30, 30];
  reach = [150, 30];
  layer = 3;
  ownerId = 0;
}

const SocketHandler = (req, res) => {
  if (res.socket.server.io) {
    console.log("Socket is already running");
  } else {
    console.log("Socket is initializing");
    const io = new Server(res.socket.server);
    res.socket.server.io = io;
    let players = [];
    let worldObjects = [...standard];
    io.on("connection", (socket) => {
      socket.on("add-player", (data) => {
        const player = new Player({
          ...data,
          id: _.uniqueId(),
        });
        players.push(player);
        socket.emit("player-added", player.id);
        socket.emit("world-update", worldObjects);
        socket.on("player-tick", (data) => {
          Object.assign(player, data);
        });
        socket.on("attack", (data) => {
          console.log(data);
          Object.assign(player, data);
          worldObjects.push(new AttackObj({ position: player.position }));
          io.emit("world-update", worldObjects);
        });
        socket.on("disconnect", () => {
          players = players.filter((pl) => pl.id !== player.id);
        });
      });
    });
    setInterval(() => {
      io.emit("update", players);
    }, varaibles.SYNC_INTERVAL);
  }
  res.end();
};

export default SocketHandler;
