// детектор движения для бедных, так сказать

class MotionDetector {
    constructor(video, callback) {
        this.video = video;
        this.callback = callback || function () {};
        const canvas = document.createElement('canvas');
        canvas.width = 6;
        canvas.height = 4;
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.tmp = true;
        this.lastBrightness = 0;
        this.lastTimestamp = new Date().getTime();
        document.addEventListener('click', () => {
            this.detection();
        });
    }

    detection() {
        this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        let totalBrightness = 0;
        for (let i = 0; i < imageData.data.length; i += 4) {
            // считаем яркость пикселя на основе щадящего алгоритма
            // расчёта яркости пикселя
            // 0.2126*R + 0.7152*G + 0.0722*B
            const r = 0.2126 * imageData.data[i];
            const g = 0.7152 * imageData.data[i + 1];
            const b = 0.0722 * imageData.data[i + 2];
            totalBrightness += (r + g + b);
        }
        const mediumBrightness = totalBrightness / (imageData.data.length / 4);
        const diff = Math.abs(this.lastBrightness - mediumBrightness);
        if (diff > 3) {
            const now = new Date().getTime();
            this.lastBrightness = mediumBrightness;

            if ((now - this.lastTimestamp) > 5e3) {
                // если с последнего изменения больше 5 секунд, вызываем коллбэк
                this.callback();
            }

            this.lastTimestamp = new Date().getTime();
        }
    }
}

export default MotionDetector;
