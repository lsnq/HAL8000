/*eslint no-console: "off"*/
/*eslint padded-blocks: "off"*/
import * as THREE from 'three';
import EffectComposer, {RenderPass, ShaderPass, CopyShader} from 'three-effectcomposer-es6';
import {DuoToneShader, BarrelBlurShader, ContrastShader} from './shaders';
document.addEventListener('DOMContentLoaded', () => {
    // INIT SCENE
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    //const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);

    const renderer = new THREE.WebGLRenderer({
        preserveDrawingBuffer: true
    });
    renderer.setClearColor('#000000');
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.body.appendChild(renderer.domElement);

    // INIT STREAM
    const video = document.createElement('video');
    video.setAttribute('playsinline', '');
    video.setAttribute('muted', 'true');

    navigator.mediaDevices.getUserMedia({
        audio: true, video: {
            facingMode: 'environment'
        }
    })
        .then((stream) => {
            video.srcObject = stream;
            video.play();
        });

    // TEXTURE
    const texture = new THREE.VideoTexture(video);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;

    // BASE OBJECT
    const geometry = new THREE.PlaneBufferGeometry(2, 2);
    const material = new THREE.MeshBasicMaterial({map: texture});
    const plane = new THREE.Mesh(geometry, material);

    scene.add(plane);




    // COMPOSER
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));

    //composer.addPass(new ShaderPass(DuoToneShader));
    composer.addPass(new ShaderPass(ContrastShader));

    composer.addPass(new ShaderPass(BarrelBlurShader));


    const copyPass = new ShaderPass(CopyShader);
    copyPass.renderToScreen = true;
    composer.addPass(copyPass);

    // ANIMATION
    const render = (timestamp) => {
        BarrelBlurShader.uniforms.time.value = timestamp;

        composer.render();
        requestAnimationFrame(render);
    };
    render();

    window.addEventListener('resize', () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
});
