class GameEngine {
    constructor(canvasId, width, height) {
        this.canvas = document.getElementById(canvasId);
        this.canvas.width = width;
        this.canvas.height = height;
        this.context = this.canvas.getContext('2d');
        this.layers = [];
        this.keys = {};
        this.gravity = 0.5;
        this.camera = { x: 0, y: 0, width: this.canvas.width, height: this.canvas.height };
        this.uiElements = [];
        this.isPaused = false;
        this.initKeyboard();
    }

    initKeyboard() {
        window.addEventListener('keydown', (e) => {
            if (e.key === 'p') {
                this.isPaused = !this.isPaused;
                if (this.isPaused) {
                    this.showPauseMenu();
                } else {
                    this.hidePauseMenu();
                }
            }
            this.keys[e.key] = true;
        });

        window.addEventListener('keyup', (e) => {
            delete this.keys[e.key];
        });
    }

    addLayer() {
        const layer = [];
        this.layers.push(layer);
        return this.layers.length - 1;
    }

    addSpriteToLayer(sprite, layerIndex) {
        if (this.layers[layerIndex]) {
            this.layers[layerIndex].push(sprite);
        } else {
            console.error(`Layer ${layerIndex} does not exist.`);
        }
    }

    removeSpriteFromLayer(sprite, layerIndex) {
        if (this.layers[layerIndex]) {
            const index = this.layers[layerIndex].indexOf(sprite);
            if (index > -1) {
                this.layers[layerIndex].splice(index, 1);
            }
        } else {
            console.error(`Layer ${layerIndex} does not exist.`);
        }
    }

    update() {
        if (this.isPaused) return;
        this.layers.forEach(layer => layer.forEach(sprite => sprite.update(this.keys, this)));
        this.uiElements.forEach(uiElement => uiElement.update());
    }

    draw() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.save();
        this.context.translate(-this.camera.x, -this.camera.y);
        this.layers.forEach(layer => layer.forEach(sprite => sprite.draw(this.context)));
        this.context.restore();
        this.uiElements.forEach(uiElement => uiElement.draw(this.context));
    }

    run() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.run());
    }

    setCameraPosition(x, y) {
        this.camera.x = x;
        this.camera.y = y;
    }

    addUIElement(uiElement) {
        this.uiElements.push(uiElement);
    }

    showPauseMenu() {
        document.getElementById('pauseMenu').style.display = 'block';
    }

    hidePauseMenu() {
        document.getElementById('pauseMenu').style.display = 'none';
    }

    showGameOverMenu() {
        document.getElementById('gameOverMenu').style.display = 'block';
    }

    hideGameOverMenu() {
        document.getElementById('gameOverMenu').style.display = 'none';
    }

    showUpgradeMenu() {
        document.getElementById('upgradeMenu').style.display = 'block';
    }

    hideUpgradeMenu() {
        document.getElementById('upgradeMenu').style.display = 'none';
    }
}

class Sprite {
    constructor(imgSrcArray, x, y, width, height, frameSpeed = 1) {
        this.pixelArtHandler = new PixelArtHandler(imgSrcArray, width, height, frameSpeed);
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.vx = 0;
        this.vy = 0;
    }

    update(keys, game) {
        this.x += this.vx;
        this.y += this.vy;

        // Override this method to add custom update logic
    }

    draw(context) {
        this.pixelArtHandler.draw(context, this.x, this.y);
    }

    isCollidingWith(otherSprite) {
        return !(
            this.x + this.width < otherSprite.x ||
            this.x > otherSprite.x + otherSprite.width ||
            this.y + this.height < otherSprite.y ||
            this.y > otherSprite.y + otherSprite.height
        );
    }
}

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
                    tile.properties.pixelArtHandler.draw(context, col * this.tileSize, row * this.tileSize);
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

class UIElement {
    constructor(x, y, drawFunction) {
        this.x = x;
        this.y = y;
        this.drawFunction = drawFunction;
    }

    update() {
        // Override this method to add custom update logic
    }

    draw(context) {
        this.drawFunction(context, this.x, this.y);
    }
}