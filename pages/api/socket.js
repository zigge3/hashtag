import { Server } from "socket.io";
import _ from "underscore";

class Player {
  constructor({ id, position }) {
    this.id = id;
    this.position = position;
  }
  id = null;
  position = [];
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
      socket.on("add-player", (p) => {
        console.log("player added");
        const player = new Player({ position: p.position, id: _.uniqueId() });
        players.push(player);
        socket.emit("player-added", player.id);
        socket.on("player-tick", (data) => {
          player.position = data;
        });
        socket.on("disconnect", () => {
          players = players.filter((pl) => pl.id !== player.id);
        });
      });
    });
    setInterval(() => {
      console.log(players);
      io.emit("update", players);
    }, 10);
  }
  res.end();
};

export default SocketHandler;
