/* eslint-disable */
import * as THREE from 'three';
import BarrelFragment from '../shaders/BarrelFragment.glsl';
import VertexShader from '../shaders/VertexShader.glsl';
import DuoToneFragment from '../shaders/DuoToneFragment.glsl';
import ContrastFragment from '../shaders/ContrastFragment.glsl';
import ZoomBlur from '../shaders/ZoomBlur.glsl';

export const DuoToneShader = {
    uniforms: {
        tDiffuse: {
            value: null
        },
        colLight: {
            value: new THREE.Color(0xff12120)
        },
        colDark: {
            value: new THREE.Color(0x0000000)
        }
    },
    vertexShader: VertexShader,
    fragmentShader: DuoToneFragment
};

export const BarrelBlurShader = {
    uniforms: {
        tDiffuse: {
            type: "t",
            value: null
        },
        amount: {
            type: "f",
            value: 0.25
        },
        time: {
            type: "f",
            value: 0
        }
    },
    vertexShader: VertexShader,
    fragmentShader: BarrelFragment
};

export const ContrastShader = {
    uniforms: {
        tDiffuse: {
            value: null
        },
        brightness: {
            type: "f",
            value: -0.015 // -0.5
        },
        contrast: {
            type: "f",
            value: 1.5
        }
    },
    vertexShader: VertexShader,
    fragmentShader: ContrastFragment
};

export const ZoomBloor = {
    uniforms: {
        tDiffuse: {
            value: null
        },
        strength: { type: 'f', value: 0 },
        center: { type: 'v2', value: new THREE.Vector2( window.innerWidth *0.5,  window.innerHeight*0.5 ) },
        resolution: { type: 'v2', value: new THREE.Vector2(  window.innerWidth,  window.innerHeight ) }
    },
    vertexShader: VertexShader,
    fragmentShader: ZoomBlur
};

export const GlitcherShader = {
    uniforms: {
        tDiffuse: {
            type: "t",
            value: null
        },
        amount: {
            type: "f",
            value: 2.5
        },
        speed: {
            type: "f",
            value: .5
        },
        time: {
            type: "f",
            value: 0
        }
    },
    vertexShader: VertexShader,
    fragmentShader: ["uniform sampler2D tDiffuse;", "varying vec2 vUv;", "uniform float amount;", "uniform float speed;", "uniform float time;", "float random1d(float n){", "return fract(sin(n) * 43758.5453);", "}", "float random2d(vec2 n) { ", "return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);", "}", "float randomRange (in vec2 seed, in float min, in float max) {", "return min + random2d(seed) * (max - min);", "}", "float insideRange(float v, float bottom, float top) {", "return step(bottom, v) - step(top, v);", "}", "float rand(vec2 co){", "return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);", "}", "void main() {", "vec2 uv = vUv;", "float sTime = floor(time * speed * 6.0 * 24.0);", "vec3 inCol = texture2D(tDiffuse, uv).rgb;", "vec3 outCol = inCol;", "float maxOffset = amount/2.0;", "vec2 uvOff;", "for (float i = 0.0; i < 10.0; i += 1.0) {", "if (i > 10.0 * amount) break;", "float sliceY = random2d(vec2(sTime + amount, 2345.0 + float(i)));", "float sliceH = random2d(vec2(sTime + amount, 9035.0 + float(i))) * 0.25;", "float hOffset = randomRange(vec2(sTime + amount, 9625.0 + float(i)), -maxOffset, maxOffset);", "uvOff = uv;", "uvOff.x += hOffset;", "vec2 uvOff = fract(uvOff);", "if (insideRange(uv.y, sliceY, fract(sliceY+sliceH)) == 1.0 ){", "outCol = texture2D(tDiffuse, uvOff).rgb;", "}", "}", "float maxColOffset = amount/6.0;", "vec2 colOffset = vec2(randomRange(vec2(sTime + amount, 3545.0),-maxColOffset,maxColOffset), randomRange(vec2(sTime , 7205.0),-maxColOffset,maxColOffset));", "uvOff = fract(uv + colOffset);", "float rnd = random2d(vec2(sTime + amount, 9545.0));", "if (rnd < 0.33){", "outCol.r = texture2D(tDiffuse, uvOff).r;", "}else if (rnd < 0.66){", "outCol.g = texture2D(tDiffuse, uvOff).g;", "} else{", "outCol.b = texture2D(tDiffuse, uvOff).b;", "}", "gl_FragColor = vec4(outCol,1.0);", "}"].join("\n")
}
