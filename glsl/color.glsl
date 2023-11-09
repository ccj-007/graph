#ifdef GL_ES
precision mediump float;
#endif

void main(){
    vec2 st=gl_FragCoord.xy/vec2(800.,600.);// 坐标归一化
    
    // 添加三个坐标点
    float dist1=length(st-vec2(.2,.2));
    float dist2=length(st-vec2(.5,.8));
    float dist3=length(st-vec2(.8,.4));
    
    // 根据距离设置颜色
    vec3 color=vec3(0.);
    if(dist1<.05){
        color=vec3(1.,0.,0.);// 红色
    }else if(dist2<.05){
        color=vec3(0.,1.,0.);// 绿色
    }else if(dist3<.05){
        color=vec3(0.,0.,1.);// 蓝色
    }
    
    gl_FragColor=vec4(color,1.);
}