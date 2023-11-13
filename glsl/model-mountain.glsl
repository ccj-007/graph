float time;
vec3 pln;

float terrain(vec3 p)
{
    float nx=floor(p.x)*10.+floor(p.z)*100.,center=0.,scale=2.;
    vec4 heights=vec4(0.,0.,0.,0.);
    
    for(int i=0;i<5;i+=1)
    {
        vec2 spxz=step(vec2(0.),p.xz);
        float corner_height=mix(mix(heights.x,heights.y,spxz.x),
        mix(heights.w,heights.z,spxz.x),spxz.y);
        
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
    
    float sc=(time+sin(time*.2)*4.)*.8;
    vec3 camo=vec3(sc+cos(time*.2)*.5,.7+sin(time*.3)*.4,.3+sin(time*.4)*.8);
    vec3 camt=vec3(sc+cos(time*.04)*1.5,-1.5,0.);
    vec3 camd=normalize(camt-camo);
    
    vec3 camu=normalize(cross(camd,vec3(.5,1.,0.))),camv=normalize(cross(camu,camd));
    camu=normalize(cross(camd,camv));
    
    mat3 m=mat3(camu,camv,camd);
    
    vec3 rd=m*normalize(vec3(uv,1.8)),rp;
    
    float t=0.;
    
    for(int i=0;i<100;i+=1)
    {
        rp=camo+rd*t;
        float d=terrain(rp);
        if(d<4e-3)
        break;
        t+=d;
    }
    
    vec3 ld=normalize(vec3(1.,.6,2.));
    fragColor.rgb=mix(vec3(.1,.1,.5)*.4,vec3(1.,1.,.8),pow(.5+.5*dot(pln,ld),.7));
    fragColor.rgb=mix(vec3(.5,.6,1.),fragColor.rgb,exp(-t*.02));
    
}
