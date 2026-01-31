import { Camera } from '../core/Camera';
import { TileMap, TileType } from './TileMap';
import { Player } from '../entities/Player';
import { EngineConfig } from '../../config/engine';

/**
 * Renderer - Canvas drawing with viewport culling
 *
 * Features:
 * - Viewport culling: only renders tiles visible on screen
 * - Integer coordinates: Math.floor prevents sub-pixel blur
 * - Alpha disabled: opaque canvas for 10-30% better performance
 * - Simple colored rectangles for Phase 4 (sprites added in Phase 5)
 */

/** Color mapping for tile types (placeholder for sprites) */
const TILE_COLORS: Record<number, string> = {
    [TileType.EMPTY]: '#000000',
    [TileType.GRASS]: '#4a7c23',
    [TileType.WALL]: '#555555',
    [TileType.WATER]: '#3366aa',
    [TileType.PATH]: '#c4a35a',
};

/** Player color (placeholder for sprite) */
const PLAYER_COLOR = '#ff6600';

export class Renderer {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private resizeHandler: () => void;

    constructor(container: HTMLElement) {
        this.canvas = document.createElement('canvas');

        // CRITICAL: Disable alpha channel for opaque game (performance boost)
        const ctx = this.canvas.getContext('2d', { alpha: false });
        if (!ctx) {
            throw new Error('Renderer: Failed to get 2D context');
        }
        this.ctx = ctx;

        container.appendChild(this.canvas);

        // Handle window resize
        this.resizeHandler = () => this.resize();
        this.resize();
        window.addEventListener('resize', this.resizeHandler);
    }

    /**
     * Resize canvas to fill browser window
     */
    private resize(): void {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.canvas.style.display = 'block';
    }

    /**
     * Get canvas width
     */
    getWidth(): number {
        return this.canvas.width;
    }

    /**
     * Get canvas height
     */
    getHeight(): number {
        return this.canvas.height;
    }

    /**
     * Render visible tiles with viewport culling
     *
     * Only draws tiles that are currently visible in the viewport,
     * which is a massive performance gain on large maps.
     */
    renderTiles(tileMap: TileMap, camera: Camera): void {
        const tileSize = EngineConfig.renderedTileSize;

        // Calculate visible tile range (viewport culling)
        const startCol = Math.floor(camera.x / tileSize);
        const endCol = Math.ceil((camera.x + this.canvas.width) / tileSize);
        const startRow = Math.floor(camera.y / tileSize);
        const endRow = Math.ceil((camera.y + this.canvas.height) / tileSize);

        // Render only visible tiles
        for (let row = startRow; row <= endRow; row++) {
            for (let col = startCol; col <= endCol; col++) {
                const tileType = tileMap.getTile(col, row);
                const color = TILE_COLORS[tileType] || TILE_COLORS[TileType.EMPTY];

                // Convert world coordinates to screen coordinates
                const screenPos = camera.worldToScreen(col * tileSize, row * tileSize);

                // CRITICAL: Use Math.floor for integer coordinates (no sub-pixel blur)
                this.ctx.fillStyle = color;
                this.ctx.fillRect(
                    Math.floor(screenPos.x),
                    Math.floor(screenPos.y),
                    tileSize,
                    tileSize
                );
            }
        }
    }

    /**
     * Render the player as a colored rectangle
     * Sprite rendering added in Phase 5
     */
    renderPlayer(player: Player, camera: Camera): void {
        const tileSize = EngineConfig.renderedTileSize;
        const screenPos = camera.worldToScreen(player.x, player.y);

        // Simple colored square for Phase 4 (sprite added in Phase 5)
        this.ctx.fillStyle = PLAYER_COLOR;
        this.ctx.fillRect(
            Math.floor(screenPos.x),
            Math.floor(screenPos.y),
            tileSize,
            tileSize
        );
    }

    /**
     * Clear the entire canvas with black
     */
    clear(): void {
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Get the rendering context for debug drawing
     * Used by Game class for debug overlays
     */
    getContext(): CanvasRenderingContext2D {
        return this.ctx;
    }

    /**
     * Clean up resources and event listeners
     */
    destroy(): void {
        window.removeEventListener('resize', this.resizeHandler);
        this.canvas.remove();
    }
}
