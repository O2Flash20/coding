#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 uResolution;

void main() {
    vec2 st = gl_FragCoord.xy / uResolution.xy;

    gl_FragColor = vec4(st.x, st.y, st.x + st.y, 1.);
}