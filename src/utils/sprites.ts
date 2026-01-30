export async function loadSpriteSheet(path: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`Failed to load sprite: ${path}`));
        img.src = path;
    });
}

// LPC character sprite extraction
// Characters are 64x64 per frame in standard LPC sheets
export function getCharacterFrame(
    direction: 'down' | 'left' | 'right' | 'up',
    frame: number
): { row: number; col: number; width: number; height: number } {
    // LPC walk cycle: row 8-11 (down, left, right, up), 9 frames each
    const directionRow: Record<string, number> = {
        down: 10,
        left: 9,
        right: 11,
        up: 8
    };

    return {
        row: directionRow[direction],
        col: frame % 9,
        width: 64,
        height: 64
    };
}

// Extract a single tile from a tileset
export function getTile(
    tileX: number,
    tileY: number,
    tileSize: number = 32
): { sx: number; sy: number; sw: number; sh: number } {
    return {
        sx: tileX * tileSize,
        sy: tileY * tileSize,
        sw: tileSize,
        sh: tileSize
    };
}
