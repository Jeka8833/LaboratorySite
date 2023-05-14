class List {
    x;
    y;
    width;
    height;
    elementsArray;
    editListener;

    index = 0;
    stepDown;
    stepUp;

    constructor(x, y, width, height, elementsArray, editListener) {
        const this_ = this

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.elementsArray = elementsArray;
        this.editListener = editListener;

        this.stepDown = new Button(x, y, height, height, function () {
            this_.index = Math.max(0, this_.index - 1);

            editListener(this_.index);
        });
        this.stepUp = new Button(x + width - height, y, height, height, function () {
            this_.index = Math.min(elementsArray.length - 1, this_.index + 1);

            editListener(this_.index);
        });
    }

    mouseMove(posX, posY) {
        this.stepDown.mouseMove(posX, posY);
        this.stepUp.mouseMove(posX, posY);
    }

    mouseClick(posX, posY) {
        this.stepDown.mouseClick(posX, posY);
        this.stepUp.mouseClick(posX, posY);
    }

    render(graphics) {
        this.stepDown.render(graphics);
        this.stepUp.render(graphics);

        graphics.fillStyle = "rgb(0,0,0)";
        const downTextM = graphics.measureText("<");
        graphics.fillText("<",
            this.x + (this.height - downTextM.width) / 2,
            this.y + (this.height + (downTextM.actualBoundingBoxAscent + downTextM.actualBoundingBoxDescent)) / 2);

        const upTextM = graphics.measureText(">");
        graphics.fillText(">",
            this.x + this.width - this.height + (this.height - upTextM.width) / 2,
            this.y + (this.height + (upTextM.actualBoundingBoxAscent + upTextM.actualBoundingBoxDescent)) / 2);

        const textM = graphics.measureText(this.elementsArray[this.index]);
        graphics.fillText(this.elementsArray[this.index],
            this.x + this.height + (this.width - this.height * 2 - textM.width) / 2,
            this.y + (this.height + (textM.actualBoundingBoxAscent + textM.actualBoundingBoxDescent)) / 2);

        graphics.fillStyle = "rgba(128,128,128,0.1)";
        graphics.fillRect(this.x + this.height, this.y, this.width - this.height * 2, this.height);
    }
}