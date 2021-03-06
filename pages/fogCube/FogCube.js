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
   // blending: THREE.AdditiveBlending
   // depthWrite: false

  });

  var geo = new THREE.BoxGeometry( .8 , .8 , .8 , 10 , 10 , 10 );
  var geo = new THREE.IcosahedronGeometry( .7 , 4);

  var mesh = new THREE.Mesh( geo , mat );

  return mesh;

}
