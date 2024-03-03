let canvas, ctx, gameInterval;
let balloons = [];
let particles = [];
let score = 0; // Variable to track the score
let lives;
let balloonSpeed, balloonFrequency;
let highScore = { easy: 0, medium: 0, hard: 0 }; // Initialize high scores

// Function to start the game with the chosen difficulty level
function startGame(difficulty) {
    // Hide the menu
    document.querySelector('.menu').style.display = 'none';

    // Show the canvas
    canvas = document.getElementById('canvas');
    canvas.style.display = 'block';
    ctx = canvas.getContext('2d');

    // Set up canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Set difficulty level based on parameter
    setDifficulty(difficulty);

    // Set initial lives
    lives = difficulty === 'easy' ? 5 : (difficulty === 'medium' ? 3 : 2);

    // Start the game loop
    gameInterval = setInterval(updateGame, 20);

    // Event listener to handle clicks on canvas
    canvas.addEventListener('click', handleClick);

    // Initialize objects
    initializeObjects();

    // Update high score display
    updateHighScoreDisplay(difficulty);
}

// Function to set game parameters based on difficulty level
function setDifficulty(difficulty) {
    if (difficulty === 'easy') {
        balloonSpeed = 2; // Adjust balloon speed for easy difficulty
        balloonFrequency = 0.01; // Adjust balloon frequency for easy difficulty
    } else if (difficulty === 'medium') {
        balloonSpeed = 3; // Adjust balloon speed for medium difficulty
        balloonFrequency = 0.02; // Adjust balloon frequency for medium difficulty
    } else if (difficulty === 'hard') {
        balloonSpeed = 4; // Adjust balloon speed for hard difficulty
        balloonFrequency = 0.03; // Adjust balloon frequency for hard difficulty
    }
}

// Function to initialize game objects
function initializeObjects() {
    // Empty balloons array
    balloons = [];
}

// Function to update game state
function updateGame() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Update and draw balloons
    for (let i = 0; i < balloons.length; i++) {
        let balloon = balloons[i];
        
        // Move balloons up
        balloon.y -= balloonSpeed;

        // Draw balloon
        ctx.beginPath();
        ctx.arc(balloon.x, balloon.y, balloon.radius, 0, Math.PI * 2);
        ctx.fillStyle = balloon.color;
        ctx.fill();
        ctx.closePath();

        // Check if balloon is out of screen
        if (balloon.y + balloon.radius < 0) {
            // Remove balloon if it's out of screen
            balloons.splice(i, 1);
            i--; // Decrement index to adjust for removed element
            // Decrease lives
            decreaseLives();
        }
    }

    // Draw particles
    for (let i = 0; i < particles.length; i++) {
        let particle = particles[i];
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
        ctx.closePath();
        particle.x += particle.vx;
        particle.y += particle.vy;
        if (particle.radius > 0) {
            particle.radius -= 0.05; // Adjust particle size without fading
        }
        if (particle.radius <= 0) {
            particles.splice(i, 1);
            i--; // Decrement index to adjust for removed element
        }
    }

    // Draw lives
    ctx.font = "20px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("Lives: " + lives, 20, 30);

    // Draw score
    ctx.fillText("Score: " + score, 20, 60);

    // Generate new balloons randomly
    if (Math.random() < balloonFrequency) {
        createBalloon();
    }

    // Check if lives are zero
    if (lives <= 0) {
        endGame();
    }
}

// Function to handle clicks on balloons
function handleClick(event) {
    // Handle click events on canvas
    let mouseX = event.clientX;
    let mouseY = event.clientY;
    
    // Find the clicked balloon
    let clickedBalloonIndex = balloons.findIndex(balloon => {
        let distance = Math.sqrt((mouseX - balloon.x) ** 2 + (mouseY - balloon.y) ** 2);
        return distance <= balloon.radius;
    });

    // If a balloon was clicked, remove it and trigger the particle effect
    if (clickedBalloonIndex !== -1) {
        let clickedBalloon = balloons[clickedBalloonIndex];
        balloons.splice(clickedBalloonIndex, 1);
        showParticles(clickedBalloon.x, clickedBalloon.y, clickedBalloon.color);
        increaseScore(); // Increase score when balloon is clicked
    }
}

// Function to increase the score
function increaseScore() {
    score++; // Increment the score
}

// Function to create a new balloon
function createBalloon() {
    // Create a new balloon and add it to the balloons array
    let radius = Math.random() * 30 + 10; // Random radius between 10 and 40
    let x = Math.random() * (canvas.width - 2 * radius) + radius; // Random x position
    let color = getRandomColor(); // Random color
    balloons.push({ x: x, y: canvas.height + radius, radius: radius, color: color });
}

// Function to generate a random color
function getRandomColor() {
    return '#' + (Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0');
}

// Function to show particle effect when a balloon is popped
function showParticles(x, y, color) {
    for (let i = 0; i < 20; i++) {
        let angle = Math.random() * Math.PI * 2;
        let speed = Math.random() * 5 + 1;
        let radius = Math.random() * 3
        let particleColor = color;
        
        particles.push({ x: x, y: y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, radius: radius, color: particleColor });
    }
}

// Function to decrease lives when a balloon goes unburst
function decreaseLives() {
    lives--;
}

// Function to end the game
function endGame() {
    clearInterval(gameInterval); // Stop the game loop

    // Apply shake effect to the canvas
    shakeCanvas();

    // Display game over message with score
    displayGameOverMessage();

    // Show the menu again after a delay
    setTimeout(() => {
        document.querySelector('.menu').style.display = 'block';
        updateHighScore(); // Update high score when the game ends
    }, 2000); // Adjust the delay as needed
}

// Function to shake the canvas
function shakeCanvas() {

    let originalLeft = canvas.offsetLeft;
    let originalTop = canvas.offsetTop;

    // Define the number of shakes
    let numShakes = 10;
    let shakeDistance = 10;

    for (let i = 0; i < numShakes; i++) {
        setTimeout(() => {
            let offsetX = Math.random() * shakeDistance * 2 - shakeDistance;
            let offsetY = Math.random() * shakeDistance * 2 - shakeDistance;
            canvas.style.left = originalLeft + offsetX + 'px';
            canvas.style.top = originalTop + offsetY + 'px';
        }, i * 50); // Adjust the duration of each shake
    }

    // Reset canvas position
    setTimeout(() => {
        canvas.style.left = originalLeft + 'px';
        canvas.style.top = originalTop + 'px';
    }, numShakes * 50);
}

// Function to display game over message with score
function displayGameOverMessage() {
    ctx.fillStyle = 'red';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2 - 50);
    ctx.font = '24px Arial';
    ctx.fillText('Your Score: ' + score, canvas.width / 2, canvas.height / 2);
}

// Function to update the high score based on the current game difficulty
function updateHighScore() {
    // Get the current difficulty level
    let difficulty = getDifficulty();

    // Update the high score if the current score is higher
    if (score > highScore[difficulty]) {
        highScore[difficulty] = score;
        // Update high score display in the menu
        document.getElementById('high-score').innerText = highScore[difficulty];
    }
}

// Function to get the current game difficulty
function getDifficulty() {
    if (balloonSpeed === 2) {
        return 'easy';
    } else if (balloonSpeed === 3) {
        return 'medium';
    } else {
        return 'hard';
    }
}

// Other functions (createBalloon, getRandomColor, etc.) are here...

