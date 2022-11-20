import Player from "../Player";
import Texture from "../Texture";
export default class Maja extends Player {
  constructor(props) {
    super(props);
    this.texture = new Texture("maja.png");
  }
  size = [50, 100];
}
