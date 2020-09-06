import State from "./State";

export default class Ball {
  public constructor(
    private readonly state: State,
    private readonly context: CanvasRenderingContext2D
  ) {}

  public draw(): void {
    this.context.beginPath();
    this.context.arc(
      this.state.x,
      this.state.y,
      this.state.ballRadius,
      0,
      Math.PI * 2
    );
    this.context.fillStyle = "#0095DD";
    this.context.fill();
    this.context.closePath();
  }
}
