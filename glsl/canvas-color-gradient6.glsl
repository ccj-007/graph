vec3 palette(float t){
    vec3 a=vec3(.5,.5,.5);
    vec3 b=vec3(.5,.5,.5);
    vec3 c=vec3(2.,1.,0.);
    vec3 d=vec3(.50,.20,.25);
    
    return a+b*cos(6.28318*(c*t+d));
}

float sdEquilateralTriangle(in vec2 p,in float r)
{
    const float k=sqrt(3.);
    p.x=abs(p.x)-r;
    p.y=p.y+r/k;
    if(p.x+k*p.y>0.)p=vec2(p.x-k*p.y,-k*p.x-p.y)/2.;
    p.x-=clamp(p.x,-2.*r,0.);
    return-length(p)*sign(p.y);
}

float sdStar5(in vec2 p,in float r,in float rf)
{
    const vec2 k1=vec2(.809016994375,-.587785252292);
    const vec2 k2=vec2(-k1.x,k1.y);
    p.x=abs(p.x);
    p-=2.*max(dot(k1,p),0.)*k1;
    p-=2.*max(dot(k2,p),0.)*k2;
    p.x=abs(p.x);
    p.y-=r;
    vec2 ba=rf*vec2(-k1.y,k1.x)-vec2(0,1);
    float h=clamp(dot(p,ba)/dot(ba,ba),0.,r);
    return length(p-ba*h)*sign(p.y*ba.x-p.x*ba.y);
}

void mainImage(out vec4 fragColor,in vec2 fragCoord)
{
    vec2 uv=(fragCoord*2.-iResolution.xy)/iResolution.y;
    vec2 uv2=uv;
    vec3 finalColor=vec3(0.);
    
    for(float i=0.;i<3.;i++){
        uv=fract(uv*1.5)-.5;
        
        float d=sdStar5(uv,.8,1.);
        
        d=d*tan(-length(uv2));
        
        vec3 col=palette(length(uv2)+i*2.+iTime*.4);
        
        d=sin(d*8.+iTime)/8.;
        d=abs(d);
        
        d=smoothstep(0.,.5,d);
        
        d=.01/d;
        finalColor+=col*d;
    }
    
    fragColor=vec4(finalColor,1.);
}