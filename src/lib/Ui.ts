import State from "./State";

export default class Ui {
  private readonly context: CanvasRenderingContext2Dn;
  constructor(
    private readonly state: State,
    private readonly canvas: HTMLCanvasElement
  ) {
    this.context = canvas.getContext("2d");
  }

  drawLives() {
    this.context.font = "16px Arial";
    this.context.fillStyle = "#0095DD";
    this.context.fillText(
      "Lives: " + this.state.lives,
      this.canvas.width - 65,
      20
    );
  }

  drawScore() {
    this.context.font = "16px Arial";
    this.context.fillStyle = "#0095DD";
    this.context.fillText(
      "Score: " + this.state.score,
      this.canvas.width - 150,
      20
    );
  }

  drawLevel() {
    this.context.font = "16px Arial";
    this.context.fillStyle = "#0095DD";
    this.context.fillText(
      "Level: " + this.state.level,
      this.canvas.width - 230,
      20
    );
  }

  startButtonRect = {
    x: this.canvas.width / 2 - 100,
    y: this.canvas.height / 2 - 50,
    width: 200,
    height: 100,
  };

  drawStartButton() {
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

  drawTitle() {
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

  drawGameOver() {
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

  drawLevelStart() {
    this.context.font = "100px Arial";
    this.context.fillStyle = "#0095DD";
    this.context.fillText(
      "Level: " + this.state.level,
      this.canvas.width / 3.7,
      this.canvas.height / 4
    );
    this.context.textAlign = "center";
    this.context.textBaseline = "middle";
  }

  drawYouWin() {
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

  drawLevelUp() {
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
}
