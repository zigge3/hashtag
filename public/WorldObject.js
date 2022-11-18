import variables from "./variables";
import gsap from "gsap";
export default class WorldObject {
  constructor({ texture, customDraw, position, size, velocity, id, isStatic }) {
    this.id = id;
    this.texture = texture;
    this.customDraw = customDraw;
    this.position = position;
    this.velocity = velocity;
    this.size = size;
    this.t = 0;
    this.isStatic = false;
  }
  sync = (player) => {
    const pos = { x: this.position[0], y: this.position[1] };
    gsap.to(pos, {
      x: player.position[0],
      y: player.position[1],
      duration: variables.SYNC_INTERVAL / 1000,
      onUpdate: () => {
        const { x, y } = pos;
        this.position = [x, y];
      },
    });
  };
}
