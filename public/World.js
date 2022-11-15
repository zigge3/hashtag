import _ from "underscore";

export default class World {
  constructor() {}
  gravity = [0, 10];
  objects = [
    {
      id: Math.random() * 100,
      position: [0, window.innerHeight - 100],
      size: [window.innerWidth, 100],
    },
    {
      id: Math.random() * 100,
      position: [-20, 0],
      size: [20, window.innerHeight],
    },
    {
      id: Math.random() * 100,
      position: [0, window.innerHeight - 100],
      size: [window.innerWidth, 100],
    },
    {
      id: Math.random() * 100,
      position: [0, window.innerHeight - 100],
      size: [window.innerWidth, 100],
    },

    {
      id: Math.random() * 100,
      position: [500, 500],
      size: [50, 50],
    },
  ];
}
