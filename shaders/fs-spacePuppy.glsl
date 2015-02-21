uniform vec3 colors[4];

uniform float opacity;
uniform float colorScale;
uniform float colorPower;

varying float vExtrude;

const float PI = 3.14159;
const float HALF_PI = PI / 2.;

float amplitude(float x, float offset) { 
             
  return max( cos( x * 3.0 * HALF_PI - HALF_PI * offset ) , 0.0 );

} 
 
void main(){


        
  vec3 sum = vec3(0.0, 0.0, 0.0);
  float offset = 0.0;

  for(int i = 0; i < 4; i++) {

    sum += colors[i] * amplitude( vExtrude * colorScale , offset );
    offset+=1.0;

  }

  

  //float a = opacity * max( -1.0 * vExtrude , 0.0 );
  float a = opacity; 
  gl_FragColor = vec4( sum * pow( vExtrude , colorPower ), a ); 



}
