import WorldObject from "../WorldObject";
const wrld = [
  {
    position: [-865, -584],
    size: [0, 0],
    textureName: "ground.png",
  },
  {
    position: [-1000, 306],
    size: [2089, 67],
    textureName: "ground.png",
  },
  {
    position: [-840, -588],
    size: [0, 0],
    textureName: "grass.png",
  },
  {
    position: [-851, -588],
    size: [-1, 0],
    textureName: "ground.png",
  },
  {
    position: [-730, 140],
    size: [70, 166],
    textureName: "ground.png",
  },
  {
    position: [-955, -569],
    size: [-4, -3],
    textureName: "wall.png",
  },
  {
    position: [-823, -619],
    size: [0, 0],
    textureName: "ground.png",
  },
  {
    position: [-667, 207],
    size: [24, 11],
    textureName: "ground.png",
  },
  {
    position: [-928, 38],
    size: [134, 42],
    textureName: "ground.png",
  },
  {
    position: [-705, -46],
    size: [118, 37],
    textureName: "ground.png",
  },
  {
    position: [-488, -117],
    size: [127, 58],
    textureName: "ground.png",
  },
  {
    position: [-270, -5],
    size: [267, 34],
    textureName: "ground.png",
  },
  {
    position: [878, -275],
    size: [210, 70],
    textureName: "ground.png",
  },
  {
    position: [-980, -576],
    size: [2, -2],
    textureName: "wall.png",
  },
  {
    position: [919, 83],
    size: [164, 221],
    textureName: "wall.png",
  },
  {
    position: [-973, -592],
    size: [0, -1],
    textureName: "timmy.png",
  },
  {
    position: [-989, -602],
    size: [0, -1],
    textureName: "moller.png",
  },
  {
    position: [-988, -568],
    size: [0, 0],
    textureName: "moller.png",
  },
  {
    position: [1017, -366],
    size: [64, 92],
    textureName: "moller.png",
  },
  {
    position: [-987, -592],
    size: [0, 0],
    textureName: "timmy.png",
  },
  {
    position: [900, -391],
    size: [87, 118],
    textureName: "timmy.png",
  },
];
export default wrld.map(
  (obj) =>
    new WorldObject({
      ...obj,
      isStatic: true,
    })
);
