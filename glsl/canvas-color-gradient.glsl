#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float plot(vec2 st){
    return smoothstep(.02,0.,abs(st.y-st.x));
}

void main(){
    // 坐标归一化
    vec2 st=gl_FragCoord.xy/u_resolution;
    
    vec3 color=vec3(st.x);
    
    color=color+vec3(0.,1.,0.);
    
    gl_FragColor=vec4(color,1.);
}