export default class WorldObject {
  constructor({ texture, customDraw, position, size }) {
    this.texture = texture;
    this.customDraw = customDraw;
    this.position = position;
    this.size = size;
  }
}
