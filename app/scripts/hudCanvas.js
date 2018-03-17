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
        this.ctx.fillStyle = '#ff1111';
        this.padding = 170;
    }

    clear() {
        this.ctx.clearRect(0, 0, this.resolution, this.resolution);
    }

    drawTimestamp() {
        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'top';
        this.ctx.font = 'bold 48pt Arial';
        this.ctx.fillText(String(new Date().getTime()), this.padding - 20, this.padding + 10);
        this.ctx.font = 'bold 16pt Arial';
        this.ctx.fillText(String(new Date()), this.padding - 20, this.padding + 80);
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
}

export default HudCanvas;
