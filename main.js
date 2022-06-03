const cvs = document.getElementById("breakOut");
const ctx = cvs.getContext("2d");
const bg = new Image();
bg.src = "./backgroud.jpg";

let leftArrow = false;
let rightArrow = false;
let life = 3;
let score = 0;
let scoreUp = 1;
let level = 1;
let maxLevel = 5;
let gameStart = false;
let gameLose = false;

document.addEventListener("keydown", function (event) {
  if (event.key === "ArrowLeft") {
    leftArrow = true;
  } else if (event.key === "ArrowRight") {
    rightArrow = true;
  }
});

document.addEventListener("keyup", function (event) {
  if (event.key === "ArrowLeft") {
    leftArrow = false;
  } else if (event.key === "ArrowRight") {
    rightArrow = false;
  }
});

ctx.lineWidth = 3;
const paddleWidth = 100;
const paddleHeight = 20;
const paddle = {
  x: cvs.width / 2 - paddleWidth / 2,
  y: cvs.height - paddleHeight,
  width: paddleWidth,
  height: paddleHeight,
  dx: 5,
};

function drawPaddle() {
  ctx.fillStyle = "#000";
  ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);

  ctx.strokeStyle = "#ecf0f1";
  ctx.strokeRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

  
function movePaddle() {
  if (rightArrow && paddle.x + paddle.width < cvs.width) {
    paddle.x += paddle.dx;
  } else if (leftArrow && paddle.x > 0) {
    paddle.x -= paddle.dx;
  }
}
const ballRadius = 9;
const ball = {
  x: cvs.width / 2,
  y: paddle.y - ballRadius,
  radius: ballRadius,
  speed: 4,
  dx: 3 * (Math.random() * 2 - 1),
  dy: -3,
  dycons: 3,
};

function drawBall() {
  ctx.beginPath();

  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = "#3498db";
  ctx.fill();

  ctx.strokeStyle = "#16a085";
  ctx.stroke();

  ctx.closePath();
}

function moveBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;
}

function ballWallCollision() {
  if (ball.x + ball.radius > cvs.width || ball.x - ball.radius < 0) {
    ball.dx = -ball.dx;
  }
  if (ball.y - ball.radius < 0) {
    ball.dy = -ball.dy;
  }
  if (ball.y + ball.radius > cvs.height) {
    life--;
    resetBall();
  }
}

function resetBall() {
  ball.x = cvs.width / 2;
  ball.y = paddle.y - ballRadius;
  ball.dx = 3 * (Math.random() * 2 - 1);
  ball.dy = -3;
}

function ballPaddleCollision() {
  if (
    ball.x < paddle.x + paddle.width &&
    ball.x > paddle.x &&
    ball.y < paddle.y + paddle.height &&
    ball.y > paddle.y
  ) {
    let collidePoint = ball.x - (paddle.x + paddle.width / 2);

    collidePoint = collidePoint / (paddle.width / 2);

    let angle = (collidePoint * Math.PI) / 3;

    ball.dx = ball.speed * Math.sin(angle);
    ball.dy = -ball.speed * Math.cos(angle);
  }
}

const brick = {
  row: 1,
  column: 6,
  width: 45,
  height: 15,
  offSetLeft: 20,
  offSetTop: 20,
  marginTop: 40,
  fillColor: "#ecf0f1",
  strokeColor: "#95a5a6",
};

let bricks = [];

function createBricks() {
  for (let r = 0; r < brick.row; r++) {
    bricks[r] = [];
    for (let c = 0; c < brick.column; c++) {
      bricks[r][c] = {
        x: c * (brick.offSetLeft + brick.width) + brick.offSetLeft,
        y:
          r * (brick.offSetTop + brick.height) +
          brick.offSetTop +
          brick.marginTop,
        status: true,
      };
    }
  }
}


function drawBricks() {
  for (let r = 0; r < brick.row; r++) {
    for (let c = 0; c < brick.column; c++) {
      let b = bricks[r][c];
      if (b.status) {
        ctx.fillStyle = brick.fillColor;
        ctx.fillRect(b.x, b.y, brick.width, brick.height);

        ctx.strokeStyle = brick.strokeColor;
        ctx.strokeRect(b.x, b.y, brick.width, brick.height);
      }
    }
  }
}

function ballBrickCollision() {
  for (let r = 0; r < brick.row; r++) {
    for (let c = 0; c < brick.column; c++) {
      let b = bricks[r][c];
      if (b.status) {
        if (
          ball.x + ball.radius > b.x &&
          ball.x - ball.radius < b.x + brick.width &&
          ball.y + ball.radius > b.y &&
          ball.y - ball.radius < b.y + brick.height
        ) {
          ball.dy = -ball.dy;
          b.status = false;
          score += scoreUp;
        }
      }
    }
  }
}

function showGamePoints(text, textX, textY) {
  ctx.fillStyle = "#fff";
  ctx.font = "20px Poppins";
  ctx.fillText(text, textX, textY);
}

function gameOver() {
  if (life < 0) {
    gameLose = true;
    showGamePoints("Game Over", cvs.width / 2 - 40, cvs.height / 2);
    showGamePoints(
      "Refresh to Play Again!",
      cvs.width / 2 - 100,
      cvs.height / 2 + 30
    );
  }
}

function levelUp() {
  let isLevelDone = true;

  for (let r = 0; r < brick.row; r++) {
    for (let c = 0; c < brick.column; c++) {
      isLevelDone = isLevelDone && !bricks[r][c].status;
    }
  }

  if (isLevelDone) {
    if (level >= maxLevel) {
      gameLose = true;
      showGamePoints("YOU WIN!", cvs.width / 2 - 45, cvs.height / 2);
      return;
    }
    brick.row = level;
    createBricks();
    resetBall();
    level++;
  }
}

let k = -1;

let m = 0;

function moveBrick() {
    if(level === 2){
        ball.speed = 4.5;
        const bars = {
            x: cvs.width / 2 - paddleWidth / 2,
            y: cvs.height - 200 -paddleHeight,
            width: paddleWidth,
            height: paddleHeight,
            dx: 5,
        };
        function drawBars() {
            ctx.fillStyle = "#74b9ff";
            ctx.fillRect(bars.x, bars.y, bars.width, bars.height);
        
            ctx.strokeStyle = "#ecf0f1";
            ctx.strokeRect(bars.x, bars.y, bars.width, bars.height);
        }
        function ballBarsCollision() {
            if (
            ball.x < bars.x + bars.width &&
            ball.x > bars.x &&
            ball.y < bars.y + bars.height &&
            ball.y > bars.y
            ) {
            let collidePoint = ball.x - (bars.x + bars.width / 2);
            collidePoint = collidePoint / (bars.width / 2);
            let angle = (collidePoint * Math.PI) / 3;
            ball.dx = ball.dx;
            ball.dy = -ball.dy;
            }
        }
        drawBars();
        ballBarsCollision();
      }
    else if (level === 3) {
    ball.speed = 5;
    for (let r = 0; r < brick.row; r++) {
      for (let c = 0; c < brick.column; c++) {
        let b = bricks[r][c];
        if (b.status) {
          m += k;
          if (b.x > 500) {
            k = -2;
          } else if (b.x < -100) {
            k = 2;
          }
          b.x += k;
          if (b.y >= paddle.y - 20) {
            gameLose = true;
            showGamePoints("Game Over", cvs.width / 2 - 40, cvs.height / 2);
            showGamePoints(
              "Refresh to Play Again!",
              cvs.width / 2 - 100,
              cvs.height / 2 + 30
            );
          }
        }
      }
    }
  } else if (level === 4) {
    ball.speed = 5.5;
    for (let r = 0; r < brick.row; r++) {
      for (let c = 0; c < brick.column; c++) {
        let b = bricks[r][c];
        if (b.status) {
          b.y += 0.1;
          if (b.y >= paddle.y - 20) {
            gameLose = true;
            showGamePoints("Game Over", cvs.width / 2 - 40, cvs.height / 2);
            showGamePoints(
              "Refresh to Play Again!",
              cvs.width / 2 - 100,
              cvs.height / 2 + 30
            );
          }
        }
      }
    }
  } else if (level === 5) {
    ball.speed = 6;
    for (let r = 0; r < brick.row; r++) {
      for (let c = 0; c < brick.column; c++) {
        let b = bricks[r][c];
        if (b.status) {
          b.y += 0.05;
          m += k;
          if (b.x > 500) {
            k = -2;
          } else if (b.x < -100) {
            k = 2;
          }
          b.x += k;
          if (b.y >= paddle.y - 20) {
            gameLose = true;
            showGamePoints("Game Over", cvs.width / 2 - 40, cvs.height / 2);
            showGamePoints(
              "Refresh to Play Again!",
              cvs.width / 2 - 100,
              cvs.height / 2 + 30
            );
          }
        }
      }
    }
  }
}
    
function draw() {
  ctx.drawImage(bg, 0, 0);
  drawPaddle();
  drawBall();
  drawBricks();
  showGamePoints("SCORE: " + score, 30, 30);
  showGamePoints("LEVEL: " + level, cvs.width / 2 - 30, 30);
  showGamePoints("LIFE: " + life, cvs.width - 100, 30);
}


function createDataBeforeStart() {
  createBricks();
}

function update() {
  movePaddle();
  moveBall();
  ballWallCollision();
  ballPaddleCollision();
  ballBrickCollision();
  gameOver();
  levelUp();
  moveBrick();
}

function loop() {
  draw();
  update();
  if (!gameLose) {
    requestAnimationFrame(loop);
  }
}

function startGame() {
  let btsl = document.querySelector("#level");
  btsl.onclick = function () {
    let selectLevel = $("#levelVal").val();
    level = parseInt(selectLevel);
    if (selectLevel == 5) {
      brick.row = 3;
    } else if(selectLevel == 1) {
      brick.row = 1;
    }else{
     brick.row = 2;
    }
    createDataBeforeStart();
    resetBall();
  };

  createDataBeforeStart();

  let btnStartGame = document.querySelector("#btn-start");
  btnStartGame.onclick = function () {
    btnStartGame.style.display = "none";
    loop();
  };
}
startGame();
