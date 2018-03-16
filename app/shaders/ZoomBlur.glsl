uniform vec2 center;
//uniform float strength;
uniform vec2 resolution;
varying vec2 vUv;
uniform sampler2D tDiffuse;
//
//void main() {
//
//	vec4 sum = vec4( 0. );
//	vec2 toCenter = center - vUv * resolution;
//	vec2 inc = vec2(0.);
//	inc = center / resolution - vUv;
//	sum += texture2D( tDiffuse, ( vUv + inc * 0. ) ) * 0.15;
//	gl_FragColor = sum;
//
//}




void main()
{


    gl_FragColor = texture2D( tDiffuse, vUv );

}
