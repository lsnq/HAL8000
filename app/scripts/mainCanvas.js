import * as THREE from 'three';
import {TexturePass, VignetteShader} from 'three-addons';
import EffectComposer, {RenderPass, ShaderPass, CopyShader} from 'three-effectcomposer-es6';
import {DuoToneShader, BarrelBlurShader, ContrastShader, BadTVShader,
    GlowShader, ScanlinesShader} from './shaders';
import HudCanvas from './hudCanvas';

class MainCanvas {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        this.renderer = new THREE.WebGLRenderer({
            preserveDrawingBuffer: true,
        });
        this.renderer.autoClear = false;
        this.hudCanvas = new HudCanvas();
        this.renderer.setClearColor('#000000');
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.domElement.id = 'renderer';
        this.constraints = {
            audio: true,
            video: {
                facingMode: 'environment',
                width: window.innerWidth / window.innerHeight * 480,
                height: 480
            }
        };


    }

    setVideo(){
        this.video = document.createElement('video');
        this.video.setAttribute('playsinline', '');
        this.video.setAttribute('muted', 'true');
    }

    setStream(){
        navigator.mediaDevices.getUserMedia(this.constraints)
            .then((stream) => {
                this.hudCanvas.render(stream);

                this.video.srcObject = stream;
                this.video.onloadedmetadata = () => {
                    this.video.muted = true;
                    this.video.play();
                };
            });
    }
    render(){
        this.setVideo();
        this.setStream();
        document.body.appendChild(this.renderer.domElement);
    }
}


// INIT SCENE
// const scene = new THREE.Scene();
// const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
//
// const renderer = new THREE.WebGLRenderer({
//     preserveDrawingBuffer: true,
//     // premultipliedAlpha: false,
//     // alpha: true
// });
// renderer.autoClear = false;
//
// renderer.setClearColor('#000000');
// renderer.setSize(window.innerWidth, window.innerHeight);
// renderer.setPixelRatio(window.devicePixelRatio);
// renderer.domElement.id = 'renderer';
// document.body.appendChild(renderer.domElement);

// INIT STREAM
// const video = document.createElement('video');
// video.setAttribute('playsinline', '');
// video.setAttribute('muted', 'true');
//
//
// navigator.mediaDevices.getUserMedia(constraints)
//     .then((stream) => {
//         hudCanvas.render(stream);
//         console.log('stream ready');
//
//         // video part
//         video.srcObject = stream;
//         video.onloadedmetadata = function () {
//             video.muted = true;
//             console.log('hooray');
//
//             video.play();
//         };
//     });

// TEXTURE
const texture = new THREE.VideoTexture(video);
texture.minFilter = THREE.LinearFilter;
texture.magFilter = THREE.LinearFilter;
texture.wrapS = THREE.ClampToEdgeWrapping;
texture.flipY = true;
texture.wrapT = THREE.ClampToEdgeWrapping;

// BASE OBJECT
// ОСНОВНОЙ КОНТЕЙНЕР!
const geometry = new THREE.PlaneBufferGeometry(1.6, 1.6);
const material = new THREE.MeshBasicMaterial({map: texture});
const plane = new THREE.Mesh(geometry, material);
scene.add(plane);

// HUD CIRCLE
const alphaMap = new THREE.TextureLoader().load('../images/alpha.png');
const hudMaterial = new THREE.MeshBasicMaterial({
    alphaMap: alphaMap,
    transparent: true
});
const hudGeometry = new THREE.PlaneBufferGeometry(0.5, 0.5 * (window.innerWidth / window.innerHeight));
const hudPlane = new THREE.Mesh(hudGeometry, hudMaterial);
scene.add(hudPlane);

// HUD MAIN
// const testTexture = new THREE.Texture(hudCanvas.node);
const testTexture = new THREE.TextureLoader().load('../images/hud_t_red.png');
const texturePass = new TexturePass(testTexture, 1.0);
texturePass.material.transparent = true;
texturePass.material.premultipliedAlpha = false;

// TEST TEXTURE FROM CANVAS
const testTexture2 = new THREE.Texture(hudCanvas.node);
const texturePass2 = new TexturePass(testTexture2, 1);
texturePass2.material.transparent = true;
texturePass2.material.premultipliedAlpha = false;

// COMPOSER
const composer = new EffectComposer(renderer);

composer.addPass(new RenderPass(scene, camera));
composer.addPass(new ShaderPass(BadTVShader));
composer.addPass(new ShaderPass(ScanlinesShader));

composer.addPass(new ShaderPass(ContrastShader));
composer.addPass(new ShaderPass(GlowShader));

composer.addPass(new ShaderPass(DuoToneShader));
composer.addPass(texturePass2);

composer.addPass(new ShaderPass(BarrelBlurShader));

const copyPass = new ShaderPass(CopyShader);
copyPass.renderToScreen = true;
composer.addPass(copyPass);

// ANIMATION
const render = (timestamp) => {
    composer.passes[1].uniforms.time.value = timestamp;
    composer.passes[2].uniforms.time.value = timestamp;
    composer.render();
    testTexture2.needsUpdate = true;
    hudCanvas.clear();
    hudCanvas.drawTimestamp();
    hudCanvas.drawEqualizer();
    hudCanvas.drawRandom();
    requestAnimationFrame(render);
};
render();

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
});
