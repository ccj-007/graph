precision mediump float;

uniform float u_time;
uniform vec2 u_resolution;

float random(vec2 st){
    return fract(sin(dot(st.xy,vec2(12.9898,78.233)))*43758.5453);
}

float noise(vec2 st){
    vec2 i=floor(st);
    vec2 f=fract(st);
    
    float a=random(i);
    float b=random(i+vec2(1.,0.));
    float c=random(i+vec2(0.,1.));
    float d=random(i+vec2(1.,1.));
    
    vec2 u=f*f*(3.-2.*f);
    return mix(a,b,u.x)+(c-a)*u.y*(1.-u.x)+(d-b)*u.x*u.y;
}

float fbm(vec2 st){
    float value=0.;
    float amplitude=.5;
    float frequency=0.;
    
    for(int i=0;i<5;i++){
        value+=amplitude*noise(st);
        st*=2.;
        amplitude*=.5;
    }
    
    return value;
}

vec2 warp(vec2 st){
    float time=u_time*1.1;
    float strength=.5;
    
    vec2 offset=vec2(
        fbm(st+vec2(cos(time),sin(time))*strength),
        fbm(st+vec2(cos(time+1.),sin(time+1.))*strength)
    );
    
    return st+offset;
}

void main(){
    vec2 st=gl_FragCoord.xy/u_resolution.xy;
    st*=8.;
    
    st=warp(st);
    
    float fractalValue=fbm(st);
    
    vec3 color=vec3(fractalValue);
    
    gl_FragColor=vec4(vec3(.1,.9,.99)*color,1.);
}