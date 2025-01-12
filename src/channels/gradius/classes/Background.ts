import Game from "./Game";
import Layer from "./Layer";
import layer1 from './images/layer1.png';
import layer2 from './images/layer2.png';
import layer3 from './images/layer3.png';

export default class Background {
  game: Game;
  layers: Layer[];
  constructor(game: Game) {
    this.game = game;
    this.layers = [
      new Layer(this.game, layer1, 0.2, 0.4),
      new Layer(this.game, layer2, 0.8, 0.6),
      new Layer(this.game, layer3, 2.5, 1),
    ];
  }
  update() {
    this.layers.forEach((layer) => layer.update());
  }
  draw(ctx: CanvasRenderingContext2D) {
    this.layers.forEach((layer) => layer.draw(ctx));
  }
  reset() {
    this.layers.forEach((layer) => layer.reset());
  }
}
