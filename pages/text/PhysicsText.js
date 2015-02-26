function PhysicsText( string , fingers , params ){

  this.string = string;
  this.active = false;
  this.params = _.defaults( params || {} , {

    sim: shaders.ss.text,

    repelPositions: [],
    gRepelPositions: [],
    offset: new THREE.Vector3( 0 , 150 , 0 ),
    distToCam: -.3,
    repelForce: 2000
  });

  this.sim = this.params.sim;
  this.sim = shaders.setValue( this.params.sim , 'REPELERS' , fingers.length );
  this.particles = text.createTextParticles( this.string );

  this.uniforms = this.particles.material.uniforms;

  this.size = this.particles.size;


  this.physics = new PhysicsRenderer( this.size , this.sim , renderer );

  console.log('TEST');
  console.log( this.uniforms );
  this.physics.setUniform( 't_to' , {
    type:"t",
    value:this.uniforms.t_lookup.value
  });



  var repelPos = [];

  for( var i = 0; i< this.params.repelPositions.length; i++ ){

    repelPos.push( this.params.repelPositions[i] );

  }

  for( var i = repelPos.length; i < 20; i++ ){

    var l = 1000000000;
    repelPos.push( new THREE.Vector3( l , l , l )); 

  }

  var uRepelPos = {
    type:"v3v",
    value: fingers
  }




  var speedUniform  = { type:"v3" , value:new THREE.Vector3() }
  var cameraMat     = { type:"m4" , value:camera.matrixWorld}
  var cameraPos     = { type:"v3" , value:camera.position } 

  this.offsetPos     = { type:"v3" , value: this.params.offset }
  this.alive         = { type:"f"  , value:0}

  this.distToCam     = { type:"f"  , value: this.params.distToCam } 
  this.repelForce    = { type:"f"  , value: this.params.repelForce }
  
  var noiseSize = .002 + (Math.random() -.5)*.003;

  this.noiseSize     = { type:"f"  , value: noiseSize };

  this.physics.setUniform( 'speed'       , speedUniform       );
  this.physics.setUniform( 'timer'       , G.time             );
  this.physics.setUniform( 'cameraMat'   , cameraMat          );
  this.physics.setUniform( 'cameraPos'   , cameraPos          );
  this.physics.setUniform( 'repelPos'    , uRepelPos          );  
  this.physics.setUniform( 'alive'       , this.alive         );
  this.physics.setUniform( 'offsetPos'   , this.offsetPos     );
  this.physics.setUniform( 'distToCam'   , this.distToCam     );
  this.physics.setUniform( 'repelForce'  , this.repelForce    );
  this.physics.setUniform( 'noiseSize'   , this.noiseSize     );

  this.physics.addBoundTexture( this.particles , 't_lookup' , 'output' );
  

}

PhysicsText.prototype.kill = function(length){

  this.alive.value = 0;

  var l = length || 10000;


  var newOpacity = { type:"f" , value: 0 }

  this.opacityTweener = { value: this.uniforms.opacity.value };

  var toTween = { value: 0 }


  var tween = new TWEEN.Tween( this.opacityTweener ).to( toTween , l );

  tween.onUpdate( function( t ){

    this.uniforms.opacity.value = this.opacityTweener.value

  }.bind( this ));


  tween.onComplete( function(){

     this.deactivate()
  
  }.bind( this ) );


  tween.start();


}

PhysicsText.prototype.instant = function(){

  this.alive.value = 2;

  this.physics.update();
  this.physics.update();
  this.physics.update();

  this.alive.value = 1;

}

PhysicsText.prototype.transport = function( position ){

  var data = new Float32Array( this.size * this.size * 4 );
  var positionsTexture = new THREE.DataTexture(
    data, 
    this.size, 
    this.size, 
    THREE.RGBAFormat, 
    THREE.FloatType 
  );

  positionsTexture.minFilter = THREE.NearestFilter;
  positionsTexture.magFilter = THREE.NearestFilter;
  positionsTexture.generateMipmaps = false;
  positionsTexture.needsUpdate = true;

  // giving some randomness, so that objects splay out properly
  for( var i = 0; i < data.length; i += 4 ){

    data[ i + 0 ] = position.x + Math.random() * .1;
    data[ i + 1 ] = position.y + Math.random() * .1;
    data[ i + 2 ] = position.z + Math.random() * .1;

    data[ i + 3 ] = 0;

  }

  positionsTexture.needsUpdate = true;

  this.physics.reset( positionsTexture );


}



PhysicsText.prototype.activate = function( pos ){

  var pos = pos || new THREE.Vector3( 0 , 0 , -40 );
  this.active = true;
  this.alive.value = 1;

  this.transport( pos );
  scene.add( this.particles );

}

PhysicsText.prototype.deactivate = function(){

  this.active = false;
  scene.remove( this.particles );

}

PhysicsText.prototype.update = function(){

  if( this.active === true ){

    this.physics.update();

  }


}
