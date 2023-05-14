class Button {

    x;
    y;
    width;
    height;
    clickListener;

    backgroundColor = "rgba(128,128,128,0.2)";
    highlightColor = "rgba(128,128,128,0.5)";

    isHighlight;

    constructor(x, y, width, height, clickListener) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.clickListener = clickListener;
    }

    mouseMove(posX, posY) {
        this.isHighlight = this.x < posX && this.x + this.width > posX && this.y < posY && this.y + this.height > posY;
    }

    mouseClick(posX, posY) {
        if (this.x < posX && this.x + this.width > posX && this.y < posY && this.y + this.height > posY) {
            this.clickListener();
        }
    }

    render(graphics) {
        graphics.fillStyle = this.isHighlight ? this.highlightColor : this.backgroundColor;
        graphics.fillRect(this.x, this.y, this.width, this.height);
    }
}