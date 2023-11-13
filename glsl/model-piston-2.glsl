float triangleCylinder(vec3 p,float width,float height){
    float dist=max(abs(p.x)-width,max(abs(p.y)-width,abs(p.z)-height));
    return dist;
}
float piston(vec2 p,float width,float height){
    p.x=abs(p.x)-width;
    p.y-=height;
    return length(max(p,0.))+min(0.,max(p.x,p.y));
}

float piston3D(vec3 p,float width,float height){
    vec2 p2=vec2(length(p.xy),p.z);
    return piston(p2,width,height);
}

// 用于对三维向量进行旋转
vec3 erot(vec3 p,vec3 ax,float ro){
    return mix(dot(p,ax)*ax,p,cos(ro))+sin(ro)*cross(ax,p);
}

// 计算一个二维向量的边界
vec2 edge(vec2 p){
    vec2 p2=abs(p);
    if(p2.x>p2.y)return vec2((p.x<0.)?-1.:1.,0.);
    else return vec2(0.,(p.y<0.)?-1.:1.);
}

// 计算场景形状
float scene(vec3 p){
    vec2 center=floor(p.xy)+.5;
    vec2 neighbour=center+edge(p.xy-center);
    float height=sin(center.y+center.x+iTime)*3.;
    float width=.4;
    float me=triangleCylinder(p-vec3(center,0),width,height);
    float next=triangleCylinder(p-vec3(neighbour,0),width,3.);
    return min(me,next);
}

// 计算法线
vec3 norm(vec3 p){
    mat3 k=mat3(p,p,p)-mat3(.01);
    return normalize(scene(p)-vec3(scene(k[0]),scene(k[1]),scene(k[2])));
}

void mainImage(out vec4 fragColor,in vec2 fragCoord)
{
    vec2 uv=(fragCoord-.5*iResolution.xy)/iResolution.y;
    
    // 相机方向
    vec3 cam=normalize(vec3(1.,uv));
    // 相机初始位置
    vec3 init=vec3(-20,0,0);
    
    float yrot=.5;
    float zrot=iTime*.2;
    
    // 旋转
    cam=erot(cam,vec3(0,1,0),yrot);
    init=erot(init,vec3(0,1,0),yrot);
    cam=erot(cam,vec3(0,0,1),zrot);
    init=erot(init,vec3(0,0,1),zrot);
    init.z+=1.;
    
    vec3 p=init;
    bool hit=false;
    
    // 光线追踪的算法
    for(int i=0;i<200&&!hit;i++){
        float dist=scene(p);
        // 判断碰撞
        hit=dist*dist<1e-6;
        // 得到向量
        p+=dist*cam;
        // 超出边界不显示
        if(distance(p,init)>40.)break;
    }
    // 得到法线，用于计算光照
    vec3 n=norm(p);
    // 得到反射向量 r
    vec3 r=reflect(cam,n);
    float col=length(sin(r*2.)*.5+.5)/sqrt(3.);
    col=col*.1+pow(col,3.);
    // 控制渲染背景与物体
    fragColor=hit?vec4(col):vec4(.8);
    fragColor=sqrt(fragColor);
}
