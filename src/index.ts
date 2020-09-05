import Breakout from "./Breakout";
import Ui from "./lib/Ui";
import Levels from "./lib/Levels";
import State from "./lib/State";
import { isInside, getMousePos } from "./lib/utils";

const canvas: HTMLCanvasElement = document.getElementById(
  "game-canvas"
) as HTMLCanvasElement;

if (!canvas) {
  throw new Error("No canvas element found");
}

canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

const levels = new Levels();
const state = new State(
  4, //defaultSpeed
  0, //level
  0, //score
  0, //brickSmashCount
  false, //rightPressed
  false, //leftPressed
  10, //paddleHeight
  125, //paddleWidth
  (canvas.width - 125) / 2, //paddleX
  12, //ballRadius
  4, //speed
  4, //dx
  -4, //dy
  canvas.width / 2, //x
  canvas.height - 300, //y
  30, //brickOffsetTop
  30, //brickOffsetLeft
  10, //brickPadding
  40, //brickHeight
  (canvas.width - 30 * 2) / levels.current.brickColumnCount - 10, //brickWidth
  3 //lives
);
var {
  defaultSpeed,
  level,
  score,
  brickSmashCount,
  rightPressed,
  leftPressed,
  paddleHeight,
  paddleWidth,
  paddleX,
  ballRadius,
  speed,
  dx,
  dy,
  x,
  y,
  brickOffsetTop,
  brickOffsetLeft,
  brickPadding,
  brickHeight,
  brickWidth,
  lives,
} = state;
const ui = new Ui(state, canvas);

ui.drawTitle();
ui.drawStartButton();

const breakout = new Breakout(state, ui, levels, canvas);

function startButtonClickHandler(e: MouseEvent) {
  var mousePos = getMousePos(e, canvas);

  if (isInside(mousePos, ui.startButtonRect)) {
    breakout.start();
    document.removeEventListener("click", startButtonClickHandler, false);
  }
}

document.addEventListener("click", startButtonClickHandler, false);

window.addEventListener("Breakout:stopped", () => {
  ui.drawStartButton();
  document.addEventListener("click", startButtonClickHandler, false);
});
