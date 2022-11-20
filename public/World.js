import _ from "underscore";
import Texture from "./Texture";
import WorldObject from "./WorldObject";
export default class World {
  constructor({ tick }) {
    tick((options) => {
      this.objects.forEach((obj) => obj.update && obj.update(options));
      this.players.forEach((obj) => obj.update && obj.update(options));
    });
  }
  gravity = [0, 10];
  players = [];
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
