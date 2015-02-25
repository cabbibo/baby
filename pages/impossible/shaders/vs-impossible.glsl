varying vec3 vEye;
varying vec3 vMPos;
varying vec3 vNorm;

varying vec2 vUv;

void main(){
  
  vUv = uv;
  
  vMPos = ( modelMatrix * vec4( position , 1. ) ).xyz;
  
  vEye = normalize( cameraPosition - vMPos);

  vNorm = normalMatrix * normal;


  gl_Position = projectionMatrix * modelViewMatrix * vec4( position , 1. );


}
