export default class State {
  public constructor(
    public defaultSpeed,
    public level,
    public score,
    public brickSmashCount,
    public rightPressed,
    public leftPressed,
    public paddleHeight,
    public paddleWidth,
    public paddleX,
    public ballRadius,
    public speed,
    public dx,
    public dy,
    public x,
    public y,
    public brickOffsetTop,
    public brickOffsetLeft,
    public brickPadding,
    public brickHeight,
    public brickWidth,
    public lives
  ) {}

  public setPaddleX(paddleX: number) {
    this.paddleX = paddleX;
  }
}
