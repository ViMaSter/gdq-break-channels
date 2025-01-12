import Background from "./Background";
import { Enemy, Flipper, Garun } from "./Enemy";
import { Explosion, PlayerExplosion } from "./Explosion";
import InputHandler from "./InputHandler";
import Player from "./Player";
import Projectile from "./Projectile";
import UI from "./UI";

export type Keys = {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
  shoot: boolean;
};

export default class Game {
  // Meta variables
  width: number;
  height: number;
  ui: UI;
  score = 0;

  // Variables for Player and input handling
  player: Player;
  input: InputHandler;
  keys: Keys = {
    up: false,
    down: false,
    left: false,
    right: false,
    shoot: false,
  };
  // Variables for enemies
  enemies: Enemy[] = [];
  explosions: Explosion[] = [];

  // Game States
  isMoving = true;
  timeoutSignal = 0;

  // Background Layers Handling
  speed = 0.75;
  bg: Background;

  // Vertical position of last enemy (to prevent spawning enemies too close to each other)
  lastEnemyY: number;
  // true, if the last enemy was a flipper
  nextEnemyFlipper: boolean;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.player = new Player(this);
    this.input = new InputHandler(this);
    this.ui = new UI(this);
    this.bg = new Background(this);
    this.lastEnemyY = 0;
    this.nextEnemyFlipper = false;
  }
  update() {
    if (this.isMoving) {
      this.bg.update();
      this.player.update();
      this.enemies.forEach((enemy) => {
        enemy.update();
        // Check collision of enemy with player
        if (this.checkCollision(this.player, enemy)) {
          this.isMoving = false;
          this.explosions.push(
            new PlayerExplosion(this, this.player.x - 15, this.player.y - 4)
          );

          enemy.markedForDeletion = true;
          this.explosions.push(new Explosion(this, enemy.x, enemy.y));
        }
        // Check collision of enemy with projectiles
        this.player.projectiles.forEach((projectile) => {
          if (this.checkCollision(projectile, enemy)) {
            projectile.markedForDelete = true;
            this.score += enemy.score;
            enemy.markedForDeletion = true;
            this.explosions.push(new Explosion(this, enemy.x, enemy.y));
          }
        });
        // Check collision between projectiles from options and enemies
        this.player.options.length &&
          this.player.options.forEach((option) =>
            option.projectiles.forEach((projectile) => {
              if (this.checkCollision(projectile, enemy)) {
                projectile.markedForDelete = true;
                this.score += enemy.score;
                enemy.markedForDeletion = true;
                this.explosions.push(new Explosion(this, enemy.x, enemy.y));
              }
            })
          );
      });
      this.enemies = this.enemies.filter((enemy) => !enemy.markedForDeletion);
    } else {
      if (!this.timeoutSignal)
        this.timeoutSignal = setTimeout(() => {
          this.bg.reset();
          this.player.reset();
          this.enemies = [];
          this.player.projectiles = [];
          this.explosions = [];
          this.timeoutSignal = 0;
          this.isMoving = true;
        }, 3000);
    }
    this.explosions.filter((explosion) => !explosion.markedForDeletion);
    this.explosions.forEach((explosion) => explosion.update());
  }
  draw(ctx: CanvasRenderingContext2D) {
    this.bg.draw(ctx);
    this.player.draw(ctx);
    this.ui.draw(ctx);
    this.enemies.forEach((enemy) => {
      enemy.draw(ctx);
    });
    this.explosions.forEach((explosion) => {
      explosion.draw(ctx);
    });
  }
  addEnemy() {
    let newEnemyY = Math.floor(Math.random() * (this.height - 50 - 27));
    while (
      newEnemyY < 50 ||
      newEnemyY > this.height - 50 ||
      Math.abs(this.lastEnemyY - newEnemyY) < 50
    ) {
      newEnemyY = Math.floor(Math.random() * this.height);
    }

    this.nextEnemyFlipper = !this.nextEnemyFlipper;
    if (this.nextEnemyFlipper) {
      this.enemies.push(new Flipper(this, newEnemyY));
      return;
    }
    
    this.enemies.push(new Garun(this, newEnemyY));
  }
  checkCollision(
    rect1: Player | Enemy | Projectile,
    rect2: Player | Enemy | Projectile
  ) {
    return (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y
    );
  }
}
