import { EngineConfig } from '../../config/engine';
import { TileMap } from '../rendering/TileMap';

/**
 * Collision - AABB collision detection against solid tiles
 *
 * Checks if rectangular areas overlap solid tiles and resolves
 * movement by processing X and Y axes separately to prevent
 * "sticky walls" when moving diagonally.
 */

export class Collision {
    private tileMap: TileMap;

    constructor(tileMap: TileMap) {
        this.tileMap = tileMap;
    }

    /**
     * Check if bounding box overlaps any solid tiles
     * Coordinates and dimensions are in pixels (at render scale)
     */
    isCollidingWithTiles(
        x: number,
        y: number,
        width: number,
        height: number
    ): boolean {
        const tileSize = EngineConfig.renderedTileSize; // 64px at 2x scale

        // Get tile coordinates for all corners
        const left = Math.floor(x / tileSize);
        const right = Math.floor((x + width - 1) / tileSize);
        const top = Math.floor(y / tileSize);
        const bottom = Math.floor((y + height - 1) / tileSize);

        // Check all overlapped tiles
        for (let row = top; row <= bottom; row++) {
            for (let col = left; col <= right; col++) {
                if (this.tileMap.isSolid(col, row)) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * Move with collision, processing X and Y separately
     *
     * CRITICAL: Separate axis processing prevents "sticky walls" where
     * diagonal movement into a wall would stop both axes even though
     * one axis has a valid path.
     *
     * @param currentX - Current X position in pixels
     * @param currentY - Current Y position in pixels
     * @param deltaX - Desired X movement in pixels
     * @param deltaY - Desired Y movement in pixels
     * @param width - Entity width in pixels
     * @param height - Entity height in pixels
     * @returns New position after collision resolution
     */
    moveWithCollision(
        currentX: number,
        currentY: number,
        deltaX: number,
        deltaY: number,
        width: number,
        height: number
    ): { x: number; y: number } {
        let newX = currentX;
        let newY = currentY;

        // Test X axis separately
        if (!this.isCollidingWithTiles(currentX + deltaX, currentY, width, height)) {
            newX += deltaX;
        }

        // Test Y axis separately (using newX, not currentX)
        // This allows sliding along walls when moving diagonally
        if (!this.isCollidingWithTiles(newX, currentY + deltaY, width, height)) {
            newY += deltaY;
        }

        return { x: newX, y: newY };
    }
}
