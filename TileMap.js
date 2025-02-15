class Tile {
    constructor(type, properties) {
        this.type = type;
        this.properties = properties;
    }
}

class TileMap {
    constructor(tileSize, mapData, tileset) {
        this.tileSize = tileSize;
        this.mapData = mapData;
        this.tileset = tileset; // Object with tile types as keys and Tile instances as values
    }

    draw(context) {
        for (let row = 0; row < this.mapData.length; row++) {
            for (let col = 0; col < this.mapData[row].length; col++) {
                const tileType = this.mapData[row][col];
                const tile = this.tileset[tileType];
                if (tile) {
                    context.drawImage(tile.properties.image, col * this.tileSize, row * this.tileSize, this.tileSize, this.tileSize);
                }
            }
        }
    }

    getTileAt(x, y) {
        const col = Math.floor(x / this.tileSize);
        const row = Math.floor(y / this.tileSize);
        if (row >= 0 && row < this.mapData.length && col >= 0 && col < this.mapData[row].length) {
            const tileType = this.mapData[row][col];
            return this.tileset[tileType];
        }
        return null;
    }
}