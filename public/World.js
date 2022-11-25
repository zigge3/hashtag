import _ from "underscore";
import Texture from "./Texture";
import WorldObject from "./WorldObject";
export default class World {
  constructor({ tick, worldObjects }) {
    tick((options) => {
      this.objects.forEach((obj) => obj.update && obj.update(options));
      this.players.forEach((obj) => obj.update && obj.update(options));
    });
    if (worldObjects) {
      this.objects = [...this.objects, ...worldObjects];
    }
  }
  add = (obj) => {
    this.objects.push(obj);
  };

  remove = (id) => {
    console.log(this.objects.length);
    this.objects = this.objects.filter((obj) => id !== obj.id);
  };

  print = () => {
    console.log(
      this.objects.map((obj) => {
        const { position, size, textureName, trigger } = obj;
        return { position, size, textureName, trigger };
      })
    );
  };

  gravity = [0, 10];
  size = [1500, 1000];
  players = [];
  startingPos = [
    [377, 159.5],
    [-129, -164.5],
    [994, -53.5],
  ];
  objects = [
    new WorldObject({
      id: Math.random() * 100,
      position: [0, 0],
      size: [window.innerWidth, window.innerHeight],
      isBackground: true,
      isStatic: true,
      size: [window.innerWidth, window.innerHeight],
      texture: new Texture("rocky-bg.jpg", {
        size: [window.innerWidth, window.innerHeight],
        aspectRatio: 1.777,
      }),
    }),
  ];
}
