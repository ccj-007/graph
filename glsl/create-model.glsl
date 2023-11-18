#define MAX_STEPS 100
#define MAX_DIST 100.
#define SURF_DIST.001

mat2 Rot(float a){
    float s=sin(a);
    float c=cos(a);
    return mat2(c,-s,s,c);
}

float smin(float a,float b,float k){
    float h=clamp(.5+.5*(b-a)/k,0.,1.);
    return mix(b,a,h)-k*h*(1.-h);
}

float sdCapsule(vec3 p,vec3 a,vec3 b,float r){
    vec3 ab=b-a;
    vec3 ap=p-a;
    
    float t=dot(ab,ap)/dot(ab,ab);
    t=clamp(t,0.,1.);
    
    vec3 c=a+t*ab;
    
    return length(p-c)-r;
}

float sdCylinder(vec3 p,vec3 a,vec3 b,float r){
    vec3 ab=b-a;
    vec3 ap=p-a;
    
    float t=dot(ab,ap)/dot(ab,ab);
    t=clamp(t,0.,1.);
    
    vec3 c=a+t*ab;
    
    float x=length(p-c)-r;
    float y=(abs(t-.5)-.5)*length(ab);
    float e=length(max(vec2(x,y),0.));
    float i=min(max(x,y),0.);
    
    return e+i;
}
float sdRoundBox(vec3 p,vec3 b,float r)
{
    vec3 q=abs(p)-b;
    return length(max(q,0.))+min(max(q.x,max(q.y,q.z)),0.)-r;
}
float julia(vec2 z,vec2 c){
    const int maxIterations=100;
    int i;
    for(i=0;i<maxIterations;i++){
        if(dot(z,z)>4.)
        break;
        z=vec2(z.x*z.x-z.y*z.y,2.*z.x*z.y)+c;
    }
    return float(i)/float(maxIterations);
}
float GetDist(vec3 p){
    float plane=dot(p,normalize(vec3(0.,1.,0.)));
    vec3 blendP=p-vec3(0,1,0);
    float scale=mix(1.,3.,smoothstep(-1.,1.,blendP.y));
    // 镜像
    blendP=abs(blendP);
    blendP-=1.;
    
    blendP.xz*=scale;
    for(int i=0;i<3;i+=1){
        blendP.xz*=Rot(blendP.y);
    }
    
    float box=sdRoundBox(blendP,vec3(1,1,1),.2)/scale;
    float d=min(plane,box*.6);
    return d;
}

// float GetDist(vec3 p){
    //     float plane=dot(p,normalize(vec3(0.,1.,0.)));
    //     vec3 bp=p-vec3(0,1,0);
    //     bp.z+=sin(bp.x*5.+iTime*3.)*.1;// flag wave
    //     bp=abs(bp);
    //     bp-=1.;//mirror
    //     float scale=mix(1.,4.,smoothstep(-1.,1.,bp.y));
    //     bp.xz*=scale;
    //     bp.xz*=Rot(bp.y);
    //     float box=sdRoundBox(bp,vec3(1,.3,1.),1.)/scale;
    
    //     // box -= sin(p.x*7.5+iTime*3.)*.02; //displacement mapping
    //     // box=abs(box)-.1; // shell
    //     float d=min(plane,box);
    //     return d;
// }

float RayMarch(vec3 ro,vec3 rd){
    float dO=0.;
    
    for(int i=0;i<MAX_STEPS;i++){
        vec3 p=ro+rd*dO;
        float dS=GetDist(p);
        dO+=dS;
        if(dO>MAX_DIST||abs(dS)<SURF_DIST)break;
    }
    
    return dO;
}

vec3 GetNormal(vec3 p){
    float d=GetDist(p);
    vec2 e=vec2(.001,0);
    
    vec3 n=d-vec3(
        GetDist(p-e.xyy),
        GetDist(p-e.yxy),
        GetDist(p-e.yyx));
        
        return normalize(n);
    }
    
    float GetLight(vec3 p){
        vec3 lightPos=vec3(3,5,4);
        vec3 l=normalize(lightPos-p);
        vec3 n=GetNormal(p);
        
        float dif=clamp(dot(n,l)*.5+.5,0.,1.);
        float d=RayMarch(p+n*SURF_DIST*2.,l);
        // if(p.y<.01 && d<length(lightPos-p)) dif *= .5;
        
        return dif;
    }
    
    vec3 R(vec2 uv,vec3 p,vec3 l,float z){
        vec3 f=normalize(l-p),
        r=normalize(cross(vec3(0,1,0),f)),
        u=cross(f,r),
        c=p+f*z,
        i=c+uv.x*r+uv.y*u,
        d=normalize(i-p);
        return d;
    }
    
    void mainImage(out vec4 fragColor,in vec2 fragCoord)
    {
        vec2 uv=(fragCoord-.5*iResolution.xy)/iResolution.y;
        vec2 m=iMouse.xy/iResolution.xy;
        
        vec3 col=vec3(0);
        
        vec3 ro=vec3(0,14,2);
        ro.yz*=Rot(-m.y*3.14+1.);
        ro.xz*=Rot(-m.x*6.2831);
        
        vec3 rd=R(uv,ro,vec3(0,1,0),1.);
        
        float d=RayMarch(ro,rd);
        
        if(d<MAX_DIST){
            vec3 p=ro+rd*d;
            
            float dif=GetLight(p);
            col=vec3(dif);
        }
        
        col=pow(col,vec3(.4545));// gamma correction
        
        fragColor=vec4(col,1.);
    }