const menuBtn = $('#menu-btn');
const menu = $('#menu');

menuBtn.on('click', () => {
    menu.fadeToggle();
})

$(document).ready(function () {
    const canvas = $('#canvas')[0];
    const ctx = canvas.getContext('2d');

    // Set higher internal resolution
    const scale = 2;
    canvas.width = canvas.clientWidth * scale;
    canvas.height = canvas.clientHeight * scale;
    ctx.scale(scale, scale);

    // Disable image smoothing
    ctx.imageSmoothingEnabled = false;

    // Character properties
    const character = {
        x: canvas.width / (2 * scale),
        y: canvas.height / (2 * scale),
        width: 100,
        height: 100,
        speed: 2,
        velocityY: 0,
        gravity: 0.2,
        jumpStrength: -10,
        isJumping: false, 
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
    images.w.src = 'asset/game_asset/naruto/jumping_up/up0.png';
    images.a.src = 'asset/game_asset/naruto/running/running0.png';
    images.s.src = 'asset/game_asset/naruto/running/running0.png';
    images.d.src = 'asset/game_asset/naruto/running/running0.png';
    images.idle.src = 'asset/game_asset/naruto/idle/idle0.png';

    let imagesLoaded = 0;
    const totalImages = Object.keys(images).length;

    for (const key in images) {
        images[key].onload = function () {
            imagesLoaded++;
            if (imagesLoaded === totalImages) {
                character.currentImage = images.idle;
                gameLoop();
            }
        };
    }

    const keys = {
        w: false,
        a: false,
        s: false,
        d: false,
        space: false
    };

    $(document).on('keydown', function (event) {
        if (event.key === 'w' || event.key === 'W') keys.w = true;
        if (event.key === 'a' || event.key === 'A') keys.a = true;
        if (event.key === 's' || event.key === 'S') keys.s = true;
        if (event.key === 'd' || event.key === 'D') keys.d = true;
        if (event.key === ' ' || event.key === 'Spacebar') keys.space = true;
    });

    $(document).on('keyup', function (event) {
        if (event.key === 'w' || event.key === 'W') keys.w = false;
        if (event.key === 'a' || event.key === 'A') keys.a = false;
        if (event.key === 's' || event.key === 'S') keys.s = false;
        if (event.key === 'd' || event.key === 'D') keys.d = false;
        if (event.key === ' ' || event.key === 'Spacebar') keys.space = false;
    });

    function gameLoop() {
        update();
        draw();
        requestAnimationFrame(gameLoop);
    }

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

        if (keys.space && !character.isJumping) {
            character.velocityY = character.jumpStrength;
            character.isJumping = true;
            character.currentImage = images.w;
        }

        // Apply gravity
        character.velocityY += character.gravity;
        character.y += character.velocityY;

        // Check if character is on the ground
        if (character.y + character.height > canvas.height / scale) {
            character.y = (canvas.height / scale) - character.height;
            character.isJumping = false;
            character.velocityY = 0;
        }

        if (!keys.w && !keys.a && !keys.s && !keys.d && !character.isJumping) {
            character.currentImage = images.idle;
        }

        if (character.x < 0) character.x = 0;
        if (character.x + character.width > canvas.width / scale) character.x = (canvas.width / scale) - character.width;
        if (character.y < 0) character.y = 0;
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (character.currentImage) {
            ctx.drawImage(character.currentImage, character.x, character.y, character.width, character.height);
        }
    }

    gameLoop();
});
