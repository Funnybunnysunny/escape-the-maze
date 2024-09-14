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
    player = { x: 0, y: 0 };
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

// Generate a random maze (basic structure)
function generateMaze() {
    const maze = new Array(rows).fill(0).map(() => new Array(cols).fill(1));
    // Create a simple random path from start to end
    for (let i = 0; i < rows; i++) {
        maze[i][Math.floor(Math.random() * cols)] = 0;
    }
    maze[rows - 1][cols - 1] = 0; // Ensure exit point is open
    return maze;
}

// Draw the maze
function drawMaze() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            ctx.fillStyle = maze[row][col] === 1 ? "#333" : "#fff";
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

    if (e.key === "ArrowUp") newY--;
    if (e.key === "ArrowDown") newY++;
    if (e.key === "ArrowLeft") newX--;
    if (e.key === "ArrowRight") newX++;

    if (newX >= 0 && newX < cols && newY >= 0 && newY < rows && maze[newY][newX] === 0) {
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
