import Player from "../Player";
import Texture from "../Texture";
export default class Johan extends Player {
  constructor(props) {
    super(props);
    this.texture = new Texture("johan.png");
    this.textureName = "johan.png";
  }
  size = [80, 100];
}
