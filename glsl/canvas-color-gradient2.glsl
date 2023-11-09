#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;

float plot(vec2 st){
    return smoothstep(.02,0.,abs(st.y-st.x));
}

void main(){
    // 归一化坐标
    vec2 st=gl_FragCoord.xy/u_resolution;
    
    vec3 color=vec3(st.x);
    
    float pct=plot(st);
    color=(1.-pct)*color+pct*vec3(0.,1.,0.);
    
    gl_FragColor=vec4(color,1.);
}