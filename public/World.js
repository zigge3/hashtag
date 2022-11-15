import _ from "underscore";

export default class World {
  constructor() {}
  gravity = [0, 10];
  objects = [
    {
      id: _.uniqueId(),
      position: [0, window.innerHeight - 100],
      size: [window.innerWidth, 100],
    },
    {
      id: _.uniqueId(),
      position: [500, 500],
      size: [50, 50],
    },
  ];
}
