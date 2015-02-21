/*
   
  Taken from the true and powerful 
  
  REZA 
  ALI
  
*/

uniform float scale;
uniform float time;
uniform float radius;
uniform float speed;

varying float vExtrude;

$simplex

void main(){

  vExtrude = snoise( vec4( normal * scale , time * speed ) );
  vExtrude +=  snoise( vec4( normal * scale * 2. , time * speed ) );

  vec3 pos = position;
  pos += normal * vExtrude * radius;

  gl_Position = projectionMatrix * modelViewMatrix * vec4( pos , 1.); 


}
