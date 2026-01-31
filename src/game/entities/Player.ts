import { Input } from '../core/Input';
import { Collision } from '../systems/Collision';
import { EngineConfig } from '../../config/engine';

/**
 * Player - Character entity with hybrid movement and collision
 *
 * Movement system:
 * - Smooth sub-tile movement while keys held (4 tiles/second)
 * - Snap to nearest tile center when keys released
 * - 4-directional only (no diagonal movement)
 * - Hard stop on collision with solid tiles
 */
export class Player {
    /** Current X position in pixels (at render scale) */
    x: number;

    /** Current Y position in pixels (at render scale) */
    y: number;

    private input: Input;
    private collision: Collision;

    /** Movement speed in pixels/second (4 tiles/second at 64px = 256) */
    private readonly speed = 256;

    /** Lerp factor for grid snapping when keys released */
    private readonly snapSpeed = 10;

    constructor(
        input: Input,
        collision: Collision,
        startTileX: number,
        startTileY: number
    ) {
        this.input = input;
        this.collision = collision;

        // Convert tile position to pixel position
        const tileSize = EngineConfig.renderedTileSize;
        this.x = startTileX * tileSize;
        this.y = startTileY * tileSize;
    }

    /**
     * Update player position based on input and collision
     *
     * @param deltaTime - Time since last frame in seconds
     */
    update(deltaTime: number): void {
        const tileSize = EngineConfig.renderedTileSize;
        const dir = this.input.getMovementDirection();

        if (dir.x !== 0 || dir.y !== 0) {
            // Keys held: smooth movement in one direction only (4-directional)
            // Input already handles direction priority (vertical over horizontal)
            let deltaX = 0;
            let deltaY = 0;

            if (dir.y !== 0) {
                deltaY = dir.y * this.speed * deltaTime;
            } else if (dir.x !== 0) {
                deltaX = dir.x * this.speed * deltaTime;
            }

            // Apply movement with collision detection
            // Player hitbox is full tile size (64x64 at 2x scale)
            const result = this.collision.moveWithCollision(
                this.x,
                this.y,
                deltaX,
                deltaY,
                tileSize,
                tileSize
            );
            this.x = result.x;
            this.y = result.y;
        } else {
            // Keys released: snap to nearest tile center using exponential smoothing
            const targetX = Math.round(this.x / tileSize) * tileSize;
            const targetY = Math.round(this.y / tileSize) * tileSize;

            // Framerate-independent lerp
            const lerpFactor = 1 - Math.exp(-this.snapSpeed * deltaTime);
            this.x += (targetX - this.x) * lerpFactor;
            this.y += (targetY - this.y) * lerpFactor;

            // Snap when very close (avoid infinite lerp toward target)
            if (Math.abs(this.x - targetX) < 0.5) this.x = targetX;
            if (Math.abs(this.y - targetY) < 0.5) this.y = targetY;
        }
    }

    /**
     * Get center X position (for camera following)
     */
    getCenterX(): number {
        return this.x + EngineConfig.renderedTileSize / 2;
    }

    /**
     * Get center Y position (for camera following)
     */
    getCenterY(): number {
        return this.y + EngineConfig.renderedTileSize / 2;
    }

    /**
     * Get current tile column (for game logic)
     */
    getTileX(): number {
        return Math.floor(this.x / EngineConfig.renderedTileSize);
    }

    /**
     * Get current tile row (for game logic)
     */
    getTileY(): number {
        return Math.floor(this.y / EngineConfig.renderedTileSize);
    }
}
