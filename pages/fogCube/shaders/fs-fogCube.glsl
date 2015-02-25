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
 
    float f = triNoise3D( p * .4, .01 , time / 2. );
    return f;
    
}

#define STEPS 10
float fogCube( vec3 ro , vec3 rd , vec3 n ){
 
    float lum = 1.;
    for( int i = 0; i < STEPS; i++ ){
        vec3 p = ro + rd * .1  * float( i );

        lum += posToFloat( p );// + sin( p.y * 3. ) + sin( p.z * 5.);
    }
    
    return lum * 4.4;    
    
}

void main(){




  vec3 pos = vMPos;
  vec3 ro = pos;
  vec3 rd = normalize( vEye );

  vec3 col = vec3( 0. );
 
   
  

  float l = .003;
  float r = 1. - .003; 
  // giving border
  if( vUv.x < l || vUv.x > r || vUv.y < l || vUv.y > r ){

    col = vec3( 0.);// vec4( vNorm * .5  + .5 , 1. );

  }else{

     // vec3 pos = ro + rd * res.x;
      
      vec3 lightPos = vec3( 5. , 5. , 5. );
      
      lightPos -= pos;
      lightPos = normalize( lightPos );
      
      vec3 refl = reflect( lightPos , vNorm );
      
      float eyeMatch = max( 0. , dot( refl , rd ) );
      float lamb =max( 0.0 , dot( lightPos , vNorm ));
      
      
      float lum = fogCube( pos , rd * 2. , vNorm );
     // col = norm * .5 + .5;
    
      float lu = max( 0.0 , -dot( lightPos , vNorm ));
      
      vec3 nCol = hsv( posToFloat( pos) + .3 , .4 , 1.);
      nCol *=pow( lum / 20. , min( 5. , 1./ eyeMatch ) ) * eyeMatch;
      
      vec3 col2 = hsv( posToFloat( pos) + .6, .6, .4);
      nCol += lamb * col2 * pow( lum / 20. , min( 5. , 1./eyeMatch) ) * ( 1. - eyeMatch );
      
      vec3 col3 = hsv( posToFloat( pos) + .6, .9, .2);
      nCol += col3 * pow( lum / 20. , min( 5. , 1./eyeMatch) ) * ( 1. - lamb );
      
     // nCol +=  vec3( .2 ) * ( 1. - eyeMatch );
     // nCol *= hsv( abs(sin(lum * .1)) , .5 , 1. );
      
      //nCol += pow( eyeMatch , 10. ) * vec3( 1. );//hsv( eyeMatch * 1. , .5 , 1. );
      col += nCol;

  }

  
  gl_FragColor = vec4( col , 1. );

}