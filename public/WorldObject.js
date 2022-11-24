import variables from "./variables";
import gsap from "gsap";
import _ from "underscore";
import Texture from "./Texture";

export default class WorldObject {
  constructor(options) {
    Object.assign(this, options);
    if (!this.id) {
      this.id = Math.random();
    }
    if (options.textureName || this.texture) {
      if (options.isBackground) {
        this.layer = 1;
        this.drawType = variables.DRAW_TYPES.BACKGROUND;
      } else {
        this.texture = new Texture(options.textureName);
        this.drawType = variables.DRAW_TYPES.TEXTURE;
      }
    }
  }
  drawType = variables.DRAW_TYPES.OBJECT;
  id = null;
  texture = null;
  customDraw = _.noop;
  position = [0, 0];
  velocity = [0, 0];
  size = [0, 0];
  zIndex = 0;
  layer = 0;
  isStatic = false;
  sync = (player) => {
    if (player.textureName !== this.textureName) {
      this.texture = new Texture(player.textureName);
    }
    Object.assign(this, { ...player, position: this.position });
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
