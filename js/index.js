const playgound = document.querySelector('.playgound');
let rows, cols;
const pixelSize = 16;
let pixels;
let biteSound = new Audio('../assets/bite.mp3');
fillPixel();

const [up, right, down, left] = [0, 1, 2, 3];
const directionsStr = ['up', 'right', 'down', 'left'];

function fillPixel() {
    rows = Math.floor(playgound.clientHeight / pixelSize);
    cols = Math.floor(playgound.clientWidth / pixelSize);

    playgound.innerHTML = ''; // Clear the playground

    playgound.style.gridTemplateRows = `repeat(${rows}, ${pixelSize}px)`;
    playgound.style.gridTemplateColumns = `repeat(${cols}, ${pixelSize}px)`;

    pixels = [];

    for (let i = 0; i < rows; i++) {
        pixels.push([]);
        for (let j = 0; j < cols; j++) {
            let pixel = document.createElement('div');
            pixel.classList.add('pixel');
            playgound.appendChild(pixel);
            pixel.id = `${i}-${j}`;
            pixels[i].push(pixel);
        }
    }
}

const snake = {
    head: null,
    tail: null,
    size: 5,
    direction: right,
}
let fruit = null;

class Cell {
    constructor(x, y, next) {
        this.x = x;
        this.y = y;
        this.next = next;
    }
}

snake.appendCell = function () {
    let x, y, next;
    if (!this.head) {
        x = Math.floor(rows / 2);
        y = Math.floor(cols / 2);
        this.head = new Cell(x, y, null);
        pixels[this.head.x][this.head.y].classList.add('green', 'head', directionsStr[snake.direction]);
        this.tail = this.head;
    } else {
        x = this.tail.x;
        y = this.tail.y;
        switch (this.direction) {
            case up: x++; break;
            case down: x--; break;
            case left: y++; break;
            case right: y--; break;
            default: break;
        }

        y = (y < 0) ? y = cols - 1 : y;
        x = (x < 0) ? x = rows - 1 : x;
        y %= cols;
        x %= rows;

        this.tail = new Cell(x, y, this.tail);
    }

    pixels[x][y].classList.add('green');
    return { x, y };
}



function move(direction) {
    let { x, y } = snake.head;

    switch (direction) {
        case up: x = snake.head.x - 1; break;
        case down: x = snake.head.x + 1; break;
        case left: y = snake.head.y - 1; break;
        case right: y = snake.head.y + 1; break;
        default: return;
    }

    y = (y < 0) ? y = cols - 1 : y;
    x = (x < 0) ? x = rows - 1 : x;
    y %= cols;
    x %= rows;

    //colission detection
    if (pixels[x][y].classList.contains('green', 'wall')) {
        newGame();
        return;
    }
    if (pixels[x][y].classList.contains('fruit')) {
        biteSound.play();
        snake.appendCell();
        addFruit();
    }

    //cut the tail
    pixels[snake.tail.x][snake.tail.y].classList.remove('green');
    snake.tail = snake.tail.next;

    // prepend the head
    snake.head.next = new Cell(x, y, null);
    pixels[snake.head.x][snake.head.y].classList.remove('head', 'left', 'right', 'up', 'down');
    snake.head = snake.head.next;
    pixels[snake.head.x][snake.head.y].classList.add('green', 'head', directionsStr[direction]);
    snake.direction = direction;
}

let moveInterval;
let speed = 150;

snake.move = function (direction) {
    if (moveInterval) clearInterval(moveInterval);
    moveInterval = setInterval(() => {
        move(direction);
    }, speed);
}

window.addEventListener('keydown', (e) => {
    // prevent reverse move
    let { x, y } = snake.head;
    let map = {
        38: up,
        39: right,
        40: down,
        37: left,
    }
    if (map[e.keyCode] == up && snake.direction == down) return
    if (map[e.keyCode] == left && snake.direction == right) return
    if (map[e.keyCode] == down && snake.direction == up) return
    if (map[e.keyCode] == right && snake.direction == left) return

    //contineously moving in input direction
    snake.move(map[e.keyCode]);
});

newGame();
function newGame() {
    if (moveInterval) clearInterval(moveInterval);
    snake.head = null;
    snake.tail = null;
    for (const rows of pixels) {
        for (const col of rows) {
            col.className = 'pixel';
        }
    }
    for (let i = 0; i < snake.size; ++i) {
        snake.appendCell();
    }
    addFruit();
}

function addFruit() {
    let emptyCells = [];
    fruit?.classList.remove('fruit');
    for (const rows of pixels) {
        for (const col of rows) {
            if (!col.classList.contains('green') && !col.classList.contains('wall')) {
                emptyCells.push(col);
            }
        }
    }
    if (emptyCells.length == 0) {
        alert('you are a G.O.A.T. 🫡');
        return;
    }
    fruit = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    fruit.classList.add('fruit');
}