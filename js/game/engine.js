// Game engine - main game loop and rendering

const Engine = {
    // Canvas and context
    canvas: null,
    ctx: null,

    // Rendering settings
    scale: 3,
    tileSize: 16,

    // Camera
    camera: {
        x: 0,
        y: 0,
        width: 0,
        height: 0
    },

    // Game state
    running: false,
    lastTime: 0,
    accumulator: 0,
    fixedDelta: 1000 / 60, // 60 FPS

    // Loading state
    loaded: false,

    // Touch device detection
    isMobile: false,

    // Initialize the game engine
    async init() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');

        // Detect mobile
        this.isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

        // Set up canvas size
        this.resize();
        window.addEventListener('resize', () => this.resize());

        // Initialize systems
        await Sprites.init();
        World.init();
        Buildings.init();

        // Set player start position (entrance gate at bottom center)
        Player.init(20, 26);

        // Mark as loaded
        this.loaded = true;

        // Hide loading screen
        this.hideLoadingScreen();

        // Update location display
        this.updateLocationDisplay();
    },

    // Resize canvas to fill viewport
    resize() {
        const dpr = window.devicePixelRatio || 1;

        // Set display size
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';

        // Set actual size in memory
        this.canvas.width = window.innerWidth * dpr;
        this.canvas.height = window.innerHeight * dpr;

        // Scale context
        this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        // Disable image smoothing for pixel-perfect rendering
        this.ctx.imageSmoothingEnabled = false;

        // Update camera dimensions
        this.camera.width = Math.ceil(window.innerWidth / (this.tileSize * this.scale));
        this.camera.height = Math.ceil(window.innerHeight / (this.tileSize * this.scale));
    },

    // Start the game loop
    start() {
        if (this.running) return;
        this.running = true;
        this.lastTime = performance.now();
        requestAnimationFrame((time) => this.loop(time));
    },

    // Stop the game loop
    stop() {
        this.running = false;
    },

    // Main game loop
    loop(currentTime) {
        if (!this.running) return;

        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;

        this.accumulator += deltaTime;

        // Fixed timestep updates
        while (this.accumulator >= this.fixedDelta) {
            this.update();
            this.accumulator -= this.fixedDelta;
        }

        // Render
        this.render();

        requestAnimationFrame((time) => this.loop(time));
    },

    // Update game state
    update() {
        // Handle dialog actions first
        if (Buildings.isDialogOpen()) {
            if (Player.actionPressed()) {
                Buildings.handleDialogAction();
                Player.clearAction();
            }
            return;
        }

        // Update player
        Player.update();

        // Handle interactions - use proximity detection or current interaction
        if (Player.actionPressed()) {
            // First check proximity-detected interaction, then fall back to Player's facing check
            const interaction = Buildings.currentInteraction || Player.interact();
            if (interaction) {
                const result = Buildings.handleInteraction(interaction);
                if (result) {
                    this.handleInteractionResult(result);
                }
            }
            Player.clearAction();
        }

        // Update interaction prompt using proximity detection
        // Check 1-tile radius around player for interactions
        if (!Buildings.isDialogOpen() && !Buildings.isPanelOpen()) {
            const nearbyInteraction = World.checkNearbyInteractions(Player.x, Player.y);
            Buildings.updatePrompt(nearbyInteraction, this.isMobile);
        } else {
            Buildings.hidePrompt();
        }

        // Update camera to follow player
        this.updateCamera();
    },

    // Handle interaction results
    handleInteractionResult(result) {
        switch (result.action) {
            case 'enter':
                this.enterBuilding(result.building);
                break;
            case 'exit':
                this.exitBuilding();
                break;
        }
    },

    // Enter a building
    enterBuilding(buildingId) {
        const interior = World.enterBuilding(buildingId);
        if (interior) {
            // Track visit and check if first time
            const isFirstVisit = Buildings.recordVisit(buildingId);

            Player.teleport(interior.spawn.x, interior.spawn.y, 'up');
            this.updateLocationDisplay();

            // Show context-aware welcome message
            const welcomeMsg = Buildings.getWelcomeMessage(buildingId, isFirstVisit);
            Buildings.showDialog(interior.name, welcomeMsg);
        }
    },

    // Exit building to campus
    exitBuilding() {
        const spawnPoint = World.exitBuilding();
        Player.teleport(spawnPoint.x, spawnPoint.y, 'down');
        this.updateLocationDisplay();
    },

    // Update camera position
    updateCamera() {
        const map = World.getCurrentMap();

        // Center camera on player
        this.camera.x = Player.pixelX - (this.camera.width * this.tileSize) / 2 + this.tileSize / 2;
        this.camera.y = Player.pixelY - (this.camera.height * this.tileSize) / 2 + this.tileSize / 2;

        // Clamp camera to map bounds
        const maxX = map.width * this.tileSize - this.camera.width * this.tileSize;
        const maxY = map.height * this.tileSize - this.camera.height * this.tileSize;

        this.camera.x = Math.max(0, Math.min(this.camera.x, maxX));
        this.camera.y = Math.max(0, Math.min(this.camera.y, maxY));
    },

    // Render the game
    render() {
        const ctx = this.ctx;
        const scale = this.scale;
        const tileSize = this.tileSize;

        // Clear canvas
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Calculate visible tile range
        const startTileX = Math.floor(this.camera.x / tileSize);
        const startTileY = Math.floor(this.camera.y / tileSize);
        const endTileX = startTileX + this.camera.width + 2;
        const endTileY = startTileY + this.camera.height + 2;

        // Render ground layer
        for (let y = startTileY; y < endTileY; y++) {
            for (let x = startTileX; x < endTileX; x++) {
                const groundTile = World.getTile(x, y, 'ground');
                this.renderTile(groundTile, x, y);
            }
        }

        // Render objects layer (below player)
        for (let y = startTileY; y < endTileY; y++) {
            for (let x = startTileX; x < endTileX; x++) {
                const objectTile = World.getTile(x, y, 'objects');
                if (objectTile !== -1 && objectTile !== World.TILES.TREE_TOP) {
                    this.renderTile(objectTile, x, y);
                }
            }
        }

        // Render player
        this.renderPlayer();

        // Render objects above player (tree tops, etc.)
        for (let y = startTileY; y < endTileY; y++) {
            for (let x = startTileX; x < endTileX; x++) {
                const objectTile = World.getTile(x, y, 'objects');
                if (objectTile === World.TILES.TREE_TOP) {
                    this.renderTile(objectTile, x, y);
                }
            }
        }
    },

    // Render a single tile
    renderTile(tileType, tileX, tileY) {
        if (tileType === -1) return;

        const spriteName = World.getTileSprite(tileType);
        if (!spriteName) return;

        const sprite = Sprites.get(spriteName);
        if (!sprite) return;

        const screenX = (tileX * this.tileSize - this.camera.x) * this.scale;
        const screenY = (tileY * this.tileSize - this.camera.y) * this.scale;

        this.ctx.drawImage(
            sprite,
            0, 0, this.tileSize, this.tileSize,
            Math.floor(screenX), Math.floor(screenY),
            this.tileSize * this.scale, this.tileSize * this.scale
        );
    },

    // Render the player
    renderPlayer() {
        const frame = Player.getSpriteFrame();

        const screenX = (Player.pixelX - this.camera.x) * this.scale;
        const screenY = (Player.pixelY - this.camera.y) * this.scale;

        this.ctx.drawImage(
            frame.image,
            frame.sx, frame.sy, frame.sw, frame.sh,
            Math.floor(screenX), Math.floor(screenY),
            this.tileSize * this.scale, this.tileSize * this.scale
        );
    },

    // Update location display in HUD
    updateLocationDisplay() {
        const locationEl = document.getElementById('current-location');
        if (!locationEl) return;

        if (World.currentLocation === 'campus') {
            locationEl.textContent = 'Cambridge Campus';
        } else {
            const interior = World.interiorMaps[World.currentLocation];
            if (interior) {
                locationEl.textContent = interior.name;
            }
        }
    },

    // Hide loading screen
    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            // Animate loading bar
            const progress = loadingScreen.querySelector('.loading-progress');
            if (progress) {
                progress.style.width = '100%';
            }

            setTimeout(() => {
                loadingScreen.classList.add('hidden');
            }, 500);
        }
    },

    // Show loading screen
    showLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.remove('hidden');
            const progress = loadingScreen.querySelector('.loading-progress');
            if (progress) {
                progress.style.width = '0%';
            }
        }
    }
};

// Export
window.Engine = Engine;
