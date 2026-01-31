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
        SIGN_THEATRE: 54,

        // Lab interior sprites (zoology theme)
        SPECIMEN: 60,
        MICROSCOPE: 61,
        PLANT: 62,
        ANIMAL_POSTER: 63,

        // Station/Theatre interior sprites (tavern repurposed)
        CONTROL_DESK: 64,
        MICROPHONE: 65,
        SCREEN: 66,
        STAGE_CURTAIN: 67,
        SPOTLIGHT: 68
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
        // (Positions adjusted to avoid building footprints)
        const interiorTrees = [
            [13, 10], [26, 10],  // Between buildings and quad
            [13, 20], [26, 20],  // Lower area, between paths
        ];
        interiorTrees.forEach(([x, y]) => placeTree(x, y));

        // ============================================
        // 5. BUILDING EXTERIORS
        // ============================================
        // 4 traditional (gothic) buildings + 1 modern building

        // Pembroke College - left side of quad (About/bio content)
        this.buildTraditionalBuilding(ground, objects, collision, interact,
            'pembroke', 5, 11, 6, 5, "Pembroke College");

        // University Library - top of quad, largest building (Publications)
        this.buildTraditionalBuilding(ground, objects, collision, interact,
            'library', 16, 4, 9, 5, "University Library");

        // Research Lab - right side, modern style (Research projects)
        this.buildModernBuilding(ground, objects, collision, interact,
            'lab', 28, 6, 7, 5, "Research Lab");

        // TV Station - right side below Lab (Media appearances)
        this.buildTraditionalBuilding(ground, objects, collision, interact,
            'station', 28, 14, 6, 5, "TV Station");

        // Lecture Theatre - bottom left (Talks/lectures)
        this.buildTraditionalBuilding(ground, objects, collision, interact,
            'theatre', 5, 19, 6, 5, "Lecture Theatre");

        // ============================================
        // 6. BUILDING SIGNS
        // ============================================
        // Place signs near each building entrance

        // Pembroke sign (entrance at 9,15, sign at 9,17)
        this.placeSign(ground, objects, collision, interact,
            T.SIGN_PEMBROKE, 9, 17, 'pembroke', "Pembroke College - About Sam");

        // Library sign (entrance at 20,8, sign at 20,10)
        this.placeSign(ground, objects, collision, interact,
            T.SIGN_LIBRARY, 20, 10, 'library', "University Library - Publications");

        // Lab sign (entrance at 32,10, sign at 32,12)
        this.placeSign(ground, objects, collision, interact,
            T.SIGN_LAB, 32, 12, 'lab', "Research Lab - Current Projects");

        // Station sign (entrance at 32,18, sign at 32,20)
        this.placeSign(ground, objects, collision, interact,
            T.SIGN_STATION, 32, 20, 'station', "TV Station - Media Appearances");

        // Theatre sign (entrance at 9,23, sign at 9,25)
        this.placeSign(ground, objects, collision, interact,
            T.SIGN_THEATRE, 9, 25, 'theatre', "Lecture Theatre - Talks");

        // ============================================
        // 7. CONNECTOR PATHS TO BUILDINGS
        // ============================================
        // Connect building entrances to main path network

        // Path from Pembroke entrance to left path (x:10 path)
        // Entrance at (9, 15), connects to vertical path at x:10
        setTile(10, 15, T.PATH);

        // Path from Library entrance (20, 8) to vertical main path (already on x:19-20)
        // Entrance is already on the main vertical path - just ensure path continues
        setTile(20, 9, T.PATH);

        // Path from Lab entrance (32, 10) to right side path (x:30)
        setTile(31, 10, T.PATH);
        setTile(30, 10, T.PATH);
        setTile(33, 10, T.PATH);

        // Path from Station entrance (32, 18) to right side path (x:30)
        setTile(31, 18, T.PATH);
        setTile(30, 18, T.PATH);
        setTile(33, 18, T.PATH);

        // Path from Theatre entrance (9, 23) to left path (x:10)
        setTile(10, 23, T.PATH);

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
    generateInteriorMaps() {
        this.interiorMaps.pembroke = this.generatePembrokeInterior();
        this.interiorMaps.library = this.generateLibraryInterior();
        this.interiorMaps.station = this.generateLectureHallInterior();
        this.interiorMaps.lab = this.generateLabInterior();
        this.interiorMaps.theatre = this.generateTheatreInterior();
    },

    // Generate Pembroke College interior (Sam's personal office)
    // 14x12 tiles - personal academic office with "home" feel
    generatePembrokeInterior() {
        const T = this.TILES;
        const w = 14;
        const h = 12;

        const ground = new Array(w * h).fill(T.WOOD_FLOOR);
        const objects = new Array(w * h).fill(-1);
        const collision = new Array(w * h).fill(0);
        const interact = new Array(w * h).fill(null);

        // ============================================
        // 1. PERIMETER WALLS
        // ============================================

        // Top wall (interior wall tiles)
        for (let x = 0; x < w; x++) {
            objects[x] = T.INT_WALL;
            collision[x] = 1;
        }

        // Side walls (collision only, no visible tile needed)
        for (let y = 0; y < h; y++) {
            collision[y * w] = 1;
            collision[y * w + (w - 1)] = 1;
        }

        // Bottom wall collision (except exit)
        for (let x = 0; x < w; x++) {
            if (x !== Math.floor(w / 2)) {
                collision[(h - 1) * w + x] = 1;
            }
        }

        // ============================================
        // 2. PERSONAL WORKSPACE (top-left)
        // ============================================

        // Sam's desk with computer
        objects[2 * w + 2] = T.DESK;
        collision[2 * w + 2] = 1;
        objects[2 * w + 3] = T.COMPUTER;
        collision[2 * w + 3] = 1;

        // Chair in front of desk
        objects[3 * w + 2] = T.CHAIR;

        // Interaction zone for desk area (bio content)
        interact[3 * w + 3] = { type: 'object', id: 'desk', content: 'about.bio' };
        interact[4 * w + 2] = { type: 'object', id: 'desk', content: 'about.bio' };
        interact[4 * w + 3] = { type: 'object', id: 'desk', content: 'about.bio' };

        // ============================================
        // 3. BOOKSHELF SECTION (right wall)
        // ============================================

        // 5 bookshelves along right side (research interests)
        for (let y = 2; y <= 6; y++) {
            objects[y * w + (w - 2)] = T.BOOKSHELF;
            collision[y * w + (w - 2)] = 1;
            // Interaction zone one tile to the left
            interact[y * w + (w - 3)] = { type: 'object', id: 'bookshelf', content: 'about.research' };
        }

        // ============================================
        // 4. PERSONAL TOUCHES
        // ============================================

        // Windows on top wall (decorative, light coming in)
        objects[5] = T.WINDOW;
        objects[8] = T.WINDOW;

        // Plant/flower near window (using FLOWER on floor)
        objects[1 * w + 6] = T.FLOWER;

        // Small reading area with armchair (using CHAIR)
        objects[6 * w + 3] = T.CHAIR;
        objects[6 * w + 4] = T.DESK;  // Side table
        collision[6 * w + 4] = 1;

        // Second plant near reading area
        objects[7 * w + 5] = T.FLOWER;

        // Picture/award area (using bookshelf creatively as display)
        objects[1 * w + 2] = T.BOOKSHELF;
        collision[1 * w + 2] = 1;

        // ============================================
        // 5. EXIT AT BOTTOM CENTER
        // ============================================

        interact[(h - 1) * w + Math.floor(w / 2)] = { type: 'exit' };

        return {
            name: "Pembroke College - Sam's Office",
            width: w,
            height: h,
            spawn: { x: Math.floor(w / 2), y: h - 2 },
            layers: { ground, objects, collision, interact }
        };
    },

    // Generate library interior (grand academic feel)
    // 20x14 tiles - tall shelves, impressive, Cambridge library vibes
    generateLibraryInterior() {
        const T = this.TILES;
        const w = 20;
        const h = 14;

        const ground = new Array(w * h).fill(T.WOOD_FLOOR);
        const objects = new Array(w * h).fill(-1);
        const collision = new Array(w * h).fill(0);
        const interact = new Array(w * h).fill(null);

        // ============================================
        // 1. PERIMETER WALLS
        // ============================================

        // Top wall with interior wall tiles
        for (let x = 0; x < w; x++) {
            objects[x] = T.INT_WALL;
            collision[x] = 1;
        }

        // Side walls (collision)
        for (let y = 0; y < h; y++) {
            collision[y * w] = 1;
            collision[y * w + (w - 1)] = 1;
        }

        // Bottom wall collision (except exit)
        for (let x = 0; x < w; x++) {
            if (x !== Math.floor(w / 2)) {
                collision[(h - 1) * w + x] = 1;
            }
        }

        // ============================================
        // 2. MASSIVE BOOKSHELF COVERAGE
        // ============================================

        // Wall of books along ENTIRE top wall (row 1)
        for (let x = 2; x < w - 2; x++) {
            objects[1 * w + x] = T.BOOKSHELF;
            collision[1 * w + x] = 1;
        }

        // Bookshelves along left wall
        for (let y = 3; y <= 8; y++) {
            objects[y * w + 1] = T.BOOKSHELF;
            collision[y * w + 1] = 1;
        }

        // Bookshelves along right wall
        for (let y = 3; y <= 8; y++) {
            objects[y * w + (w - 2)] = T.BOOKSHELF;
            collision[y * w + (w - 2)] = 1;
        }

        // Central bookshelf row 1 (with aisle gaps)
        // Left section
        for (let x = 4; x <= 7; x++) {
            objects[4 * w + x] = T.BOOKSHELF;
            collision[4 * w + x] = 1;
        }
        // Right section
        for (let x = 12; x <= 15; x++) {
            objects[4 * w + x] = T.BOOKSHELF;
            collision[4 * w + x] = 1;
        }

        // Central bookshelf row 2 (with aisle gaps)
        // Left section
        for (let x = 4; x <= 7; x++) {
            objects[7 * w + x] = T.BOOKSHELF;
            collision[7 * w + x] = 1;
        }
        // Right section
        for (let x = 12; x <= 15; x++) {
            objects[7 * w + x] = T.BOOKSHELF;
            collision[7 * w + x] = 1;
        }

        // ============================================
        // 3. READING AREA (bottom section)
        // ============================================

        // Reading tables with chairs (4 desks)
        // Left reading table
        objects[10 * w + 4] = T.DESK;
        collision[10 * w + 4] = 1;
        objects[10 * w + 5] = T.DESK;
        collision[10 * w + 5] = 1;
        objects[10 * w + 3] = T.CHAIR;
        objects[10 * w + 6] = T.CHAIR;

        // Right reading table
        objects[10 * w + 14] = T.DESK;
        collision[10 * w + 14] = 1;
        objects[10 * w + 15] = T.DESK;
        collision[10 * w + 15] = 1;
        objects[10 * w + 13] = T.CHAIR;
        objects[10 * w + 16] = T.CHAIR;

        // ============================================
        // 4. INTERACTIVE ZONES FOR PUBLICATIONS
        // ============================================

        // Top wall bookshelves - publications 0-7 (row in front)
        let pubIndex = 0;
        for (let x = 3; x <= 6; x++) {
            interact[2 * w + x] = { type: 'publication', index: pubIndex++ };
        }
        for (let x = 13; x <= 16; x++) {
            interact[2 * w + x] = { type: 'publication', index: pubIndex++ };
        }

        // Left wall bookshelves
        for (let y = 4; y <= 7; y++) {
            interact[y * w + 2] = { type: 'publication', index: pubIndex++ };
        }

        // Right wall bookshelves
        for (let y = 4; y <= 7; y++) {
            interact[y * w + (w - 3)] = { type: 'publication', index: pubIndex++ };
        }

        // Central bookshelf aisles (both rows)
        // Row 1 - front aisle
        interact[5 * w + 5] = { type: 'publication', index: pubIndex++ };
        interact[5 * w + 6] = { type: 'publication', index: pubIndex++ };
        interact[5 * w + 13] = { type: 'publication', index: pubIndex++ };
        interact[5 * w + 14] = { type: 'publication', index: pubIndex++ };

        // Row 2 - front aisle
        interact[8 * w + 5] = { type: 'publication', index: pubIndex++ };
        interact[8 * w + 6] = { type: 'publication', index: pubIndex++ };
        interact[8 * w + 13] = { type: 'publication', index: pubIndex++ };
        interact[8 * w + 14] = { type: 'publication', index: pubIndex++ };

        // ============================================
        // 5. ATMOSPHERIC ELEMENTS
        // ============================================

        // Windows on top wall (light streaming in)
        objects[7] = T.WINDOW;
        objects[12] = T.WINDOW;

        // ============================================
        // 6. EXIT AT BOTTOM CENTER
        // ============================================

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

    // Generate lab interior (zoology theme with computers)
    // 18x12 tiles - nature specimens, animal imagery, computer workstations
    generateLabInterior() {
        const T = this.TILES;
        const w = 18;
        const h = 12;

        const ground = new Array(w * h).fill(T.WOOD_FLOOR);
        const objects = new Array(w * h).fill(-1);
        const collision = new Array(w * h).fill(0);
        const interact = new Array(w * h).fill(null);

        // ============================================
        // 1. PERIMETER WALLS
        // ============================================

        // Top wall with interior wall tiles
        for (let x = 0; x < w; x++) {
            objects[x] = T.INT_WALL;
            collision[x] = 1;
        }

        // Side walls (collision)
        for (let y = 0; y < h; y++) {
            collision[y * w] = 1;
            collision[y * w + (w - 1)] = 1;
        }

        // Bottom wall collision (except exit)
        for (let x = 0; x < w; x++) {
            if (x !== Math.floor(w / 2)) {
                collision[(h - 1) * w + x] = 1;
            }
        }

        // ============================================
        // 2. LAB BENCH AREA (top section) - Zoology specimens
        // ============================================

        // Lab benches along top wall with specimens
        // Left bench section with specimen jars
        for (let x = 2; x <= 5; x++) {
            objects[1 * w + x] = T.LAB_BENCH;
            collision[1 * w + x] = 1;
        }
        // Specimen jars on benches
        objects[1 * w + 2] = T.SPECIMEN;
        collision[1 * w + 2] = 1;
        objects[1 * w + 4] = T.SPECIMEN;
        collision[1 * w + 4] = 1;

        // Microscope station
        objects[1 * w + 6] = T.LAB_BENCH;
        collision[1 * w + 6] = 1;
        objects[1 * w + 7] = T.MICROSCOPE;
        collision[1 * w + 7] = 1;

        // Right bench section with more specimens
        for (let x = 11; x <= 15; x++) {
            objects[1 * w + x] = T.LAB_BENCH;
            collision[1 * w + x] = 1;
        }
        objects[1 * w + 12] = T.SPECIMEN;
        collision[1 * w + 12] = 1;
        objects[1 * w + 14] = T.SPECIMEN;
        collision[1 * w + 14] = 1;

        // Interaction zones for specimen benches
        for (let x = 2; x <= 7; x++) {
            interact[2 * w + x] = { type: 'research', index: 0 };
        }
        for (let x = 11; x <= 15; x++) {
            interact[2 * w + x] = { type: 'research', index: 0 };
        }

        // ============================================
        // 3. COMPUTER WORKSTATIONS (middle area)
        // ============================================

        // Left computer cluster
        objects[4 * w + 3] = T.DESK;
        collision[4 * w + 3] = 1;
        objects[4 * w + 4] = T.COMPUTER;
        collision[4 * w + 4] = 1;
        objects[5 * w + 3] = T.CHAIR;
        interact[5 * w + 4] = { type: 'research', index: 1 };

        // Center computer cluster
        objects[4 * w + 8] = T.DESK;
        collision[4 * w + 8] = 1;
        objects[4 * w + 9] = T.COMPUTER;
        collision[4 * w + 9] = 1;
        objects[5 * w + 8] = T.CHAIR;
        interact[5 * w + 9] = { type: 'research', index: 1 };

        // Right computer cluster
        objects[4 * w + 13] = T.DESK;
        collision[4 * w + 13] = 1;
        objects[4 * w + 14] = T.COMPUTER;
        collision[4 * w + 14] = 1;
        objects[5 * w + 14] = T.CHAIR;
        interact[5 * w + 13] = { type: 'research', index: 1 };

        // ============================================
        // 4. NATURE/ZOOLOGY DISPLAYS (walls and corners)
        // ============================================

        // Animal posters on walls (left and right sides)
        objects[3 * w + 1] = T.ANIMAL_POSTER;
        collision[3 * w + 1] = 1;
        objects[6 * w + 1] = T.ANIMAL_POSTER;
        collision[6 * w + 1] = 1;
        objects[3 * w + (w - 2)] = T.ANIMAL_POSTER;
        collision[3 * w + (w - 2)] = 1;
        objects[6 * w + (w - 2)] = T.ANIMAL_POSTER;
        collision[6 * w + (w - 2)] = 1;

        // Potted plants in corners for greenery
        objects[8 * w + 2] = T.PLANT;
        objects[8 * w + (w - 3)] = T.PLANT;

        // ============================================
        // 5. CENTRAL DISPLAY/WHITEBOARD AREA
        // ============================================

        // Screen for data display (central feature)
        objects[7 * w + 7] = T.SCREEN;
        collision[7 * w + 7] = 1;
        objects[7 * w + 8] = T.SCREEN;
        collision[7 * w + 8] = 1;
        objects[7 * w + 9] = T.SCREEN;
        collision[7 * w + 9] = 1;
        objects[7 * w + 10] = T.SCREEN;
        collision[7 * w + 10] = 1;

        // Interaction for whiteboard/screen
        interact[8 * w + 8] = { type: 'object', id: 'whiteboard', content: 'lab.projects' };
        interact[8 * w + 9] = { type: 'object', id: 'whiteboard', content: 'lab.projects' };

        // ============================================
        // 6. EXIT AT BOTTOM CENTER
        // ============================================

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
            [T.SIGN_THEATRE]: 'signTheatre',
            // Lab interior sprites (zoology theme)
            [T.SPECIMEN]: 'specimen',
            [T.MICROSCOPE]: 'microscope',
            [T.PLANT]: 'plant',
            [T.ANIMAL_POSTER]: 'animalPoster',
            // Station/Theatre interior sprites
            [T.CONTROL_DESK]: 'controlDesk',
            [T.MICROPHONE]: 'microphone',
            [T.SCREEN]: 'screen',
            [T.STAGE_CURTAIN]: 'stageCurtain',
            [T.SPOTLIGHT]: 'spotlight'
        };
        return spriteMap[tileType] || null;
    }
};

// Export
window.World = World;
