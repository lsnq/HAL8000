
const randomString = () => {
    const phrase = Math.random().toString(36).substring(2, 5) + ' ' + Math.random().toString(36).substring(2, 10);
    return phrase.toUpperCase();
};

class HudCanvas {
    constructor() {
        this.randomArray = new Array(64).fill(true).map(() => randomString());
        this.node = document.createElement('canvas');
        this.resolution = 1024;
        this.node.width = this.resolution;
        this.node.height = this.resolution;
        this.node.id = 'hud';
        this.ctx = this.node.getContext('2d');
        this.ctx.textBaseline = 'alphabetic';
        this.ctx.fillStyle = '#ff1111';
        this.padding = 170;
        this.motion = false;
    }

    clear() {
        this.ctx.clearRect(0, 0, this.resolution, this.resolution);
    }

    drawTimestamp() {
        const date = new Date();
        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'top';
        this.ctx.font = 'bold 48pt Arial';
        this.ctx.fillText(String(date.getTime()), this.padding - 20, this.padding + 10);
        this.ctx.font = 'bold 18pt Arial';
        this.ctx.fillText(date, this.padding - 20, this.padding + 90);
        this.ctx.font = 'bold 48pt Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'bottom';
        const time = date.getHours() + ':' + String(date.getMinutes()).padStart(2, '0');
        this.ctx.fillText(time, this.resolution / 2 + 70, this.resolution - this.padding);
    }

    drawEqualizer() {
        if (this.stream) {
            this.analyser.getByteFrequencyData(this.frequencyData);
            let x = this.padding - 20;
            this.frequencyData.forEach((size) => {
                const y = this.resolution - size - this.padding;
                // x, y width, height
                this.ctx.fillRect(x, y, 18, size);
                x += 20;
            });
        }
    }

    drawRandom() {
        this.ctx.textAlign = 'right';
        this.ctx.font = 'bold 16pt monospace';
        this.randomArray.forEach((el, index) => {
            this.ctx.fillText(el, this.resolution - this.padding + 20, index * 20 + this.padding);
        });
        this.randomArray.shift();
        this.randomArray.push(randomString());
    }

    // если произошло движение запускаем событие
    motionDetected() {
        this.motion = true;
        this.timestamp = new Date().getTime();
    }

    // анимация при инициализации движения. через 5 секунд выключаем
    motionAnimation() {
        if (this.motion) {
            const timestamp = new Date().getTime() - this.timestamp;

            const opacity = (Math.sin(timestamp / 139) + 1) / 2;
            this.ctx.textAlign = 'left';
            this.ctx.textBaseline = 'middle';
            this.ctx.font = 'bold 80pt Arial';
            this.ctx.fillStyle = 'rgba(255,0,0, ' + opacity + ')';
            this.ctx.fillText('MENACE!', this.padding, this.resolution / 2);
            this.ctx.fillStyle = 'rgba(255,0,0,255)';

            if (timestamp >= 5000) {
                this.motion = false;
            }
        }
    }

    render(stream) {
        if (stream) {
            // AUDIO PART INIT
            this.stream = stream;
            this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            this.analyser = this.audioCtx.createAnalyser();
            this.audioSource = this.audioCtx.createMediaStreamSource(stream);
            this.audioSource.connect(this.analyser);

            this.analyser.fftSize = 32;
            this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);
        }
    }

    animate() {
        this.clear();
        this.drawTimestamp();
        this.drawEqualizer();
        this.drawRandom();
        this.motionAnimation();
    }
}

export default HudCanvas;
