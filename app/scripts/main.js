/*eslint no-console: "off"*/
/*eslint padded-blocks: "off"*/
import * as THREE from 'three';
import {VignetteShader} from 'three-addons';

import EffectComposer, {RenderPass, ShaderPass, CopyShader} from 'three-effectcomposer-es6';
import {DuoToneShader, BarrelBlurShader, ContrastShader, BadTVShader,
    GlowShader, ScanlinesShader} from './shaders';

document.addEventListener('DOMContentLoaded', () => {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 1024;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    let source;

    // HUD CANVAS TEST
    const width = window.innerWidth;
    const height = window.innerHeight;

    const hudCanvas = document.getElementById('hud');
    hudCanvas.width = width;
    hudCanvas.height = height;

    const ctx = hudCanvas.getContext('2d');
    const text = 'init system()';
    ctx.fillStyle = 'white';

    ctx.fillText(text, 50, 50);

    // INIT SCENE
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const renderer = new THREE.WebGLRenderer({
        preserveDrawingBuffer: true, alpha: true, premultipliedAlpha: true
    });

    renderer.setClearColor('#000000');
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.domElement.id = 'renderer';
    document.body.appendChild(renderer.domElement);

    // INIT STREAM
    const video = document.createElement('video');
    video.setAttribute('playsinline', '');
    video.setAttribute('muted', 'true');

    const constraints = {
        audio: true,
        video: {
            facingMode: 'environment'
        }
    };

    navigator.mediaDevices.getUserMedia(constraints)
        .then((stream) => {
            // audio part
            const source = audioCtx.createMediaStreamSource(stream);
            source.connect(analyser);

            // video part
            video.srcObject = stream;
            video.onloadedmetadata = function () {
                video.muted = true;
                console.log('hooray');
                video.play();
            };
        });

    // TEXTURE
    const texture = new THREE.VideoTexture(video);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;

    // BASE OBJECT
    const geometry = new THREE.PlaneBufferGeometry(1.6, 1.6);
    const material = new THREE.MeshBasicMaterial({map: texture});
    const plane = new THREE.Mesh(geometry, material);
    scene.add(plane);

    // HUD
    const alphaMap = new THREE.TextureLoader().load('../images/alpha.png');
    const hudMaterial = new THREE.MeshBasicMaterial({
        alphaMap: alphaMap,
        transparent: true
    });
    const hudGeometry = new THREE.PlaneBufferGeometry(0.5, 0.5 * (window.innerWidth / window.innerHeight));
    const hudPlane = new THREE.Mesh(hudGeometry, hudMaterial);
    hudPlane.width = 500;
    hudPlane.height = 500;

    scene.add(hudPlane);

    // COMPOSER
    const composer = new EffectComposer(renderer);

    composer.addPass(new RenderPass(scene, camera));
    composer.addPass(new ShaderPass(BadTVShader));
    composer.addPass(new ShaderPass(ScanlinesShader));
    composer.addPass(new ShaderPass(ContrastShader));
    composer.addPass(new ShaderPass(GlowShader));
    composer.addPass(new ShaderPass(DuoToneShader));
    composer.addPass(new ShaderPass(BarrelBlurShader));
    composer.addPass(new ShaderPass(VignetteShader));

    const copyPass = new ShaderPass(CopyShader);
    copyPass.renderToScreen = true;
    composer.addPass(copyPass);

    // ANIMATION
    const render = (timestamp) => {
        composer.passes[1].uniforms.time.value = timestamp;
        composer.passes[2].uniforms.time.value = timestamp;

        composer.render();

        analyser.getByteTimeDomainData(dataArray);
        ctx.clearRect(0, 0, width, height);
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'rgb(255, 255, 255)';

        ctx.beginPath();
        const sliceWidth = Number(width) / bufferLength;
        let x = 0;
        for (let i = 0; i < bufferLength; i++) {
            const v = dataArray[i] / 256.0;
            const y = v * (height / 2);
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
            x += sliceWidth;
        }
        ctx.lineTo(width, height / 2);
        ctx.lineWidth = 2;
        ctx.stroke();
        requestAnimationFrame(render);
    };
    render();

    window.addEventListener('resize', () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
});
