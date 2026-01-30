export const EngineConfig = {
    // LPC uses 32x32 tiles (updated from 16x16)
    tileSize: 32,

    // Scale factor for rendering (2x = 64px displayed tiles)
    scale: 2,

    // Calculated rendered tile size
    get renderedTileSize() {
        return this.tileSize * this.scale;
    }
};
