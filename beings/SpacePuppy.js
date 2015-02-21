function SpacePuppy( toucher , file){

  // This is the vec3 that we use to calculate being touched
  this.toucher = toucher;
  
  this.stream = new Stream( file , audioController );

  // STATE
  this.hovered = false;
  this.touched = false;
  this.playing = false;
 
  this.outerRadius = .04;
  this.innerRadius = .03;

  this.touchVec = new THREE.Vector3();
  
  this.dist = 0;
  this.oDist = 0;

  this.colors = [];

  this.colors.push( new THREE.Vector3( 240 , 21  , 0   ) );
  this.colors.push( new THREE.Vector3( 34  , 186 , 120 ) );
  this.colors.push( new THREE.Vector3( 52  , 113 , 244 ) );
  this.colors.push( new THREE.Vector3( 245 , 190 , 36  ) );

  for( var i  = 0; i< this.colors.length; i++ ){
    this.colors[i].multiplyScalar( 1 / 255 );
  }

  this.uniforms = {

    colors : { type:"v3v" , value:this.colors },
    
    colorPower: { type:"f" , value: 1 },
    colorScale: { type:"f" , value: 1 },
    opacity:    { type:"f" , value: 1 },

    time:G.time,
    scale:{type:"f",value:1},
    radius:{type:"f",value:.001},
    speed:{type:"f",value:1},

  }

  var geo = new THREE.IcosahedronGeometry( this.innerRadius , 4 );
  var mat = new THREE.ShaderMaterial({
    uniforms:this.uniforms,
    vertexShader: shaders.vs.spacePuppy,
    fragmentShader: shaders.fs.spacePuppy,
  });
  
  this.body = new THREE.Mesh( geo , mat );

  /*var geo = new THREE.IcosahedronGeometry( this.outerRadius , 3 );
  var mat = new THREE.ShaderMaterial({
    uniforms:this.uniforms,
    vertexShader: shaders.vs.spacePuppy,
    fragmentShader: shaders.fs.spacePuppy,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });*/

  var geo = new THREE.IcosahedronGeometry( 1 , 2 );
  var mat = new THREE.MeshBasicMaterial({ wireframe: true , opacity: .1 , transparent: true });


  this.shell = new THREE.Mesh( geo , mat );
  
  this.shell.scale.x = this.outerRadius;
  this.shell.scale.y = this.outerRadius;
  this.shell.scale.z = this.outerRadius;

  this.body.add( this.shell );





}

SpacePuppy.prototype.update = function(){

  this.touchVec.copy( this.toucher );
  this.touchVec.sub( this.body.position );

  //console.log( this.body.position );

  this.oDist = this.dist;
  this.dist = this.touchVec.length();
 

  if( this.dist <=  this.outerRadius && this.oDist > this.outerRadius ){
    this.hoverOver();
  }

  if( this.dist >=  this.outerRadius && this.oDist < this.outerRadius ){
    this.hoverOut();
  }

  if( this.dist <=  this.innerRadius && this.oDist > this.innerRadius ){
    this.touchDown();
  }

  if( this.dist >=  this.innerRadius && this.oDist < this.innerRadius ){
    this.touchUp();
  }

  // HOVERING
  if( this.hovered === true &&  this.touched === false ){

    // 0 - not even hovering
    // 1 - touching
    var amount = ( this.dist - this.innerRadius) / ( this.outerRadius - this.innerRadius );
    this.hovering( amount );


  }

  //TOUCHING
  if( this.touched === true ){
    this.touching();
  }

}

SpacePuppy.prototype.hovering = function( amount ){

  this.uniforms.scale.value = amount * 3;//{type:"f",value:3},

  this.shell.scale.x = this.dist;
  this.shell.scale.y = this.dist;
  this.shell.scale.z = this.dist;

  this.shell.material.color.setHSL( amount * 30  , 1 , .8 );

  console.log('hvo');

}

SpacePuppy.prototype.touching = function(){

  var time = G.time.value - this.touchStartTime;

  this.uniforms.colorScale.value = 5 * Math.abs( Math.sin( time )  + Math.sin( time * 1.7015 ));
  this.uniforms.scale.value = 2 * Math.abs( Math.sin( time )  + Math.sin( time * 1.7015 ));
  this.uniforms.radius.value = .02 * Math.abs( Math.sin( time )  + Math.sin( time * 1.7015 ));

}



SpacePuppy.prototype.hoverOver = function(){

  console.log( 'hoverOver' );
  this.shell.material.opacity = .3;
  this.hovered = true;


}

SpacePuppy.prototype.hoverOut = function(){

  this.shell.material.opacity = .1;
  this.hovered = false;

}

SpacePuppy.prototype.touchDown = function(){

  // gives us a speed at which we touched the object
  this.touchSpeed = this.oDist - this.dist;
  this.touched = true; 
  console.log( 'touchDown' );

  if( this.playing == false ){
    this.playing = true;
    this.stream.play();
  }else{
    this.playing = false;
    this.stream.stop();
  }

}

SpacePuppy.prototype.touchUp = function(){

  console.log( 'touchUp' );
  this.touchStartTime = G.time.value;
  this.uniforms.radius.value = .001//2 * Math.abs( Math.sin( time )  + Math.sin( time * 1.7015 ));

  this.touched = false;


}
