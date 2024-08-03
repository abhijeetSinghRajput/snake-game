const gameBoard = document.querySelector('.game-board');
let highScore = document.querySelector('.high-score .value');
let score = document.querySelector('.score .value');

highScore.textContent = localStorage.getItem('snakeHighScore') || 0;
score.textContent = 0;
let gridNum = 20;
let scoreIncrement = 5;

let snakeBody = [
    { x: 10, y: 13 },
    { x: 10, y: 12 },
    { x: 10, y: 11 },
];

let snakeSpeed = 5;
const expansionRate = 1;
let snakeDirection = 'right';
const directions = [
    { x: -1, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 0 },
    { x: 0, y: -1 },
];
const [up, right, down, left] = directions;

let grid = [];
for (let i = 1; i <= gridNum; ++i) {
    for (let j = 1; j <= gridNum; ++j) {
        grid.push({ x: i, y: j });
    }
}
let foodPosition = getRandomFood();

let lastRenderTime = 0;
function main(currTime) {
    let sec_delay = (currTime - lastRenderTime) / 1000;
    requestAnimationFrame(main);
    if (sec_delay < (1 / snakeSpeed)) return;

    moveSnake();
    drawSnake();
    drawFood();
    lastRenderTime = currTime;
}
requestAnimationFrame(main);

function incScore() {
    let value = +score.textContent;
    let bonus = 0;

    //level up
    if(value > 200) bonus = 10, snakeSpeed = 9;
    else if(value > 150) bonus = 10, snakeSpeed = 8;
    else if(value > 100) bonus = 5, snakeSpeed = 7;
    else if(value > 50) bonus = 2, snakeSpeed = 6;

    score.textContent = value + scoreIncrement + bonus;

    if (+score.textContent > +highScore.textContent) {
        highScore.textContent = score.textContent;
        localStorage.setItem('snakeHighScore', highScore.textContent);
    }
}

function drawSnake() {
    gameBoard.innerHTML = '';
    snakeBody.forEach(({ x, y }, i) => {
        let snake = document.createElement('div');
        snake.className = "snake";
        snake.style.gridRowStart = x;
        snake.style.gridColumnStart = y;
        if (i === 0) snake.classList.add('head', snakeDirection);
        gameBoard.appendChild(snake);
    });
}

function drawFood() {
    let food = document.createElement('div');
    food.className = 'food';
    food.style.gridRowStart = foodPosition.x;
    food.style.gridColumnStart = foodPosition.y;
    gameBoard.appendChild(food);
}

const biteSound = new Audio('./assets/bite.mp3');
function move(direction, str) {
    // prevent 180-degree turn
    if (str === 'up' && snakeDirection === 'down') return;
    if (str === 'left' && snakeDirection === 'right') return;
    if (str === 'right' && snakeDirection === 'left') return;
    if (str === 'down' && snakeDirection === 'up') return;

    snakeDirection = str;
}

function moveSnake() {
    let direction;
    switch (snakeDirection) {
        case 'up':
            direction = up;
            break;
        case 'down':
            direction = down;
            break;
        case 'left':
            direction = left;
            break;
        case 'right':
            direction = right;
            break;
    }

    for (let i = snakeBody.length - 1; i > 0; --i) {
        snakeBody[i] = { ...snakeBody[i - 1] };
    }

    snakeBody[0].x += direction.x;
    snakeBody[0].y += direction.y;

    // teleport
    if (snakeBody[0].x > gridNum) snakeBody[0].x = 1;
    if (snakeBody[0].y > gridNum) snakeBody[0].y = 1;
    if (snakeBody[0].x < 1) snakeBody[0].x = gridNum;
    if (snakeBody[0].y < 1) snakeBody[0].y = gridNum;

    if (checkIntersection()) {
        alert('game over');
        newGame();
        return;
    }
    if (isEqual(snakeBody[0], foodPosition)) {
        expand(expansionRate);
        biteSound.play();
        foodPosition = getRandomFood();
        incScore();
    }
}

function checkIntersection() {
    for (let i = 1; i < snakeBody.length; ++i) {
        if (isEqual(snakeBody[0], snakeBody[i])) {
            return true;
        }
    }
    return false;
}

function expand(expansionRate) {
    while (expansionRate--) {
        snakeBody.push({ ...snakeBody[snakeBody.length - 1] });
    }
}

function getRandomFood() {
    const remainingCell = grid.filter((cell) => {
        for (let i = 0; i < snakeBody.length; ++i) {
            if (isEqual(cell, snakeBody[i])) {
                return false;
            }
        }
        return true;
    });
    if (remainingCell.length === 0) {
        alert('you do not know how elite you are');
        newGame();
    }
    let randomIndex = Math.floor(Math.random() * remainingCell.length);
    return remainingCell[randomIndex];
}

function isEqual(pos1, pos2) {
    return pos1.x === pos2.x && pos1.y === pos2.y;
}

function newGame() {
    
    snakeBody = [
        { x: 10, y: 13 },
        { x: 10, y: 12 },
        { x: 10, y: 11 },
    ];
    snakeSpeed = 5;
    snakeDirection = 'right';
    foodPosition = getRandomFood();
    score.textContent = 0;
}

window.addEventListener('keydown', ({ key }) => {
    switch (key) {
        case 'ArrowUp':
            move(up, 'up');
            break;
        case 'ArrowDown':
            move(down, 'down');
            break;
        case 'ArrowLeft':
            move(left, 'left');
            break;
        case 'ArrowRight':
            move(right, 'right');
            break;
        default:
            break;
    }
});
