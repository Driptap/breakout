import React, { useRef, useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";

interface Position {
  x: number;
  y: number;
}

interface Rect extends Position {
  height: number;
  width: number;
}

function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function isInside(pos: Position, rect: Rect) {
  return (
    pos.x > rect.x &&
    pos.x < rect.x + rect.width &&
    pos.y < rect.y + rect.height &&
    pos.y > rect.y
  );
}

function startGame(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d");
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

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

  let score = 0;
  let rightPressed = false;
  let leftPressed = false;
  const paddleHeight = 10;
  const paddleWidth = 125;
  let paddleX = (canvas.width - paddleWidth) / 2;
  const ballRadius = 12;
  const speed = 4;
  let dx = speed;
  let dy = -speed;
  let x = canvas.width / 2;
  let y = canvas.height - 300;

  var brickRowCount = 4;
  var brickColumnCount = 8;
  var brickOffsetTop = 30;
  var brickOffsetLeft = 30;
  var brickPadding = 10;
  var brickWidth =
    (canvas.width - brickOffsetLeft * 2) / brickColumnCount - brickPadding;
  var brickHeight = 40;
  var lives = 3;

  var bricks: Array<Array<{
    x: number;
    y: number;
    status: number;
    colour: string;
  }>> = [];

  function drawBricks() {
    if (!ctx) {
      return;
    }

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

  function collisionDetection() {
    for (var c = 0; c < brickColumnCount; c++) {
      for (var r = 0; r < brickRowCount; r++) {
        var b = bricks[c][r];
        if (
          x > b.x &&
          x < b.x + brickWidth &&
          y > b.y &&
          y < b.y + brickHeight
        ) {
          dy = -dy;
          b.status = 0;
          score++;
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
  }

  function drawTitle() {
    if (!ctx) {
      return;
    }
    ctx.font = "100px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("BREAK IN!", canvas.width / 3.7, canvas.height / 4);
    ctx.textAlign = 'center';
  }

  function drawGameOver() {
    if (!ctx) {
      return;
    }
    ctx.font = "100px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("GAME OVER!", canvas.width / 3.7, canvas.height / 4);
    ctx.textAlign = 'center'; 
  }

  function draw() {
    if (!ctx) {
      return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBall();
    drawPaddle();
    drawBricks();
    drawLives();
    drawScore();

    collisionDetection();

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
          dx = speed;
          dy = -speed;
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
  document.addEventListener("click", startButtonClickHandler, false);

  let gameInterval: any;
  function start() {
    for (var c = 0; c < brickColumnCount; c++) {
      bricks[c] = [];
      for (var r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1, colour: getRandomColor() };
      }
    }
    score = 0;
    lives = 3;
    lives = lives - 1;
    x = canvas.width / 2;
    y = canvas.height - 30;
    dx = speed;
    dy = -speed;
    paddleX = (canvas.width - paddleWidth) / 2;
    document.removeEventListener("click", startButtonClickHandler, false);
    gameInterval = setInterval(draw, 10);
  }

  drawTitle();
  drawStartButton();
}

function App() {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    canvas.current && startGame(canvas.current);
  }, [canvas]);

  return (
    <div className="App">
      <main>
        <canvas ref={canvas} />
      </main>
    </div>
  );
}

export default App;
