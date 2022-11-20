import Player from "../Player";
import Texture from "../Texture";
export default class Moller extends Player {
  constructor(props) {
    super(props);
    this.texture = new Texture("moller.png");
  }
  size = [50, 100];
}
