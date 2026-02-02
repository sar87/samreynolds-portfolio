// Player character with movement and animation

const Player = {
    // Position (in tiles)
    x: 20,
    y: 20,

    // Pixel position (for smooth movement)
    // NOTE: pixelX/pixelY represent the player's FOOT position (bottom-center of sprite)
    // The 16x32 character sprite is rendered with Y offset to align feet with ground
    pixelX: 20 * 16,
    pixelY: 20 * 16,

    // Sprite dimensions (Pokemon GBA style)
    spriteWidth: 16,   // Character width in pixels
    spriteHeight: 32,  // Character height in pixels (2x tile height)

    // Movement
    speed: 2, // Pixels per frame
    moving: false,
    targetX: 20,
    targetY: 20,
    direction: 'down',

    // Animation
    // Walk cycle: frames 0-3 cycle during movement
    // Frame 0 when standing still
    frame: 0,
    frameTimer: 0,
    frameDelay: 8, // Frames between animation updates (~150ms at 60fps)
    animating: false,

    // Input state
    keys: {
        up: false,
        down: false,
        left: false,
        right: false,
        action: false
    },

    // Mobile touch state
    touchDir: null,
    touchAction: false,

    // Interaction
    nearInteraction: null,

    // Initialize player
    init(startX, startY) {
        this.x = startX || 20;
        this.y = startY || 20;
        this.pixelX = this.x * 16;
        this.pixelY = this.y * 16;
        this.targetX = this.x;
        this.targetY = this.y;
        this.direction = 'down';
        this.frame = 0;
        this.moving = false;

        this.setupControls();
    },

    // Set up keyboard and touch controls
    setupControls() {
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            if (e.repeat) return;

            switch (e.key) {
                case 'ArrowUp':
                case 'w':
                case 'W':
                    this.keys.up = true;
                    e.preventDefault();
                    break;
                case 'ArrowDown':
                case 's':
                case 'S':
                    this.keys.down = true;
                    e.preventDefault();
                    break;
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    this.keys.left = true;
                    e.preventDefault();
                    break;
                case 'ArrowRight':
                case 'd':
                case 'D':
                    this.keys.right = true;
                    e.preventDefault();
                    break;
                case 'Enter':
                case ' ':
                    this.keys.action = true;
                    e.preventDefault();
                    break;
            }
        });

        document.addEventListener('keyup', (e) => {
            switch (e.key) {
                case 'ArrowUp':
                case 'w':
                case 'W':
                    this.keys.up = false;
                    break;
                case 'ArrowDown':
                case 's':
                case 'S':
                    this.keys.down = false;
                    break;
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    this.keys.left = false;
                    break;
                case 'ArrowRight':
                case 'd':
                case 'D':
                    this.keys.right = false;
                    break;
                case 'Enter':
                case ' ':
                    this.keys.action = false;
                    break;
            }
        });

        // Mobile touch controls
        this.setupTouchControls();
    },

    // Set up mobile D-pad and action button
    setupTouchControls() {
        // D-pad buttons
        const dpadBtns = document.querySelectorAll('.dpad-btn');
        dpadBtns.forEach(btn => {
            const dir = btn.dataset.dir;

            btn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.touchDir = dir;
                this.keys[dir] = true;
            });

            btn.addEventListener('touchend', (e) => {
                e.preventDefault();
                if (this.touchDir === dir) {
                    this.touchDir = null;
                }
                this.keys[dir] = false;
            });

            btn.addEventListener('touchcancel', (e) => {
                this.keys[dir] = false;
            });

            // Also handle mouse for testing
            btn.addEventListener('mousedown', () => {
                this.keys[dir] = true;
            });

            btn.addEventListener('mouseup', () => {
                this.keys[dir] = false;
            });

            btn.addEventListener('mouseleave', () => {
                this.keys[dir] = false;
            });
        });

        // Action button
        const actionBtn = document.getElementById('action-button');
        if (actionBtn) {
            actionBtn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.keys.action = true;
                this.touchAction = true;
            });

            actionBtn.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.keys.action = false;
                this.touchAction = false;
            });

            actionBtn.addEventListener('mousedown', () => {
                this.keys.action = true;
            });

            actionBtn.addEventListener('mouseup', () => {
                this.keys.action = false;
            });
        }

        // Detect touch device
        if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
            document.body.classList.add('touch-device');
        }
    },

    // Update player state
    update() {
        // Handle movement
        if (!this.moving) {
            this.checkMovement();
        } else {
            this.continueMovement();
        }

        // Update animation
        this.updateAnimation();

        // Check for nearby interactions
        this.checkNearbyInteraction();
    },

    // Check for new movement input
    checkMovement() {
        let dx = 0;
        let dy = 0;
        let newDir = this.direction;

        if (this.keys.up) {
            dy = -1;
            newDir = 'up';
        } else if (this.keys.down) {
            dy = 1;
            newDir = 'down';
        } else if (this.keys.left) {
            dx = -1;
            newDir = 'left';
        } else if (this.keys.right) {
            dx = 1;
            newDir = 'right';
        }

        // Update direction even if we can't move
        this.direction = newDir;

        if (dx !== 0 || dy !== 0) {
            const newX = this.x + dx;
            const newY = this.y + dy;

            if (World.isWalkable(newX, newY)) {
                this.targetX = newX;
                this.targetY = newY;
                this.moving = true;
                this.animating = true;
            }
        }
    },

    // Continue movement to target tile
    continueMovement() {
        const targetPixelX = this.targetX * 16;
        const targetPixelY = this.targetY * 16;

        // Move towards target
        if (this.pixelX < targetPixelX) {
            this.pixelX = Math.min(this.pixelX + this.speed, targetPixelX);
        } else if (this.pixelX > targetPixelX) {
            this.pixelX = Math.max(this.pixelX - this.speed, targetPixelX);
        }

        if (this.pixelY < targetPixelY) {
            this.pixelY = Math.min(this.pixelY + this.speed, targetPixelY);
        } else if (this.pixelY > targetPixelY) {
            this.pixelY = Math.max(this.pixelY - this.speed, targetPixelY);
        }

        // Check if reached target
        if (this.pixelX === targetPixelX && this.pixelY === targetPixelY) {
            this.x = this.targetX;
            this.y = this.targetY;
            this.moving = false;

            // Check if any key is still held to continue moving
            if (this.keys.up || this.keys.down || this.keys.left || this.keys.right) {
                this.checkMovement();
            } else {
                this.animating = false;
                this.frame = 0;
            }
        }
    },

    // Update animation frame
    updateAnimation() {
        if (this.animating) {
            this.frameTimer++;
            if (this.frameTimer >= this.frameDelay) {
                this.frameTimer = 0;
                this.frame = (this.frame + 1) % 4;
            }
        }
    },

    // Check for nearby interactive objects
    checkNearbyInteraction() {
        // Check tile player is standing on
        let interaction = World.getInteraction(this.x, this.y);

        // Check tile player is facing
        if (!interaction) {
            let checkX = this.x;
            let checkY = this.y;

            switch (this.direction) {
                case 'up': checkY--; break;
                case 'down': checkY++; break;
                case 'left': checkX--; break;
                case 'right': checkX++; break;
            }

            interaction = World.getInteraction(checkX, checkY);
        }

        this.nearInteraction = interaction;
    },

    // Try to interact with nearby object
    interact() {
        if (this.nearInteraction) {
            return this.nearInteraction;
        }
        return null;
    },

    // Teleport player (used when entering/exiting buildings)
    teleport(x, y, direction = 'down') {
        this.x = x;
        this.y = y;
        this.pixelX = x * 16;
        this.pixelY = y * 16;
        this.targetX = x;
        this.targetY = y;
        this.direction = direction;
        this.moving = false;
        this.animating = false;
        this.frame = 0;
    },

    // Get current sprite frame data
    getSpriteFrame() {
        return Sprites.getCharacterFrame(this.direction, this.frame);
    },

    // Check if action key was just pressed
    actionPressed() {
        return this.keys.action;
    },

    // Clear action state (after handling)
    clearAction() {
        this.keys.action = false;
    }
};

// Export
window.Player = Player;
