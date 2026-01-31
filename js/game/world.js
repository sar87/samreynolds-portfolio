// World map and collision detection for Cambridge campus

const World = {
    // Map dimensions (in tiles)
    width: 40,
    height: 30,
    tileSize: 16,

    // Current location (campus or interior)
    currentLocation: 'campus',

    // Tile types
    TILES: {
        GRASS: 0,
        PATH: 1,
        WATER: 2,
        FLOWER: 3,
        TREE: 4,
        TREE_TOP: 5,
        WALL: 6,
        ROOF: 7,
        DOOR: 8,
        WINDOW: 9,
        SPIRE: 10,
        SIGN: 11,
        // Campus decorations
        GATE: 12,
        LAMPPOST: 13,
        BENCH_LEFT: 14,
        BENCH_RIGHT: 15,
        IVY: 16,
        COBBLE: 17,
        // Interior tiles
        WOOD_FLOOR: 20,
        INT_WALL: 21,
        BOOKSHELF: 22,
        DESK: 23,
        COMPUTER: 24,
        PODIUM: 25,
        LAB_BENCH: 26,
        CHAIR: 27
    },

    // Building definitions with entry points
    buildings: {
        office: {
            name: "Sam's Office",
            contentKey: 'about',
            entrance: { x: 8, y: 12 },
            tiles: { x: 6, y: 9, w: 5, h: 4 }
        },
        library: {
            name: "King's College Library",
            contentKey: 'publications',
            entrance: { x: 20, y: 18 },
            tiles: { x: 17, y: 14, w: 7, h: 5 }
        },
        lectureHall: {
            name: "Senate House",
            contentKey: 'media',
            entrance: { x: 32, y: 12 },
            tiles: { x: 29, y: 9, w: 6, h: 4 }
        },
        lab: {
            name: "Research Lab",
            contentKey: 'research',
            entrance: { x: 20, y: 7 },
            tiles: { x: 17, y: 4, w: 7, h: 4 }
        }
    },

    // Campus map layers
    campusMap: null,

    // Interior maps for each building
    interiorMaps: {},

    // Initialize the world
    init() {
        this.generateCampusMap();
        this.generateInteriorMaps();
    },

    // Generate the main campus map
    generateCampusMap() {
        const T = this.TILES;
        const w = this.width;
        const h = this.height;

        // Initialize layers
        const ground = new Array(w * h).fill(T.GRASS);
        const objects = new Array(w * h).fill(-1);
        const collision = new Array(w * h).fill(0);
        const interact = new Array(w * h).fill(null);

        // Helper to set tile
        const setTile = (x, y, groundTile, objectTile = -1, blocked = false, interactData = null) => {
            if (x < 0 || x >= w || y < 0 || y >= h) return;
            const idx = y * w + x;
            if (groundTile !== null) ground[idx] = groundTile;
            if (objectTile !== -1) objects[idx] = objectTile;
            if (blocked) collision[idx] = 1;
            if (interactData) interact[idx] = interactData;
        };

        // Draw paths
        // Main horizontal path
        for (let x = 0; x < w; x++) {
            setTile(x, 13, T.PATH);
            setTile(x, 14, T.PATH);
        }

        // Vertical paths
        for (let y = 5; y < 25; y++) {
            setTile(8, y, T.PATH);
            setTile(20, y, T.PATH);
            setTile(32, y, T.PATH);
        }

        // River Cam (left side)
        for (let y = 0; y < h; y++) {
            setTile(0, y, T.WATER, -1, true);
            setTile(1, y, T.WATER, -1, true);
            setTile(2, y, T.WATER, -1, true);
        }

        // Decorative flowers
        const flowerPositions = [
            [5, 16], [6, 17], [10, 5], [11, 6], [24, 20], [25, 21],
            [35, 16], [36, 17], [14, 10], [15, 11], [26, 10], [27, 11]
        ];
        flowerPositions.forEach(([x, y]) => setTile(x, y, T.FLOWER));

        // Trees
        const treePositions = [
            [4, 4], [4, 20], [4, 25], [12, 4], [12, 20], [12, 25],
            [24, 4], [24, 24], [28, 20], [36, 4], [36, 20], [36, 25],
            [14, 17], [26, 17], [38, 10], [38, 16]
        ];
        treePositions.forEach(([x, y]) => {
            setTile(x, y, T.GRASS, T.TREE, true);
            setTile(x, y - 1, null, T.TREE_TOP, true);
        });

        // Build buildings
        this.buildBuilding(ground, objects, collision, interact, 'office', 6, 9, 5, 4, "Sam's Office");
        this.buildBuilding(ground, objects, collision, interact, 'library', 17, 14, 7, 5, "Library");
        this.buildBuilding(ground, objects, collision, interact, 'lectureHall', 29, 9, 6, 4, "Lecture Hall");
        this.buildBuilding(ground, objects, collision, interact, 'lab', 17, 4, 7, 4, "Research Lab");

        // Add signs near buildings
        setTile(7, 13, T.GRASS, T.SIGN, true, { type: 'sign', text: "Sam's Office - About Me", building: 'office' });
        setTile(19, 19, T.GRASS, T.SIGN, true, { type: 'sign', text: "King's College Library - Publications", building: 'library' });
        setTile(31, 13, T.GRASS, T.SIGN, true, { type: 'sign', text: "Senate House - Media & Talks", building: 'lectureHall' });
        setTile(19, 8, T.GRASS, T.SIGN, true, { type: 'sign', text: "Research Lab - Current Projects", building: 'lab' });

        // Welcome sign at spawn
        setTile(20, 22, T.GRASS, T.SIGN, true, { type: 'sign', text: "Welcome to Cambridge! Explore the campus to learn about Sam's work. Enter buildings to discover more." });

        this.campusMap = {
            width: w,
            height: h,
            layers: { ground, objects, collision, interact }
        };
    },

    // Helper to build a building on the map
    buildBuilding(ground, objects, collision, interact, id, x, y, w, h, name) {
        const T = this.TILES;
        const mapW = this.width;
        const building = this.buildings[id];

        // Fill building area with walls
        for (let bx = x; bx < x + w; bx++) {
            for (let by = y; by < y + h; by++) {
                const idx = by * mapW + bx;
                objects[idx] = T.WALL;
                collision[idx] = 1;
            }
        }

        // Add roof (top row)
        for (let bx = x; bx < x + w; bx++) {
            const idx = y * mapW + bx;
            objects[idx] = T.ROOF;
        }

        // Add windows
        for (let bx = x + 1; bx < x + w - 1; bx += 2) {
            if (bx !== building.entrance.x) {
                const idx = (y + 2) * mapW + bx;
                objects[idx] = T.WINDOW;
            }
        }

        // Add door at entrance
        const doorIdx = (building.entrance.y) * mapW + building.entrance.x;
        objects[doorIdx] = T.DOOR;
        collision[doorIdx] = 0; // Door is walkable (to enter)
        interact[doorIdx] = { type: 'door', building: id, name };

        // Make tile in front of door walkable and interactive
        const frontIdx = (building.entrance.y + 1) * mapW + building.entrance.x;
        ground[frontIdx] = T.PATH;
        collision[frontIdx] = 0;
        interact[frontIdx] = { type: 'entrance', building: id, name };
    },

    // Generate interior maps for each building
    generateInteriorMaps() {
        this.interiorMaps.office = this.generateOfficeInterior();
        this.interiorMaps.library = this.generateLibraryInterior();
        this.interiorMaps.lectureHall = this.generateLectureHallInterior();
        this.interiorMaps.lab = this.generateLabInterior();
    },

    // Generate office interior
    generateOfficeInterior() {
        const T = this.TILES;
        const w = 12;
        const h = 10;

        const ground = new Array(w * h).fill(T.WOOD_FLOOR);
        const objects = new Array(w * h).fill(-1);
        const collision = new Array(w * h).fill(0);
        const interact = new Array(w * h).fill(null);

        // Walls (top row)
        for (let x = 0; x < w; x++) {
            objects[x] = T.INT_WALL;
            collision[x] = 1;
        }

        // Side walls
        for (let y = 0; y < h; y++) {
            collision[y * w] = 1;
            collision[y * w + (w - 1)] = 1;
        }

        // Desk with computer
        objects[2 * w + 2] = T.DESK;
        collision[2 * w + 2] = 1;
        interact[3 * w + 2] = { type: 'object', id: 'desk', content: 'office.desk' };

        objects[2 * w + 3] = T.COMPUTER;
        collision[2 * w + 3] = 1;
        interact[3 * w + 3] = { type: 'object', id: 'computer', content: 'office.computer' };

        // Chair
        objects[3 * w + 2] = T.CHAIR;

        // Bookshelf
        for (let x = 6; x < 10; x++) {
            objects[1 * w + x] = T.BOOKSHELF;
            collision[1 * w + x] = 1;
            interact[2 * w + x] = { type: 'object', id: 'bookshelf', content: 'office.bookshelf' };
        }

        // Window (interactable)
        objects[1 * w + 10] = T.WINDOW;
        collision[1 * w + 10] = 1;
        interact[2 * w + 10] = { type: 'object', id: 'window', content: 'office.window' };

        // Exit
        interact[(h - 1) * w + Math.floor(w / 2)] = { type: 'exit' };

        return {
            name: "Sam's Office",
            width: w,
            height: h,
            spawn: { x: Math.floor(w / 2), y: h - 2 },
            layers: { ground, objects, collision, interact }
        };
    },

    // Generate library interior
    generateLibraryInterior() {
        const T = this.TILES;
        const w = 16;
        const h = 12;

        const ground = new Array(w * h).fill(T.WOOD_FLOOR);
        const objects = new Array(w * h).fill(-1);
        const collision = new Array(w * h).fill(0);
        const interact = new Array(w * h).fill(null);

        // Walls
        for (let x = 0; x < w; x++) {
            objects[x] = T.INT_WALL;
            collision[x] = 1;
        }
        for (let y = 0; y < h; y++) {
            collision[y * w] = 1;
            collision[y * w + (w - 1)] = 1;
        }

        // Bookshelves along walls
        for (let x = 2; x < 7; x++) {
            objects[1 * w + x] = T.BOOKSHELF;
            collision[1 * w + x] = 1;
        }
        for (let x = 9; x < 14; x++) {
            objects[1 * w + x] = T.BOOKSHELF;
            collision[1 * w + x] = 1;
        }

        // Central bookshelves (rows)
        for (let x = 3; x < 13; x++) {
            objects[4 * w + x] = T.BOOKSHELF;
            collision[4 * w + x] = 1;
            objects[7 * w + x] = T.BOOKSHELF;
            collision[7 * w + x] = 1;
        }

        // Reading desk
        objects[9 * w + 7] = T.DESK;
        collision[9 * w + 7] = 1;
        objects[9 * w + 8] = T.DESK;
        collision[9 * w + 8] = 1;

        // Interactive zones for publications
        // Each bookshelf section shows different publications
        for (let x = 2; x < 7; x++) {
            interact[2 * w + x] = { type: 'publication', index: x - 2 };
        }
        for (let x = 9; x < 14; x++) {
            interact[2 * w + x] = { type: 'publication', index: x - 4 };
        }

        // Exit
        interact[(h - 1) * w + Math.floor(w / 2)] = { type: 'exit' };

        return {
            name: "King's College Library",
            width: w,
            height: h,
            spawn: { x: Math.floor(w / 2), y: h - 2 },
            layers: { ground, objects, collision, interact }
        };
    },

    // Generate lecture hall interior
    generateLectureHallInterior() {
        const T = this.TILES;
        const w = 14;
        const h = 12;

        const ground = new Array(w * h).fill(T.WOOD_FLOOR);
        const objects = new Array(w * h).fill(-1);
        const collision = new Array(w * h).fill(0);
        const interact = new Array(w * h).fill(null);

        // Walls
        for (let x = 0; x < w; x++) {
            objects[x] = T.INT_WALL;
            collision[x] = 1;
        }
        for (let y = 0; y < h; y++) {
            collision[y * w] = 1;
            collision[y * w + (w - 1)] = 1;
        }

        // Podium at front
        objects[2 * w + 6] = T.PODIUM;
        collision[2 * w + 6] = 1;
        objects[2 * w + 7] = T.PODIUM;
        collision[2 * w + 7] = 1;
        interact[3 * w + 6] = { type: 'media', index: 0 };
        interact[3 * w + 7] = { type: 'media', index: 0 };

        // Screen (window repurposed)
        objects[1 * w + 5] = T.WINDOW;
        collision[1 * w + 5] = 1;
        objects[1 * w + 6] = T.WINDOW;
        collision[1 * w + 6] = 1;
        objects[1 * w + 7] = T.WINDOW;
        collision[1 * w + 7] = 1;
        objects[1 * w + 8] = T.WINDOW;
        collision[1 * w + 8] = 1;

        // Rows of chairs
        for (let row = 0; row < 4; row++) {
            for (let x = 3; x < 11; x += 2) {
                const y = 5 + row * 2;
                objects[y * w + x] = T.CHAIR;
                collision[y * w + x] = 1;
                // Each row of seats links to different media item
                interact[y * w + x + 1] = { type: 'media', index: row + 1 };
            }
        }

        // Exit
        interact[(h - 1) * w + Math.floor(w / 2)] = { type: 'exit' };

        return {
            name: "Senate House - Lecture Hall",
            width: w,
            height: h,
            spawn: { x: Math.floor(w / 2), y: h - 2 },
            layers: { ground, objects, collision, interact }
        };
    },

    // Generate lab interior
    generateLabInterior() {
        const T = this.TILES;
        const w = 16;
        const h = 12;

        const ground = new Array(w * h).fill(T.WOOD_FLOOR);
        const objects = new Array(w * h).fill(-1);
        const collision = new Array(w * h).fill(0);
        const interact = new Array(w * h).fill(null);

        // Walls
        for (let x = 0; x < w; x++) {
            objects[x] = T.INT_WALL;
            collision[x] = 1;
        }
        for (let y = 0; y < h; y++) {
            collision[y * w] = 1;
            collision[y * w + (w - 1)] = 1;
        }

        // Lab benches
        for (let x = 2; x < 7; x++) {
            objects[2 * w + x] = T.LAB_BENCH;
            collision[2 * w + x] = 1;
            interact[3 * w + x] = { type: 'research', index: 0 };
        }
        for (let x = 9; x < 14; x++) {
            objects[2 * w + x] = T.LAB_BENCH;
            collision[2 * w + x] = 1;
            interact[3 * w + x] = { type: 'research', index: 1 };
        }

        // Computer stations
        objects[5 * w + 3] = T.DESK;
        objects[5 * w + 4] = T.COMPUTER;
        collision[5 * w + 3] = 1;
        collision[5 * w + 4] = 1;
        interact[6 * w + 3] = { type: 'research', index: 2 };
        interact[6 * w + 4] = { type: 'research', index: 2 };

        objects[5 * w + 11] = T.DESK;
        objects[5 * w + 12] = T.COMPUTER;
        collision[5 * w + 11] = 1;
        collision[5 * w + 12] = 1;
        interact[6 * w + 11] = { type: 'research', index: 3 };
        interact[6 * w + 12] = { type: 'research', index: 3 };

        // Whiteboard (bookshelf sprite repurposed)
        for (let x = 5; x < 11; x++) {
            objects[8 * w + x] = T.BOOKSHELF;
            collision[8 * w + x] = 1;
        }
        interact[9 * w + 7] = { type: 'object', id: 'whiteboard', content: 'lab.whiteboard' };
        interact[9 * w + 8] = { type: 'object', id: 'whiteboard', content: 'lab.whiteboard' };

        // Exit
        interact[(h - 1) * w + Math.floor(w / 2)] = { type: 'exit' };

        return {
            name: "Research Lab",
            width: w,
            height: h,
            spawn: { x: Math.floor(w / 2), y: h - 2 },
            layers: { ground, objects, collision, interact }
        };
    },

    // Get current map based on location
    getCurrentMap() {
        if (this.currentLocation === 'campus') {
            return this.campusMap;
        }
        return this.interiorMaps[this.currentLocation] || this.campusMap;
    },

    // Check if a position is walkable
    isWalkable(x, y) {
        const map = this.getCurrentMap();
        if (x < 0 || x >= map.width || y < 0 || y >= map.height) {
            return false;
        }
        const idx = y * map.width + x;
        return map.layers.collision[idx] === 0;
    },

    // Get interaction data at position
    getInteraction(x, y) {
        const map = this.getCurrentMap();
        if (x < 0 || x >= map.width || y < 0 || y >= map.height) {
            return null;
        }
        const idx = y * map.width + x;
        return map.layers.interact[idx];
    },

    // Enter a building
    enterBuilding(buildingId) {
        if (this.interiorMaps[buildingId]) {
            this.currentLocation = buildingId;
            return this.interiorMaps[buildingId];
        }
        return null;
    },

    // Exit to campus
    exitBuilding() {
        const previousLocation = this.currentLocation;
        this.currentLocation = 'campus';

        // Return spawn point near the building exit
        if (this.buildings[previousLocation]) {
            const entrance = this.buildings[previousLocation].entrance;
            return { x: entrance.x, y: entrance.y + 1 };
        }
        return { x: 20, y: 20 };
    },

    // Get tile at position (for rendering)
    getTile(x, y, layer) {
        const map = this.getCurrentMap();
        if (x < 0 || x >= map.width || y < 0 || y >= map.height) {
            return -1;
        }
        const idx = y * map.width + x;
        return map.layers[layer][idx];
    },

    // Get tile sprite name from tile type
    getTileSprite(tileType) {
        const T = this.TILES;
        const spriteMap = {
            [T.GRASS]: 'grass',
            [T.PATH]: 'path',
            [T.WATER]: 'water',
            [T.FLOWER]: 'flower',
            [T.TREE]: 'tree',
            [T.TREE_TOP]: 'treeTop',
            [T.WALL]: 'wall',
            [T.ROOF]: 'roof',
            [T.DOOR]: 'door',
            [T.WINDOW]: 'window',
            [T.SPIRE]: 'spire',
            [T.SIGN]: 'sign',
            [T.GATE]: 'gate',
            [T.LAMPPOST]: 'lamppost',
            [T.LAB_BENCH_LEFT]: 'benchLeft',
            [T.LAB_BENCH_RIGHT]: 'benchRight',
            [T.IVY]: 'ivy',
            [T.COBBLE]: 'cobble',
            [T.WOOD_FLOOR]: 'woodFloor',
            [T.INT_WALL]: 'interiorWall',
            [T.BOOKSHELF]: 'bookshelf',
            [T.DESK]: 'desk',
            [T.COMPUTER]: 'computer',
            [T.PODIUM]: 'podium',
            [T.LAB_BENCH]: 'bench',
            [T.CHAIR]: 'chair'
        };
        return spriteMap[tileType] || null;
    }
};

// Export
window.World = World;
