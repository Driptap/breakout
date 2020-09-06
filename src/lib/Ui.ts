import State from "./State";
import Levels from "./Levels";

export default class Ui {
  private readonly context: CanvasRenderingContext2D;

  public constructor(
    private readonly state: State,
    private readonly canvas: HTMLCanvasElement,
    private readonly levels: Levels
  ) {
    this.context = canvas.getContext("2d") as CanvasRenderingContext2D;
  }

  public drawLives() {
    this.context.font = "16px Arial";
    this.context.fillStyle = "#0095DD";
    this.context.fillText(
      "Lives: " + this.state.lives,
      this.canvas.width - 65,
      20
    );
  }

  public drawScore() {
    this.context.font = "16px Arial";
    this.context.fillStyle = "#0095DD";
    this.context.fillText(
      "Score: " + this.state.score,
      this.canvas.width - 150,
      20
    );
  }

  public drawLevel() {
    this.context.font = "16px Arial";
    this.context.fillStyle = "#0095DD";
    this.context.fillText(
      "Level: " + this.levels.currentNumber,
      this.canvas.width - 230,
      20
    );
  }

  public startButtonRect = {
    x: this.canvas.width / 2 - 100,
    y: this.canvas.height / 2 - 50,
    width: 200,
    height: 100,
  };

  public drawStartButton() {
    this.context.beginPath();
    const { x, y, width, height } = this.startButtonRect;
    this.context.rect(x, y, width, height);
    this.context.fillStyle = "#0095DD";
    this.context.fill();
    this.context.font = "40pt Arial";
    this.context.fillStyle = "#ffffff";
    this.context.fillText(
      "Start",
      this.canvas.width / 2 - 60,
      this.canvas.height / 2 + 20
    );
    this.context.textAlign = "center";
    this.context.textBaseline = "middle";
  }

  public drawTitle() {
    if (!this.context) {
      return;
    }
    this.context.font = "100px Arial";
    this.context.fillStyle = "#0095DD";
    this.context.fillText(
      "BREAK OUT!",
      this.canvas.width / 3.7,
      this.canvas.height / 4
    );
    this.context.textAlign = "center";
    this.context.textBaseline = "middle";
  }

  public drawGameOver() {
    this.context.font = "100px Arial";
    this.context.fillStyle = "#0095DD";
    this.context.fillText(
      "GAME OVER!",
      this.canvas.width / 3.7,
      this.canvas.height / 4
    );
    this.context.textAlign = "center";
    this.context.textBaseline = "middle";
  }

  public drawLevelStart() {
    this.context.font = "100px Arial";
    this.context.fillStyle = "#0095DD";
    this.context.fillText(
      "Level: " + this.levels.currentNumber,
      this.canvas.width / 3.7,
      this.canvas.height / 4
    );
    this.context.textAlign = "center";
    this.context.textBaseline = "middle";
  }

  public drawYouWin() {
    if (!this.context) {
      return;
    }
    this.context.font = "100px Arial";
    this.context.fillStyle = "#0095DD";
    this.context.fillText(
      "YOU WIN!, You scored: " + this.state.score * this.state.lives,
      this.canvas.width / 3.7,
      this.canvas.height / 4
    );
    this.context.textAlign = "center";
    this.context.textBaseline = "middle";
  }

  public drawLevelUp() {
    if (!this.context) {
      return;
    }
    this.context.font = "100px Arial";
    this.context.fillStyle = "#0095DD";
    this.context.fillText(
      "LEVEL UP!",
      this.canvas.width / 3.7,
      this.canvas.height / 4
    );
    this.context.textAlign = "center";
    this.context.textBaseline = "middle";
  }

  public drawLostALife() {
    if (!this.context) {
      return;
    }
    this.context.font = "100px Arial";
    this.context.fillStyle = "#0095DD";
    this.context.fillText(
      "LOST A LIFE!",
      this.canvas.width / 3.7,
      this.canvas.height / 4
    );
    this.context.textAlign = "center";
    this.context.textBaseline = "middle";
  }
}
