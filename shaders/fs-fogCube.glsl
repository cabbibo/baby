
uniform float time;

varying vec3 vEye;
varying vec3 vMPos;
varying vec3 vNorm;

varying vec2 vUv;

$triNoise3D


// TODO: make sure that once it hits the side of
// the cube is stops adding
#define STEPS 20
vec4 fogMap( vec3 ro , vec3 rd ){


  float l = 0.;

  for( int i = 0; i < STEPS; i++ ){

    vec3 p = ro + rd * float(i) / 1.;

    
    l += sin( p.x * 20.);// triNoise3D( p * .6 , float(i) * 2.1 , time * .001 );
    l += sin( p.y * 20. );// triNoise3D( p * .6 , float(i) * 2.1 , time * .001 );

  }

  float a = (l / float( STEPS ));
 return vec4( a * vec3( 1. , 0.5 , 0.3 ) , a * 2.  );

}

void main(){




  vec3 ro = vMPos;
  vec3 rd = normalize( vEye );

  vec4 col = fogMap( ro , rd );
  
  

  float l = .03;
  float r = 1. - .03; 
  // giving border
  if( vUv.x < l || vUv.x > r || vUv.y < l || vUv.y > r ){

    col = vec4( vec3( 0.) , 1. );// vec4( vNorm * .5  + .5 , 1. );

  }

  
  gl_FragColor = col;

}
