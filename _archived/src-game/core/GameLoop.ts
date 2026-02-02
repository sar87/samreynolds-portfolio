/**
 * GameLoop - Framerate-independent game loop using requestAnimationFrame
 *
 * Features:
 * - Delta time in seconds for framerate independence
 * - Delta clamping to prevent "spiral of death" on tab switch
 * - Start/stop control with running state
 */
export class GameLoop {
    private lastTime = 0;
    private running = false;
    private animationFrameId = 0;
    private onUpdate: (deltaTime: number) => void;
    private onRender: () => void;

    // Maximum delta time (100ms) to prevent large jumps after tab becomes visible
    private readonly MAX_DELTA = 0.1;

    constructor(
        onUpdate: (deltaTime: number) => void,
        onRender: () => void
    ) {
        this.onUpdate = onUpdate;
        this.onRender = onRender;
    }

    /**
     * Start the game loop
     */
    start(): void {
        if (this.running) return;

        this.running = true;
        this.lastTime = performance.now();
        this.animationFrameId = requestAnimationFrame((time) => this.loop(time));
    }

    /**
     * Stop the game loop
     */
    stop(): void {
        if (!this.running) return;

        this.running = false;
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = 0;
        }
    }

    /**
     * Check if the loop is currently running
     */
    isRunning(): boolean {
        return this.running;
    }

    /**
     * Main loop - calculates delta time and calls update/render
     */
    private loop(currentTime: number): void {
        if (!this.running) return;

        // Calculate delta time in seconds
        const deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;

        // Clamp delta to prevent spiral of death on tab switch
        const clampedDelta = Math.min(deltaTime, this.MAX_DELTA);

        // Update game state with clamped delta
        this.onUpdate(clampedDelta);

        // Render current state
        this.onRender();

        // Schedule next frame
        this.animationFrameId = requestAnimationFrame((time) => this.loop(time));
    }
}
