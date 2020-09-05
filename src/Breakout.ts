import Sound from "./lib/Sound";
import Levels from "./lib/Levels";
import State from "./lib/State";
import DomListeners from "./lib/DomListeners";
import Modifiers from "./lib/Modifiers";
import Bricks from "./lib/Bricks";
import Ui from "./lib/Ui";

import {
  getRandomColor,
  Position,
  Rect,
  isInside,
  getMousePos,
} from "./lib/utils";

const DEFAULT_SPEED = 4;

function drawBall(ctx: CanvasRenderingContext2D, state: State) {
  if (!ctx) {
    return;
  }

  ctx.beginPath();
  ctx.arc(state.x, state.y, state.ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

function drawPaddle(
  ctx: CanvasRenderingContext2D,
  state: State,
  canvas: HTMLCanvasElement
) {
  if (!ctx) {
    return;
  }

  ctx.beginPath();
  ctx.rect(
    state.paddleX,
    canvas.height - state.paddleHeight,
    state.paddleWidth,
    state.paddleHeight
  );
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

export default class Breakout {
  private context: CanvasRenderingContext2D;
  private sound: Sound;
  private domListeners: DomListeners;
  private modifiers: Modifiers;
  private bricks: Bricks;

  private gameLoopInterval: any;

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
    this.bricks = new Bricks(state, this.levels, this.modifiers, this.sound);
  }

  public start() {
    this.state.brickWidth =
      (this.canvas.width - this.state.brickOffsetLeft * 2) /
        this.levels.current.brickColumnCount -
      this.state.brickPadding;
    this.state.score = 0;
    this.state.level = this.levels.currentNumber;
    this.state.x = this.canvas.width / 2;
    this.state.y = this.canvas.height - 30;
    this.state.dx = this.state.speed;
    this.state.dy = -this.state.speed;
    this.state.paddleX = (this.canvas.width - this.state.paddleWidth) / 2;

    if (this.levels.complete) {
      this.ui.drawYouWin();
      this.ui.drawStartButton();
      return;
    }

    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ui.drawLevelStart();
    setTimeout(() => {
      this.gameLoopInterval = setInterval(this.loop, 10);
    }, 1000);
  }

  public stop(): void {
    this.gameLoopInterval && clearInterval(this.gameLoopInterval);
    window.dispatchEvent(new CustomEvent("Breakout:stopped"));
  }

  private loop = (): void => {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // updateSpeed();
    drawBall(this.context, this.state);
    drawPaddle(this.context, this.state, this.canvas);
    this.bricks.draw(this.context);
    this.ui.drawLives();
    this.ui.drawScore();
    this.ui.drawLevel();

    this.bricks.detectCollisions();

    if (
      this.state.brickSmashCount ===
      this.levels.current.brickColumnCount * this.levels.current.brickRowCount
    ) {
      this.levels.completedCurrent();
      this.state.brickSmashCount = 0;
      this.state.lives += 1;
      clearInterval(this.gameLoopInterval);
      this.start();
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

    // game over
    if (
      this.state.y + this.state.dy >
      this.canvas.height - this.state.ballRadius
    ) {
      if (
        this.state.x > this.state.paddleX + 2 &&
        this.state.x < this.state.paddleX + this.state.paddleWidth + 2
      ) {
        this.state.dy = -this.state.dy;
      } else {
        if (this.state.lives !== 0) {
          this.state.lives = this.state.lives - 1;
          this.state.x = this.canvas.width / 2;
          this.state.y = this.canvas.height - 30;
          this.state.speed = DEFAULT_SPEED;

          this.sound.looseALife();
          this.state.paddleX = (this.canvas.width - this.state.paddleWidth) / 2;
        } else {
          this.stop();
          this.ui.drawGameOver();
        }
      }
    }

    // bottom and top edge collision
    if (this.state.y + this.state.dy < this.state.ballRadius) {
      this.state.dy = -this.state.dy;
    }

    // left and right edge collision
    if (
      this.state.x + this.state.dx < this.state.ballRadius ||
      this.state.x + this.state.dx > this.canvas.width - this.state.ballRadius
    ) {
      this.state.dx = -this.state.dx;
    }

    this.state.y += this.state.dy;
    this.state.x += this.state.dx;
  };
}
