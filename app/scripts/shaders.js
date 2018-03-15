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
            value: new THREE.Color(0xff00000)
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
            value: 0.35
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
            value: -0.2
        },
        contrast: {
            type: "f",
            value: 4
        }
    },
    vertexShader: VertexShader,
    fragmentShader: ContrastFragment
};

export const ZoomBlur = {
    uniforms: {
        tInput: {
            value: null
        },
        strength: {
            type: "f",
            value: 1.0
        },
        contrast: {
            type: "f",
            value: 2.0
        }
    },
    vertexShader: VertexShader,
    fragmentShader: ContrastFragment
};
