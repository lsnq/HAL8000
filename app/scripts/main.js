/*eslint no-console: "off"*/
/*eslint padded-blocks: "off"*/

document.addEventListener('DOMContentLoaded', () => {
    console.log(2);
    const requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

    window.requestAnimationFrame = requestAnimationFrame;
    const video = document.createElement('video');
    video.setAttribute('muted', 'true');

    const canvas = document.getElementById('interface');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const ctx = canvas.getContext('2d');

    navigator.mediaDevices.getUserMedia({audio: false, video: { facingMode: 'environment' }})
        .then((stream) => {
            video.srcObject = stream;

        });

    function step() {
        ctx.drawImage(video, 0,0);
        requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
});
