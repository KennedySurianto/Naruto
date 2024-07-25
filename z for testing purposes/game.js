$(document).ready(function () {
    const canvas = $('#gameCanvas')[0];
    const ctx = canvas.getContext('2d');

    // Character properties
    const character = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        width: 50,
        height: 50,
        speed: 5,
        currentImage: null
    };

    // Images for character animations
    const images = {
        w: new Image(),
        a: new Image(),
        s: new Image(),
        d: new Image(),
        idle: new Image()
    };

    // Load images
    images.w.src = 'asset/game_asset/naruto/jumping_up/up0.png'; // Replace with the actual path
    images.a.src = 'asset/game_asset/naruto/running/running0.png'; // Replace with the actual path
    images.s.src = 'asset/game_asset/naruto/running/running0.png'; // Replace with the actual path
    images.d.src = 'asset/game_asset/naruto/running/running0.png'; // Replace with the actual path
    images.idle.src = 'asset/game_asset/naruto/idle/idle0.png'; // Replace with the actual path

    // Set the initial image
    character.currentImage = images.idle;

    // Key press states
    const keys = {
        w: false,
        a: false,
        s: false,
        d: false
    };

    // Event listeners for key presses
    $(document).on('keydown', function (event) {
        if (event.key === 'w' || event.key === 'W') keys.w = true;
        if (event.key === 'a' || event.key === 'A') keys.a = true;
        if (event.key === 's' || event.key === 'S') keys.s = true;
        if (event.key === 'd' || event.key === 'D') keys.d = true;
    });

    $(document).on('keyup', function (event) {
        if (event.key === 'w' || event.key === 'W') keys.w = false;
        if (event.key === 'a' || event.key === 'A') keys.a = false;
        if (event.key === 's' || event.key === 'S') keys.s = false;
        if (event.key === 'd' || event.key === 'D') keys.d = false;
    });

    // Game loop
    function gameLoop() {
        update();
        draw();
        requestAnimationFrame(gameLoop);
    }

    // Update game state
    function update() {
        if (keys.w) {
            character.y -= character.speed;
            character.currentImage = images.w;
        }
        if (keys.a) {
            character.x -= character.speed;
            character.currentImage = images.a;
        }
        if (keys.s) {
            character.y += character.speed;
            character.currentImage = images.s;
        }
        if (keys.d) {
            character.x += character.speed;
            character.currentImage = images.d;
        }

        // If no keys are pressed, set the idle image
        if (!keys.w && !keys.a && !keys.s && !keys.d) {
            character.currentImage = images.idle;
        }

        // Keep the character within the canvas boundaries
        if (character.x < 0) character.x = 0;
        if (character.x + character.width > canvas.width) character.x = canvas.width - character.width;
        if (character.y < 0) character.y = 0;
        if (character.y + character.height > canvas.height) character.y = canvas.height - character.height;
    }

    // Draw the game state
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(character.currentImage, character.x, character.y, character.width, character.height);
    }

    // Start the game loop
    gameLoop();
});
