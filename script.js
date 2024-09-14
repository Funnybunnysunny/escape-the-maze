const canvas = document.getElementById("mazeCanvas");
const ctx = canvas.getContext("2d");
let maze, player, timer, timeLeft, gameInterval;
const tileSize = 40;
const rows = 10;
const cols = 10;
let gameOver = false;

// Initialize the maze and player
function startGame() {
    maze = generateMaze();
    player = { x: 0, y: 0 }; // Starting position
    timeLeft = 60;
    gameOver = false;
    document.getElementById("status").innerText = "";
    drawMaze();
    startTimer();
    window.addEventListener("keydown", movePlayer);
}

// Timer for countdown
function startTimer() {
    clearInterval(gameInterval);
    gameInterval = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            document.getElementById("time").innerText = timeLeft;
        } else {
            endGame("Time's up! You lost.");
        }
    }, 1000);
}

// Generate a simple random maze
function generateMaze() {
    const maze = new Array(rows).fill(0).map(() => new Array(cols).fill(1)); // Fill with walls (1)

    // Create a path from start to finish
    let currentRow = 0;
    let currentCol = 0;
    maze[currentRow][currentCol] = 0; // Start point

    while (currentRow < rows - 1 || currentCol < cols - 1) {
        const directions = [];

        if (currentRow < rows - 1) directions.push('down');
        if (currentCol < cols - 1) directions.push('right');

        const randomDirection = directions[Math.floor(Math.random() * directions.length)];

        if (randomDirection === 'down') {
            currentRow++;
        } else if (randomDirection === 'right') {
            currentCol++;
        }

        maze[currentRow][currentCol] = 0; // Create path
    }

    maze[rows - 1][cols - 1] = 0; // Ensure exit point is open

    // Add random branches for extra difficulty
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (Math.random() < 0.3) maze[i][j] = 0; // Random open spaces
        }
    }

    return maze;
}

// Draw the maze
function drawMaze() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            ctx.fillStyle = maze[row][col] === 1 ? "#333" : "#fff"; // Draw walls or paths
            ctx.fillRect(col * tileSize, row * tileSize, tileSize, tileSize);
        }
    }
    // Draw player
    ctx.fillStyle = "red";
    ctx.fillRect(player.x * tileSize, player.y * tileSize, tileSize, tileSize);
}

// Move player
function movePlayer(e) {
    if (gameOver) return;

    let newX = player.x;
    let newY = player.y;

    if (e.key === "ArrowUp" && player.y > 0 && maze[player.y - 1][player.x] === 0) newY--;
    if (e.key === "ArrowDown" && player.y < rows - 1 && maze[player.y + 1][player.x] === 0) newY++;
    if (e.key === "ArrowLeft" && player.x > 0 && maze[player.y][player.x - 1] === 0) newX--;
    if (e.key === "ArrowRight" && player.x < cols - 1 && maze[player.y][player.x + 1] === 0) newX++;

    if (maze[newY][newX] === 0) { // Only move if there’s an open path
        player.x = newX;
        player.y = newY;
        drawMaze();
        checkWin();
    }
}

// Check if player reached the end
function checkWin() {
    if (player.x === cols - 1 && player.y === rows - 1) {
        endGame("Congratulations! You escaped the maze!");
    }
}

// End game
function endGame(message) {
    clearInterval(gameInterval);
    document.getElementById("status").innerText = message;
    gameOver = true;
    window.removeEventListener("keydown", movePlayer);
}
