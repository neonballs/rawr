class PixelArtHandler {
    constructor(imgSrcArray, width, height, frameSpeed = 1) {
        this.images = imgSrcArray.map(src => {
            const img = new Image();
            img.src = src;
            return img;
        });
        this.width = width;
        this.height = height;
        this.frameSpeed = frameSpeed;
        this.currentFrame = 0;
        this.frameTimer = 0;
    }

    draw(context, x, y) {
        const image = this.images[this.currentFrame];
        context.drawImage(image, 0, 0, this.width, this.height, x, y, this.width, this.height);

        // Update animation frame
        this.frameTimer++;
        if (this.frameTimer >= this.frameSpeed) {
            this.currentFrame++;
            this.frameTimer = 0;
            if (this.currentFrame >= this.images.length) {
                this.currentFrame = 0;
            }
        }
    }
}