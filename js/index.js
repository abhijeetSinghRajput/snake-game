const playgound = document.querySelector('.playgound');
let rows, cols;
const pixelSize = 16;
let pixels;
let board;
fillPixel();

function fillPixel() {
    rows = Math.floor(playgound.clientHeight / pixelSize);
    cols = Math.floor(playgound.clientWidth / pixelSize);

    playgound.innerHTML = ''; // Clear the playground

    playgound.style.gridTemplateRows = `repeat(${rows}, ${pixelSize}px)`;
    playgound.style.gridTemplateColumns = `repeat(${cols}, ${pixelSize}px)`;

    pixels = [];
    board = [];

    for (let i = 0; i < rows; i++) {
        pixels.push([]);
        board.push([]);
        for (let j = 0; j < cols; j++) {
            let pixel = document.createElement('div');
            pixel.classList.add('pixel');
            playgound.appendChild(pixel);
            pixel.id = `${i}-${j}`;
            pixels[i].push(pixel);
            board[i].push(null);
        }
    }
}

const snake = {
    head: null,
    tail: null,
}
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
        pixels[this.head.x][this.head.y].classList.add('green', 'head', 'right');
        this.tail = this.head;
    } else {
        x = this.tail.x;
        y = this.tail.y - 1;
        this.tail = new Cell(x, y, this.tail);
    }

    pixels[x][y].classList.add('green');
}

snake.appendCell();
snake.appendCell();
snake.appendCell();
snake.appendCell();
snake.appendCell();
snake.appendCell();
snake.appendCell();
snake.appendCell();

const [up, right, down, left] = [0, 1, 2, 3];
const directionsStr = ['up', 'right', 'down', 'left'];

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

    // prepend the head
    snake.head.next = new Cell(x, y, null);
    pixels[snake.head.x][snake.head.y].classList.remove('head', 'left', 'right', 'up', 'down');
    snake.head = snake.head.next;
    pixels[snake.head.x][snake.head.y].classList.add('green', 'head', directionsStr[direction]);

    //cut the tail
    pixels[snake.tail.x][snake.tail.y].classList.remove('green');
    snake.tail = snake.tail.next;
}

//controlls
window.addEventListener('keydown', (e) => {
    switch (e.keyCode) {
        case 38: move(up); break;
        case 39: move(right); break;
        case 40: move(down); break;
        case 37: move(left); break;
        default: return;
    }
})