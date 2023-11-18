
float time;
vec3 pln;
// 函数接受一个三维向量p作为参数，表示要计算高度的点的位置。
float terrain(vec3 p)
{
    // 用于计算地形高度的x轴方向的索引值
    float nx=floor(p.x)*10.+floor(p.z)*300.;
    // 地形高度中心值
    float center=0.;
    // 高度缩放系数
    float scale=1.3;
    // 存储地形高度的向量，包含四个高度值
    vec4 heights=vec4(1.,1.,1.,1.);
    
    for(int i=0;i<6;i+=1)
    {
        // 地形高度的步进向量
        vec2 spxz=step(vec2(0.),p.xz);
        // 混合计算角落高度
        float corner_height=mix(mix(heights.x,heights.y,spxz.x),
        mix(heights.w,heights.z,spxz.x),spxz.y);
        // 中间高度
        vec4 mid_heights=(heights+heights.yzwx)*.5;
        
        heights=mix(mix(vec4(heights.x,mid_heights.x,center,mid_heights.w),
        vec4(mid_heights.x,heights.y,mid_heights.y,center),spxz.x),
        mix(vec4(mid_heights.w,center,mid_heights.z,heights.w),
        vec4(center,mid_heights.y,heights.z,mid_heights.z),spxz.x),spxz.y);
        
        nx=nx*4.+spxz.x+2.*spxz.y;
        
        center=(center+corner_height)*.5+cos(nx*20.)/scale*30.;
        
        p.xz=fract(p.xz)-vec2(.5);
        
        p*=2.;
        
        scale*=2.;
    }
    
    float d0=p.x+p.z;
    vec2 plh=mix(mix(heights.xw,heights.zw,step(0.,d0)),
    mix(heights.xy,heights.zy,step(0.,d0)),step(p.z,p.x));
    pln=normalize(vec3(plh.x-plh.y,2.,(plh.x-center)+(plh.y-center)));
    if(p.x+p.z>0.)
    pln.xz=-pln.zx;
    if(p.x<p.z)
    pln.xz=pln.zx;
    p.y-=center;
    return dot(p,pln)/scale;
}

void mainImage(out vec4 fragColor,in vec2 fragCoord)
{
    time=iTime*.4;
    vec2 uv=(fragCoord.xy/iResolution.xy)*2.-vec2(1.);
    uv.x*=iResolution.x/iResolution.y;
    // 缩放因子
    float sc=(time+sin(time*.2)*4.)*6.;
    
    // 相机原点位置
    vec3 camo=vec3(sc+cos(time*.2)*.5,.58+sin(time*.3)*.01,.3+sin(time*.4)*.8);
    // 相机目标位置
    vec3 camd=normalize(camo);
    // 相机的右侧向量
    vec3 camu=normalize(cross(camd,vec3(.5,1.,0.)));
    // 相机的上方向向量
    vec3 camv=normalize(cross(camu,camd));
    camu=normalize(cross(camd,camv));
    
    // 相机的三维向量构成的矩阵
    mat3 m=mat3(camu,camv,camd);
    
    // 射线方向向量
    vec3 rd=m*normalize(vec3(uv,1.));
    // 相交点位置向量
    vec3 rp;
    float t=0.;
    
    for(int i=0;i<100;i+=1)
    {
        rp=camo+rd*t;
        float d=terrain(rp);
        if(d<.001)
        // 此时地形碰撞
        break;
        t+=d;
    }
    // 光源方向
    vec3 ld=normalize(vec3(1.,.6,2.));
    fragColor.rgb=mix(vec3(.0235,.051,.251)*.4,vec3(.0627,.6353,.2824),pow(.5+.5*dot(pln,ld),.7));
    vec3 colors=vec3(.0039,.1059,.0784);
    
    fragColor.rgb=mix(vec3(.7922,.9255,.9529),fragColor.rgb+colors,exp(-t*.02));
}