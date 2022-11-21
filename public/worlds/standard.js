import WorldObject from "../WorldObject";
export default [
  new WorldObject({
    id: Math.random() * 100,
    position: [0, 1000],
    size: [1200, 100],
    isStatic: true,
  }),
  new WorldObject({
    id: Math.random() * 100,
    position: [0, 0],
    size: [10, 10],
    isStatic: true,
  }),
  new WorldObject({
    id: Math.random() * 100,
    position: [-50, 0],
    size: [100, 1000],
    isStatic: true,
  }),
  new WorldObject({
    id: Math.random() * 100,
    position: [1150, 0],
    size: [100, 1000],
    isStatic: true,
  }),
  new WorldObject({
    id: Math.random() * 100,
    position: [500, 500],
    textureName: "dick.png",
    size: [100, 100],
    isStatic: true,
  }),
];
