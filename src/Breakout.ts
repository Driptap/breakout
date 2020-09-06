import Sound from "./lib/Sound";
import Levels from "./lib/Levels";
import State from "./lib/State";
import DomListeners from "./lib/DomListeners";
import Modifiers from "./lib/Modifiers";
import Bricks from "./lib/Bricks";
import Ui from "./lib/Ui";
import Ball from "./lib/Ball";
import Paddle from "./lib/Paddle";
import { DEFAULT_SPEED } from "./lib/constants";

import {
  getRandomColor,
  Position,
  Rect,
  isInside,
  getMousePos,
} from "./lib/utils";

export default class Breakout {
  private context: CanvasRenderingContext2D;
  private sound: Sound;
  private domListeners: DomListeners;
  private modifiers: Modifiers;
  private bricks?: Bricks;
  private gameLoopInterval: any;
  private ball: Ball;
  private paddle: Paddle;

  public constructor(
    private readonly state: State,
    private readonly ui: Ui,
    private readonly levels: Levels,
    private readonly canvas: HTMLCanvasElement
  ) {
    this.context = canvas.getContext("2d") as CanvasRenderingContext2D;
    this.sound = new Sound();
    this.domListeners = new DomListeners(state, canvas);
    this.modifiers = new Modifiers(state);
    this.ball = new Ball(this.state, this.context);
    this.paddle = new Paddle(this.state, this.canvas);
  }

  public start() {
    this.bricks = new Bricks(
      this.state,
      this.levels,
      this.modifiers,
      this.sound,
      this.context
    );
    this.state.brickWidth =
      (this.canvas.width - this.state.brickOffsetLeft * 2) /
        this.levels.current.brickColumnCount -
      this.state.brickPadding;

    if (this.levels.complete) {
      this.ui.drawYouWin();
      this.ui.drawStartButton();
      return;
    }

    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.centerBallAndPaddle();
    this.ui.drawLevelStart();
    setTimeout(() => {
      this.gameLoopInterval = setInterval(this.loop, 10);
    }, 1000);
  }

  private loop = (): void => {
    if (!this.bricks) {
      throw new Error("Bricks have not been generated!");
    }
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.paddle.draw();
    this.ball.draw();
    this.bricks.draw();

    this.ui.drawLives();
    this.ui.drawScore();
    this.ui.drawLevel();

    this.bricks.detectCollisions();

    if (this.smashedBricksCheck()) {
      this.levelUp();
    }

    // Move paddle
    if (this.state.rightPressed) {
      this.state.paddleX += 7;
      if (this.state.paddleX + this.state.paddleWidth > this.canvas.width) {
        this.state.paddleX = this.canvas.width - this.state.paddleWidth;
      }
    }

    if (this.state.leftPressed) {
      this.state.paddleX -= 7;
      if (this.state.paddleX < 0) {
        this.state.paddleX = 0;
      }
    }

    if (this.bottomEdgeCollisionCheck()) {
      if (this.paddleCollisionCheck()) {
        this.state.dy = -this.state.dy;
      } else {
        this.looseALife();
      }
    }

    // bottom and top edge collision
    if (this.topEdgeCollisionCheck()) {
      this.state.dy = -this.state.dy;
    }

    // left and right edge collision
    if (this.sideEdgeCollisionCheck()) {
      this.state.dx = -this.state.dx;
    }

    this.state.y += this.state.dy;
    this.state.x += this.state.dx;
  };

  private smashedBricksCheck = () =>
    this.state.brickSmashCount ===
    this.levels.current.brickColumnCount * this.levels.current.brickRowCount;

  private paddleCollisionCheck = () =>
    this.state.x > this.state.paddleX + 2 &&
    this.state.x < this.state.paddleX + this.state.paddleWidth + 2;

  private bottomEdgeCollisionCheck = () =>
    this.state.y + this.state.dy > this.canvas.height - this.state.ballRadius;

  private topEdgeCollisionCheck = () =>
    this.state.y + this.state.dy < this.state.ballRadius;

  private sideEdgeCollisionCheck = () =>
    this.state.x + this.state.dx < this.state.ballRadius ||
    this.state.x + this.state.dx > this.canvas.width - this.state.ballRadius;

  private levelUp() {
    clearInterval(this.gameLoopInterval);
    this.levels.completedCurrent();
    this.state.lives += 1;
    this.state.brickWidth =
      (this.canvas.width - this.state.brickOffsetLeft * 2) /
        this.levels.current.brickColumnCount -
      this.state.brickPadding;

    this.centerBallAndPaddle();
    this.state.brickSmashCount = 0;
    this.ui.drawLevelUp();
    setTimeout(() => this.start(), 1000);
  }

  private looseALife() {
    if (this.state.lives !== 0) {
      clearInterval(this.gameLoopInterval);
      this.state.lives = this.state.lives - 1;
      this.sound.looseALife();
      this.ui.drawLostALife();
      this.centerBallAndPaddle();
      setTimeout(() => {
        this.gameLoopInterval = setInterval(this.loop, 10);
      }, 1000);
    } else {
      this.gameOver();
      this.ui.drawGameOver();
    }
  }

  public centerBallAndPaddle() {
    this.state.paddleX = (this.canvas.width - this.state.paddleWidth) / 2;
    this.state.x = this.canvas.width / 2;
    this.state.y = this.canvas.height - 50;
    this.state.dx = -DEFAULT_SPEED;
    this.state.dy = -DEFAULT_SPEED;
    this.state.setBallSpeed(DEFAULT_SPEED);
  }

  private gameOver(): void {
    this.gameLoopInterval && clearInterval(this.gameLoopInterval);
    window.dispatchEvent(new CustomEvent("Breakout:stopped"));
  }
}
