import State from "./State";

export default class Paddle {
  private context: CanvasRenderingContext2D;
  public constructor(
    private readonly state: State,
    private readonly canvas: HTMLCanvasElement
  ) {
    this.context = canvas.getContext("2d") as CanvasRenderingContext2D;
  }

  public draw(): void {
    this.context.beginPath();
    this.context.rect(
      this.state.paddleX,
      this.canvas.height - this.state.paddleHeight,
      this.state.paddleWidth,
      this.state.paddleHeight
    );
    this.context.fillStyle = "#0095DD";
    this.context.fill();
    this.context.closePath();
  }
}
