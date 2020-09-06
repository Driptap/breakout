import State from "./State";
import Levels from "./Levels";
import Modifiers from "./Modifiers";
import Sound from "./Sound";

import { getRandomColor } from "./utils";

interface Brick {
  x: number;
  y: number;
  status: number;
  colour: string;
  modifier?: number;
}

export default class Bricks {
  private bricks: Array<Brick[]> = [];

  constructor(
    private readonly state: State,
    private readonly levels: Levels,
    private readonly modifiers: Modifiers,
    private readonly sound: Sound
  ) {
    const { brickRowCount, brickColumnCount } = levels.current;
    for (var c = 0; c < brickColumnCount; c++) {
      this.bricks[c] = [];

      for (var r = 0; r < brickRowCount; r++) {
        this.bricks[c][r] = { x: 0, y: 0, status: 1, colour: getRandomColor() };
        if (Math.random() > 0.8) {
          this.bricks[c][r].modifier = modifiers.random();
        }
      }
    }
  }

  public draw(ctx: CanvasRenderingContext2D) {
    const { brickRowCount, brickColumnCount } = this.levels.current;
    for (let c = 0; c < brickColumnCount; c++) {
      for (let r = 0; r < brickRowCount; r++) {
        if (this.bricks[c][r].status == 1) {
          const brickX =
            c * (this.state.brickWidth + this.state.brickPadding) +
            this.state.brickOffsetLeft;
          const brickY =
            r * (this.state.brickHeight + this.state.brickPadding) +
            this.state.brickOffsetTop;

          this.bricks[c][r].x = brickX;
          this.bricks[c][r].y = brickY;

          ctx.fillStyle = this.bricks[c][r].colour;
          ctx.beginPath();
          ctx.rect(
            brickX,
            brickY,
            this.state.brickWidth,
            this.state.brickHeight
          );
          ctx.fill();

          const modifier = this.bricks[c][r].modifier;
          if (modifier !== undefined) {
            ctx.drawImage(
              this.modifiers.icon(modifier),
              brickX + 5,
              brickY + 5,
              50,
              this.state.brickHeight - 10
            );
          }
          ctx.closePath();
        }
      }
    }
  }

  public detectCollisions() {
    const { brickColumnCount, brickRowCount } = this.levels.current;
    for (let c = 0; c < brickColumnCount; c++) {
      for (let r = 0; r < brickRowCount; r++) {
        const brick = this.bricks[c][r];
        if (
          brick.status === 1 &&
          this.state.x > brick.x &&
          this.state.x < brick.x + this.state.brickWidth &&
          this.state.y > brick.y &&
          this.state.y < brick.y + this.state.brickHeight
        ) {
          this.state.dy = -this.state.dy;
          brick.status = 0;
          this.state.score++;
          this.state.brickSmashCount++;
          this.state.setBallSpeed(this.state.speed + 0.2);
          if (brick.modifier !== undefined) {
            this.modifiers.activate(brick.modifier);
            this.sound.powerUp();
          } else {
            this.sound.brickSmash();
          }
        }
      }
    }
  }
}
