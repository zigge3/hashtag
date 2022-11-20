import Player from "../Player";
import Texture from "../Texture";
export default class Timmy extends Player {
  constructor(props) {
    super(props);
    this.texture = new Texture("timmy.png");
    this.textureName = "timmy.png";
  }
  size = [100, 150];
  acceleration = [0.2, 7];
}
