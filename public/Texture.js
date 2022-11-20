const isServer = typeof window === "undefined";
export default class Texture {
  constructor(texture, options = {}) {
    Object.assign(this, options);
    if (isServer) return;
    this.name = texture;
    const img = new Image();
    img.onload = () => {
      this.ready = true;
      this.texture = img;
    };
    img.src = "/images/" + texture;
  }
  offset = [0, 0];
  ready = false;
  texture = null;
}
