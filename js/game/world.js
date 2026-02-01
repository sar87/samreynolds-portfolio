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
    // Positions match the pre-rendered Pallet Town map
    buildings: {
        playerHouse: {
            name: "Player's House",
            contentKey: 'about',  // About Me content
            entrance: { x: 5, y: 6 },  // Door position in pre-rendered map
            style: 'house',
            floors: 2  // Has 1F and 2F
        },
        rivalHouse: {
            name: "Rival's House",
            contentKey: 'talks_media',  // Talks + Media content
            entrance: { x: 13, y: 6 },  // Door position in pre-rendered map
            style: 'house'
        },
        oakLab: {
            name: "Professor Oak's Lab",
            contentKey: 'research_publications',  // Research + Publications
            entrance: { x: 14, y: 12 },  // Door position in pre-rendered map
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

    // Generate collision/interaction data for the pre-rendered Pallet Town map
    // The map image is rendered directly; this just handles collision and interactions
    generateCampusMap() {
        const w = 20;   // Pallet Town width in tiles
        const h = 18;   // Pallet Town height in tiles
        this.width = w;
        this.height = h;

        // These layers are for collision/interaction only - ground/objects not rendered tile-by-tile
        const ground = new Array(w * h).fill(0);
        const objects = new Array(w * h).fill(-1);
        const collision = new Array(w * h).fill(0);  // Default: walkable
        const interact = new Array(w * h).fill(null);

        const setCollision = (x, y, blocked, interactData = null) => {
            if (x < 0 || x >= w || y < 0 || y >= h) return;
            const idx = y * w + x;
            collision[idx] = blocked ? 1 : 0;
            if (interactData) interact[idx] = interactData;
        };

        const blockRect = (x1, y1, x2, y2) => {
            for (let x = x1; x <= x2; x++) {
                for (let y = y1; y <= y2; y++) {
                    setCollision(x, y, true);
                }
            }
        };

        // ============================================
        // COLLISION BASED ON PRE-RENDERED MAP LAYOUT
        // ============================================

        // 1. TREE BORDER (edges of the map)
        // Top tree rows
        blockRect(0, 0, 19, 1);
        // Left tree columns
        blockRect(0, 0, 1, 17);
        // Right tree columns
        blockRect(18, 0, 19, 17);
        // Bottom row (partial trees)
        blockRect(0, 17, 5, 17);  // Bottom left near pond
        blockRect(15, 17, 19, 17); // Bottom right

        // 2. LEFT HOUSE (Player's House) - approx x=3-7, y=2-5
        blockRect(3, 2, 7, 5);
        // Door at bottom center - walkable with interaction
        setCollision(5, 6, false, { type: 'door', building: 'playerHouse', name: "Player's House" });

        // 3. RIGHT HOUSE (Rival's House) - approx x=11-15, y=2-5
        blockRect(11, 2, 15, 5);
        // Door at bottom center
        setCollision(13, 6, false, { type: 'door', building: 'rivalHouse', name: "Rival's House" });

        // 4. OAK'S LAB (right side) - approx x=11-17, y=8-12
        blockRect(11, 8, 17, 11);
        // Door at entrance
        setCollision(14, 12, false, { type: 'door', building: 'oakLab', name: "Professor Oak's Lab" });

        // 5. FENCES (block movement)
        // Fence row above flower garden area
        blockRect(3, 7, 7, 7);
        // Fence row at bottom center
        blockRect(8, 14, 14, 14);

        // 6. POND (bottom left) - water blocks movement
        blockRect(2, 14, 5, 16);

        // 7. SIGNS (interactive, not blocking)
        setCollision(7, 7, false, { type: 'sign', message: "Player's House" });
        setCollision(8, 14, false, { type: 'sign', message: 'Pallet Town - Shades of your journey await!' });

        // Update building entrance positions
        this.buildings.playerHouse.entrance = { x: 5, y: 6 };
        this.buildings.rivalHouse.entrance = { x: 13, y: 6 };
        this.buildings.oakLab.entrance = { x: 14, y: 12 };

        this.campusMap = {
            width: w,
            height: h,
            layers: { ground, objects, collision, interact }
        };
    },

    // Generate interior maps for each building
    generateInteriorMaps() {
        this.interiorMaps.playerHouse = this.generatePlayerHouse1F();
        this.interiorMaps.playerHouse2F = this.generatePlayerHouse2F();
        this.interiorMaps.rivalHouse = this.generateRivalHouse();
        this.interiorMaps.oakLab = this.generateOakLab();
    },

    // Generate Player's House - 1F interior (living room)
    // 10x8 tiles - cozy home with About Me content zones
    generatePlayerHouse1F() {
        const T = this.TILES;
        const w = 10;
        const h = 8;

        const ground = new Array(w * h).fill(T.FLOOR);
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

        // Side walls (collision only)
        for (let y = 0; y < h; y++) {
            collision[y * w] = 1;
            collision[y * w + (w - 1)] = 1;
        }

        // Bottom wall collision (except exit)
        const exitX = Math.floor(w / 2);
        for (let x = 0; x < w; x++) {
            if (x !== exitX) {
                collision[(h - 1) * w + x] = 1;
            }
        }

        // ============================================
        // 2. TV AREA (left wall) - About bio content
        // ============================================

        // TV on left wall
        objects[1 * w + 1] = T.TV;
        collision[1 * w + 1] = 1;

        // Sofa facing TV
        objects[3 * w + 1] = T.SOFA;
        collision[3 * w + 1] = 1;
        objects[3 * w + 2] = T.SOFA;
        collision[3 * w + 2] = 1;

        // Interaction zone in front of TV
        interact[2 * w + 1] = { type: 'about', subtype: 'bio' };

        // ============================================
        // 3. TABLE (center) - About links content
        // ============================================

        // Table in center of room
        objects[3 * w + 5] = T.TABLE;
        collision[3 * w + 5] = 1;

        // Interaction zone near table
        interact[4 * w + 5] = { type: 'about', subtype: 'links' };

        // ============================================
        // 4. STAIRS TO 2F (right side)
        // ============================================

        // Stairs on right side
        objects[1 * w + (w - 2)] = T.STAIRS;
        collision[1 * w + (w - 2)] = 1;
        interact[1 * w + (w - 2)] = { type: 'stairs', floor: '2F' };

        // ============================================
        // 5. DECORATIONS
        // ============================================

        // Plant decoration
        objects[5 * w + 1] = T.PLANT;

        // Rug under table
        objects[3 * w + 4] = T.RUG;
        objects[3 * w + 6] = T.RUG;

        // ============================================
        // 6. EXIT AT BOTTOM CENTER
        // ============================================

        interact[(h - 1) * w + exitX] = { type: 'exit' };

        return {
            name: "Player's House - 1F",
            width: w,
            height: h,
            spawn: { x: exitX, y: h - 2 },
            layers: { ground, objects, collision, interact }
        };
    },

    // Generate Player's House - 2F interior (bedroom/study)
    // 10x8 tiles - personal space with more About content
    generatePlayerHouse2F() {
        const T = this.TILES;
        const w = 10;
        const h = 8;

        const ground = new Array(w * h).fill(T.FLOOR);
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

        // Side walls (collision only)
        for (let y = 0; y < h; y++) {
            collision[y * w] = 1;
            collision[y * w + (w - 1)] = 1;
        }

        // Bottom wall collision (except stairs)
        const stairsX = w - 2;
        for (let x = 0; x < w; x++) {
            if (x !== stairsX) {
                collision[(h - 1) * w + x] = 1;
            }
        }

        // ============================================
        // 2. BED AREA (left side) - About education
        // ============================================

        // Bed (using table as bed representation)
        objects[2 * w + 1] = T.TABLE;
        collision[2 * w + 1] = 1;
        objects[2 * w + 2] = T.TABLE;
        collision[2 * w + 2] = 1;

        // Interaction zone near bed
        interact[3 * w + 1] = { type: 'about', subtype: 'education' };
        interact[3 * w + 2] = { type: 'about', subtype: 'education' };

        // ============================================
        // 3. DESK WITH COMPUTER (right side) - About research
        // ============================================

        // Desk with computer
        objects[2 * w + (w - 3)] = T.TABLE;
        collision[2 * w + (w - 3)] = 1;
        objects[2 * w + (w - 2)] = T.COMPUTER;
        collision[2 * w + (w - 2)] = 1;

        // Chair in front of desk
        objects[3 * w + (w - 3)] = T.CHAIR;

        // Interaction zone at desk
        interact[3 * w + (w - 2)] = { type: 'about', subtype: 'research' };

        // ============================================
        // 4. BOOKSHELVES (bottom wall)
        // ============================================

        // Bookshelf along bottom
        objects[5 * w + 2] = T.BOOKSHELF;
        collision[5 * w + 2] = 1;
        objects[5 * w + 3] = T.BOOKSHELF;
        collision[5 * w + 3] = 1;
        objects[5 * w + 4] = T.BOOKSHELF;
        collision[5 * w + 4] = 1;

        // Interaction zones in front of bookshelves
        interact[4 * w + 2] = { type: 'about', subtype: 'interests' };
        interact[4 * w + 3] = { type: 'about', subtype: 'interests' };
        interact[4 * w + 4] = { type: 'about', subtype: 'interests' };

        // ============================================
        // 5. DECORATIONS
        // ============================================

        // Plants
        objects[5 * w + 1] = T.PLANT;
        objects[5 * w + 6] = T.PLANT;

        // Rug in center
        objects[4 * w + 5] = T.RUG;

        // ============================================
        // 6. STAIRS DOWN AT RIGHT SIDE
        // ============================================

        objects[(h - 1) * w + stairsX] = T.STAIRS;
        collision[(h - 1) * w + stairsX] = 1;
        interact[(h - 1) * w + stairsX] = { type: 'stairs', floor: '1F' };

        return {
            name: "Player's House - 2F",
            width: w,
            height: h,
            spawn: { x: stairsX, y: h - 2 },
            layers: { ground, objects, collision, interact }
        };
    },

    // Generate Rival's House interior (living area)
    // 10x8 tiles - TV area and bookshelves for Talks + Media content
    generateRivalHouse() {
        const T = this.TILES;
        const w = 10;
        const h = 8;

        const ground = new Array(w * h).fill(T.FLOOR);
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

        // Side walls (collision only)
        for (let y = 0; y < h; y++) {
            collision[y * w] = 1;
            collision[y * w + (w - 1)] = 1;
        }

        // Bottom wall collision (except exit)
        const exitX = Math.floor(w / 2);
        for (let x = 0; x < w; x++) {
            if (x !== exitX) {
                collision[(h - 1) * w + x] = 1;
            }
        }

        // ============================================
        // 2. TV MEDIA AREA (left side) - Media content
        // ============================================

        // Large TV for media appearances
        objects[1 * w + 1] = T.TV;
        collision[1 * w + 1] = 1;
        objects[1 * w + 2] = T.TV;
        collision[1 * w + 2] = 1;

        // Sofa facing TV
        objects[3 * w + 1] = T.SOFA;
        collision[3 * w + 1] = 1;
        objects[3 * w + 2] = T.SOFA;
        collision[3 * w + 2] = 1;

        // Media interaction zone
        interact[2 * w + 1] = { type: 'media', showPanel: true };
        interact[2 * w + 2] = { type: 'media', showPanel: true };

        // ============================================
        // 3. BOOKSHELF AREA (right side) - Talks content
        // ============================================

        // Bookshelves for talks/presentations
        objects[1 * w + (w - 2)] = T.BOOKSHELF;
        collision[1 * w + (w - 2)] = 1;
        objects[2 * w + (w - 2)] = T.BOOKSHELF;
        collision[2 * w + (w - 2)] = 1;
        objects[3 * w + (w - 2)] = T.BOOKSHELF;
        collision[3 * w + (w - 2)] = 1;

        // Talks interaction zones
        interact[1 * w + (w - 3)] = { type: 'talks', showPanel: true };
        interact[2 * w + (w - 3)] = { type: 'talks', showPanel: true };
        interact[3 * w + (w - 3)] = { type: 'talks', showPanel: true };

        // ============================================
        // 4. TABLE WITH NOTES (center)
        // ============================================

        // Table in center
        objects[5 * w + 5] = T.TABLE;
        collision[5 * w + 5] = 1;

        // Chair at table
        objects[4 * w + 5] = T.CHAIR;

        // Additional talks interaction
        interact[5 * w + 4] = { type: 'talks', showPanel: true };

        // ============================================
        // 5. DECORATIONS
        // ============================================

        // Plants
        objects[5 * w + 1] = T.PLANT;
        objects[5 * w + (w - 2)] = T.PLANT;

        // Rug
        objects[4 * w + 1] = T.RUG;
        objects[4 * w + 2] = T.RUG;

        // ============================================
        // 6. EXIT AT BOTTOM CENTER
        // ============================================

        interact[(h - 1) * w + exitX] = { type: 'exit' };

        return {
            name: "Rival's House",
            width: w,
            height: h,
            spawn: { x: exitX, y: h - 2 },
            layers: { ground, objects, collision, interact }
        };
    },

    // Generate Professor Oak's Lab interior
    // 12x10 tiles - laboratory with bookshelves and research equipment
    generateOakLab() {
        const T = this.TILES;
        const w = 12;
        const h = 10;

        const ground = new Array(w * h).fill(T.FLOOR);
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

        // Side walls (collision only)
        for (let y = 0; y < h; y++) {
            collision[y * w] = 1;
            collision[y * w + (w - 1)] = 1;
        }

        // Bottom wall collision (except exit)
        const exitX = Math.floor(w / 2);
        for (let x = 0; x < w; x++) {
            if (x !== exitX) {
                collision[(h - 1) * w + x] = 1;
            }
        }

        // ============================================
        // 2. BOOKSHELVES (left wall) - Publications
        // ============================================

        // Floor-to-ceiling bookshelves for publications
        for (let y = 1; y <= 5; y++) {
            objects[y * w + 1] = T.BOOKSHELF;
            collision[y * w + 1] = 1;
            // Interaction zone in front
            interact[y * w + 2] = { type: 'publication', showPanel: true };
        }

        // Additional bookshelves on top wall
        objects[1 * w + 3] = T.BOOKSHELF;
        collision[1 * w + 3] = 1;
        objects[1 * w + 4] = T.BOOKSHELF;
        collision[1 * w + 4] = 1;
        objects[1 * w + 5] = T.BOOKSHELF;
        collision[1 * w + 5] = 1;

        // Publications interaction zones
        interact[2 * w + 3] = { type: 'publication', showPanel: true };
        interact[2 * w + 4] = { type: 'publication', showPanel: true };
        interact[2 * w + 5] = { type: 'publication', showPanel: true };

        // ============================================
        // 3. LAB TABLES (right side) - Research projects
        // ============================================

        // Research lab tables with equipment
        objects[1 * w + (w - 2)] = T.TABLE;
        collision[1 * w + (w - 2)] = 1;
        objects[2 * w + (w - 2)] = T.TABLE;
        collision[2 * w + (w - 2)] = 1;
        objects[3 * w + (w - 2)] = T.TABLE;
        collision[3 * w + (w - 2)] = 1;

        // Research interaction zones
        interact[1 * w + (w - 3)] = { type: 'research', showPanel: true };
        interact[2 * w + (w - 3)] = { type: 'research', showPanel: true };
        interact[3 * w + (w - 3)] = { type: 'research', showPanel: true };

        // ============================================
        // 4. COMPUTER WORKSTATIONS (center area)
        // ============================================

        // Left computer station
        objects[4 * w + 3] = T.TABLE;
        collision[4 * w + 3] = 1;
        objects[4 * w + 4] = T.COMPUTER;
        collision[4 * w + 4] = 1;
        objects[5 * w + 3] = T.CHAIR;

        // Research interaction at computer
        interact[5 * w + 4] = { type: 'research', showPanel: true };

        // Right computer station
        objects[4 * w + 7] = T.TABLE;
        collision[4 * w + 7] = 1;
        objects[4 * w + 8] = T.COMPUTER;
        collision[4 * w + 8] = 1;
        objects[5 * w + 8] = T.CHAIR;

        // Research interaction at computer
        interact[5 * w + 7] = { type: 'research', showPanel: true };

        // ============================================
        // 5. ADDITIONAL RESEARCH EQUIPMENT
        // ============================================

        // More research tables at bottom
        objects[6 * w + 2] = T.TABLE;
        collision[6 * w + 2] = 1;
        objects[6 * w + 9] = T.TABLE;
        collision[6 * w + 9] = 1;

        // Research interactions
        interact[7 * w + 2] = { type: 'research', showPanel: true };
        interact[7 * w + 9] = { type: 'research', showPanel: true };

        // ============================================
        // 6. DECORATIONS
        // ============================================

        // Plants for lab atmosphere
        objects[7 * w + 1] = T.PLANT;
        objects[7 * w + (w - 2)] = T.PLANT;

        // ============================================
        // 7. EXIT AT BOTTOM CENTER
        // ============================================

        interact[(h - 1) * w + exitX] = { type: 'exit' };

        return {
            name: "Professor Oak's Lab",
            width: w,
            height: h,
            spawn: { x: exitX, y: h - 2 },
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
