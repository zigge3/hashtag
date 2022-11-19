import variables from "./variables";
import gsap from "gsap";
import _ from "underscore";
import Texture from "./Texture";
export default class WorldObject {
  constructor(options) {
    Object.assign(this, options);
    if (options.textureName) {
      this.texture = new Texture(options.textureName);
    }
  }
  id = null;
  texture = null;
  customDraw = _.noop;
  position = [0, 0];
  velocity = [0, 0];
  size = [0, 0];
  zIndex = 0;
  layer = 0;
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
