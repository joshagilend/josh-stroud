// Initialize the canvas and context
const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Define the main character Tommy the Ghoul Gourmet
const tommy = {
    x: 50,
    y: 50,
    width: 50,
    height: 50,
    color: 'purple',
    speed: 10,
    originalX: 50,
    originalY: 50,
    isFlashing: false,
    flashCounter: 0,
    slimeCollected: 0,
    targetX: 50,
    targetY: 50
};

// Define enemy properties
const enemies = [];
const enemyCount = 30;
for (let i = 0; i < enemyCount; i++) {
    enemies.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        width: 50,
        height: 50,
        color: i === 0 ? 'gold' : 'red', // The first enemy is the "king" enemy
        speed: 3,
        direction: Math.random() < 0.5 ? 'down' : 'up',
        isKing: i === 0 // Mark the king enemy
    });
}

let specialActionTriggered = false;
let specialActionCounter = 0;
let gameWon = false;
const effects = ["🎉", "❄️", "😊", "🌟", "🎈"];

// Update target position based on mouse movement
canvas.addEventListener('mousemove', function(event) {
    const rect = canvas.getBoundingClientRect();
    tommy.targetX = event.clientX - rect.left;
    tommy.targetY = event.clientY - rect.top;
});

// Function to draw Tommy
function drawTommy() {
    if (!tommy.isFlashing || tommy.flashCounter % 10 < 5) {
        context.fillStyle = tommy.color;
        context.fillRect(tommy.x, tommy.y, tommy.width, tommy.height);
    }
}

// Function to draw enemies or effects if the game is won
function drawEnemiesOrEffects() {
    if (gameWon) {
        enemies.forEach((enemy, index) => {
            context.fillStyle = 'white';
            context.font = '40px Arial';
            context.fillText(effects[index % effects.length], enemy.x, enemy.y + 40);
        });
    } else {
        enemies.forEach(enemy => {
            context.fillStyle = enemy.color;
            context.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        });
    }
}

// Function to update Tommy's position
function updateTommy() {
    const dx = tommy.targetX - tommy.x;
    const dy = tommy.targetY - tommy.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > tommy.speed) {
        tommy.x += (dx / distance) * tommy.speed;
        tommy.y += (dy / distance) * tommy.speed;
    } else {
        tommy.x = tommy.targetX;
        tommy.y = tommy.targetY;
    }
}

// Function to update enemies' positions
function updateEnemies() {
    enemies.forEach(enemy => {
        if (enemy.direction === 'down') {
            enemy.y += enemy.speed - (tommy.slimeCollected ? 1 : 0); // Slower if slime collected
            if (enemy.y + enemy.height > canvas.height) {
                enemy.direction = 'up';
            }
        } else {
            enemy.y -= enemy.speed - (tommy.slimeCollected ? 1 : 0); // Slower if slime collected
            if (enemy.y < 0) {
                enemy.direction = 'down';
            }
        }
    });
}

// Function to check collision
function checkCollision(rect1, rect2) {
    return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y
    );
}

// Function to handle collision
function handleCollision() {
    enemies.forEach(enemy => {
        if (checkCollision(tommy, enemy)) {
            if (enemy.isKing) {
                gameWon = true;
                alert('You win! Here's the prize: https://timetraveldb.com');
            } else {
                tommy.isFlashing = true;
                tommy.flashCounter = 0;
                tommy.x = tommy.originalX;
                tommy.y = tommy.originalY;
                tommy.targetX = tommy.originalX;
                tommy.targetY = tommy.originalY;
                tommy.slimeCollected++;
            }
        }
    });
}

// Function to handle special action
function handleSpecialAction() {
    if (specialActionTriggered) {
        specialActionCounter++;
        if (specialActionCounter < 100) {
            enemies.forEach(enemy => {
                if (specialActionCounter % 20 < 10) {
                    enemy.color = 'blue';
                } else {
                    enemy.color = 'red';
                }
            });
        } else {
            specialActionTriggered = false;
        }
    }
}

// Main game loop
function gameLoop() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    updateTommy();
    updateEnemies();
    drawTommy();
    drawEnemiesOrEffects();
    handleCollision();
    handleSpecialAction();
    
    if (tommy.isFlashing) {
        tommy.flashCounter++;
        if (tommy.flashCounter > 30) {
            tommy.isFlashing = false;
        }
    }

    requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();