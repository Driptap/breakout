import Sound from "./lib/Sound";
import Levels from "./lib/Levels";

import { getRandomColor, Position, Rect, isInside } from "./lib/utils";

export function startGame(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d");

  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  let sound: Sound;
  let levels: Levels;

  if (!ctx) {
    return;
  }

  function keyDownHandler(e: KeyboardEvent) {
    if (e.key == "Right" || e.key === "ArrowRight") {
      rightPressed = true;
    } else if (e.key == "Left" || e.key === "ArrowLeft") {
      leftPressed = true;
    }
  }

  function keyUpHandler(e: KeyboardEvent) {
    if (e.key == "Right" || e.key === "ArrowRight") {
      rightPressed = false;
    } else if (e.key == "Left" || e.key === "ArrowLeft") {
      leftPressed = false;
    }
  }

  function mouseMoveHandler(e: MouseEvent) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
      paddleX = relativeX - paddleWidth / 2;
    }
  }

  function getMousePos(e: MouseEvent) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }

  function startButtonClickHandler(e: MouseEvent) {
    var mousePos = getMousePos(e);

    if (isInside(mousePos, startButtonRect)) {
      start();
    }
  }

  const defaultSpeed = 4;
  let level = 0;
  let score = 0;
  let brickSmashCount = 0;
  let rightPressed = false;
  let leftPressed = false;
  const paddleHeight = 10;
  let paddleWidth = 125;
  let paddleX = (canvas.width - paddleWidth) / 2;
  let ballRadius = 12;
  let speed = defaultSpeed;
  let dx = speed;
  let dy = -speed;
  let x = canvas.width / 2;
  let y = canvas.height - 300;

  var brickOffsetTop = 30;
  var brickOffsetLeft = 30;
  var brickPadding = 10;
  const getBrickWidth = (brickColumnCount: number): number =>
    (canvas.width - brickOffsetLeft * 2) / brickColumnCount - brickPadding;
  var brickHeight = 40;
  var lives = 3;

  const oneUpIcon = document.getElementById("icon-one-up") as HTMLImageElement;

  interface Modifier {
    icon: HTMLImageElement;
    function: () => void;
  }

  const bigPaddle = {
    icon: oneUpIcon,
    function: () => {
      const originalPaddleWidth = paddleWidth;
      paddleWidth = paddleWidth + 100;
      score += 10;
      setTimeout(() => {
        paddleWidth = originalPaddleWidth;
      }, 5000);
    },
  };

  const speedBall = {
    icon: oneUpIcon,
    function: () => {
      const originalSpeed = speed;
      speed = speed + 3;
      updateSpeed();
      score += 10;
      setTimeout(() => {
        speed = originalSpeed;
        updateSpeed();
      }, 5000);
    },
  };

  function updateSpeed() {
    dx = speed;
    dy = -speed;
  }

  const modifiers: Modifier[] = [bigPaddle, speedBall];
  interface Brick {
    x: number;
    y: number;
    status: number;
    colour: string;
    modifier?: Modifier;
  }
  type Bricks = Array<Brick[]>;
  var bricks: Bricks = [];

  function drawBricks(level: Level) {
    if (!ctx) {
      return;
    }

    const { brickRowCount, brickColumnCount } = level;
    const brickWidth = getBrickWidth(brickColumnCount);
    for (var c = 0; c < brickColumnCount; c++) {
      for (var r = 0; r < brickRowCount; r++) {
        if (bricks[c][r].status == 1) {
          var brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
          var brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
          bricks[c][r].x = brickX;
          bricks[c][r].y = brickY;
          ctx.fillStyle = bricks[c][r].colour;
          ctx.beginPath();
          ctx.rect(brickX, brickY, brickWidth, brickHeight);
          ctx.fill();
          if (bricks[c][r].modifier !== undefined) {
            ctx.drawImage(
              bricks[c][r].modifier!.icon,
              brickX + 5,
              brickY + 5,
              50,
              brickHeight - 10
            );
          }
          ctx.closePath();
        }
      }
    }
  }

  function drawBall() {
    if (!ctx) {
      return;
    }

    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
  }

  function drawPaddle() {
    if (!ctx) {
      return;
    }

    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
  }

  function drawLives() {
    if (!ctx) {
      return;
    }
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
  }

  function drawScore() {
    if (!ctx) {
      return;
    }
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: " + score, canvas.width - 150, 20);
  }

  function drawLevel() {
    if (!ctx) {
      return;
    }
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Level: " + level, canvas.width - 230, 20);
  }

  function collisionDetection(level: Level) {
    const { brickColumnCount, brickRowCount } = level;
    const brickWidth = getBrickWidth(brickColumnCount);
    for (var c = 0; c < brickColumnCount; c++) {
      for (var r = 0; r < brickRowCount; r++) {
        var b = bricks[c][r];
        if (
          b.status === 1 &&
          x > b.x &&
          x < b.x + brickWidth &&
          y > b.y &&
          y < b.y + brickHeight
        ) {
          dy = -dy;
          b.status = 0;
          score++;
          brickSmashCount++;
          speed += 0.2;
          updateSpeed();
          if (b.modifier) {
            b.modifier.function();
            sound.powerUp();
          } else {
            sound.brickSmash();
          }
        }
      }
    }
  }

  const startButtonRect: Rect = {
    x: canvas.width / 2 - 100,
    y: canvas.height / 2 - 50,
    width: 200,
    height: 100,
  };
  function drawStartButton() {
    if (!ctx) {
      return;
    }
    ctx.beginPath();
    const { x, y, width, height } = startButtonRect;
    ctx.rect(x, y, width, height);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.font = "40pt Arial";
    ctx.fillStyle = "#ffffff";
    ctx.fillText("Start", canvas.width / 2 - 60, canvas.height / 2 + 20);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    document.addEventListener("click", startButtonClickHandler, false);
  }

  function drawTitle() {
    if (!ctx) {
      return;
    }
    ctx.font = "100px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("BREAK OUT!", canvas.width / 3.7, canvas.height / 4);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
  }

  function drawGameOver() {
    if (!ctx) {
      return;
    }
    ctx.font = "100px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("GAME OVER!", canvas.width / 3.7, canvas.height / 4);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
  }

  function drawLevelStart() {
    if (!ctx) {
      return;
    }
    ctx.font = "100px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Level: " + level, canvas.width / 3.7, canvas.height / 4);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
  }

  function drawYouWin() {
    if (!ctx) {
      return;
    }
    ctx.font = "100px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText(
      "YOU WIN!, You scored: " + score * lives,
      canvas.width / 3.7,
      canvas.height / 4
    );
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
  }

  function draw(level: Level) {
    if (!ctx) {
      return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBall();
    drawPaddle();
    drawBricks(level);
    drawLives();
    drawScore();
    drawLevel();

    collisionDetection(level);

    if (brickSmashCount === level.brickColumnCount * level.brickRowCount) {
      levels.completedCurrent();
      brickSmashCount = 0;
      lives += 1;
      clearInterval(gameInterval);
      start();
    }

    // Move paddle
    if (rightPressed) {
      paddleX += 7;
      if (paddleX + paddleWidth > canvas.width) {
        paddleX = canvas.width - paddleWidth;
      }
    }

    if (leftPressed) {
      paddleX -= 7;
      if (paddleX < 0) {
        paddleX = 0;
      }
    }

    // game over
    if (y + dy > canvas.height - ballRadius) {
      if (x > paddleX + 2 && x < paddleX + paddleWidth + 2) {
        dy = -dy;
      } else {
        if (lives !== 0) {
          lives = lives - 1;
          x = canvas.width / 2;
          y = canvas.height - 30;
          speed = defaultSpeed;
          updateSpeed();
          sound.looseALife();
          paddleX = (canvas.width - paddleWidth) / 2;
        } else {
          gameInterval && clearInterval(gameInterval);
          document.addEventListener("click", startButtonClickHandler, false);
          drawStartButton();
          drawGameOver();
        }
      }
    }

    // bottom and top edge collision
    if (y + dy < ballRadius) {
      dy = -dy;
    }

    // left and right edge collision
    if (x + dx < ballRadius || x + dx > canvas.width - ballRadius) {
      dx = -dx;
    }

    y += dy;
    x += dx;
  }

  document.addEventListener("keydown", keyDownHandler, false);
  document.addEventListener("keyup", keyUpHandler, false);
  document.addEventListener("mousemove", mouseMoveHandler, false);

  let gameInterval: any;
  function start() {
    if (levels.complete) {
      drawYouWin();
      drawStartButton();
      return;
    }

    const { brickRowCount, brickColumnCount } = levels.current;
    for (var c = 0; c < brickColumnCount; c++) {
      bricks[c] = [];

      for (var r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1, colour: getRandomColor() };
        if (Math.random() > 0.8) {
          bricks[c][r].modifier =
            modifiers[Math.floor(Math.random() * modifiers.length)];
        }
      }
    }
    score = 0;
    level = levels.currentNumber;
    x = canvas.width / 2;
    y = canvas.height - 30;
    dx = speed;
    dy = -speed;
    paddleX = (canvas.width - paddleWidth) / 2;
    document.removeEventListener("click", startButtonClickHandler, false);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawLevelStart();
    setTimeout(() => {
      gameInterval = setInterval(() => draw(levels.current), 10);
    }, 1000);
  }

  sound = new Sound();
  levels = new Levels();

  drawTitle();
  drawStartButton();
}
