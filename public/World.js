import _ from "underscore";
import Texture from "./Texture";
import WorldObject from "./WorldObject";
export default class World {
  constructor({ tick }) {
    tick((options) =>
      this.objects.forEach((obj) => obj.update && obj.update(options))
    );
  }
  gravity = [0, 10];
  objects = [
    new WorldObject({
      id: Math.random() * 100,
      position: [0, 0],
      size: [window.innerWidth, window.innerHeight],
      isBackground: true,
      isStatic: true,
      texture: new Texture("rocky-bg.jpg", {
        size: [window.innerWidth, window.innerHeight],
        offset: [0, 0],
      }),
    }),
    new WorldObject({
      id: Math.random() * 100,
      position: [0, window.innerHeight - 100],
      size: [window.innerWidth, 100],
      isStatic: true,
    }),
    new WorldObject({
      id: Math.random() * 100,
      position: [-20, 0],
      size: [20, window.innerHeight],
      isStatic: true,
    }),
    new WorldObject({
      id: Math.random() * 100,
      position: [window.innerWidth, 0],
      size: [20, window.innerHeight],
      isStatic: true,
    }),
    new WorldObject({
      id: Math.random() * 100,
      position: [0, window.innerHeight - 100],
      size: [window.innerWidth, 100],
      texture: new Texture("grass.png", {
        size: [window.innerWidth, 150],
        offset: [0, 50],
      }),
      isStatic: true,
    }),
    new WorldObject({
      id: Math.random() * 100,
      position: [500, 500],
      texture: new Texture("dick.png"),
      size: [100, 100],
      isStatic: true,
    }),
  ];
}
