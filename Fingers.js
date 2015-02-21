function Fingers( camera , controller ){

  this.camera = camera;

  var g = new THREE.IcosahedronGeometry(.005 , 1 );
  var m = new THREE.MeshNormalMaterial({
    color: 0xffffff
  });

  this.meshes     = [];
  this.positions  = [];
  this.velocities = [];
  this.powers     = [];
  this.radii      = [];
  this.targets    = [];

  this.tv1 = new THREE.Vector3();
  
  for(var i = 0; i < 50; i++ ){

    var mesh = new THREE.Mesh( g , m  );
    mesh.target   = new THREE.Vector3();//toCart( 12 , t , p );
    mesh.velocity = new THREE.Vector3();
    mesh.power    = new THREE.Vector3( 1 , 1 , 1);
    mesh.radius   = new THREE.Vector3( 1 , 1 , 1); 
    
    this.meshes.push( mesh );
    this.targets.push( mesh.target );
    this.velocities.push( mesh.velocity );
    this.powers.push( mesh.power );
    this.radii.push( mesh.radius );
    this.positions.push( mesh.position );

  }




}


Fingers.prototype.add = function( scene ){

  for( var i = 0; i< 50; i++ ){
    scene.add( this.meshes[i] );
  }

}

Fingers.prototype.update = function(){

  var frame = controller.frame();
  if( frame.valid == true ){
    this.updateHand( frame , 0 );
    this.updateHand( frame , 1 );
  }else{
  }

}


Fingers.prototype.updateHand = function( frame , whichHand ){

  if( frame.hands[whichHand] ){

    for( var i = 0; i < 25; i++ ){

      var r = this.positions[i+25*whichHand];
      var bI =  i % 5 ;                     // Bone index
      var fI = Math.floor( i / 5 );     // finger index

      var p = this.leapToScene( frame.hands[whichHand].fingers[fI].positions[bI] );

      this.transformToCamera( r , p ); 
    
    }

  }else{
       //console.
   for( var i = 0; i < 25; i++ ){

     var r = this.positions[i+25*whichHand];
     r.x = 100000;

    }



  }


}

Fingers.prototype.transformToCamera = function( threePos , leapPos ){

  if( VR == true ){
          
    // z is y || x is x ||  y is -z
    this.tv1.set( -leapPos[0] , -leapPos[2] , -leapPos[1] );
    threePos.copy( this.camera.position );
    this.tv1.applyQuaternion( this.camera.quaternion );
    threePos.add( this.tv1 );

  }else{ 

    threePos.copy( this.camera.position );
    this.tv1.set( leapPos[0] , leapPos[1] -.3 , leapPos[2] - .3 );
    threePos.add( this.tv1 );

  }

}

Fingers.prototype.leapToScene = function(  position  ){


    var p =  position;  
    return [ 
      p[0] * .001,
      p[1] * .001,
      p[2] * .001
    ]

}
