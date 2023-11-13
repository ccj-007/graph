#ifdef PRETTY
#define AA_SAMPLES 8
#define MOTION_BLUR
#else
#define AA_SAMPLES 1
#endif

#iChannel0"https://66.media.tumblr.com/tumblr_mcmeonhR1e1ridypxo1_500.jpg"
#iChannel1"https://66.media.tumblr.com/tumblr_mcmeonhR1e1ridypxo1_500.jpg"

// 顶点进行变换
vec3 vertex(vec3 p){
    return step(0.,p)*2.-1.;
}
// 计算面的法线
vec3 face(vec3 p){
    vec3 ap=abs(p);
    if(ap.x>=max(ap.z,ap.y))return vec3(sign(p.x),0.,0.);
    if(ap.y>=max(ap.z,ap.x))return vec3(0.,sign(p.y),0.);
    if(ap.z>=max(ap.x,ap.y))return vec3(0.,0.,sign(p.z));
    return vec3(0);
}

// 计算边的位置
vec3 edge(vec3 p){
    vec3 mask=vec3(1)-abs(face(p));
    vec3 v=vertex(p);
    vec3 a=v*mask.zxy,b=v*mask.yzx;
    return distance(p,a)<distance(p,b)?a:b;
}

// 计算超平面
float super(vec2 p){
    return sqrt(length(p*p));
}

// 计算角的位置
float corner(vec2 p,float h){
    vec2 q=p-vec2(0,h);
    return super(max(q,0.))+min(0.,max(q.x,q.y));
}

// 计算网格的位置
vec4 grid(vec3 p){
    vec3 id=floor(p)+.5;
    vec3 m=sign(mod(id,2.)-1.);
    if(m.x*m.y*m.z<0.)id+=face(p-id);
    p-=id;
    float d1=length(p)-.6;
    p-=edge(p);
    float d2=length(p)-.6;
    return vec4(d1,d2,id);
}

#define FBI floatBitsToInt
// 计算哈希值
float hash(float a,float b){
    int x=FBI(cos(a))^FBI(a);
    int y=FBI(cos(b))^FBI(b);
    return float((x*x+y)*(y*y-x)+x)/2.14e9;
}

// 计算弹簧效果
float spring(float x){
    return smoothstep(-.4,.4,x)+smoothstep(-.3,.3,x)-smoothstep(-.7,.7,x);
}

// 计算平滑最小值
float smin(float a,float b,float k){
    float h=max(0.,k-abs(b-a))/k;
    return min(a,b)-h*h*h*k/6.;
}

vec3 smin(vec3 a,vec3 b,float k){
    vec3 h=max(vec3(0),k-abs(b-a))/k;
    return min(a,b)-h*h*h*k/6.;
}

// 对向量进行旋转
vec3 erot(vec3 p,vec3 ax,float ro){
    return mix(dot(p,ax)*ax,p,cos(ro))+sin(ro)*cross(ax,p);
}

// 时间
float mtime;
// 网格id
vec2 gid;
// 局部位置
vec3 glocal;
// 地面位置
float gnd;
// 时间变量
float gt;
float scene(vec3 p){
    float ds1=dot(cos(p.xy/5.),sin(p.xy/4.))*.06;
    vec3 p3=vec3(p.xy,ds1);
    vec4 g=grid(p3);
    gid=g.zw;
    
    float s1=hash(gid.x,gid.y);
    float s2=hash(s1,s1);
    gt=sin(s1*100.+mtime*mix(1.,2.,s2*.5+.5))-.4;
    float h=spring(gt)*2.-.5;
    
    vec2 crd=vec2(g.x,p.z);
    vec2 crd2=vec2(g.y,p.z);
    float maxheight=1.7;
    
    gnd=corner(crd*vec2(-1,1)+vec2(.08,0.),0.)-.04;
    
    crd.y-=h;
    glocal=p-vec3(gid,h);
    glocal=erot(glocal,vec3(0,0,1),s1*100.+gt*2.);
    float curr=corner(crd,0.);
    
    vec3 lp=glocal;
    lp.z=asin(sin(lp.z*5.+.5))/5.;
    curr=-smin(-curr,length(lp.yz)-.05,.03);
    
    float adjacent=corner(crd2,maxheight);
    return min(gnd,min(curr,adjacent)-.02);
}

// 计算法线
vec3 norm(vec3 p){
    mat3 k=mat3(p,p,p)-mat3(.01);
    return normalize(scene(p)-vec3(scene(k[0]),scene(k[1]),scene(k[2])));
}

// 计算天空光照
vec3 skylight(vec3 p){
    float d=dot(p,normalize(vec3(1)));
    return vec3(1)*d*.2+.2+pow(max(0.,d),10.)*1.5;
}

// 计算采样
float smpl(vec3 p,vec3 dir,float dist){
    return smoothstep(-dist,dist,scene(p+dir*dist));
}

// 计算像素颜色
vec3 pixel_color(vec2 uv,float time)
{
    vec2 mouse=(iMouse.xy-.5*iResolution.xy)/iResolution.y;
    mtime=time;
    vec3 cam=normalize(vec3(1.5,uv));
    vec3 init=vec3(-7,0,0);
    
    float yrot=.7+sin(time*.3)*.2;
    float zrot=time*.2;
    if(iMouse.z>0.){
        yrot=clamp(1.-4.*mouse.y,-0.,3.14/2.);
        zrot=4.*mouse.x;
    }
    
    cam=erot(cam,vec3(0,1,0),yrot);
    init=erot(init,vec3(0,1,0),yrot);
    cam=erot(cam,vec3(0,0,1),zrot);
    init=erot(init,vec3(0,0,1),zrot);
    
    init.xy+=time*vec2(.5,sqrt(2.));
    init.z+=2.;
    vec3 p=init;
    bool hit=false;
    float dist;int i;
    for(i=0;i<200&&!hit;i++){
        dist=scene(p);
        hit=dist*dist<1e-6;
        p+=dist*cam;
        if(distance(p,init)>50.)break;
    }
    bool g=gnd==dist;
    vec2 id=gid;
    float s1=hash(gid.y,gid.x);
    float s2=hash(s1,gid.x);
    vec3 local=g?p:glocal+vec3(id,0);
    
    float fog=min(1.,smoothstep(5.,50.,distance(p,init))+smoothstep(100.,200.,float(i)));
    vec3 n=norm(p);
    vec3 r=reflect(cam,n);
    float ao=smpl(p,n,.1);
    
    if(!g&&n.z>.9){
        float ang=atan(p.x-id.x,p.y-id.y);
        float ang2=atan(local.x-id.x,local.y-id.y);
        local=vec3(ang2/2.,length(p.xy-id)*40.,local.z+id.x*.9+id.y*.4);
        n=normalize(vec3(cos(ang*2.),sin(ang*2.),1));
    }
    
    //rough texture
    // float sharpness=texture(iChannel0,local/2.).x;
    // sharpness=sqrt(texture(iChannel0,local*vec3(1,4,.5)+sharpness*.1).x);
    // sharpness*=pow(texture(iChannel0,local/10.+sharpness*.1).x,2.);
    // sharpness=sharpness*.5+.9;
    float sharpness=1.;
    
    float ro=sqrt(smpl(p,r,.9)*smpl(p,r,.5)*smpl(p,r,.2));
    
    float spec=length(sin(r*3.*sharpness)*.4+.6)/sqrt(3.)*smoothstep(-1.,-.0,p.z);
    float fres=1.-abs(dot(cam,n))*.5;
    vec3 mcol=abs(erot(vec3(.4,.6,.9),normalize(vec3(0,s2,2)),s1*.6));
    if(g)mcol=vec3(.1);
    
    vec3 col=(mcol*spec+pow(spec,10.*sharpness))*ro*ao*fres*1.5;
    vec3 bgcol=skylight(cam);
    vec3 fragColor=hit?mix(col,bgcol,fog):bgcol;
    return fragColor;
}

// 计算二维Weyl序列
vec2 weyl_2d(int n){
    return fract(vec2(n*12664745,n*9560333)/exp2(24.));
}

// 用于计算Bayer序列
float bayer(ivec2 uv){
    return texelFetch(iChannel1,uv%8,0).x;
}

void mainImage(out vec4 fragColor,in vec2 fragCoord)
{
    vec2 uv=(fragCoord-.5*iResolution.xy)/iResolution.y;
    fragColor=vec4(0);
    float b=bayer(ivec2(fragCoord));
    for(int i=0;i<AA_SAMPLES+int(min(0,iFrame));i++){
        vec2 uv2=uv+weyl_2d(i)/iResolution.y*1.25;
        #ifdef MOTION_BLUR
        float blur=((float(i)+b)/float(AA_SAMPLES)-.5)*iTimeDelta;
        #else
        float blur=0.;
        #endif
        fragColor+=vec4(pixel_color(uv2,iTime+blur),1.);
    }
    fragColor.xyz=sqrt(fragColor.xyz/fragColor.w);
    
    fragColor.xyz=smin(fragColor.xyz,vec3(1),.1);
}