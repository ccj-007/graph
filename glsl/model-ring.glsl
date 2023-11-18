#iChannel0"https://66.media.tumblr.com/tumblr_mcmeonhR1e1ridypxo1_500.jpg"
#iChannel1"https://66.media.tumblr.com/tumblr_mcmeonhR1e1ridypxo1_500.jpg"

vec3 erot(vec3 p,vec3 ax,float ro){
    return mix(dot(ax,p)*ax,p,cos(ro))+sin(ro)*cross(ax,p);
}

float torus(vec3 p,float r1,float r2){
    return length(vec2(length(p.xz)-r1,p.y))-r2;
}

float super(vec3 x){
    return sqrt(length(x*x));
}

float box(vec3 p,vec3 d){
    p=abs(p)-d;
    return super(max(p,0.))+min(0.,max(max(p.x,p.y),p.z));
}

float smin(float a,float b,float k){
    float h=max(0.,k-abs(b-a))/k;
    return min(a,b)-h*h*h*k/6.;
}

float scene(vec3 p){
    vec3 p2=abs(erot(p-vec3(0,0,.4),vec3(1,0,0),radians(45.)));
    p2.yz=vec2(-smin(-p2.y,-p2.z,.1),smin(p2.y,p2.z,.1));
    float bx=box(p2,vec3(.05,.75,.15))-.1;
    float sph=length(p2)-.8;
    float tor=torus(p-vec3(0,0,-.35),.78,.15);
    return smin(tor,mix(bx,sph,.15),.1);
}

vec3 norm(vec3 p){
    mat3 k=mat3(p,p,p)-mat3(.01);
    return normalize(scene(p)-vec3(scene(k[0]),scene(k[1]),scene(k[2])));
}

//////////////////////////////////////////
//adapted from https://www.shadertoy.com/view/llySRh
float char(vec2 p,int c,sampler2D sampler){
    if(p.x<.0||p.x>1.||p.y<0.||p.y>1.)return 1.;
    return texture(sampler,p/16.+fract(vec2(c,15-c/16)/16.)).w;
}

float lighting(vec3 normal,int type){
    if(type==0){
        //phong diffuse lighting
        vec3 lightDir=normalize(vec3(1));
        return max(dot(lightDir,normal),0.);
    }
    if(type==1){
        //hemispherical lighting
        vec3 lightDir=normalize(vec3(1));
        return dot(lightDir,normal)*.5+.5;
    }
    if(type==2){
        //"leaky" phong diffuse lighting
        vec3 lightDir=normalize(vec3(1));
        float shade=dot(lightDir,normal);
        return mix(max(shade,0.),shade*.5+.5,.05);
    }
    if(type==3){
        //axis lighting
        return dot(max(normal,0.),vec3(.4));
    }
    if(type==4){
        //downward pointing axis lighting
        normal=erot(normal,normalize(vec3(-1,1,0)),.96);
        return dot(max(normal,0.),vec3(.4));
    }
    if(type==5){
        //image based lighting
        return pow(texture(iChannel0,vec2(normal.xz)).x,2.);
    }
    if(type==6){
        //fake image based lighting ("studio lighting")
        return pow(length(sin(normal*2.)*.5+.5)/sqrt(3.),2.);
    }
    if(type==7){
        //fake image based lighting ("outdoor lighting")
        return length(sin(normal*2.)*.5+.5)/sqrt(3.)*smoothstep(-1.,1.,normal.z);
    }
    return 0.;
}

void mainImage(out vec4 fragColor,in vec2 fragCoord)
{
    
    int type=int(mod(iTime/3.14159,8.));
    
    if(fragCoord.x<iResolution.x/3.&&fragCoord.y<iResolution.y/3.){
        vec2 uv=(vec2(1)-fragCoord/iResolution.xy*3.)*vec2(2.,1.)*3.1415;
        vec3 dir=vec3(sin(uv.y)*cos(uv.x),sin(uv.y)*sin(uv.x),cos(uv.y));
        fragColor=sqrt(vec4(lighting(dir,type)));
        return;
    }
    
    vec2 uv=(fragCoord-iResolution.xy*.5)/iResolution.y;
    vec3 cam=normalize(vec3(1,uv));
    vec3 init=vec3(-3,0,0);
    vec4 col=texture(iChannel0,uv).rgba;
    
    float zrot=iTime+3.14;
    float yrot=.2;
    cam=erot(cam,vec3(0,1,0),yrot);
    init=erot(init,vec3(0,1,0),yrot);
    cam=erot(cam,vec3(0,0,1),zrot);
    init=erot(init,vec3(0,0,1),zrot);
    
    vec3 p=init;
    bool hit=false;
    for(int i=0;i<150&&!hit;i++){
        float dist=scene(p);
        hit=dist*dist<1e-6;
        p+=cam*dist;
        if(distance(p,init)>10.)break;
    }
    
    vec3 n=norm(p);
    
    float shade=lighting(n,type);
    
    fragColor=vec4(hit?shade:0.);
    
    fragColor=sqrt(fragColor);
    
    float num=1.-smoothstep(.48,.51,char((uv+vec2(.85,-.3))*6.,48+type,iChannel1));
    fragColor=max(fragColor,vec4(num));
    fragColor*=col;
    
}