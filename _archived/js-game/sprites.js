// Pokemon sprite sheet loading and coordinate mapping system
// Loads professional Pokemon FireRed/LeafGreen sprite sheets

const Sprites = {
    tileSize: 16,      // Pokemon GBA tile size
    charWidth: 16,     // Character sprite width
    charHeight: 32,    // Character sprite height (2x tile)
    scale: 3,          // Render scale

    sheets: {},        // Loaded Image objects
    loaded: false,

    // Sprite sheet paths
    SPRITE_SHEETS: {
        town: 'Pokemon Sprites/Game Boy Advance - Pokemon FireRed _ LeafGreen - Maps (Towns, Buildings, Etc.) - Pallet Town.png',
        npcs: 'Pokemon Sprites/Game Boy Advance - Pokemon FireRed _ LeafGreen - Trainers & Non-Playable Characters - Overworld NPCs.png'
    },

    // PRE-RENDERED MAP SECTIONS
    // The sprite sheet contains complete pre-rendered maps, not individual tiles
    // We render entire map sections and overlay collision/interaction data
    MAPS: {
        // Pallet Town outdoor map - the main overworld
        // Skip the "Pallet Town" text label at top (about 16px), map is 20x18 tiles
        palletTown: { sx: 0, sy: 16, sw: 320, sh: 288 },  // Full outdoor map (20x18 tiles)

        // Interior maps for buildings
        playerHouse1F: { sx: 320, sy: 10, sw: 160, sh: 144 },   // Player House ground floor
        playerHouse2F: { sx: 480, sy: 10, sw: 160, sh: 144 },   // Player House second floor
        rivalHouse: { sx: 320, sy: 160, sw: 160, sh: 144 },     // Rival's House
        oakLab: { sx: 640, sy: 10, sw: 192, sh: 160 }           // Professor Oak's Lab
    },

    // Individual tiles for interior decoration (these ARE designed to tile)
    TILE_COORDS: {
        // Interior tiles from Player House section
        floor: { sx: 368, sy: 96, sw: 16, sh: 16 },
        wall: { sx: 352, sy: 32, sw: 16, sh: 16 },
        door: { sx: 400, sy: 128, sw: 16, sh: 16 },
        stairs: { sx: 448, sy: 64, sw: 16, sh: 16 },
        table: { sx: 384, sy: 80, sw: 16, sh: 16 },
        chair: { sx: 400, sy: 96, sw: 16, sh: 16 },
        bookshelf: { sx: 352, sy: 48, sw: 16, sh: 16 },
        computer: { sx: 432, sy: 48, sw: 16, sh: 16 },
        sofa: { sx: 336, sy: 80, sw: 16, sh: 16 },
        tv: { sx: 336, sy: 48, sw: 16, sh: 16 },
        plant: { sx: 336, sy: 64, sw: 16, sh: 16 },
        rug: { sx: 384, sy: 96, sw: 16, sh: 16 }
    },

    // Character animation frames (4 directions x 4 frames = 16 total)
    // Character sprite is located in the NPC sheet under "CHARACTERS" label
    // Each frame is 16x32, arranged as: down, left, right, up (rows)
    CHARACTER_COORDS: {
        // Down direction (row 0)
        player_down_0: { sx: 0, sy: 1408, sw: 16, sh: 32 },
        player_down_1: { sx: 16, sy: 1408, sw: 16, sh: 32 },
        player_down_2: { sx: 32, sy: 1408, sw: 16, sh: 32 },
        player_down_3: { sx: 48, sy: 1408, sw: 16, sh: 32 },

        // Left direction (row 1)
        player_left_0: { sx: 0, sy: 1440, sw: 16, sh: 32 },
        player_left_1: { sx: 16, sy: 1440, sw: 16, sh: 32 },
        player_left_2: { sx: 32, sy: 1440, sw: 16, sh: 32 },
        player_left_3: { sx: 48, sy: 1440, sw: 16, sh: 32 },

        // Right direction (row 2)
        player_right_0: { sx: 0, sy: 1472, sw: 16, sh: 32 },
        player_right_1: { sx: 16, sy: 1472, sw: 16, sh: 32 },
        player_right_2: { sx: 32, sy: 1472, sw: 16, sh: 32 },
        player_right_3: { sx: 48, sy: 1472, sw: 16, sh: 32 },

        // Up direction (row 3)
        player_up_0: { sx: 0, sy: 1504, sw: 16, sh: 32 },
        player_up_1: { sx: 16, sy: 1504, sw: 16, sh: 32 },
        player_up_2: { sx: 32, sy: 1504, sw: 16, sh: 32 },
        player_up_3: { sx: 48, sy: 1504, sw: 16, sh: 32 }
    },

    // Load a sprite sheet asynchronously
    async loadSpriteSheet(name, path) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                this.sheets[name] = img;
                resolve(img);
            };
            img.onerror = () => reject(new Error(`Failed to load sprite sheet: ${path}`));
            img.src = path;
        });
    },

    // Initialize sprite system - load all sprite sheets
    async init() {
        await Promise.all([
            this.loadSpriteSheet('town', this.SPRITE_SHEETS.town),
            this.loadSpriteSheet('npcs', this.SPRITE_SHEETS.npcs)
        ]);
        this.loaded = true;
        console.log('Pokemon sprite sheets loaded');
        return Promise.resolve();
    },

    // Get tile sprite data for rendering
    get(name) {
        const coords = this.TILE_COORDS[name];
        if (!coords) return null;
        return {
            image: this.sheets.town,
            ...coords
        };
    },

    // Get pre-rendered map data
    getMap(name) {
        const coords = this.MAPS[name];
        if (!coords) return null;
        return {
            image: this.sheets.town,
            ...coords
        };
    },

    // Get character frame for animation
    getCharacterFrame(direction, frame) {
        const key = `player_${direction}_${frame % 4}`;
        const coords = this.CHARACTER_COORDS[key];
        if (!coords) return null;
        return {
            image: this.sheets.npcs,
            ...coords,
            sw: this.charWidth,
            sh: this.charHeight
        };
    }
};

// Export for use in other modules
window.Sprites = Sprites;
