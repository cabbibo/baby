uniform float time;

varying vec3 vEye;
varying vec3 vMPos;
varying vec3 vNorm;

varying vec2 vUv;

// trying to port
// https://www.shadertoy.com/view/llfGWB
// to this world
$triNoise3D
$hsv


float posToFloat( vec3 p ){
 
    float f = triNoise3D( p * 1.4, .5 , time  );
    return f;
    
}

#define STEPS 10
vec3 fogCube( vec3 ro , vec3 rd , vec3 n ){

    vec3 col = vec3( 0. );
    float lum = 1.;
    for( int i = 0; i < STEPS; i++ ){
        vec3 p = ro + rd * .003  * float( i );


        lum +=  posToFloat( p );
        col += lum *  hsv(  3. * posToFloat( p ) , .5 , .5 );
    }
    
    return lum * col * .008;    
    
}

void main(){




  vec3 pos = vMPos;
  vec3 ro = pos;
  vec3 rd = normalize( vEye );

  vec3 col = vec3( 0. );
 
   
  

  float l = .00;
  float r = 1. - l; 
  // giving border
 // if( vUv.x < l || vUv.x > r || vUv.y < l || vUv.y > r ){

 //   col = vec3( 0. );
    //col = vNorm * .5  + .5;


//  }else{

     // vec3 pos = ro + rd * res.x;
      
      vec3 lightPos = vec3( 5. , 5. , 5. );
      
      lightPos -= pos;
      lightPos = normalize( lightPos );
      
      vec3 refl = reflect( lightPos , vNorm );
      
      float eyeMatch = max( 0. , dot( refl , rd ) );
      float lamb =max( 0.0 , dot( lightPos , vNorm ));
      
      
      vec3 fogCol = fogCube( pos , rd * 2. , vNorm );
       
      col = fogCol;

    
//  }

  
  gl_FragColor = vec4( col , 1. );

}
