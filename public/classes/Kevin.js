import Player from "../Player";
import Texture from "../Texture";
export default class Kevin extends Player {
  constructor(props) {
    super(props);
    this.texture = new Texture("kevin.png");
  }
  size = [50, 100];
}
