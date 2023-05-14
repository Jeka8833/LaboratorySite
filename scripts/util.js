const degrees_to_radians = deg => (deg * Math.PI) / 180.0;
const radians_to_degrees = rad => (rad * 180.0) / Math.PI;

function getKFactor(canvas, element) {
    const cW = canvas.offsetWidth;
    const cH = canvas.offsetHeight;
    const iW = element.width;
    const iH = element.height;

    if (cW > cH * (iW / iH)) {
        return iH / cH;
    }
    return iW / cW;
}