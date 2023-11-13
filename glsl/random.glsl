#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float random(vec2 st){
    return fract(sin(dot(st.xy,vec2(12.,100.)))*1000.);
}

void main(){
    vec2 st=gl_FragCoord.xy/u_resolution.xy;
    st*=20.;
    
    float offset=0.;
    offset+=u_time;
    if(mod(st.y,2.)<1.){
        st.x+=offset;
    }else{
        st.x-=offset;
    }
    
    vec2 ipos=floor(st);
    
    float rnd=random(ipos);
    
    gl_FragColor=vec4(vec3(rnd),1.);
}
