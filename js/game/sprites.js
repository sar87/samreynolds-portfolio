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

    // Tile coordinate mappings (sx, sy, sw, sh)
    // Pallet Town outdoor map tiles (left section ~0-384px wide)
    TILE_COORDS: {
        // Outdoor terrain (from Pallet Town map)
        grass: { sx: 16, sy: 16, sw: 16, sh: 16 },
        path: { sx: 80, sy: 144, sw: 16, sh: 16 },
        flower: { sx: 48, sy: 48, sw: 16, sh: 16 },
        tree_trunk: { sx: 32, sy: 96, sw: 16, sh: 16 },
        tree_top: { sx: 32, sy: 80, sw: 16, sh: 16 },
        water: { sx: 160, sy: 304, sw: 16, sh: 16 },

        // Building exteriors (from Pallet Town houses)
        house_wall: { sx: 64, sy: 80, sw: 16, sh: 16 },
        house_roof: { sx: 64, sy: 64, sw: 16, sh: 16 },
        house_door: { sx: 88, sy: 88, sw: 16, sh: 16 },
        lab_wall: { sx: 192, sy: 208, sw: 16, sh: 16 },
        lab_roof: { sx: 192, sy: 192, sw: 16, sh: 16 },
        lab_door: { sx: 216, sy: 216, sw: 16, sh: 16 },

        // Interior tiles (from Player House 1F - starts around x=384)
        floor: { sx: 440, sy: 96, sw: 16, sh: 16 },
        wall: { sx: 440, sy: 32, sw: 16, sh: 16 },
        door: { sx: 488, sy: 144, sw: 16, sh: 16 },
        stairs: { sx: 520, sy: 120, sw: 16, sh: 16 },
        table: { sx: 472, sy: 96, sw: 16, sh: 16 },
        chair: { sx: 456, sy: 112, sw: 16, sh: 16 },
        bookshelf: { sx: 456, sy: 48, sw: 16, sh: 16 },
        computer: { sx: 504, sy: 64, sw: 16, sh: 16 },
        sofa: { sx: 520, sy: 80, sw: 16, sh: 16 },
        tv: { sx: 504, sy: 48, sw: 16, sh: 16 },
        plant: { sx: 488, sy: 80, sw: 16, sh: 16 },
        rug: { sx: 488, sy: 112, sw: 16, sh: 16 }
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
