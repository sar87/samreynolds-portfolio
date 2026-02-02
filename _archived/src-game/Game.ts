import { GameLoop } from './core/GameLoop';
import { Input } from './core/Input';
import { Camera } from './core/Camera';
import { TileMap } from './rendering/TileMap';
import { Collision } from './systems/Collision';
import { Player } from './entities/Player';
import { Renderer } from './rendering/Renderer';
import { testMapData } from './data/testMap';
import { EngineConfig } from '../config/engine';

/**
 * Game - Main coordinator that wires all game systems together
 *
 * Responsibilities:
 * - Initialize all systems in correct order
 * - Wire GameLoop callbacks to update/render
 * - Update camera to follow player each frame
 * - Provide start(), stop(), destroy() lifecycle methods
 * - Debug overlay with FPS and player tile coordinates
 */
export class Game {
    private gameLoop: GameLoop;
    private input: Input;
    private camera: Camera;
    private tileMap: TileMap;
    private collision: Collision;
    private player: Player;
    private renderer: Renderer;

    /** Debug overlay enabled by default */
    private debugEnabled = true;

    /** FPS tracking */
    private frameCount = 0;
    private fpsDisplay = 0;
    private lastFpsUpdate = 0;

    constructor(container: HTMLElement) {
        // Initialize systems in dependency order

        // Input system - no dependencies
        this.input = new Input();

        // TileMap - loads test map data
        this.tileMap = new TileMap(
            testMapData.width,
            testMapData.height,
            testMapData.tiles
        );

        // Collision - depends on TileMap
        this.collision = new Collision(this.tileMap);

        // Player - depends on Input, Collision, and spawn position
        this.player = new Player(
            this.input,
            this.collision,
            testMapData.playerSpawn.x,
            testMapData.playerSpawn.y
        );

        // Renderer - creates canvas in container
        this.renderer = new Renderer(container);

        // Camera - depends on renderer dimensions and map size
        this.camera = new Camera(
            this.renderer.getWidth(),
            this.renderer.getHeight(),
            this.tileMap.getPixelWidth(),
            this.tileMap.getPixelHeight()
        );

        // Center camera on player initially
        this.camera.centerOn(
            this.player.getCenterX(),
            this.player.getCenterY()
        );

        // GameLoop - wire update and render callbacks
        this.gameLoop = new GameLoop(
            (dt) => this.update(dt),
            () => this.render()
        );
    }

    /**
     * Game update - called by GameLoop with delta time
     */
    private update(deltaTime: number): void {
        // Update player movement
        this.player.update(deltaTime);

        // Camera follows player
        this.camera.follow(
            this.player.getCenterX(),
            this.player.getCenterY(),
            deltaTime
        );

        // FPS counter update
        if (this.debugEnabled) {
            this.frameCount++;
            const now = performance.now();
            if (now - this.lastFpsUpdate >= 1000) {
                this.fpsDisplay = this.frameCount;
                this.frameCount = 0;
                this.lastFpsUpdate = now;
            }
        }
    }

    /**
     * Game render - called by GameLoop after update
     */
    private render(): void {
        // Clear canvas
        this.renderer.clear();

        // Render world
        this.renderer.renderTiles(this.tileMap, this.camera);
        this.renderer.renderPlayer(this.player, this.camera);

        // Debug overlay
        if (this.debugEnabled) {
            this.renderDebug();
        }
    }

    /**
     * Render debug overlay (FPS and tile position)
     */
    private renderDebug(): void {
        const tileSize = EngineConfig.renderedTileSize;
        const tileX = Math.floor(this.player.x / tileSize);
        const tileY = Math.floor(this.player.y / tileSize);

        const ctx = this.renderer.getContext();
        ctx.fillStyle = '#ffffff';
        ctx.font = '16px monospace';
        ctx.fillText(`FPS: ${this.fpsDisplay}`, 10, 24);
        ctx.fillText(`Tile: ${tileX}, ${tileY}`, 10, 44);
    }

    /**
     * Start the game loop
     */
    start(): void {
        this.gameLoop.start();
    }

    /**
     * Stop the game loop (can be resumed with start)
     */
    stop(): void {
        this.gameLoop.stop();
    }

    /**
     * Clean up all resources and event listeners
     */
    destroy(): void {
        this.gameLoop.stop();
        this.input.destroy();
        this.renderer.destroy();
    }
}
