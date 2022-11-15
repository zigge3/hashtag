export default class WorldObject {
  constructor({ texture, customDraw, position, size, velocity, id }) {
    this.id = id;
    this.texture = texture;
    this.customDraw = customDraw;
    this.position = position;
    this.velocity = velocity;
    this.size = size;
    this.t = 0;
  }
  update = () => {
    const [velX, velY] = this.velocity;
    const [posX, posY] = this.position;
    this.position = [posX + velX, posY + Math.round(velY)];
  };
}
