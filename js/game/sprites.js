// Sprite generation and loading system
// Creates pixel art sprites programmatically (no external assets needed)

const Sprites = {
    tileSize: 16,
    scale: 3,
    cache: {},

    // Color palettes
    colors: {
        // Character colors
        skin: '#ffd5b0',
        skinShadow: '#d4a574',
        hair: '#4a3728',
        shirt: '#3498db',
        shirtShadow: '#2980b9',
        pants: '#34495e',
        pantsShadow: '#2c3e50',

        // Environment colors
        grass: '#4a7c59',
        grassLight: '#6b9b5a',
        grassDark: '#3d6b4a',
        path: '#c9a959',
        pathLight: '#ddc07a',
        pathShadow: '#a88a3d',
        water: '#4a90a4',
        waterLight: '#6bb3c9',
        waterDark: '#3a7a8a',

        // Building colors
        stone: '#8b8b8b',
        stoneLight: '#a0a0a0',
        stoneDark: '#707070',
        brick: '#8b5a2b',
        brickDark: '#6b4423',
        roof: '#5c4033',
        roofLight: '#7a5a4a',
        window: '#87ceeb',
        windowFrame: '#4a3728',
        door: '#6b4423',

        // Interior colors
        floor: '#c4a35a',
        floorDark: '#a8894a',
        wall: '#e8dcc8',
        wallDark: '#d4c8b4',
        wood: '#8b6914',
        woodDark: '#6b5010',

        // UI colors
        white: '#ffffff',
        black: '#1a1a2e',

        // Campus decoration colors
        metal: '#4a4a4a',
        metalLight: '#6a6a6a',
        metalDark: '#3a3a3a',
        ivyGreen: '#3d6b3d',
        ivyLight: '#4d8b4d',
        cobble: '#8a8070',
        cobbleLight: '#a09080',
        cobbleDark: '#6a6050',

        // Gothic/ornate building colors
        ornateStone: '#9a9a9a',
        ironGray: '#3a3a3a',

        // Modern building colors
        modernGray: '#b0b0b0',
        modernGrayDark: '#909090',
        glassBlue: '#a8d4e6',
        glassBlueDark: '#88b4c6',
        metalBrushed: '#7a7a7a',
        metalBrushedLight: '#9a9a9a',

        // Sign colors
        signWood: '#8b6914',
        signWoodDark: '#6b5010',
        signText: '#2a2a2a',
        signModern: '#e0e0e0',
        signModernDark: '#c0c0c0'
    },

    // Initialize sprite system
    init() {
        this.createAllSprites();
        return Promise.resolve();
    },

    // Create a canvas for drawing sprites
    createCanvas(width, height) {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        return canvas;
    },

    // Draw a pixel on canvas
    drawPixel(ctx, x, y, color, size = 1) {
        ctx.fillStyle = color;
        ctx.fillRect(x, y, size, size);
    },

    // Create all sprites
    createAllSprites() {
        this.createCharacterSprites();
        this.createTileSprites();
        this.createBuildingSprites();
        this.createInteriorSprites();
        this.createUISprites();
    },

    // Character sprite sheet (4 directions x 4 frames)
    createCharacterSprites() {
        const size = this.tileSize;
        const canvas = this.createCanvas(size * 4, size * 4);
        const ctx = canvas.getContext('2d');

        const directions = ['down', 'left', 'right', 'up'];

        directions.forEach((dir, row) => {
            for (let frame = 0; frame < 4; frame++) {
                const x = frame * size;
                const y = row * size;
                this.drawCharacter(ctx, x, y, dir, frame);
            }
        });

        this.cache.character = canvas;
    },

    // Draw a single character frame
    drawCharacter(ctx, x, y, direction, frame) {
        const c = this.colors;
        const walk = frame % 2; // Alternating walk cycle

        // Body offset for walking animation
        const bodyOffset = (frame === 1 || frame === 3) ? 1 : 0;

        // Head (always centered)
        ctx.fillStyle = c.hair;
        ctx.fillRect(x + 4, y + 1, 8, 4);
        ctx.fillStyle = c.skin;
        ctx.fillRect(x + 5, y + 4, 6, 4);

        // Eyes based on direction
        ctx.fillStyle = c.black;
        if (direction === 'down') {
            ctx.fillRect(x + 6, y + 5, 1, 2);
            ctx.fillRect(x + 9, y + 5, 1, 2);
        } else if (direction === 'up') {
            // No eyes visible from back
        } else if (direction === 'left') {
            ctx.fillRect(x + 5, y + 5, 1, 2);
        } else if (direction === 'right') {
            ctx.fillRect(x + 10, y + 5, 1, 2);
        }

        // Body/shirt
        ctx.fillStyle = c.shirt;
        ctx.fillRect(x + 4, y + 8 + bodyOffset, 8, 4);
        ctx.fillStyle = c.shirtShadow;
        ctx.fillRect(x + 4, y + 11 + bodyOffset, 8, 1);

        // Arms
        if (direction === 'left' || direction === 'right') {
            ctx.fillStyle = c.skin;
            ctx.fillRect(x + 3, y + 8, 2, 3);
            ctx.fillRect(x + 11, y + 8, 2, 3);
        } else {
            ctx.fillStyle = c.skin;
            const armOffset = walk ? 1 : 0;
            ctx.fillRect(x + 3, y + 8 + armOffset, 2, 3);
            ctx.fillRect(x + 11, y + 8 - armOffset, 2, 3);
        }

        // Legs/pants
        ctx.fillStyle = c.pants;
        if (walk && (direction === 'left' || direction === 'right')) {
            ctx.fillRect(x + 5, y + 12, 3, 3);
            ctx.fillRect(x + 8, y + 13, 3, 2);
        } else if (walk) {
            ctx.fillRect(x + 5, y + 12, 3, 4);
            ctx.fillRect(x + 8, y + 12, 3, 3);
        } else {
            ctx.fillRect(x + 5, y + 12, 6, 3);
        }

        // Feet
        ctx.fillStyle = c.pantsShadow;
        ctx.fillRect(x + 5, y + 15, 3, 1);
        ctx.fillRect(x + 8, y + 15, 3, 1);
    },

    // Create tile sprites
    createTileSprites() {
        const size = this.tileSize;
        const c = this.colors;

        // Grass tile
        const grass = this.createCanvas(size, size);
        const gCtx = grass.getContext('2d');
        gCtx.fillStyle = c.grass;
        gCtx.fillRect(0, 0, size, size);
        // Add texture
        gCtx.fillStyle = c.grassLight;
        for (let i = 0; i < 8; i++) {
            const px = Math.floor(Math.random() * size);
            const py = Math.floor(Math.random() * size);
            gCtx.fillRect(px, py, 1, 2);
        }
        gCtx.fillStyle = c.grassDark;
        for (let i = 0; i < 4; i++) {
            const px = Math.floor(Math.random() * size);
            const py = Math.floor(Math.random() * size);
            gCtx.fillRect(px, py, 1, 1);
        }
        this.cache.grass = grass;

        // Path tile
        const path = this.createCanvas(size, size);
        const pCtx = path.getContext('2d');
        pCtx.fillStyle = c.path;
        pCtx.fillRect(0, 0, size, size);
        pCtx.fillStyle = c.pathLight;
        for (let i = 0; i < 6; i++) {
            const px = Math.floor(Math.random() * size);
            const py = Math.floor(Math.random() * size);
            pCtx.fillRect(px, py, 2, 1);
        }
        pCtx.fillStyle = c.pathShadow;
        for (let i = 0; i < 4; i++) {
            const px = Math.floor(Math.random() * size);
            const py = Math.floor(Math.random() * size);
            pCtx.fillRect(px, py, 1, 1);
        }
        this.cache.path = path;

        // Water tile
        const water = this.createCanvas(size, size);
        const wCtx = water.getContext('2d');
        wCtx.fillStyle = c.water;
        wCtx.fillRect(0, 0, size, size);
        wCtx.fillStyle = c.waterLight;
        for (let y = 0; y < size; y += 4) {
            for (let x = 0; x < size; x += 6) {
                wCtx.fillRect(x + (y % 8 === 0 ? 0 : 3), y, 3, 1);
            }
        }
        this.cache.water = water;

        // Flower tile (grass with flowers)
        const flower = this.createCanvas(size, size);
        const fCtx = flower.getContext('2d');
        fCtx.drawImage(grass, 0, 0);
        // Add flowers
        const flowerColors = ['#ff6b6b', '#ffd93d', '#fff'];
        flowerColors.forEach((color, i) => {
            fCtx.fillStyle = color;
            fCtx.fillRect(4 + i * 4, 4, 2, 2);
            fCtx.fillRect(2 + i * 5, 10, 2, 2);
        });
        this.cache.flower = flower;

        // Tree tile (just the trunk, tree tops are separate)
        const tree = this.createCanvas(size, size);
        const tCtx = tree.getContext('2d');
        tCtx.drawImage(grass, 0, 0);
        tCtx.fillStyle = '#5d4037';
        tCtx.fillRect(6, 4, 4, 12);
        tCtx.fillStyle = '#4a3528';
        tCtx.fillRect(6, 4, 1, 12);
        this.cache.tree = tree;

        // Tree top
        const treeTop = this.createCanvas(size, size);
        const ttCtx = treeTop.getContext('2d');
        ttCtx.fillStyle = '#2d5a27';
        ttCtx.fillRect(2, 4, 12, 10);
        ttCtx.fillStyle = '#3d7a37';
        ttCtx.fillRect(4, 2, 8, 4);
        ttCtx.fillRect(3, 6, 10, 6);
        ttCtx.fillStyle = '#4d8a47';
        ttCtx.fillRect(5, 3, 6, 3);
        ttCtx.fillRect(4, 7, 8, 4);
        this.cache.treeTop = treeTop;

        // Gate (entrance archway - stone pillar with arch)
        const gate = this.createCanvas(size, size);
        const gateCtx = gate.getContext('2d');
        gateCtx.drawImage(grass, 0, 0);
        // Stone pillar
        gateCtx.fillStyle = c.stone;
        gateCtx.fillRect(4, 0, 8, 16);
        gateCtx.fillStyle = c.stoneDark;
        gateCtx.fillRect(4, 0, 1, 16);
        gateCtx.fillRect(11, 0, 1, 16);
        // Decorative top
        gateCtx.fillStyle = c.stoneLight;
        gateCtx.fillRect(3, 0, 10, 2);
        gateCtx.fillRect(5, 2, 6, 1);
        // Arch opening
        gateCtx.fillStyle = c.grass;
        gateCtx.fillRect(6, 6, 4, 10);
        this.cache.gate = gate;

        // Lamppost (metal post with lantern top on grass)
        const lamppost = this.createCanvas(size, size);
        const lpCtx = lamppost.getContext('2d');
        lpCtx.drawImage(grass, 0, 0);
        // Post
        lpCtx.fillStyle = c.metal;
        lpCtx.fillRect(7, 4, 2, 12);
        lpCtx.fillStyle = c.metalDark;
        lpCtx.fillRect(7, 4, 1, 12);
        // Lantern housing
        lpCtx.fillStyle = c.metalLight;
        lpCtx.fillRect(5, 0, 6, 4);
        lpCtx.fillStyle = c.metal;
        lpCtx.fillRect(5, 3, 6, 1);
        // Light glow (yellowish)
        lpCtx.fillStyle = '#ffd700';
        lpCtx.fillRect(6, 1, 4, 2);
        this.cache.lamppost = lamppost;

        // Bench left half (wooden park bench)
        const benchLeft = this.createCanvas(size, size);
        const blCtx = benchLeft.getContext('2d');
        blCtx.drawImage(grass, 0, 0);
        // Seat
        blCtx.fillStyle = c.wood;
        blCtx.fillRect(0, 8, 16, 3);
        blCtx.fillStyle = c.woodDark;
        blCtx.fillRect(0, 10, 16, 1);
        // Back
        blCtx.fillStyle = c.wood;
        blCtx.fillRect(0, 4, 16, 3);
        blCtx.fillStyle = c.woodDark;
        blCtx.fillRect(0, 6, 16, 1);
        // Left leg
        blCtx.fillStyle = c.metal;
        blCtx.fillRect(1, 11, 2, 5);
        this.cache.benchLeft = benchLeft;

        // Bench right half (wooden park bench)
        const benchRight = this.createCanvas(size, size);
        const brCtx = benchRight.getContext('2d');
        brCtx.drawImage(grass, 0, 0);
        // Seat
        brCtx.fillStyle = c.wood;
        brCtx.fillRect(0, 8, 16, 3);
        brCtx.fillStyle = c.woodDark;
        brCtx.fillRect(0, 10, 16, 1);
        // Back
        brCtx.fillStyle = c.wood;
        brCtx.fillRect(0, 4, 16, 3);
        brCtx.fillStyle = c.woodDark;
        brCtx.fillRect(0, 6, 16, 1);
        // Right leg
        brCtx.fillStyle = c.metal;
        brCtx.fillRect(13, 11, 2, 5);
        this.cache.benchRight = benchRight;

        // Ivy (vine overlay for walls - darker green tendrils)
        const ivy = this.createCanvas(size, size);
        const ivyCtx = ivy.getContext('2d');
        // Draw on stone background
        ivyCtx.fillStyle = c.stone;
        ivyCtx.fillRect(0, 0, size, size);
        // Vine tendrils
        ivyCtx.fillStyle = c.ivyGreen;
        ivyCtx.fillRect(2, 0, 2, 10);
        ivyCtx.fillRect(4, 3, 2, 2);
        ivyCtx.fillRect(10, 0, 2, 14);
        ivyCtx.fillRect(8, 6, 2, 2);
        ivyCtx.fillRect(12, 4, 2, 6);
        // Lighter leaves
        ivyCtx.fillStyle = c.ivyLight;
        ivyCtx.fillRect(1, 2, 2, 2);
        ivyCtx.fillRect(3, 5, 2, 2);
        ivyCtx.fillRect(9, 3, 2, 2);
        ivyCtx.fillRect(11, 8, 2, 2);
        ivyCtx.fillRect(13, 2, 2, 2);
        this.cache.ivy = ivy;

        // Cobblestone path (irregular stones variant)
        const cobble = this.createCanvas(size, size);
        const cobCtx = cobble.getContext('2d');
        cobCtx.fillStyle = c.cobble;
        cobCtx.fillRect(0, 0, size, size);
        // Irregular stone pattern
        cobCtx.fillStyle = c.cobbleDark;
        cobCtx.fillRect(0, 0, 5, 4);
        cobCtx.fillRect(6, 0, 4, 5);
        cobCtx.fillRect(11, 0, 5, 4);
        cobCtx.fillRect(0, 5, 6, 4);
        cobCtx.fillRect(7, 6, 5, 5);
        cobCtx.fillRect(13, 5, 3, 5);
        cobCtx.fillRect(0, 10, 4, 6);
        cobCtx.fillRect(5, 11, 5, 5);
        cobCtx.fillRect(11, 11, 5, 5);
        // Highlights
        cobCtx.fillStyle = c.cobbleLight;
        cobCtx.fillRect(1, 1, 3, 2);
        cobCtx.fillRect(7, 1, 2, 3);
        cobCtx.fillRect(12, 1, 3, 2);
        cobCtx.fillRect(1, 6, 4, 2);
        cobCtx.fillRect(8, 7, 3, 3);
        cobCtx.fillRect(6, 12, 3, 3);
        this.cache.cobble = cobble;
    },

    // Create building sprites
    createBuildingSprites() {
        const size = this.tileSize;
        const c = this.colors;

        // Building wall
        const wall = this.createCanvas(size, size);
        const wallCtx = wall.getContext('2d');
        wallCtx.fillStyle = c.stone;
        wallCtx.fillRect(0, 0, size, size);
        // Stone pattern
        wallCtx.fillStyle = c.stoneDark;
        for (let y = 0; y < size; y += 4) {
            for (let x = 0; x < size; x += 8) {
                const offset = (y % 8 === 0) ? 0 : 4;
                wallCtx.fillRect(x + offset, y, 7, 3);
                wallCtx.fillStyle = c.stoneLight;
                wallCtx.fillRect(x + offset + 1, y + 1, 5, 1);
                wallCtx.fillStyle = c.stoneDark;
            }
        }
        this.cache.wall = wall;

        // Roof tile
        const roof = this.createCanvas(size, size);
        const roofCtx = roof.getContext('2d');
        roofCtx.fillStyle = c.roof;
        roofCtx.fillRect(0, 0, size, size);
        roofCtx.fillStyle = c.roofLight;
        for (let y = 0; y < size; y += 4) {
            roofCtx.fillRect(0, y, size, 2);
        }
        this.cache.roof = roof;

        // Door
        const door = this.createCanvas(size, size);
        const doorCtx = door.getContext('2d');
        doorCtx.fillStyle = c.stone;
        doorCtx.fillRect(0, 0, size, size);
        doorCtx.fillStyle = c.door;
        doorCtx.fillRect(2, 2, 12, 14);
        doorCtx.fillStyle = '#4a2813';
        doorCtx.fillRect(2, 2, 12, 2);
        doorCtx.fillRect(2, 2, 2, 14);
        // Door handle
        doorCtx.fillStyle = '#ffd700';
        doorCtx.fillRect(11, 9, 2, 2);
        this.cache.door = door;

        // Window
        const window = this.createCanvas(size, size);
        const winCtx = window.getContext('2d');
        winCtx.fillStyle = c.stone;
        winCtx.fillRect(0, 0, size, size);
        winCtx.fillStyle = c.windowFrame;
        winCtx.fillRect(2, 2, 12, 12);
        winCtx.fillStyle = c.window;
        winCtx.fillRect(3, 3, 10, 10);
        // Window cross
        winCtx.fillStyle = c.windowFrame;
        winCtx.fillRect(7, 3, 2, 10);
        winCtx.fillRect(3, 7, 10, 2);
        this.cache.window = window;

        // Chapel spire element
        const spire = this.createCanvas(size, size);
        const spireCtx = spire.getContext('2d');
        spireCtx.fillStyle = c.stone;
        spireCtx.fillRect(4, 8, 8, 8);
        spireCtx.fillRect(6, 4, 4, 4);
        spireCtx.fillRect(7, 0, 2, 4);
        this.cache.spire = spire;

        // Sign post
        const sign = this.createCanvas(size, size);
        const signCtx = sign.getContext('2d');
        signCtx.drawImage(this.cache.grass, 0, 0);
        signCtx.fillStyle = '#5d4037';
        signCtx.fillRect(7, 6, 2, 10);
        signCtx.fillStyle = '#8b6914';
        signCtx.fillRect(2, 2, 12, 6);
        signCtx.fillStyle = '#6b5010';
        signCtx.fillRect(2, 7, 12, 1);
        this.cache.sign = sign;

        // === Gothic Architectural Sprites ===

        // Gothic window - Arched window with pointed top
        const gothicWindow = this.createCanvas(size, size);
        const gwCtx = gothicWindow.getContext('2d');
        gwCtx.fillStyle = c.stone;
        gwCtx.fillRect(0, 0, size, size);
        // Stone frame with pointed arch
        gwCtx.fillStyle = c.windowFrame;
        gwCtx.fillRect(2, 4, 12, 12);
        // Pointed arch top
        gwCtx.fillRect(3, 3, 10, 1);
        gwCtx.fillRect(4, 2, 8, 1);
        gwCtx.fillRect(5, 1, 6, 1);
        gwCtx.fillRect(6, 0, 4, 1);
        gwCtx.fillRect(7, 0, 2, 1);
        // Glass with pointed arch shape
        gwCtx.fillStyle = c.window;
        gwCtx.fillRect(4, 5, 8, 10);
        gwCtx.fillRect(5, 4, 6, 1);
        gwCtx.fillRect(6, 3, 4, 1);
        gwCtx.fillRect(7, 2, 2, 1);
        // Tracery lines (gothic detail)
        gwCtx.fillStyle = c.windowFrame;
        gwCtx.fillRect(7, 2, 2, 13);
        gwCtx.fillRect(4, 9, 8, 1);
        // Decorative highlight at arch peak
        gwCtx.fillStyle = c.stoneLight;
        gwCtx.fillRect(7, 1, 2, 1);
        this.cache.gothicWindow = gothicWindow;

        // Gothic door - Arched doorway with pointed top
        const gothicDoor = this.createCanvas(size, size);
        const gdCtx = gothicDoor.getContext('2d');
        gdCtx.fillStyle = c.stone;
        gdCtx.fillRect(0, 0, size, size);
        // Stone frame with pointed arch
        gdCtx.fillStyle = c.stoneDark;
        gdCtx.fillRect(1, 4, 14, 12);
        gdCtx.fillRect(2, 3, 12, 1);
        gdCtx.fillRect(3, 2, 10, 1);
        gdCtx.fillRect(4, 1, 8, 1);
        gdCtx.fillRect(5, 0, 6, 1);
        // Wooden door
        gdCtx.fillStyle = c.door;
        gdCtx.fillRect(3, 5, 10, 11);
        gdCtx.fillRect(4, 4, 8, 1);
        gdCtx.fillRect(5, 3, 6, 1);
        gdCtx.fillRect(6, 2, 4, 1);
        // Wood grain/planks
        gdCtx.fillStyle = '#5a3a1a';
        gdCtx.fillRect(8, 4, 1, 12);
        // Iron studs
        gdCtx.fillStyle = c.ironGray;
        gdCtx.fillRect(4, 6, 2, 2);
        gdCtx.fillRect(10, 6, 2, 2);
        gdCtx.fillRect(4, 11, 2, 2);
        gdCtx.fillRect(10, 11, 2, 2);
        // Door handle (iron ring)
        gdCtx.fillStyle = c.ironGray;
        gdCtx.fillRect(5, 9, 2, 2);
        gdCtx.fillStyle = '#ffd700';
        gdCtx.fillRect(6, 9, 1, 1);
        this.cache.gothicDoor = gothicDoor;

        // Ornate wall - Decorative stone wall with carved details
        const ornateWall = this.createCanvas(size, size);
        const owCtx = ornateWall.getContext('2d');
        owCtx.fillStyle = c.stone;
        owCtx.fillRect(0, 0, size, size);
        // Stone pattern (like regular wall)
        owCtx.fillStyle = c.stoneDark;
        for (let y = 0; y < size; y += 4) {
            for (let x = 0; x < size; x += 8) {
                const offset = (y % 8 === 0) ? 0 : 4;
                owCtx.fillRect(x + offset, y, 7, 3);
            }
        }
        // Carved relief bands (horizontal decorative lines)
        owCtx.fillStyle = c.ornateStone;
        owCtx.fillRect(0, 0, size, 2);
        owCtx.fillRect(0, 7, size, 2);
        owCtx.fillRect(0, 14, size, 2);
        // Decorative diamond pattern in bands
        owCtx.fillStyle = c.stoneLight;
        owCtx.fillRect(3, 0, 2, 2);
        owCtx.fillRect(11, 0, 2, 2);
        owCtx.fillRect(7, 7, 2, 2);
        owCtx.fillRect(3, 14, 2, 2);
        owCtx.fillRect(11, 14, 2, 2);
        this.cache.ornateWall = ornateWall;

        // Archway - Stone archway entrance
        const archway = this.createCanvas(size, size);
        const awCtx = archway.getContext('2d');
        // Background (transparent/passable)
        awCtx.fillStyle = c.grass;
        awCtx.fillRect(0, 0, size, size);
        // Stone pillars on sides
        awCtx.fillStyle = c.stone;
        awCtx.fillRect(0, 0, 4, size);
        awCtx.fillRect(12, 0, 4, size);
        // Arch top
        awCtx.fillRect(0, 0, size, 4);
        awCtx.fillRect(2, 4, 12, 2);
        awCtx.fillRect(3, 6, 10, 1);
        awCtx.fillRect(4, 7, 8, 1);
        // Shadow/depth on pillars
        awCtx.fillStyle = c.stoneDark;
        awCtx.fillRect(3, 0, 1, size);
        awCtx.fillRect(12, 0, 1, size);
        // Keystone at top
        awCtx.fillStyle = c.stoneLight;
        awCtx.fillRect(6, 0, 4, 3);
        awCtx.fillRect(7, 3, 2, 2);
        this.cache.archway = archway;

        // Spire top - Enhanced spire for tower tops
        const spireTop = this.createCanvas(size, size);
        const stCtx = spireTop.getContext('2d');
        // Pointed spire shape
        stCtx.fillStyle = c.stone;
        stCtx.fillRect(6, 8, 4, 8);
        stCtx.fillRect(5, 10, 6, 6);
        stCtx.fillRect(4, 12, 8, 4);
        // Narrowing toward top
        stCtx.fillRect(7, 4, 2, 4);
        stCtx.fillRect(7, 2, 2, 2);
        // Cross/finial at top
        stCtx.fillStyle = c.ironGray;
        stCtx.fillRect(7, 0, 2, 4);
        stCtx.fillRect(6, 1, 4, 2);
        // Highlight
        stCtx.fillStyle = c.stoneLight;
        stCtx.fillRect(8, 4, 1, 4);
        stCtx.fillRect(6, 10, 1, 6);
        this.cache.spireTop = spireTop;

        // Battlement - Crenellated wall top (castle-like)
        const battlement = this.createCanvas(size, size);
        const btCtx = battlement.getContext('2d');
        // Base wall
        btCtx.fillStyle = c.stone;
        btCtx.fillRect(0, 8, size, 8);
        // Crenellations (alternating high/low)
        btCtx.fillRect(0, 0, 4, 8);
        btCtx.fillRect(6, 4, 4, 4);
        btCtx.fillRect(12, 0, 4, 8);
        // Shadow for depth
        btCtx.fillStyle = c.stoneDark;
        btCtx.fillRect(3, 0, 1, 8);
        btCtx.fillRect(9, 4, 1, 4);
        btCtx.fillRect(15, 0, 1, 8);
        btCtx.fillRect(0, 15, size, 1);
        // Highlight
        btCtx.fillStyle = c.stoneLight;
        btCtx.fillRect(0, 0, 3, 1);
        btCtx.fillRect(6, 4, 3, 1);
        btCtx.fillRect(12, 0, 3, 1);
        this.cache.battlement = battlement;
    },

    // Create interior sprites
    createInteriorSprites() {
        const size = this.tileSize;
        const c = this.colors;

        // Wood floor
        const woodFloor = this.createCanvas(size, size);
        const wfCtx = woodFloor.getContext('2d');
        wfCtx.fillStyle = c.floor;
        wfCtx.fillRect(0, 0, size, size);
        wfCtx.fillStyle = c.floorDark;
        for (let x = 0; x < size; x += 4) {
            wfCtx.fillRect(x, 0, 1, size);
        }
        this.cache.woodFloor = woodFloor;

        // Interior wall
        const intWall = this.createCanvas(size, size);
        const iwCtx = intWall.getContext('2d');
        iwCtx.fillStyle = c.wall;
        iwCtx.fillRect(0, 0, size, size);
        iwCtx.fillStyle = c.wallDark;
        iwCtx.fillRect(0, 14, size, 2);
        this.cache.interiorWall = intWall;

        // Bookshelf
        const bookshelf = this.createCanvas(size, size);
        const bsCtx = bookshelf.getContext('2d');
        bsCtx.fillStyle = c.wood;
        bsCtx.fillRect(0, 0, size, size);
        bsCtx.fillStyle = c.woodDark;
        bsCtx.fillRect(0, 5, size, 1);
        bsCtx.fillRect(0, 10, size, 1);
        bsCtx.fillRect(0, 15, size, 1);
        // Books
        const bookColors = ['#c0392b', '#27ae60', '#2980b9', '#8e44ad', '#f39c12'];
        bookColors.forEach((color, i) => {
            bsCtx.fillStyle = color;
            bsCtx.fillRect(1 + i * 3, 1, 2, 4);
            bsCtx.fillRect(2 + i * 3, 6, 2, 4);
            bsCtx.fillRect(1 + i * 3, 11, 2, 4);
        });
        this.cache.bookshelf = bookshelf;

        // Desk
        const desk = this.createCanvas(size, size);
        const dCtx = desk.getContext('2d');
        dCtx.fillStyle = c.wood;
        dCtx.fillRect(0, 4, size, 4);
        dCtx.fillStyle = c.woodDark;
        dCtx.fillRect(1, 8, 3, 8);
        dCtx.fillRect(12, 8, 3, 8);
        dCtx.fillRect(0, 7, size, 1);
        // Items on desk
        dCtx.fillStyle = '#fff';
        dCtx.fillRect(4, 2, 4, 3); // Paper
        dCtx.fillStyle = '#333';
        dCtx.fillRect(10, 2, 4, 2); // Laptop
        this.cache.desk = desk;

        // Computer/monitor
        const computer = this.createCanvas(size, size);
        const compCtx = computer.getContext('2d');
        compCtx.fillStyle = '#333';
        compCtx.fillRect(2, 2, 12, 10);
        compCtx.fillStyle = '#1a1a2e';
        compCtx.fillRect(3, 3, 10, 8);
        compCtx.fillStyle = '#00ff00';
        compCtx.fillRect(4, 4, 8, 1);
        compCtx.fillRect(4, 6, 6, 1);
        compCtx.fillRect(4, 8, 7, 1);
        compCtx.fillStyle = '#333';
        compCtx.fillRect(6, 12, 4, 2);
        compCtx.fillRect(4, 14, 8, 2);
        this.cache.computer = computer;

        // Podium/lectern
        const podium = this.createCanvas(size, size);
        const podCtx = podium.getContext('2d');
        podCtx.fillStyle = c.wood;
        podCtx.fillRect(4, 0, 8, 4);
        podCtx.fillRect(5, 4, 6, 2);
        podCtx.fillRect(6, 6, 4, 10);
        podCtx.fillStyle = c.woodDark;
        podCtx.fillRect(4, 3, 8, 1);
        podCtx.fillRect(6, 15, 4, 1);
        this.cache.podium = podium;

        // Lab bench
        const bench = this.createCanvas(size, size);
        const benchCtx = bench.getContext('2d');
        benchCtx.fillStyle = '#aaa';
        benchCtx.fillRect(0, 4, size, 3);
        benchCtx.fillStyle = '#888';
        benchCtx.fillRect(1, 7, 3, 9);
        benchCtx.fillRect(12, 7, 3, 9);
        // Equipment
        benchCtx.fillStyle = '#3498db';
        benchCtx.fillRect(4, 1, 3, 4);
        benchCtx.fillStyle = '#e74c3c';
        benchCtx.fillRect(9, 2, 2, 3);
        this.cache.bench = bench;

        // Chair
        const chair = this.createCanvas(size, size);
        const chairCtx = chair.getContext('2d');
        chairCtx.fillStyle = c.wood;
        chairCtx.fillRect(4, 8, 8, 2);
        chairCtx.fillRect(5, 10, 2, 6);
        chairCtx.fillRect(9, 10, 2, 6);
        chairCtx.fillRect(4, 0, 8, 8);
        chairCtx.fillStyle = '#c0392b';
        chairCtx.fillRect(5, 1, 6, 6);
        this.cache.chair = chair;
    },

    // Create UI sprites
    createUISprites() {
        const c = this.colors;

        // Interaction indicator (down arrow)
        const indicator = this.createCanvas(16, 16);
        const iCtx = indicator.getContext('2d');
        iCtx.fillStyle = c.white;
        iCtx.fillRect(6, 0, 4, 10);
        iCtx.fillRect(2, 6, 12, 4);
        iCtx.fillRect(4, 10, 8, 2);
        iCtx.fillRect(6, 12, 4, 2);
        this.cache.indicator = indicator;
    },

    // Get sprite from cache
    get(name) {
        return this.cache[name] || null;
    },

    // Get character frame
    getCharacterFrame(direction, frame) {
        const dirIndex = { down: 0, left: 1, right: 2, up: 3 };
        const row = dirIndex[direction] || 0;
        const col = frame % 4;

        return {
            image: this.cache.character,
            sx: col * this.tileSize,
            sy: row * this.tileSize,
            sw: this.tileSize,
            sh: this.tileSize
        };
    }
};

// Export for use in other modules
window.Sprites = Sprites;
