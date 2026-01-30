/**
 * Sam Portfolio Game - Development Entry Point
 *
 * This is the Vite + TypeScript development setup for the pixel-art
 * Cambridge exploration game. Phase 4 will migrate the existing
 * js/game/* JavaScript files to TypeScript modules.
 */

// Show game mode container (hide normal mode for dev)
const normalMode = document.getElementById('normal-mode');
const gameMode = document.getElementById('game-mode');
const modeToggle = document.getElementById('mode-toggle');

if (normalMode) normalMode.classList.add('hidden');
if (gameMode) gameMode.classList.remove('hidden');
if (modeToggle) modeToggle.style.display = 'none';

// Get canvas and context
const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');

if (!ctx) {
  throw new Error('Could not get 2D rendering context');
}

// Set canvas size (will be properly configured in Phase 3)
canvas.width = 800;
canvas.height = 600;

// Draw a simple test rectangle to verify canvas works
ctx.fillStyle = '#2d5a27'; // Cambridge green
ctx.fillRect(0, 0, canvas.width, canvas.height);

// Draw a test shape to confirm rendering
ctx.fillStyle = '#8b7355'; // Stone color
ctx.fillRect(100, 100, 200, 150);

// Add some text
ctx.fillStyle = '#ffffff';
ctx.font = '24px monospace';
ctx.fillText('Dev environment ready', 150, 300);

// Log confirmation
console.log('Dev environment ready');
console.log('Canvas dimensions:', canvas.width, 'x', canvas.height);
