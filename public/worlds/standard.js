import WorldObject from "../WorldObject";
const wrld = [
  {
    position: [-865, -584],
    size: [0, 0],
    textureName: "ground.png",
    trigger: null,
  },
  {
    position: [-1000, 306],
    size: [2089, 67],
    textureName: "ground.png",
    trigger: null,
  },
  {
    position: [-840, -588],
    size: [0, 0],
    textureName: "grass.png",
    trigger: null,
  },
  {
    position: [-851, -588],
    size: [-1, 0],
    textureName: "ground.png",
    trigger: null,
  },
  {
    position: [-730, 140],
    size: [70, 166],
    textureName: "ground.png",
    trigger: null,
  },
  {
    position: [-955, -569],
    size: [-4, -3],
    textureName: "wall.png",
    trigger: null,
  },
  {
    position: [-823, -619],
    size: [0, 0],
    textureName: "ground.png",
    trigger: null,
  },
  {
    position: [-667, 207],
    size: [24, 11],
    textureName: "ground.png",
    trigger: null,
  },
  {
    position: [-928, 38],
    size: [134, 42],
    textureName: "ground.png",
    trigger: null,
  },
  {
    position: [-705, -46],
    size: [118, 37],
    textureName: "ground.png",
    trigger: null,
  },
  {
    position: [-488, -117],
    size: [127, 58],
    textureName: "ground.png",
    trigger: null,
  },
  {
    position: [-270, -5],
    size: [267, 34],
    textureName: "ground.png",
    trigger: null,
  },
  {
    position: [878, -275],
    size: [210, 70],
    textureName: "ground.png",
    trigger: null,
  },
  {
    position: [-980, -576],
    size: [2, -2],
    textureName: "wall.png",
    trigger: null,
  },
  {
    position: [919, 83],
    size: [164, 221],
    textureName: "wall.png",
    trigger: null,
  },
  {
    position: [-973, -592],
    size: [0, -1],
    textureName: "timmy.png",
    trigger: null,
  },
  {
    position: [-989, -602],
    size: [0, -1],
    textureName: "moller.png",
    trigger: null,
  },
  {
    position: [-988, -568],
    size: [0, 0],
    textureName: "moller.png",
    trigger: null,
  },
  {
    position: [1017, -366],
    size: [64, 92],
    textureName: "moller.png",
    trigger: null,
  },
  {
    position: [-987, -592],
    size: [0, 0],
    textureName: "timmy.png",
    trigger: null,
  },
  {
    position: [900, -391],
    size: [87, 118],
    textureName: "timmy.png",
    trigger: null,
  },
  {
    position: [-1271, -644.5],
    size: [104, 1130],
    textureName: "",
    trigger: "dth",
  },
  {
    position: [-1271, -646.5],
    size: [1958, 71],
    textureName: "",
    trigger: "dth",
  },

  {
    position: [686, -652.5],
    size: [697, 77],
    textureName: "",
    trigger: "dth",
  },

  {
    position: [-1271, 485.5],
    size: [1951, 70],
    textureName: "",
    trigger: "dth",
  },
  {
    position: [1300, 372.5],
    size: [79, 169],
    textureName: "",
    trigger: "dth",
  },
  {
    position: [681, 483.5],
    size: [697, 78],
    textureName: "",
    trigger: "dth",
  },
  {
    position: [1284, -654.5],
    size: [94, 1030],
    textureName: "",
    trigger: "dth",
  },
];
export default wrld.map(
  (obj) =>
    new WorldObject({
      ...obj,
      isStatic: true,
    })
);
