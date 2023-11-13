#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float random(vec2 st){
    return fract(sin(dot(st.xy,vec2(12.9898,78.233)))*43758.5453);
}

float noise(vec2 st){
    vec2 i=floor(st);
    vec2 f=fract(st);
    
    // 四个角点的随机数
    float a=random(i);
    float b=random(i+vec2(1.,0.));
    float c=random(i+vec2(0.,1.));
    float d=random(i+vec2(1.,1.));
    
    // 双线性插值
    vec2 u=f*f*(3.-2.*f);
    return mix(a,b,u.x)+(c-a)*u.y*(1.-u.x)+(d-b)*u.x*u.y;
}

void main(){
    vec2 st=gl_FragCoord.xy/u_resolution.xy;
    float n=noise(st*100.);
    
    gl_FragColor=vec4(vec3(n),1.);
}