import Game from "./Game";
import projectile from "./images/projectile.png";

export default class Projectile {
  game: Game;
  width = 27 / 1.2;
  height = 6 / 1.2;
  // Position and Speed
  x: number;
  y: number;
  speed = 11.25;
  // LifeCycle
  markedForDelete = false;

  // Sprite
  sheet: HTMLImageElement;
  sheetOffsetX = 0;
  staggerFrames = 2;
  constructor(game: Game, x: number, y: number) {
    this.game = game;
    this.x = x - this.speed;
    this.y = y;
    this.sheet = new Image();
    this.sheet.src = projectile;
  }
  update() {
    this.animateSprite();
    this.x += this.speed;
    if (this.x > this.game.width) this.markedForDelete = true;
  }
  draw(ctx: CanvasRenderingContext2D) {
    ctx.drawImage(
      this.sheet,
      27 * this.sheetOffsetX,
      0,
      27,
      6,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }
  animateSprite() {
    this.staggerFrames--;
    if (this.staggerFrames < 0) {
      this.staggerFrames = 2;
      this.sheetOffsetX = this.sheetOffsetX ? 0 : 1;
    }
  }
}
