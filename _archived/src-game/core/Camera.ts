/**
 * Camera - Viewport transform with smooth lerp follow and edge clamping
 *
 * Features:
 * - Smooth lerp follow with ~0.2s catch-up time
 * - Framerate-independent using exponential smoothing
 * - Clamps to map edges so no void is visible
 * - Coordinate conversion from world to screen space
 */
export class Camera {
    /** Camera position (top-left corner of viewport in world coordinates) */
    x = 0;
    y = 0;

    private viewportWidth: number;
    private viewportHeight: number;
    private mapWidth: number;
    private mapHeight: number;

    /** Lerp speed (higher = faster catch-up, 10-15 gives ~0.2s) */
    private readonly LERP_SPEED = 12;

    constructor(
        viewportWidth: number,
        viewportHeight: number,
        mapWidth: number,
        mapHeight: number
    ) {
        this.viewportWidth = viewportWidth;
        this.viewportHeight = viewportHeight;
        this.mapWidth = mapWidth;
        this.mapHeight = mapHeight;
    }

    /**
     * Smoothly follow a target position (typically player center)
     * Uses framerate-independent exponential smoothing
     *
     * @param targetX - Target world X position to center on
     * @param targetY - Target world Y position to center on
     * @param deltaTime - Time since last frame in seconds
     */
    follow(targetX: number, targetY: number, deltaTime: number): void {
        // Calculate desired camera position (centered on target)
        const targetCamX = targetX - this.viewportWidth / 2;
        const targetCamY = targetY - this.viewportHeight / 2;

        // Framerate-independent lerp using exponential smoothing
        // Formula: 1 - e^(-speed * dt) gives smooth interpolation
        const lerpFactor = 1 - Math.exp(-this.LERP_SPEED * deltaTime);

        // Interpolate toward target
        this.x += (targetCamX - this.x) * lerpFactor;
        this.y += (targetCamY - this.y) * lerpFactor;

        // Clamp to map bounds (prevent seeing void)
        this.clampToBounds();
    }

    /**
     * Immediately center on a position without smoothing
     * Useful for initial camera placement or scene transitions
     *
     * @param targetX - Target world X position to center on
     * @param targetY - Target world Y position to center on
     */
    centerOn(targetX: number, targetY: number): void {
        this.x = targetX - this.viewportWidth / 2;
        this.y = targetY - this.viewportHeight / 2;
        this.clampToBounds();
    }

    /**
     * Convert world coordinates to screen coordinates
     * Useful for rendering objects relative to camera
     *
     * @param worldX - World X position
     * @param worldY - World Y position
     * @returns Screen coordinates { x, y }
     */
    worldToScreen(worldX: number, worldY: number): { x: number; y: number } {
        return {
            x: worldX - this.x,
            y: worldY - this.y
        };
    }

    /**
     * Update map bounds (when map changes or loads)
     *
     * @param mapWidth - Map width in pixels (at render scale)
     * @param mapHeight - Map height in pixels (at render scale)
     */
    setMapBounds(mapWidth: number, mapHeight: number): void {
        this.mapWidth = mapWidth;
        this.mapHeight = mapHeight;
        this.clampToBounds();
    }

    /**
     * Update viewport size (on window resize)
     *
     * @param viewportWidth - Viewport width in pixels
     * @param viewportHeight - Viewport height in pixels
     */
    setViewportSize(viewportWidth: number, viewportHeight: number): void {
        this.viewportWidth = viewportWidth;
        this.viewportHeight = viewportHeight;
        this.clampToBounds();
    }

    /**
     * Clamp camera position to map bounds
     * Prevents camera from showing void beyond map edges
     */
    private clampToBounds(): void {
        // Calculate maximum allowed camera positions
        const maxX = Math.max(0, this.mapWidth - this.viewportWidth);
        const maxY = Math.max(0, this.mapHeight - this.viewportHeight);

        // Clamp camera position
        this.x = Math.max(0, Math.min(this.x, maxX));
        this.y = Math.max(0, Math.min(this.y, maxY));
    }

    /**
     * Get current viewport width
     */
    getViewportWidth(): number {
        return this.viewportWidth;
    }

    /**
     * Get current viewport height
     */
    getViewportHeight(): number {
        return this.viewportHeight;
    }
}
