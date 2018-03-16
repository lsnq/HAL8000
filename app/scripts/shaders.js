/* eslint-disable */
import * as THREE from 'three';
import BarrelFragment from '../shaders/BarrelFragment.glsl';
import VertexShader from '../shaders/VertexShader.glsl';
import DuoToneFragment from '../shaders/DuoToneFragment.glsl';
import ContrastFragment from '../shaders/ContrastFragment.glsl';

const {innerHeight, innerWidth} = window;

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

        amount: {
            type: "f",
            value: 0.5
        }
    },
    vertexShader: VertexShader,
    fragmentShader: ContrastFragment
};

export const ScanlinesShader = {
    uniforms: {
        tDiffuse: {
            value: null
        },
        time: {
            value: 0
        },
        noiseAmount: {
            value: .0
        },
        linesAmount: {
            value: .232
        },
        count: {
            value: innerHeight / 2
        },
        height: {
            value: innerHeight
        }
    },
    vertexShader: VertexShader,
    fragmentShader: ["uniform sampler2D tDiffuse;", "uniform float time;", "uniform float count;", "uniform float noiseAmount;", "uniform float linesAmount;", "uniform float height;", "varying vec2 vUv;", "#define PI 3.14159265359", "highp float rand( const in vec2 uv ) {", "const highp float a = 12.9898, b = 78.233, c = 43758.5453;", "highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );", "return fract(sin(sn) * c);", "}", "void main() {", "vec4 cTextureScreen = texture2D( tDiffuse, vUv );", "float dx = rand( vUv + time );", "vec3 cResult = cTextureScreen.rgb * dx * noiseAmount;", "float lineAmount = height * 1.8 * count;", "vec2 sc = vec2( sin( vUv.y * lineAmount), cos( vUv.y * lineAmount) );", "cResult += cTextureScreen.rgb * vec3( sc.x, sc.y, sc.x ) * linesAmount;", "cResult = cTextureScreen.rgb + ( cResult );", "gl_FragColor =  vec4( cResult, cTextureScreen.a );", "}"].join("\n")
};

export const GlowShader = {
    uniforms: {
        tDiffuse: {
            type: "t",
            value: null
        },
        amount: {
            type: "f",
            value: .25
        },
        size: {
            type: "f",
            value: .5
        },
        darkness: {
            type: "f",
            value: .3
        },
        resolution: {
            type: "v2",
            value: new THREE.Vector2(innerWidth,innerHeight)
        }
    },
    vertexShader: VertexShader,
    fragmentShader: ["uniform sampler2D tDiffuse;", "uniform float size;", "uniform float amount;", "uniform vec2 resolution;", "uniform float darkness;", "varying vec2 vUv;", "void main() {", "float h = size / resolution.x;", "float v = size / resolution.y;", "vec4 sum = vec4( 0.0 );", "sum += (texture2D( tDiffuse, vec2( vUv.x - 4.0 * h, vUv.y ) )- darkness) * 0.051 ;", "sum += (texture2D( tDiffuse, vec2( vUv.x - 3.0 * h, vUv.y ) )- darkness) * 0.0918;", "sum += (texture2D( tDiffuse, vec2( vUv.x - 2.0 * h, vUv.y ) )- darkness) * 0.12245;", "sum += (texture2D( tDiffuse, vec2( vUv.x - 1.0 * h, vUv.y ) )- darkness) * 0.1531;", "sum += (texture2D( tDiffuse, vec2( vUv.x, vUv.y ) )- darkness) * 0.1633;", "sum += (texture2D( tDiffuse, vec2( vUv.x + 1.0 * h, vUv.y ) )- darkness) * 0.1531;", "sum += (texture2D( tDiffuse, vec2( vUv.x + 2.0 * h, vUv.y ) )- darkness) * 0.12245;", "sum += (texture2D( tDiffuse, vec2( vUv.x + 3.0 * h, vUv.y ) )- darkness) * 0.0918;", "sum += (texture2D( tDiffuse, vec2( vUv.x + 4.0 * h, vUv.y ) )- darkness) * 0.051;", "sum += (texture2D( tDiffuse, vec2( vUv.x, vUv.y - 4.0 * v ) )- darkness) * 0.051;", "sum += (texture2D( tDiffuse, vec2( vUv.x, vUv.y - 3.0 * v ) )- darkness) * 0.0918;", "sum += (texture2D( tDiffuse, vec2( vUv.x, vUv.y - 2.0 * v ) )- darkness) * 0.12245;", "sum += (texture2D( tDiffuse, vec2( vUv.x, vUv.y - 1.0 * v ) )- darkness) * 0.1531;", "sum += (texture2D( tDiffuse, vec2( vUv.x, vUv.y ) )- darkness) * 0.1633;", "sum += (texture2D( tDiffuse, vec2( vUv.x, vUv.y + 1.0 * v ) )- darkness) * 0.1531;", "sum += (texture2D( tDiffuse, vec2( vUv.x, vUv.y + 2.0 * v ) )- darkness) * 0.12245;", "sum += (texture2D( tDiffuse, vec2( vUv.x, vUv.y + 3.0 * v ) )- darkness) * 0.0918;", "sum += (texture2D( tDiffuse, vec2( vUv.x, vUv.y + 4.0 * v ) )- darkness) * 0.051;", "vec4 base = texture2D( tDiffuse, vUv );", "gl_FragColor = base + max(sum,0.0) * amount;", "}"].join("\n")
};

export const BadTVShader = {
    uniforms: {
        tDiffuse: {
            type: "t",
            value: null
        },
        time: {
            type: "f",
            value: 0
        },
        distortion: {
            type: "f",
            value: 0.
        },
        distortion2: {
            type: "f",
            value: 0.51
        },
        speed: {
            type: "f",
            value: 0.00000125
        },
        rollSpeed: {
            type: "f",
            value: 0
        }
    },
    vertexShader: VertexShader,
    fragmentShader: ["uniform sampler2D tDiffuse;", "uniform float time;", "uniform float distortion;", "uniform float distortion2;", "uniform float speed;", "uniform float rollSpeed;", "varying vec2 vUv;", "vec3 mod289(vec3 x) {", "  return x - floor(x * (1.0 / 289.0)) * 289.0;", "}", "vec2 mod289(vec2 x) {", "  return x - floor(x * (1.0 / 289.0)) * 289.0;", "}", "vec3 permute(vec3 x) {", "  return mod289(((x*34.0)+1.0)*x);", "}", "float snoise(vec2 v)", "  {", "  const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0", "                      0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)", "                     -0.577350269189626,  // -1.0 + 2.0 * C.x", "                      0.024390243902439); // 1.0 / 41.0", "  vec2 i  = floor(v + dot(v, C.yy) );", "  vec2 x0 = v -   i + dot(i, C.xx);", "  vec2 i1;", "  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);", "  vec4 x12 = x0.xyxy + C.xxzz;", " x12.xy -= i1;", "  i = mod289(i); // Avoid truncation effects in permutation", "  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))", "		+ i.x + vec3(0.0, i1.x, 1.0 ));", "  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);", "  m = m*m ;", "  m = m*m ;", "  vec3 x = 2.0 * fract(p * C.www) - 1.0;", "  vec3 h = abs(x) - 0.5;", "  vec3 ox = floor(x + 0.5);", "  vec3 a0 = x - ox;", "  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );", "  vec3 g;", "  g.x  = a0.x  * x0.x  + h.x  * x0.y;", "  g.yz = a0.yz * x12.xz + h.yz * x12.yw;", "  return 130.0 * dot(m, g);", "}", "void main() {", "vec2 p = vUv;", "float ty = time * speed * 17.346;", "float yt = p.y - ty;", "float offset = snoise(vec2(yt*3.0,0.0))*0.2;", "offset = offset*distortion * offset*distortion * offset;", "offset += snoise(vec2(yt*50.0,0.0))*distortion2*0.002;", "gl_FragColor = texture2D(tDiffuse,  vec2(fract(p.x + offset),fract(p.y - time * rollSpeed) ));", "}"].join("\n")
};


