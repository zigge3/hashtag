import _ from "underscore";
import Texture from "./Texture";
export default class World {
  constructor({ tick }) {
    tick((options) =>
      this.objects.forEach((obj) => obj.update && obj.update(options))
    );
  }
  gravity = [0, 10];
  objects = [
    {
      id: Math.random() * 100,
      position: [0, window.innerHeight - 100],
      size: [window.innerWidth, 100],
      isStatic: true,
    },
    {
      id: Math.random() * 100,
      position: [-20, 0],
      size: [20, window.innerHeight],
      isStatic: true,
    },
    {
      id: Math.random() * 100,
      position: [window.innerWidth, 0],
      size: [20, window.innerHeight],
      isStatic: true,
    },
    {
      id: Math.random() * 100,
      position: [0, window.innerHeight - 100],
      size: [window.innerWidth, 100],
      texture: new Texture("grass.png", {
        size: [window.innerWidth, 150],
        offset: [0, 50],
      }),
      isStatic: true,
    },

    {
      id: Math.random() * 100,
      position: [500, 500],
      size: [50, 50],
      isStatic: true,
    },
  ];
}
