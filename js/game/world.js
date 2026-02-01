// World map and collision detection for Cambridge campus

const World = {
    // Map dimensions (in tiles)
    width: 40,
    height: 30,
    tileSize: 16,

    // Current location (campus or interior)
    currentLocation: 'campus',

    // Tile types (Pokemon-specific)
    TILES: {
        // Outdoor terrain
        GRASS: 0,
        PATH: 1,
        FLOWER: 2,
        WATER: 3,
        TREE_TRUNK: 4,
        TREE_TOP: 5,
        FENCE: 6,

        // Building exteriors
        HOUSE_WALL: 10,
        HOUSE_ROOF: 11,
        HOUSE_DOOR: 12,
        LAB_WALL: 13,
        LAB_ROOF: 14,
        LAB_DOOR: 15,

        // Interior - floor/walls
        FLOOR: 20,
        INT_WALL: 21,
        INT_DOOR: 22,
        STAIRS: 23,

        // Interior - furniture
        TABLE: 30,
        CHAIR: 31,
        BOOKSHELF: 32,
        COMPUTER: 33,
        TV: 34,
        SOFA: 35,
        PLANT: 36,
        RUG: 37
    },

    // Building definitions with entry points
    buildings: {
        playerHouse: {
            name: "Player's House",
            contentKey: 'about',  // About Me content
            entrance: { x: 6, y: 10 },
            tiles: { x: 4, y: 7, w: 5, h: 4 },
            style: 'house',
            floors: 2  // Has 1F and 2F
        },
        rivalHouse: {
            name: "Rival's House",
            contentKey: 'talks_media',  // Talks + Media content
            entrance: { x: 14, y: 10 },
            tiles: { x: 12, y: 7, w: 5, h: 4 },
            style: 'house'
        },
        oakLab: {
            name: "Professor Oak's Lab",
            contentKey: 'research_publications',  // Research + Publications
            entrance: { x: 10, y: 16 },
            tiles: { x: 7, y: 13, w: 7, h: 4 },
            style: 'lab'
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

    // Generate the main Pallet Town map
    generateCampusMap() {
        const T = this.TILES;
        const w = 20;   // Pallet Town width
        const h = 18;   // Pallet Town height
        this.width = w;
        this.height = h;

        const ground = new Array(w * h).fill(T.GRASS);
        const objects = new Array(w * h).fill(-1);
        const collision = new Array(w * h).fill(0);
        const interact = new Array(w * h).fill(null);

        const setTile = (x, y, groundTile, objectTile = -1, blocked = false, interactData = null) => {
            if (x < 0 || x >= w || y < 0 || y >= h) return;
            const idx = y * w + x;
            if (groundTile !== null) ground[idx] = groundTile;
            if (objectTile !== -1) objects[idx] = objectTile;
            if (blocked) collision[idx] = 1;
            if (interactData) interact[idx] = interactData;
        };

        const placeTree = (x, y) => {
            setTile(x, y, T.GRASS, T.TREE_TRUNK, true);
            if (y > 0) setTile(x, y - 1, null, T.TREE_TOP, true);
        };

        // 1. TREE BORDER (dense forest edge)
        for (let x = 0; x < w; x++) {
            placeTree(x, 1);
            if (x < 8 || x > 12) placeTree(x, 2);
        }
        for (let y = 2; y < h - 1; y++) {
            placeTree(0, y);
            placeTree(1, y);
            placeTree(w - 1, y);
            placeTree(w - 2, y);
        }

        // 2. MAIN PATH (vertical from bottom)
        for (let y = 3; y < h; y++) {
            setTile(9, y, T.PATH);
            setTile(10, y, T.PATH);
        }

        // 3. HORIZONTAL PATHS to houses
        for (let x = 4; x < 9; x++) setTile(x, 8, T.PATH);
        for (let x = 11; x < 16; x++) setTile(x, 8, T.PATH);

        // 4. PLAYER'S HOUSE (left side)
        this.buildHouse(ground, objects, collision, interact, 'playerHouse', 4, 5, 5, 4);

        // 5. RIVAL'S HOUSE (right side)
        this.buildHouse(ground, objects, collision, interact, 'rivalHouse', 12, 5, 5, 4);

        // 6. OAK'S LAB (bottom center)
        this.buildLab(ground, objects, collision, interact, 'oakLab', 7, 12, 7, 5);

        // 7. FLOWERS (decorative)
        const flowerSpots = [[5, 9], [6, 9], [14, 9], [15, 9], [8, 11], [12, 11]];
        flowerSpots.forEach(([x, y]) => setTile(x, y, T.FLOWER));

        // 8. POND (bottom left area)
        for (let x = 3; x <= 5; x++) {
            for (let y = 14; y <= 16; y++) {
                setTile(x, y, T.WATER, -1, true);
            }
        }

        this.campusMap = {
            width: w,
            height: h,
            layers: { ground, objects, collision, interact }
        };
    },

    // Helper to build a house exterior
    buildHouse(ground, objects, collision, interact, id, x, y, w, h) {
        const T = this.TILES;
        const mapW = this.width;
        const building = this.buildings[id];

        // Fill building footprint with walls
        for (let bx = x; bx < x + w; bx++) {
            for (let by = y; by < y + h; by++) {
                const idx = by * mapW + bx;
                objects[idx] = T.HOUSE_WALL;
                collision[idx] = 1;
            }
        }

        // Roof row at top
        for (let bx = x; bx < x + w; bx++) {
            const idx = y * mapW + bx;
            objects[idx] = T.HOUSE_ROOF;
        }

        // Door at entrance
        const doorIdx = building.entrance.y * mapW + building.entrance.x;
        objects[doorIdx] = T.HOUSE_DOOR;
        collision[doorIdx] = 0;
        interact[doorIdx] = { type: 'door', building: id, name: building.name };
    },

    // Helper to build a lab exterior
    buildLab(ground, objects, collision, interact, id, x, y, w, h) {
        const T = this.TILES;
        const mapW = this.width;
        const building = this.buildings[id];

        // Fill building footprint with lab walls
        for (let bx = x; bx < x + w; bx++) {
            for (let by = y; by < y + h; by++) {
                const idx = by * mapW + bx;
                objects[idx] = T.LAB_WALL;
                collision[idx] = 1;
            }
        }

        // Lab roof row at top
        for (let bx = x; bx < x + w; bx++) {
            const idx = y * mapW + bx;
            objects[idx] = T.LAB_ROOF;
        }

        // Door at entrance
        const doorIdx = building.entrance.y * mapW + building.entrance.x;
        objects[doorIdx] = T.LAB_DOOR;
        collision[doorIdx] = 0;
        interact[doorIdx] = { type: 'door', building: id, name: building.name };
    },

    // Generate interior maps for each building
    generateInteriorMaps() {
        this.interiorMaps.pembroke = this.generatePembrokeInterior();
        this.interiorMaps.library = this.generateLibraryInterior();
        this.interiorMaps.station = this.generateStationInterior();
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

    // Generate TV Station interior (broadcast studio)
    // 14x10 tiles - control desk, screens, microphones, spotlights
    generateStationInterior() {
        const T = this.TILES;
        const w = 14;
        const h = 10;

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
        // 2. BROADCASTING CONTROL AREA (top section)
        // ============================================

        // Control desk (broadcasting console)
        objects[1 * w + 3] = T.CONTROL_DESK;
        collision[1 * w + 3] = 1;
        objects[1 * w + 4] = T.CONTROL_DESK;
        collision[1 * w + 4] = 1;
        objects[1 * w + 5] = T.CONTROL_DESK;
        collision[1 * w + 5] = 1;
        interact[2 * w + 4] = { type: 'media', index: 0 };

        // Monitor screens on wall
        objects[1 * w + 8] = T.SCREEN;
        collision[1 * w + 8] = 1;
        objects[1 * w + 9] = T.SCREEN;
        collision[1 * w + 9] = 1;
        objects[1 * w + 10] = T.SCREEN;
        collision[1 * w + 10] = 1;
        interact[2 * w + 9] = { type: 'media', index: 1 };

        // ============================================
        // 3. INTERVIEW/RECORDING AREA (middle)
        // ============================================

        // Microphones for interview setup
        objects[4 * w + 5] = T.MICROPHONE;
        collision[4 * w + 5] = 1;
        objects[4 * w + 8] = T.MICROPHONE;
        collision[4 * w + 8] = 1;
        interact[5 * w + 5] = { type: 'media', index: 2 };
        interact[5 * w + 8] = { type: 'media', index: 2 };

        // Chairs for interview
        objects[5 * w + 4] = T.CHAIR;
        objects[5 * w + 9] = T.CHAIR;

        // ============================================
        // 4. STUDIO LIGHTING
        // ============================================

        // Spotlights for studio lighting
        objects[3 * w + 2] = T.SPOTLIGHT;
        collision[3 * w + 2] = 1;
        objects[3 * w + 11] = T.SPOTLIGHT;
        collision[3 * w + 11] = 1;

        // Additional media interaction zones
        interact[6 * w + 6] = { type: 'media', index: 3 };
        interact[6 * w + 7] = { type: 'media', index: 4 };

        // ============================================
        // 5. EXIT AT BOTTOM CENTER
        // ============================================

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

    // Generate Lecture Theatre interior (lecture hall/stage setup)
    // 16x12 tiles - stage with curtain, podium, screen, audience seating
    generateTheatreInterior() {
        const T = this.TILES;
        const w = 16;
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
        // 2. STAGE AREA (top section)
        // ============================================

        // Stage curtain along top (behind stage)
        for (let x = 3; x <= 12; x++) {
            objects[1 * w + x] = T.STAGE_CURTAIN;
            collision[1 * w + x] = 1;
        }

        // Presentation screen behind podium
        objects[1 * w + 6] = T.SCREEN;
        collision[1 * w + 6] = 1;
        objects[1 * w + 7] = T.SCREEN;
        collision[1 * w + 7] = 1;
        objects[1 * w + 8] = T.SCREEN;
        collision[1 * w + 8] = 1;
        objects[1 * w + 9] = T.SCREEN;
        collision[1 * w + 9] = 1;

        // Podium at center stage
        objects[2 * w + 7] = T.PODIUM;
        collision[2 * w + 7] = 1;
        objects[2 * w + 8] = T.PODIUM;
        collision[2 * w + 8] = 1;
        interact[3 * w + 7] = { type: 'talks', index: 0 };
        interact[3 * w + 8] = { type: 'talks', index: 0 };

        // ============================================
        // 3. STAGE LIGHTING
        // ============================================

        // Spotlights above stage
        objects[2 * w + 3] = T.SPOTLIGHT;
        collision[2 * w + 3] = 1;
        objects[2 * w + 12] = T.SPOTLIGHT;
        collision[2 * w + 12] = 1;

        // ============================================
        // 4. AUDIENCE SEATING (5 rows)
        // ============================================

        // Row 1 (closest to stage)
        for (let x = 4; x <= 11; x += 2) {
            objects[4 * w + x] = T.CHAIR;
            collision[4 * w + x] = 1;
        }
        interact[4 * w + 5] = { type: 'talks', index: 1 };
        interact[4 * w + 9] = { type: 'talks', index: 1 };

        // Row 2
        for (let x = 3; x <= 12; x += 2) {
            objects[5 * w + x] = T.CHAIR;
            collision[5 * w + x] = 1;
        }
        interact[5 * w + 6] = { type: 'talks', index: 2 };
        interact[5 * w + 10] = { type: 'talks', index: 2 };

        // Row 3
        for (let x = 4; x <= 11; x += 2) {
            objects[6 * w + x] = T.CHAIR;
            collision[6 * w + x] = 1;
        }
        interact[6 * w + 5] = { type: 'talks', index: 3 };
        interact[6 * w + 9] = { type: 'talks', index: 3 };

        // Row 4
        for (let x = 3; x <= 12; x += 2) {
            objects[7 * w + x] = T.CHAIR;
            collision[7 * w + x] = 1;
        }
        interact[7 * w + 6] = { type: 'talks', index: 4 };
        interact[7 * w + 10] = { type: 'talks', index: 4 };

        // Row 5 (back row)
        for (let x = 4; x <= 11; x += 2) {
            objects[8 * w + x] = T.CHAIR;
            collision[8 * w + x] = 1;
        }

        // ============================================
        // 5. EXIT AT BOTTOM CENTER
        // ============================================

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

    // Check for nearby interactions at player position (1-tile proximity)
    checkNearbyInteractions(playerX, playerY) {
        const map = this.getCurrentMap();
        if (!map) return null;

        const { interact } = map.layers;
        const w = map.width;
        const h = map.height;

        // Check 3x3 area around player (player tile + adjacent tiles)
        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                const checkX = playerX + dx;
                const checkY = playerY + dy;

                // Bounds check
                if (checkX < 0 || checkX >= w || checkY < 0 || checkY >= h) continue;

                const idx = checkY * w + checkX;
                const interaction = interact[idx];

                if (interaction) {
                    // Return interaction with position info
                    return {
                        ...interaction,
                        x: checkX,
                        y: checkY
                    };
                }
            }
        }
        return null;
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
            [T.FLOWER]: 'flower',
            [T.WATER]: 'water',
            [T.TREE_TRUNK]: 'tree_trunk',
            [T.TREE_TOP]: 'tree_top',
            [T.HOUSE_WALL]: 'house_wall',
            [T.HOUSE_ROOF]: 'house_roof',
            [T.HOUSE_DOOR]: 'house_door',
            [T.LAB_WALL]: 'lab_wall',
            [T.LAB_ROOF]: 'lab_roof',
            [T.LAB_DOOR]: 'lab_door',
            [T.FLOOR]: 'floor',
            [T.INT_WALL]: 'wall',
            [T.INT_DOOR]: 'door',
            [T.STAIRS]: 'stairs',
            [T.TABLE]: 'table',
            [T.CHAIR]: 'chair',
            [T.BOOKSHELF]: 'bookshelf',
            [T.COMPUTER]: 'computer',
            [T.TV]: 'tv',
            [T.SOFA]: 'sofa',
            [T.PLANT]: 'plant',
            [T.RUG]: 'rug'
        };
        return spriteMap[tileType] || null;
    }
};

// Export
window.World = World;
