const backgroundImagePathPowerSupply = "images/powerSupply.png";
const dividerNamesPowerSupply = ["3 V", "6 V", "9 V", "12 V", "15 V", "18 V", "21 V", "24 V", "27 V", "30 V"];
const dividerValuesPowerSupply = [3, 6, 9, 12, 15, 18, 21, 24, 27, 30];

class PowerSupply {
    backgroundImage = new Image();
    canvas;
    graphics;

    data = {
        power: false,
        divider: 0
    };

    precisionSet;
    dividerStepper;
    powerBtn;

    changeListener = null;

    autoHeight = false;

    constructor(canvas) {
        const this_ = this

        this.canvas = canvas;
        this.graphics = canvas.getContext("2d");

        this.backgroundImage.onload = function () {
            this_.repaint()
        };
        this.backgroundImage.src = backgroundImagePathPowerSupply;

        this.powerBtn = new Button(705, 73, 100, 100, function () {
            this_.data.power = !this_.data.power;

            if (this_.changeListener != null) {
                this_.changeListener(this_.getVoltage());
            }
        });

        this.dividerStepper = new List(176, 590, 300, 50, dividerNamesPowerSupply,
            function (index) {
                this_.data.divider = index;

                if (this_.changeListener != null) {
                    this_.changeListener(this_.getVoltage());
                }
            });

        this.precisionSet = new Spinner(735, 790, 90, function (value) {
            this_.data.precisionSet = value;

            if (this_.changeListener != null) {
                this_.changeListener(this_.getVoltage());
            }
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
            this_.precisionSet.mouseMove(x, y);
            this_.repaint();
        });

        this.canvas.addEventListener('mousedown', function (e) {
            const k = getKFactor(this_.canvas, this_.backgroundImage);

            const rect = this_.canvas.getBoundingClientRect();
            const x = (e.clientX - rect.left) * k;
            const y = (e.clientY - rect.top) * k;

            this_.precisionSet.mouseDown(x, y, e);
            this_.repaint();
        });

        this.canvas.addEventListener('mouseup', function (e) {
            this_.precisionSet.mouseUp(e);
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
        this.precisionSet.render(this.graphics);

        this.graphics.fillStyle = "rgb(0,0,0)";
        this.graphics.fillText(this.data.power ? "On" : "Off", 720, 210);
    }

    addListener(changeListener) {
        this.changeListener = changeListener;
    }

    getVoltage() {
        const voltage = this.data.divider <= 0 ? (this.precisionSet.getPercentage() * 3) :
            (dividerValuesPowerSupply[this.data.divider - 1] + this.precisionSet.getPercentage() * 3);

        return this.data.power ? voltage : 0;
    }

    setAutoHeight(enable) {
        this.autoHeight = enable;
    }
}