#iChannel0"https://66.media.tumblr.com/tumblr_mcmeonhR1e1ridypxo1_500.jpg"

void mainImage(out vec4 fragColor,in vec2 fragCoord)
{
    vec2 uv=fragCoord/iResolution.xy;
    
    vec3 col=texture(iChannel0,uv).rgb;
    
    col+=vec3(0,0,0);
    
    fragColor=vec4(col,1.);
}
