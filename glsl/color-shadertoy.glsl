// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
// Created by S.Guillitte
void main(){
    float time=iGlobalTime*1.;
    vec2 uv=(gl_FragCoord.xy/iResolution.xx-.5)*8.;
    vec2 uv0=uv;
    float i0=1.;
    float i1=1.;
    float i2=1.;
    float i4=0.;
    for(int s=0;s<7;s++){
        vec2 r;
        r=vec2(cos(uv.y*i0-i4+time/i1),sin(uv.x*i0-i4+time/i1))/i2;
        r+=vec2(-r.y,r.x)*.3;
        uv.xy+=r;
        
        i0*=1.93;
        i1*=1.15;
        i2*=1.7;
        i4+=.05+.1*time*i1;
    }
    float r=sin(uv.x-time)*.5+.5;
    float b=sin(uv.y+time)*.5+.5;
    float g=sin((uv.x+uv.y+sin(time*.5))*.5)*.5+.5;
    gl_FragColor=vec4(r,g,b,1.);
}