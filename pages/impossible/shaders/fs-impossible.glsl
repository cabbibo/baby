uniform float time;
uniform float leftOrRight;

varying vec3 vEye;
varying vec3 vMPos;
varying vec3 vNorm;

varying vec2 vUv;


void main(){




  vec3 pos = vMPos;
  vec3 ro = pos;
  vec3 rd = normalize( vEye );

  //float dif = (sin( time ) * .5 + 1.5 )/2.;

  float dif = 1.;
  vec3 col =  vec3( leftOrRight * dif + ( 1. - dif) , .4 , (1. - leftOrRight) * dif + ( 1. - dif)  );
 


  
  gl_FragColor = vec4( col , 1. );

}
