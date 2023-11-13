#ifdef GL_ES
precision mediump float;
#endif
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

vec2 skew(vec2 st){
    vec2 r=vec2(0.);
    r.x=1.1547*st.x;
    r.y=st.y+.5*r.x;
    return r;
}

vec3 simplexGrid(vec2 st){
    vec3 xyz=vec3(0.);
    vec2 p=fract(skew(st));
    if(p.x>p.y){
        xyz.xy=1.-vec2(p.x,p.y-p.x);
        xyz.z=p.y;
    }else{
        xyz.yz=1.-vec2(p.x-p.y,p.y);
        xyz.x=p.x;
    }
    return fract(xyz);
}

void main(){
    vec2 st=gl_FragCoord.xy/u_resolution.xy;
    vec2 repeat=vec2(5.,5.);// 设置重复的次数
    st*=repeat;
    vec3 color=simplexGrid(st);
    gl_FragColor=vec4(color,1.);
}