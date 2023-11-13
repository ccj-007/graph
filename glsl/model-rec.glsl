//CC0 1.0 Universal https://creativecommons.org/publicdomain/zero/1.0/
//To the extent possible under law, Blackle Mori has waived all copyright and related or neighboring rights to this work.

//In this example we extend the "assume-the-worst" trick to 3 dimensional domain repetition.

float box(vec3 p,vec3 d){
    p=abs(p)-d;
    return length(max(p,0.))+min(0.,max(max(p.x,p.y),p.z));
}

vec3 erot(vec3 p,vec3 ax,float ro){
    return mix(dot(p,ax)*ax,p,cos(ro))+sin(ro)*cross(ax,p);
}

#define FK(k)floatBitsToInt(k*k/7.)^floatBitsToInt(k)
float hash(float a,float b){
    int x=FK(a),y=FK(b);
    return float((x*x+y)*(y*y-x)-x)/2.14e9;
}

//nonzero sign function
float nonZeroSign(float x){
    return x<0.?-1.:1.;
}

//closest face of the cube to p
vec3 face(vec3 p){
    vec3 ap=abs(p);
    if(ap.x>=max(ap.z,ap.y))return vec3(nonZeroSign(p.x),0.,0.);
    if(ap.y>=max(ap.z,ap.x))return vec3(0.,nonZeroSign(p.y),0.);
    if(ap.z>=max(ap.x,ap.y))return vec3(0.,0.,nonZeroSign(p.z));
    return vec3(0);
}

float scene(vec3 p){
    vec3 center=floor(p)+.5;
    vec3 neighbour=center+face(p-center);
    float hs=hash(hash(center.x,center.y),center.z);
    vec3 pos=p-center;
    pos=erot(pos,vec3(0,0,1),hs*100.);
    vec3 npos=p-neighbour;
    float worst=box(vec3(length(npos.xy),npos.z,0),vec3(.4,.04,.04))-.005;
    float me=box(pos,vec3(.4,.04,.04))-.005;
    return min(me,worst);
}

vec3 norm(vec3 p){
    mat3 k=mat3(p,p,p)-mat3(.001);
    return normalize(scene(p)-vec3(scene(k[0]),scene(k[1]),scene(k[2])));
}

void mainImage(out vec4 fragColor,in vec2 fragCoord)
{
    vec2 uv=(fragCoord-.5*iResolution.xy)/iResolution.y;
    vec2 mouse=(iMouse.xy-.5*iResolution.xy)/iResolution.y;
    vec3 cam=normalize(vec3(1.5,uv));
    vec3 init=vec3(-2,0,0);
    
    float yrot=.5;
    float zrot=iTime*.2;
    if(iMouse.z>0.){
        yrot=clamp(1.-4.*mouse.y,-0.,3.14/2.);
        zrot=4.*mouse.x;
    }
    
    cam=erot(cam,vec3(0,1,0),yrot);
    init=erot(init,vec3(0,1,0),yrot);
    cam=erot(cam,vec3(0,0,1),zrot);
    init=erot(init,vec3(0,0,1),zrot);
    
    vec3 p=init;
    bool hit=false;
    for(int i=0;i<200&&!hit;i++){
        float dist=scene(p);
        hit=dist*dist<1e-6;
        p+=dist*cam;
        if(distance(p,init)>50.)break;
    }
    vec3 n=norm(p);
    vec3 r=reflect(cam,n);
    float col=length(sin(r*2.)*.5+.5)/sqrt(3.);
    col=col*.1+pow(col,6.);
    fragColor=hit?vec4(col):vec4(.03);
    fragColor=sqrt(fragColor);
}
