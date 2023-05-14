const backgroundImagePathVoltmeter = "images/voltmeter.png";
const alarmImagePathVoltmeter = "images/alarm.png";
const dividerNamesVoltmeter = ["0.03 mV", "0.1 mV", "0.3 mV", "1 mV", "3 mV", "10 mV", "30 mV", "100 mV",
    "300 mV", "1 V", "3 V", "10 V", "30 V", "100 V", "300 V"];
const dividerValueVoltmeter = [0.00003, 0.0001, 0.0003, 0.001, 0.003, 0.01, 0.03, 0.1, 0.3, 1, 3, 10, 30,
    100, 300];

class Voltmeter {
    backgroundImage = new Image();
    alarmImage = new Image();
    canvas;
    graphics;

    data = {
        power: false,
        divider: 0,
        value: 0,
        error: 0
    };

    nullSet;
    dividerStepper;
    powerBtn;

    autoHeight = false;

    constructor(canvas) {
        const this_ = this

        this.canvas = canvas;
        this.graphics = canvas.getContext("2d");

        this.backgroundImage.onload = function () {
            this_.repaint()
        };
        this.backgroundImage.src = backgroundImagePathVoltmeter;

        this.alarmImage.onload = function () {
            this_.repaint()
        };
        this.alarmImage.src = alarmImagePathVoltmeter;

        this.powerBtn = new Button(700, 950, 128, 128, function () {
            this_.data.power = !this_.data.power;
        });

        this.dividerStepper = new List(315, 1082, 300, 50, dividerNamesVoltmeter,
            function (index) {
                this_.data.divider = index;
            });

        this.nullSet = new Spinner(170, 878, 65, function (value) {
        });

        window.addEventListener("resize", function () {
            this_.repaint();
        });

        this.canvas.addEventListener('click', function (e) {
            const k = getKFactor(this_.canvas, this_.backgroundImage);

            const rect = this_.canvas.getBoundingClientRect();
            const x = (e.clientX - rect.left) * k;
            const y = (e.clientY - rect.top) * k;

            this_.powerBtn.mouseClick(x, y);
            this_.dividerStepper.mouseClick(x, y);
            this_.repaint();
        });

        this.canvas.addEventListener('mousemove', function (e) {
            const k = getKFactor(this_.canvas, this_.backgroundImage);

            const rect = this_.canvas.getBoundingClientRect();
            const x = (e.clientX - rect.left) * k;
            const y = (e.clientY - rect.top) * k;

            this_.powerBtn.mouseMove(x, y);
            this_.dividerStepper.mouseMove(x, y);
            this_.nullSet.mouseMove(x, y);
            this_.repaint();
        });

        this.canvas.addEventListener('mousedown', function (e) {
            const k = getKFactor(this_.canvas, this_.backgroundImage);

            const rect = this_.canvas.getBoundingClientRect();
            const x = (e.clientX - rect.left) * k;
            const y = (e.clientY - rect.top) * k;

            this_.nullSet.mouseDown(x, y, e);
            this_.repaint();
        });

        this.canvas.addEventListener('mouseup', function (e) {
            this_.nullSet.mouseUp(e);
            this_.repaint();
        });
    }

    repaint() {
        if (this.autoHeight)
            this.canvas.style.height =
                (voltmeterElement.offsetWidth / (this.backgroundImage.width / this.backgroundImage.height)) + "px";

        const cW = this.canvas.offsetWidth;
        const cH = this.canvas.offsetHeight;
        const iW = this.backgroundImage.width;
        const iH = this.backgroundImage.height;

        if (cW > cH * (iW / iH)) {
            this.canvas.width = (iH / cH) * cW;
            this.canvas.height = iH;
        } else {
            this.canvas.width = iW;
            this.canvas.height = (iW / cW) * cH;
        }

        this.graphics.font = "48px serif";
        this.graphics.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.graphics.drawImage(this.backgroundImage, 0, 0);

        this.powerBtn.render(this.graphics);
        this.dividerStepper.render(this.graphics);
        this.nullSet.render(this.graphics);

        this.graphics.fillStyle = "rgb(0,0,0)";
        this.graphics.fillText(this.data.power ? "On" : "Off", 810, 885);

        // < 1 V layer - Lover 131.9 degree; Higher: 47.9 degree; Range: 84 degree
        // >= 1 layer - Lover 131.9 degree; Higher: 52.3 degree; Range: 79.6 degree

        const percentage = this.data.power ? this.data.value / dividerValueVoltmeter[this.data.divider] : 0;
        const error = this.data.error + (this.data.power ? (this.nullSet.getPercentage() - 0.5) * 5 : 0);
        const voltageRot = Math.max(-5, Math.min(89,
            error + (dividerValueVoltmeter[this.data.divider] >= 1 ? 79.6 : 84) * percentage));

        const angle = degrees_to_radians(131.9 - voltageRot);
        const startX = 467 + Math.cos(angle) * 70;
        const startY = 643 - Math.sin(angle) * 70;
        const endX = 467 + Math.cos(angle) * 400;
        const endY = 643 - Math.sin(angle) * 400;
        this.graphics.lineWidth = 2;
        this.graphics.strokeStyle = "rgb(0,0,0)";
        this.graphics.beginPath();
        this.graphics.moveTo(startX, startY);
        this.graphics.lineTo(endX, endY);
        this.graphics.stroke();

        if (percentage > 10)
            this.graphics.drawImage(this.alarmImage, 270, 200, 400, 350);
    }

    setError(error) {
        this.data.error = error;
        this.repaint();
    }

    setVoltage(voltage) {
        this.data.value = voltage;
        this.repaint();
    }

    setAutoHeight(enable) {
        this.autoHeight = enable;
    }
}