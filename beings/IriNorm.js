function IriNorm(){

  var vs = G.shaders.vs.iriNorm;
  var fs = G.shaders.vs.iriNorm;

  var uniforms = {}

  var mat = new THREE.ShaderMaterial({

    uniforms: uniforms,
    vertexShader: vs,
    fragmentShader: fs,


  });

  var geo = new THREE.PlaneBufferGeometry( .5 , .5 , 100 , 100 );





}
