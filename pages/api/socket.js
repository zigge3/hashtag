import { Server } from "socket.io";
import _ from "underscore";
import varaibles from "../../public/variables";
import standard from "../../public/worlds/standard";
import Player from "../../public/Player";

class ServerPlayer {
  constructor(options) {
    Object.assign(this, options);
  }
}

const checkCollision = (posA, posB) => {
  const [r1X, r1Y, r1W, r1H] = posA;
  const [r2X, r2Y, r2W, r2H] = posB;
  const col =
    r1X < r2X + r2W && r1X + r1W > r2X && r1Y < r2Y + r2H && r1Y + r1H > r2Y;
  return col;
};

class AttackObj {
  constructor(props) {
    Object.assign(this, props);
  }
  textureName = "pow.png";
  position = [0, 0];
  size = [150, 30];
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
        const player = new ServerPlayer({
          ...data,
          id: _.uniqueId(),
          socket,
        });
        players.push(player);
        socket.emit("player-added", player.id);
        socket.emit("world-update", worldObjects);
        socket.on("player-tick", (data) => {
          Object.assign(player, data);
        });
        socket.on("attack", (data) => {
          Object.assign(player, data);
          const attack = new AttackObj({
            ownerId: player.id,
            position: [
              player.position[0] + player.hitArea[0],
              player.position[1] + player.hitArea[1],
            ],
          });

          players
            .filter((p) => p.id !== player.id)
            .forEach((pl) => {
              const isHit = checkCollision(
                [...attack.position, ...attack.reach],
                [...pl.position, ...pl.size]
              );
              if (isHit) {
                pl.socket.emit("is-hit", attack);
              }
            });
          worldObjects.push(attack);
          io.emit("world-update", worldObjects);
        });
        socket.on("disconnect", () => {
          players = players.filter((pl) => pl.id !== player.id);
        });
      });
    });
    setInterval(() => {
      io.emit(
        "update",
        players.map((player) => Player.toData(player))
      );
    }, varaibles.SYNC_INTERVAL);
  }
  res.end();
};

export default SocketHandler;
