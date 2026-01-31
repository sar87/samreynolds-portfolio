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
        CHAIR: 27,

        // Gothic/traditional building tiles
        GOTHIC_WINDOW: 30,
        GOTHIC_DOOR: 31,
        ORNATE_WALL: 32,
        ARCHWAY: 33,
        SPIRE_TOP: 34,
        BATTLEMENT: 35,

        // Modern building tiles
        MODERN_WALL: 40,
        MODERN_WINDOW: 41,
        MODERN_DOOR: 42,
        METAL_PANEL: 43,

        // Building signs
        SIGN_PEMBROKE: 50,
        SIGN_LIBRARY: 51,
        SIGN_LAB: 52,
        SIGN_STATION: 53,
        SIGN_THEATRE: 54
    },

    // Building definitions with entry points
    // 5 buildings around central quad: 4 traditional (gothic), 1 modern
    buildings: {
        pembroke: {
            name: "Pembroke College",
            contentKey: 'about',
            entrance: { x: 9, y: 15 },
            tiles: { x: 5, y: 11, w: 6, h: 5 },
            style: 'traditional'
        },
        library: {
            name: "University Library",
            contentKey: 'publications',
            entrance: { x: 20, y: 8 },
            tiles: { x: 16, y: 4, w: 9, h: 5 },  // Largest building
            style: 'traditional'
        },
        lab: {
            name: "Research Lab",
            contentKey: 'research',
            entrance: { x: 32, y: 10 },
            tiles: { x: 28, y: 6, w: 7, h: 5 },
            style: 'modern'  // Only modern building
        },
        station: {
            name: "TV Station",
            contentKey: 'media',
            entrance: { x: 32, y: 18 },
            tiles: { x: 28, y: 14, w: 6, h: 5 },
            style: 'traditional'
        },
        theatre: {
            name: "Lecture Theatre",
            contentKey: 'talks',
            entrance: { x: 9, y: 23 },
            tiles: { x: 5, y: 19, w: 6, h: 5 },
            style: 'traditional'
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
    // Redesigned for Phase 5: central quad, entrance gate, no river, tree boundaries
    generateCampusMap() {
        const T = this.TILES;
        const w = this.width;  // 40
        const h = this.height; // 30

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

        // Helper to place a tree (trunk + top)
        const placeTree = (x, y) => {
            if (y > 0) {
                setTile(x, y, T.GRASS, T.TREE, true);
                setTile(x, y - 1, null, T.TREE_TOP, true);
            }
        };

        // ============================================
        // 1. NATURAL TREE BOUNDARY AT EDGES
        // ============================================

        // Dense tree line at left edge (where river was removed)
        for (let y = 2; y < h - 1; y += 2) {
            placeTree(0, y);
            placeTree(1, y + 1);
            if (y % 4 === 2) placeTree(2, y);
        }

        // Dense tree line at right edge
        for (let y = 2; y < h - 1; y += 2) {
            placeTree(39, y);
            placeTree(38, y + 1);
            if (y % 4 === 2) placeTree(37, y);
        }

        // Tree line at top edge
        for (let x = 3; x < w - 3; x += 2) {
            if (x < 15 || x > 25) { // Leave gap for building area
                placeTree(x, 2);
            }
        }

        // Tree line at bottom edges (leave gap for entrance)
        for (let x = 1; x < 16; x += 2) {
            placeTree(x, 29);
        }
        for (let x = 24; x < w - 1; x += 2) {
            placeTree(x, 29);
        }

        // ============================================
        // 2. COBBLESTONE PATHS - CROSS PATTERN THROUGH QUAD
        // ============================================

        // Main vertical path from entrance (bottom) through center to top
        for (let y = 4; y < h; y++) {
            setTile(19, y, T.COBBLE);
            setTile(20, y, T.COBBLE);
        }

        // Main horizontal path through quad center
        for (let x = 5; x < w - 5; x++) {
            setTile(x, 14, T.COBBLE);
            setTile(x, 15, T.COBBLE);
        }

        // Secondary path on left side (to Theatre/Pembroke areas)
        for (let y = 8; y < 22; y++) {
            setTile(10, y, T.PATH);
        }

        // Secondary path on right side (to Lab/Station areas)
        for (let y = 8; y < 22; y++) {
            setTile(30, y, T.PATH);
        }

        // ============================================
        // 3. ENTRANCE GATE AT BOTTOM CENTER
        // ============================================

        // Gate structure (x:18-21, y:27-28)
        setTile(18, 27, T.GRASS, T.GATE, true);
        setTile(21, 27, T.GRASS, T.GATE, true);
        // Gate pillars block, but the path through is open

        // Path leading from gate
        setTile(19, 27, T.COBBLE);
        setTile(20, 27, T.COBBLE);
        setTile(19, 28, T.COBBLE);
        setTile(20, 28, T.COBBLE);

        // Welcome sign near entrance
        setTile(22, 25, T.GRASS, T.SIGN, true, {
            type: 'sign',
            text: "Welcome to Cambridge! Explore the campus to learn about Sam's work. Enter buildings to discover more."
        });

        // ============================================
        // 4. DECORATIVE ELEMENTS - LIVED-IN FEEL
        // ============================================

        // Lampposts along main paths (6-8 total)
        const lamppostPositions = [
            [17, 10], [22, 10],    // Upper quad
            [17, 18], [22, 18],    // Lower quad
            [8, 14], [32, 14],     // Horizontal path ends
            [19, 24], [20, 24]     // Near entrance
        ];
        lamppostPositions.forEach(([x, y]) => {
            setTile(x, y, T.GRASS, T.LAMPPOST, true);
        });

        // Benches around the quad (3-4 sets)
        // Each bench is 2 tiles: BENCH_LEFT + BENCH_RIGHT
        // Bench 1: Left side of quad
        setTile(13, 12, T.GRASS, T.BENCH_LEFT, true);
        setTile(14, 12, T.GRASS, T.BENCH_RIGHT, true);

        // Bench 2: Right side of quad
        setTile(25, 12, T.GRASS, T.BENCH_LEFT, true);
        setTile(26, 12, T.GRASS, T.BENCH_RIGHT, true);

        // Bench 3: Lower quad left
        setTile(13, 17, T.GRASS, T.BENCH_LEFT, true);
        setTile(14, 17, T.GRASS, T.BENCH_RIGHT, true);

        // Bench 4: Lower quad right
        setTile(25, 17, T.GRASS, T.BENCH_LEFT, true);
        setTile(26, 17, T.GRASS, T.BENCH_RIGHT, true);

        // Flower clusters near benches and building entrances
        const flowerPositions = [
            // Near benches
            [12, 11], [15, 11], [24, 11], [27, 11],
            [12, 18], [15, 18], [24, 18], [27, 18],
            // Near building plot areas
            [7, 8], [8, 8], [7, 19], [8, 19],       // Left side
            [31, 8], [32, 8], [31, 19], [32, 19],   // Right side
            // Scattered in quad
            [16, 13], [23, 13], [16, 16], [23, 16]
        ];
        flowerPositions.forEach(([x, y]) => setTile(x, y, T.FLOWER));

        // Scattered trees inside campus for shade/variety
        const interiorTrees = [
            [6, 12], [34, 12],  // Near edges
            [6, 20], [34, 20],  // Lower area
            [15, 6], [25, 6],   // Upper quad area
        ];
        interiorTrees.forEach(([x, y]) => placeTree(x, y));

        // ============================================
        // 5. BUILDING PLOT AREAS (reserved for Plan 03)
        // ============================================
        // Buildings will be placed in 05-03-PLAN.md
        // For now, just grass where buildings will go:
        //
        // Pembroke College: left side (x:5-10, y:10-14)
        // Library: top of quad (x:16-24, y:4-8) - larger
        // Lab: right side near top (x:28-35, y:5-9) - modern
        // TV Station: right side middle (x:28-34, y:12-16)
        // Theatre: bottom left (x:5-12, y:18-22)
        //
        // (No building code here - just documenting reserved areas)

        // ============================================
        // OLD BUILDING PLACEMENTS (commented out for reference)
        // Buildings will be rebuilt in Plan 03 with new designs
        // ============================================
        // this.buildBuilding(ground, objects, collision, interact, 'office', 6, 9, 5, 4, "Sam's Office");
        // this.buildBuilding(ground, objects, collision, interact, 'library', 17, 14, 7, 5, "Library");
        // this.buildBuilding(ground, objects, collision, interact, 'lectureHall', 29, 9, 6, 4, "Lecture Hall");
        // this.buildBuilding(ground, objects, collision, interact, 'lab', 17, 4, 7, 4, "Research Lab");

        // OLD SIGNS (commented out - will be recreated with new building positions)
        // setTile(7, 13, T.GRASS, T.SIGN, true, { type: 'sign', text: "Sam's Office - About Me", building: 'office' });
        // setTile(19, 19, T.GRASS, T.SIGN, true, { type: 'sign', text: "King's College Library - Publications", building: 'library' });
        // setTile(31, 13, T.GRASS, T.SIGN, true, { type: 'sign', text: "Senate House - Media & Talks", building: 'lectureHall' });
        // setTile(19, 8, T.GRASS, T.SIGN, true, { type: 'sign', text: "Research Lab - Current Projects", building: 'lab' });

        this.campusMap = {
            width: w,
            height: h,
            layers: { ground, objects, collision, interact }
        };
    },

    // Helper to build a traditional (gothic) building exterior
    // Uses: ORNATE_WALL, BATTLEMENT, GOTHIC_WINDOW, GOTHIC_DOOR, IVY, SPIRE_TOP
    buildTraditionalBuilding(ground, objects, collision, interact, id, x, y, w, h, name) {
        const T = this.TILES;
        const mapW = this.width;
        const building = this.buildings[id];

        // Fill building perimeter with ornate walls (collision on all)
        for (let bx = x; bx < x + w; bx++) {
            for (let by = y; by < y + h; by++) {
                const idx = by * mapW + bx;
                objects[idx] = T.ORNATE_WALL;
                collision[idx] = 1;
            }
        }

        // Top row: battlements for gothic castle feel
        for (let bx = x; bx < x + w; bx++) {
            const idx = y * mapW + bx;
            objects[idx] = T.BATTLEMENT;
        }

        // Add spire tops at corners for larger buildings (w >= 7)
        if (w >= 7) {
            objects[y * mapW + x] = T.SPIRE_TOP;
            objects[y * mapW + (x + w - 1)] = T.SPIRE_TOP;
        }

        // Add gothic windows at regular intervals (every 2 tiles, middle row)
        const windowRow = y + 2;
        for (let bx = x + 1; bx < x + w - 1; bx += 2) {
            if (bx !== building.entrance.x) {
                const idx = windowRow * mapW + bx;
                objects[idx] = T.GOTHIC_WINDOW;
            }
        }

        // Add ivy patches on some wall tiles (decorative pattern)
        // Place ivy on lower-left and lower-right corners
        if (h >= 4) {
            const ivyRow = y + h - 2;
            objects[ivyRow * mapW + x] = T.IVY;
            objects[ivyRow * mapW + (x + w - 1)] = T.IVY;
        }

        // Add gothic door at entrance position
        const doorIdx = building.entrance.y * mapW + building.entrance.x;
        objects[doorIdx] = T.GOTHIC_DOOR;
        collision[doorIdx] = 0; // Door is walkable (to trigger entry)
        interact[doorIdx] = { type: 'door', building: id, name };

        // Path tile in front of door (connects to building)
        const frontIdx = (building.entrance.y + 1) * mapW + building.entrance.x;
        ground[frontIdx] = T.PATH;
        collision[frontIdx] = 0;
        interact[frontIdx] = { type: 'entrance', building: id, name };
    },

    // Helper to build a modern building exterior
    // Uses: MODERN_WALL, METAL_PANEL, MODERN_WINDOW, MODERN_DOOR
    buildModernBuilding(ground, objects, collision, interact, id, x, y, w, h, name) {
        const T = this.TILES;
        const mapW = this.width;
        const building = this.buildings[id];

        // Fill building perimeter with modern walls (collision on all)
        for (let bx = x; bx < x + w; bx++) {
            for (let by = y; by < y + h; by++) {
                const idx = by * mapW + bx;
                objects[idx] = T.MODERN_WALL;
                collision[idx] = 1;
            }
        }

        // Top row: metal panels for clean modern look
        for (let bx = x; bx < x + w; bx++) {
            const idx = y * mapW + bx;
            objects[idx] = T.METAL_PANEL;
        }

        // Modern windows - larger, more frequent (every tile on window row)
        const windowRow = y + 2;
        for (let bx = x + 1; bx < x + w - 1; bx++) {
            if (bx !== building.entrance.x) {
                const idx = windowRow * mapW + bx;
                objects[idx] = T.MODERN_WINDOW;
            }
        }

        // Additional row of windows for modern glass facade
        const windowRow2 = y + 3;
        if (h >= 5) {
            for (let bx = x + 1; bx < x + w - 1; bx++) {
                if (bx !== building.entrance.x) {
                    const idx = windowRow2 * mapW + bx;
                    objects[idx] = T.MODERN_WINDOW;
                }
            }
        }

        // Modern door at entrance position
        const doorIdx = building.entrance.y * mapW + building.entrance.x;
        objects[doorIdx] = T.MODERN_DOOR;
        collision[doorIdx] = 0; // Door is walkable
        interact[doorIdx] = { type: 'door', building: id, name };

        // Path tile in front of door
        const frontIdx = (building.entrance.y + 1) * mapW + building.entrance.x;
        ground[frontIdx] = T.PATH;
        collision[frontIdx] = 0;
        interact[frontIdx] = { type: 'entrance', building: id, name };
    },

    // Place a building sign near entrance
    placeSign(ground, objects, collision, interact, signTile, x, y, building, text) {
        const mapW = this.width;
        const idx = y * mapW + x;
        objects[idx] = signTile;
        collision[idx] = 1; // Can't walk through sign
        interact[idx] = { type: 'sign', text, building };
    },

    // Generate interior maps for each building
    // Note: Interior maps will be fully implemented in Plans 04-05 (Wave 3)
    // These are placeholder stubs to prevent errors during building exterior testing
    generateInteriorMaps() {
        this.interiorMaps.pembroke = this.generateOfficeInterior();      // Pembroke = old office
        this.interiorMaps.library = this.generateLibraryInterior();
        this.interiorMaps.station = this.generateLectureHallInterior();  // Station = old lectureHall
        this.interiorMaps.lab = this.generateLabInterior();
        this.interiorMaps.theatre = this.generateTheatreInterior();      // New
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
            name: "Pembroke College",
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
            name: "University Library",
            width: w,
            height: h,
            spawn: { x: Math.floor(w / 2), y: h - 2 },
            layers: { ground, objects, collision, interact }
        };
    },

    // Generate TV station interior (repurposed lecture hall)
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
            name: "TV Station",
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

    // Generate theatre interior (placeholder - will be expanded in Plans 04-05)
    generateTheatreInterior() {
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

        // Podium/stage at front
        objects[2 * w + 6] = T.PODIUM;
        collision[2 * w + 6] = 1;
        objects[2 * w + 7] = T.PODIUM;
        collision[2 * w + 7] = 1;
        interact[3 * w + 6] = { type: 'talk', index: 0 };
        interact[3 * w + 7] = { type: 'talk', index: 0 };

        // Rows of chairs (audience seating)
        for (let row = 0; row < 4; row++) {
            for (let x = 3; x < 11; x += 2) {
                const y = 5 + row * 2;
                objects[y * w + x] = T.CHAIR;
                collision[y * w + x] = 1;
                interact[y * w + x + 1] = { type: 'talk', index: row + 1 };
            }
        }

        // Exit
        interact[(h - 1) * w + Math.floor(w / 2)] = { type: 'exit' };

        return {
            name: "Lecture Theatre",
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
            [T.CHAIR]: 'chair',
            // Gothic/traditional building tiles
            [T.GOTHIC_WINDOW]: 'gothicWindow',
            [T.GOTHIC_DOOR]: 'gothicDoor',
            [T.ORNATE_WALL]: 'ornateWall',
            [T.ARCHWAY]: 'archway',
            [T.SPIRE_TOP]: 'spireTop',
            [T.BATTLEMENT]: 'battlement',
            // Modern building tiles
            [T.MODERN_WALL]: 'modernWall',
            [T.MODERN_WINDOW]: 'modernWindow',
            [T.MODERN_DOOR]: 'modernDoor',
            [T.METAL_PANEL]: 'metalPanel',
            // Building signs
            [T.SIGN_PEMBROKE]: 'signPembroke',
            [T.SIGN_LIBRARY]: 'signLibrary',
            [T.SIGN_LAB]: 'signLab',
            [T.SIGN_STATION]: 'signStation',
            [T.SIGN_THEATRE]: 'signTheatre'
        };
        return spriteMap[tileType] || null;
    }
};

// Export
window.World = World;
