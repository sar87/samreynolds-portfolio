import { TileType } from '../rendering/TileMap';

/**
 * Test map for Phase 4 development
 *
 * Layout (20x15):
 * WWWWWWWWWWWWWWWWWWWW  (W = wall)
 * W..................W
 * W..................W
 * W...PPPP...........W
 * W...P..P...WWWW....W
 * W...P..P...W..W....W
 * W...PPPP...W..W....W
 * W..........WWWW....W
 * W..................W
 * W......~~~~........W  (~ = water)
 * W......~~~~........W
 * W......~~~~........W
 * W..................W
 * W..................W
 * WWWWWWWWWWWWWWWWWWWW
 *
 * Features:
 * - Border walls around all edges
 * - Path area (top-left region)
 * - Internal wall structure (center-right)
 * - Water feature (River Cam placeholder)
 * - Open grass areas for movement testing
 */

// Shorthand aliases for readability
const _ = TileType.GRASS;
const W = TileType.WALL;
const P = TileType.PATH;
const O = TileType.WATER; // O for water (visual: ~~~~)

// prettier-ignore
const tiles: TileType[] = [
    // Row 0: Top border
    W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W,
    // Row 1: Open grass
    W, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, W,
    // Row 2: Open grass
    W, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, W,
    // Row 3: Path starts
    W, _, _, _, P, P, P, P, _, _, _, _, _, _, _, _, _, _, _, W,
    // Row 4: Path + wall structure
    W, _, _, _, P, _, _, P, _, _, _, W, W, W, W, _, _, _, _, W,
    // Row 5: Path + wall structure
    W, _, _, _, P, _, _, P, _, _, _, W, _, _, W, _, _, _, _, W,
    // Row 6: Path ends + wall structure
    W, _, _, _, P, P, P, P, _, _, _, W, _, _, W, _, _, _, _, W,
    // Row 7: Wall structure ends
    W, _, _, _, _, _, _, _, _, _, _, W, W, W, W, _, _, _, _, W,
    // Row 8: Open grass
    W, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, W,
    // Row 9: Water starts (River Cam)
    W, _, _, _, _, _, _, O, O, O, O, _, _, _, _, _, _, _, _, W,
    // Row 10: Water continues
    W, _, _, _, _, _, _, O, O, O, O, _, _, _, _, _, _, _, _, W,
    // Row 11: Water ends
    W, _, _, _, _, _, _, O, O, O, O, _, _, _, _, _, _, _, _, W,
    // Row 12: Open grass
    W, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, W,
    // Row 13: Open grass
    W, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, W,
    // Row 14: Bottom border
    W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W,
];

export const testMapData = {
    width: 20,
    height: 15,
    tiles,
    /** Player spawn position in tile coordinates */
    playerSpawn: { x: 3, y: 3 },
};
