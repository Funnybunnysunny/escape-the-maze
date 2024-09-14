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
    window.addEventListener("keydown", movePlayer); // Listen for arrow key presses
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

// Generate a simple random maze with limited walls
function generateMaze() {
    const maze = new Array(rows).fill(0).map(() => new Array(cols).fill(0)); // Start with all open spaces (0)
    const wallLimit = 20; // Maximum number of walls
    let wallsPlaced = 0;

    // Place walls randomly while keeping a clear path
    while (wallsPlaced < wallLimit) {
        const row = Math.floor(Math.random() * rows);
        const col = Math.floor(Math.random() * cols);

        // Avoid placing walls on the player's start or end position
        if ((row === 0 && col === 0) || (row === rows - 1 && col === cols - 1)) continue;

        if (maze[row][col] === 0) { // Place a wall if the spot is empty
            maze[row][col] = 1;
            wallsPlaced++;
        }
    }

    return maze;
}

// Draw the maze
function drawMaze() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (row === rows - 1 && col === cols - 1) {
                ctx.fillStyle = "green"; // Draw the exit in green
            } else {
                ctx.fillStyle = maze[row][col] === 1 ? "#333" : "#fff"; // Draw walls or paths
            }
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

    if (newX !== player.x || newY !== player.y) {
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
