function FogCube(){


  var uniforms = {
    time: G.time
  }

  var mat = new THREE.ShaderMaterial({

    uniforms: uniforms,
    vertexShader: shaders.vs.fogCube,
    fragmentShader: shaders.fs.fogCube,
    //side: THREE.DoubleSide,
    transparent: true,
   // depthWrite: false

  });

  var geo = new THREE.BoxGeometry( .8 , .8 , .8 , 30 , 30 , 30 );

  var mesh = new THREE.Mesh( geo , mat );

  return mesh;

}
