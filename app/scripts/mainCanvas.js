import * as THREE from 'three';
import {TexturePass} from 'three-addons';
import EffectComposer, {RenderPass, ShaderPass, CopyShader} from 'three-effectcomposer-es6';
import {
    DuoToneShader, BarrelBlurShader, ContrastShader, BadTVShader,
    GlowShader, ScanlinesShader
} from './shaders';
import HudCanvas from './hudCanvas';
import MotionDetector from './motionDetector';
import AngryVoice from './audioOutput';

class MainCanvas {
    constructor() {
        this.setVideo();
        this.angryVoice = new AngryVoice();
        this.scene = new THREE.Scene();
        this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        this.renderer = new THREE.WebGLRenderer({
            preserveDrawingBuffer: true
        });
        this.renderer.autoClear = false;
        this.hudCanvas = new HudCanvas();
        this.motionDetector = new MotionDetector(this.video, () => {
            this.hudCanvas.motionDetected();
            this.angryVoice.render();
        });
        this.renderer.setClearColor('#000000');
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.domElement.id = 'renderer';
        this.constraints = {
            audio: true,
            video: {
                facingMode: 'environment'
                // наличие этих параметров отчего-то вызывает exception в iOS Safari
                // просьба к уважаемому проверяющему подсказать, как лучше
                // установить пропорции для видео в constraints
                // width: {max: window.innerWidth / window.innerHeight * 480},
                // height: {max: 480}
            }
        };

        // устаналвивает размер канваса при изменении размеров окна
        window.addEventListener('resize', () => {
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    // создаем контейнер для видео. пока пустой
    setVideo() {
        this.video = document.createElement('video');
        this.video.setAttribute('playsinline', '');
        this.video.setAttribute('muted', 'true');
    }

    // получаем доступ к медиаустройствам, в случае успеха запускаем видео
    setStream() {
        navigator.mediaDevices.getUserMedia(this.constraints)
            .then((stream) => {
                this.hudCanvas.render(stream);
                this.video.srcObject = stream;
                this.video.muted = true;
                this.video.onloadedmetadata = () => {
                    this.video.play();
                    this.hudCanvas.noSignal = false;
                };
            });
    }

    // добавляем результаты нашего творчества в сцену
    setScene() {
        // TEXTURE
        const texture = new THREE.VideoTexture(this.video);
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.wrapS = THREE.ClampToEdgeWrapping;
        texture.flipY = true;
        texture.wrapT = THREE.ClampToEdgeWrapping;

        // BASE OBJECT
        const geometry = new THREE.PlaneBufferGeometry(1.6, 1.6);
        const material = new THREE.MeshBasicMaterial({map: texture});
        const plane = new THREE.Mesh(geometry, material);
        this.scene.add(plane);

        // HUD CIRCLE
        const alphaMap = new THREE.TextureLoader().load('../images/alpha.png');
        const hudMaterial = new THREE.MeshBasicMaterial({
            alphaMap: alphaMap,
            transparent: true
        });
        const hudGeometry = new THREE.PlaneBufferGeometry(0.5, 0.5 * (window.innerWidth / window.innerHeight));
        const hudCircle = new THREE.Mesh(hudGeometry, hudMaterial);
        this.scene.add(hudCircle);

        // HUD MAIN
        const canvasTexture = new THREE.Texture(this.hudCanvas.node);
        const canvasPass = new TexturePass(canvasTexture, 1);
        canvasPass.material.transparent = true;
        canvasPass.material.premultipliedAlpha = false;

        // COMPOSER
        const composer = new EffectComposer(this.renderer);

        // Добавляем шейдеры для красоты
        composer.addPass(new RenderPass(this.scene, this.camera));
        composer.addPass(new ShaderPass(BadTVShader));
        composer.addPass(new ShaderPass(ScanlinesShader));
        composer.addPass(new ShaderPass(ContrastShader));
        composer.addPass(new ShaderPass(GlowShader));
        composer.addPass(new ShaderPass(DuoToneShader));

        // добавляем интерфейс в сцену
        composer.addPass(canvasPass);

        // ...и ещё немного красоты
        composer.addPass(new ShaderPass(BarrelBlurShader));

        // берем всё и выводим на вывод
        const copyPass = new ShaderPass(CopyShader);
        copyPass.renderToScreen = true;
        composer.addPass(copyPass);

        this.composer = composer;
        this.canvasTexture = canvasTexture;
    }

    //запускаем по очереди и добавляем сцену в DOM
    render() {
        this.setStream();
        this.setScene();

        const animation = (timestamp) => {
            if (this.composer) {
                const composer = this.composer;
                this.canvasTexture.needsUpdate = true;

                composer.passes[1].uniforms.time.value = timestamp;
                composer.passes[2].uniforms.time.value = timestamp;
                composer.render();

                //запускаем анимацию HUD интерфейса
                this.hudCanvas.animate();
                this.motionDetector.detection();
                requestAnimationFrame(animation);
            }
        };
        animation();

        document.body.appendChild(this.renderer.domElement);
    }
}

export default MainCanvas;
