import { Server } from "socket.io";
import _ from "underscore";
import varaibles from "../../public/variables";

class Player {
  constructor({ id, position, velocity, inputs, size }) {
    this.id = id;
    this.position = position;
    this.velocity = velocity;
    this.size = size;
    this.inputs = inputs;
  }
  id = null;
  velocity = [];
  position = [];
  inputs = {
    up: false,
    down: false,
    left: false,
    right: false,
  };
}

const SocketHandler = (req, res) => {
  if (res.socket.server.io) {
    console.log("Socket is already running");
  } else {
    console.log("Socket is initializing");
    const io = new Server(res.socket.server);
    res.socket.server.io = io;
    let players = [];
    io.on("connection", (socket) => {
      socket.on("add-player", (data) => {
        console.log("player added");
        console.log(data);
        const player = new Player({
          ...data,
          id: _.uniqueId(),
        });
        players.push(player);
        socket.emit("player-added", player.id);
        socket.on("player-tick", (data) => {
          Object.keys(data).forEach((key) => {
            player[key] = data[key];
          });
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
