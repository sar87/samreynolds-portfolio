import { EngineConfig } from '../../config/engine';

/**
 * TileMap - Stores tile data and provides spatial queries
 *
 * Used by the collision system and renderer to determine
 * what tiles exist at given coordinates and whether they block movement.
 */

/**
 * Tile types for the game world
 * Using const object instead of enum for erasableSyntaxOnly compatibility
 */
export const TileType = {
    EMPTY: 0,
    GRASS: 1,
    WALL: 2,
    WATER: 3,
    PATH: 4,
} as const;

export type TileType = (typeof TileType)[keyof typeof TileType];

/**
 * Set of tile types that block player movement
 */
const SOLID_TILES = new Set<TileType>([TileType.WALL, TileType.WATER]);

/**
 * TileMap class that stores tile data as a flat array
 * and provides spatial queries for collision and rendering.
 */
export class TileMap {
    private width: number;
    private height: number;
    private tiles: TileType[];

    constructor(width: number, height: number, tiles: TileType[]) {
        this.width = width;
        this.height = height;
        this.tiles = tiles;

        // Validate that tiles array matches dimensions
        if (tiles.length !== width * height) {
            throw new Error(
                `TileMap: tiles array length (${tiles.length}) does not match dimensions (${width}x${height}=${width * height})`
            );
        }
    }

    /**
     * Get the tile type at the given column and row
     * Returns EMPTY for out-of-bounds coordinates
     */
    getTile(col: number, row: number): TileType {
        if (col < 0 || col >= this.width || row < 0 || row >= this.height) {
            return TileType.EMPTY;
        }
        const index = row * this.width + col;
        return this.tiles[index];
    }

    /**
     * Check if the tile at the given column and row is solid (blocks movement)
     * Out-of-bounds tiles are treated as passable (EMPTY)
     */
    isSolid(col: number, row: number): boolean {
        const tile = this.getTile(col, row);
        return SOLID_TILES.has(tile);
    }

    /**
     * Get map width in tiles
     */
    getWidth(): number {
        return this.width;
    }

    /**
     * Get map height in tiles
     */
    getHeight(): number {
        return this.height;
    }

    /**
     * Get map width in pixels (at render scale)
     * Uses EngineConfig.renderedTileSize (tileSize * scale)
     */
    getPixelWidth(): number {
        return this.width * EngineConfig.renderedTileSize;
    }

    /**
     * Get map height in pixels (at render scale)
     * Uses EngineConfig.renderedTileSize (tileSize * scale)
     */
    getPixelHeight(): number {
        return this.height * EngineConfig.renderedTileSize;
    }
}
