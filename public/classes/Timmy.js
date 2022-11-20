import Player from "../Player";
import Texture from "../Texture";
export default class Timmy extends Player {
  constructor(props) {
    super(props);
    this.texture = new Texture("timmy.png");
  }
  size = [100, 150];
}