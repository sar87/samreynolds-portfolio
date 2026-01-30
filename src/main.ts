import { EngineConfig } from './config/engine';
import { loadSpriteSheet, getCharacterFrame, getTile } from './utils/sprites';

const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

// Set canvas size for test display
canvas.width = 400;
canvas.height = 300;

// Disable image smoothing for crisp pixel art
ctx.imageSmoothingEnabled = false;

async function renderTest() {
    try {
        // Load player sprite
        const playerSheet = await loadSpriteSheet('/assets/sprites/characters/player.png');

        // Load a terrain tile (grass from LPC terrain pack)
        const terrainSheet = await loadSpriteSheet('/assets/sprites/terrain/grass.png');

        // Clear canvas
        ctx.fillStyle = '#2d2d2d';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw terrain tile at position (0,0)
        const tile = getTile(0, 0);
        ctx.drawImage(
            terrainSheet,
            tile.sx, tile.sy, tile.sw, tile.sh,
            10, 10,
            EngineConfig.renderedTileSize,
            EngineConfig.renderedTileSize
        );

        // Draw player sprite (front-facing, first frame)
        const frame = getCharacterFrame('down', 0);
        ctx.drawImage(
            playerSheet,
            frame.col * frame.width,
            frame.row * frame.height,
            frame.width,
            frame.height,
            100, 10,
            frame.width * EngineConfig.scale,
            frame.height * EngineConfig.scale
        );

        // Add labels
        ctx.fillStyle = '#ffffff';
        ctx.font = '14px monospace';
        ctx.fillText(`Tile: ${EngineConfig.tileSize}x${EngineConfig.tileSize} @ ${EngineConfig.scale}x`, 10, 150);
        ctx.fillText('Terrain (left) | Player (right)', 10, 170);
        ctx.fillText('Phase 1: Foundation & Asset Selection - COMPLETE', 10, 200);

        console.log('Sprite rendering test complete');
        console.log(`Tile size: ${EngineConfig.tileSize}px, Scale: ${EngineConfig.scale}x`);
        console.log(`Rendered tile size: ${EngineConfig.renderedTileSize}px`);

    } catch (error) {
        console.error('Sprite loading failed:', error);
        ctx.fillStyle = '#ff0000';
        ctx.fillText('Error loading sprites - check console', 10, 50);
    }
}

renderTest();
