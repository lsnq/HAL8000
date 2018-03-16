uniform sampler2D tDiffuse;
uniform float amount;
varying vec2 vUv;

void main() {
    float factor = (1.015*(amount + 1.0))/(1.0*(1.015-amount));
    vec3 color = texture2D(tDiffuse, vUv).rgb;
    vec3 colorContrasted = factor * (color - 0.5)  + 0.5;
    gl_FragColor.rgb = colorContrasted + 0.1;
    gl_FragColor.a = 1.0;
}
