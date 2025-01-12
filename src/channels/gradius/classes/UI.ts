import Game from "./Game";
import fontDigits from "./images/fontDigits.png";
import fontLetters from "./images/fontLetters.png";

export default class UI {
  digitSheet: HTMLImageElement;
  letterSheet: HTMLImageElement;
  game: Game;
  fontSize = 25;
  fontFamily = "Press Start 2P";
  color = "white";

  characterWidth = 32;
  characterHeight = 32;

  constructor(game: Game) {
    this.game = game;
    this.digitSheet = new Image();
    this.digitSheet.src = fontDigits;
    this.letterSheet = new Image();
    this.letterSheet.src = fontLetters;
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.renderScore(ctx);
  }

  renderScore(ctx: CanvasRenderingContext2D) {
    const scoreString = String(this.game.score).padStart(7, "0");
    const startX = 0;
    const startY = 0;

    for (let i = 0; i < scoreString.length; i++) {
      const digit = parseInt(scoreString[i], 10);
      this.drawDigit(
        ctx,
        digit,
        startX + i * this.characterWidth,
        startY - this.characterHeight
      );
    }
  }

  drawDigit(
    ctx: CanvasRenderingContext2D,
    digit: number,
    x: number,
    y: number
  ) {
    ctx.drawImage(
      this.digitSheet,
      digit * (this.characterWidth + 2),
      0,
      this.characterWidth + 2,
      this.characterHeight,
      x,
      y,
      this.characterWidth + 2,
      this.characterHeight
    );
  }
  drawCharacter(
    ctx: CanvasRenderingContext2D,
    letterCode: number,
    x: number,
    y: number
  ) {
    ctx.drawImage(
      this.letterSheet,
      (letterCode - 65) * (this.characterWidth + 2),
      0,
      this.characterWidth + 2,
      this.characterHeight,
      x,
      y,
      this.characterWidth + 2,
      this.characterHeight
    );
  }
}
