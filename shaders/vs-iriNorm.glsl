

varying vec3 vNorm;

$simplex


vec3 getDisplacement( vec3 pos ){


}

vec3 getNorm( vec3 pos , out vec3 offset){

  vec2 ep = vec2( .0001 , .0 , .0 );

  vec3 l = pos + ep.xyy;
  vec3 r = pos - ep.xyy;
  vec3 u = pos + ep.yxy;
  vec3 d = pos - ep.yxy;

  

  vec3 d1 = 

}
void main(){

  vec3 pos = position;




  gl_Position = projectionMatrix * modelViewMatrix * vec4( pos , 1. );


}
