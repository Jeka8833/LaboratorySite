class Spinner {
    centerX;
    centerY;
    radius;
    valuerChangeListener;

    value = degrees_to_radians(-90);
    startAngle = degrees_to_radians(45);
    maxValue = degrees_to_radians(270);

    backgroundColor = "rgba(128,128,128,0.2)";
    highlightColor = "rgba(0,255,0,0.7)";

    isEditing;

    constructor(centerX, centerY, radius, valuerChangeListener) {
        this.centerX = centerX;
        this.centerY = centerY;
        this.radius = radius;
        this.valuerChangeListener = valuerChangeListener;
    }

    mouseMove(posX, posY) {
        if (!this.isEditing) return;

        this.value = Math.atan2(posY - this.centerY, posX - this.centerX);
        if (((this.value + this.startAngle + Math.PI) % (2 * Math.PI)) > this.maxValue)
            this.value = Math.PI - this.startAngle + this.maxValue;

        this.valuerChangeListener(this.getPercentage());
    }

    mouseDown(posX, posY, e) {
        if (e.button !== 0) return;

        const dist = Math.sqrt(
            (this.centerX - posX) * (this.centerX - posX) + (this.centerY - posY) * (this.centerY - posY));

        if (dist < this.radius) {
            this.isEditing = true;
        }
    }

    mouseUp(e) {
        if (e.button !== 0) return;

        this.isEditing = false;
    }

    render(graphics) {
        graphics.lineWidth = 10;

        graphics.strokeStyle = this.backgroundColor;
        graphics.beginPath();
        graphics.arc(this.centerX, this.centerY, this.radius,
            Math.PI - this.startAngle, Math.PI - this.startAngle + this.maxValue);
        graphics.stroke();

        graphics.strokeStyle = this.highlightColor;
        graphics.beginPath();
        graphics.arc(this.centerX, this.centerY, this.radius, Math.PI - this.startAngle, this.value);
        graphics.stroke();
    }

    getPercentage() {
        return ((this.value + this.startAngle + Math.PI) % (2 * Math.PI)) / this.maxValue;
    }
}