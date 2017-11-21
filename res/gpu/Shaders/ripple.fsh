varying vec2 v_texCoord;
varying vec4 v_fragmentColor;

uniform float u_threshold;

void main()
{
    vec4 normal = vec4(0.0);
    normal = texture2D(CC_Texture0, vec2(v_texCoord.x, v_texCoord.y));

    normal.x = u_threshold;
    gl_FragColor = v_fragmentColor * normal;
}
