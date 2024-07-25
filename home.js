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
        speed: 5,
        velocityY: 0,
        gravity: 0.2,
        jumpStrength: -8,
        isJumping: false,
        currentAnimation: 'idle',
        animationFrame: 0,
        animationSpeed: 0.03,
        isFlipped: false
    };

    // Load images
    const images = {
        jumpingUp: [],
        jumpingDown: [],
        idle: [],
        running: []
    };

    function preloadImages(imageArray, category, callback) {
        let loadedImages = 0;
        const totalImages = imageArray.length;

        imageArray.forEach((src, index) => {
            const img = new Image();
            img.onload = () => {
                loadedImages++;
                images[category][index] = img;
                if (loadedImages === totalImages) callback();
            };
            img.src = src;
        });
    }

    // Load images
    preloadImages([
        'asset/game_asset/naruto/jumping_up/up0.png',
        'asset/game_asset/naruto/jumping_up/up1.png'
    ], 'jumpingUp', onImagesLoaded);

    preloadImages([
        'asset/game_asset/naruto/jumping_down/down0.png',
        'asset/game_asset/naruto/jumping_down/down1.png'
    ], 'jumpingDown', onImagesLoaded);

    preloadImages([
        'asset/game_asset/naruto/idle/idle0.png',
        'asset/game_asset/naruto/idle/idle1.png',
        'asset/game_asset/naruto/idle/idle2.png',
        'asset/game_asset/naruto/idle/idle3.png',
        'asset/game_asset/naruto/idle/idle4.png',
        'asset/game_asset/naruto/idle/idle5.png'
    ], 'idle', onImagesLoaded);

    preloadImages([
        'asset/game_asset/naruto/running/running0.png',
        'asset/game_asset/naruto/running/running1.png',
        'asset/game_asset/naruto/running/running2.png',
        'asset/game_asset/naruto/running/running3.png',
        'asset/game_asset/naruto/running/running4.png',
        'asset/game_asset/naruto/running/running5.png'
    ], 'running', onImagesLoaded);

    let imagesLoaded = 0;
    const totalImageGroups = Object.keys(images).length;

    function onImagesLoaded() {
        imagesLoaded++;
        if (imagesLoaded === totalImageGroups) {
            gameLoop();
        }
    }

    // Key states
    const keys = {
        w: false,
        a: false,
        d: false
    };

    $(document).on('keydown', function (event) {
        if (event.key === 'w' || event.key === 'W') keys.w = true;
        if (event.key === 'a' || event.key === 'A') keys.a = true;
        if (event.key === 'd' || event.key === 'D') keys.d = true;
    });

    $(document).on('keyup', function (event) {
        if (event.key === 'w' || event.key === 'W') keys.w = false;
        if (event.key === 'a' || event.key === 'A') keys.a = false;
        if (event.key === 'd' || event.key === 'D') keys.d = false;
    });

    function gameLoop() {
        update();
        draw();
        requestAnimationFrame(gameLoop);
    }

    function update() {
        if (keys.w && !character.isJumping) {
            character.velocityY = character.jumpStrength;
            character.isJumping = true;
            character.currentAnimation = 'jumpingUp';
        }
        if (keys.a) {
            character.x -= character.speed;
            character.currentAnimation = 'running';
            character.isFlipped = true; // Set to flip the character
        }
        if (keys.d) {
            character.x += character.speed;
            character.currentAnimation = 'running';
            character.isFlipped = false; // No flip for right movement
        }

        // Apply gravity
        character.velocityY += character.gravity;
        character.y += character.velocityY;

        // Check if character is on the ground
        if (character.y + character.height > canvas.height / scale) {
            character.y = (canvas.height / scale) - character.height;
            character.isJumping = false;
            character.velocityY = 0;
            if (!keys.a && !keys.d) {
                character.currentAnimation = 'idle';
            }
        }

        // Wrap around the canvas horizontally
        if (character.x + character.width < 0) {
            character.x = canvas.width / scale;
        } else if (character.x > canvas.width / scale) {
            character.x = -character.width;
        }

        // Update animation frame
        character.animationFrame += character.animationSpeed;
        if (character.animationFrame >= images[character.currentAnimation].length) {
            character.animationFrame = 0;
        }
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const currentImage = images[character.currentAnimation][Math.floor(character.animationFrame)];
        if (currentImage) {
            ctx.save(); // Save the current state of the context
            if (character.isFlipped) {
                ctx.translate(character.x + character.width / 2, character.y + character.height / 2);
                ctx.scale(-1, 1); // Flip horizontally
                ctx.drawImage(currentImage, -character.width / 2, -character.height / 2, character.width, character.height);
            } else {
                ctx.drawImage(currentImage, character.x, character.y, character.width, character.height);
            }
            ctx.restore(); // Restore the context to its original state
        }
    }

    gameLoop();
});
