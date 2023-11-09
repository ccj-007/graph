// Author: Inigo Quiles
// Title: Expo

#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float plot(vec2 st,float pct){
    // 用于计算st.y的值在(pct-.02,pct)和(pct,pct+.02)两个范围之间的插值，并返回一个在-1.到1.之间的值。
    return smoothstep(pct-.02,pct,st.y)-smoothstep(pct,pct+.02,st.y);
}

void main(){
    vec2 st=gl_FragCoord.xy/u_resolution;
    
    // 计算一个数的指定次幂
    float y=pow(st.x,5.);
    
    vec3 color=vec3(y);
    
    float pct=plot(st,y);
    color=(1.-pct)*color+pct*vec3(0.,1.,0.);
    
    gl_FragColor=vec4(color,1.);
}
