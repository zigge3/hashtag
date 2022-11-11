export default class World {
  constructor() {}
  gravity = [0, 9.807];
  objects = [
    {
      id: 2,
      position: [0, window.innerHeight - 100],
      size: [window.innerWidth, 100],
    },
  ];
}
