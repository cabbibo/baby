

function Link( id , touchers , title , link ){

  this.id = id;

  this.link = link;
  // This is the vec3 that we use to calculate being touched
  this.touchers = touchers;
  
  // STATE
  this.hovered = false;
  this.touched = false;
  this.playing = false;

  this.transitioning = false;
 
  this.outerRadius = .03;
  this.innerRadius = .01;

  this.touchVec = new THREE.Vector3();
  this.tv1 = new THREE.Vector3();
  
  this.dist = 0;
  this.oDist = 0;

  this.colors = [];


  var geo = new THREE.IcosahedronGeometry( this.innerRadius , 4 );
  var mat = new THREE.MeshBasicMaterial({ color: 0x999999 });

  this.body = new THREE.Mesh( geo , mat );
  this.position = this.body.position;

  var geo = new THREE.IcosahedronGeometry( 1 , 2 );
  var mat = new THREE.MeshBasicMaterial({ wireframe: true , opacity: .1 , transparent: true });

  this.shell = new THREE.Mesh( geo , mat );
  
  this.shell.scale.x = this.outerRadius;
  this.shell.scale.y = this.outerRadius;
  this.shell.scale.z = this.outerRadius;

  this.body.add( this.shell );

  

  /*
  
     AUDIO

  */

  var ctx = audioController.ctx;
  this.gain = ctx.createGain();
  this.gain.connect( audioController.gain );

  this.oscillator = ctx.createOscillator();
  //this.oscillator.type = 'square';
  this.oscillator.frequency.value = id * 40; // value in hertz
  this.oscillator.connect( this.gain );

  this.oscillator.start();
  this.gain.gain.value = 0;


}

Link.prototype.update = function(){

  var l = 10000
  for( var i = 0; i < this.touchers.length; i++ ){

    this.tv1.copy( this.touchers[i] );
    this.tv1.sub( this.body.position );
    if( this.tv1.length() < l ){
      l = this.tv1.length()
      this.touchVec.copy( this.touchers[i] );
    }

  }

  this.touchVec.sub( this.body.position );
  
  this.oDist = this.dist;
  this.dist = this.touchVec.length();

  //this.gain.gain.value = Math.min( .4 , .001 / this.dist);
 

  if( this.dist <=  this.outerRadius && this.oDist > this.outerRadius ){
    this._hoverOver();
  }

  if( this.dist >=  this.outerRadius && this.oDist < this.outerRadius ){
    this._hoverOut();
  }

  if( this.dist <=  this.innerRadius && this.oDist > this.innerRadius ){
    this._touchDown();
  }

  if( this.dist >=  this.innerRadius && this.oDist < this.innerRadius ){
    this._touchUp();
  }

  // HOVERING
  if( this.hovered === true &&  this.touched === false ){

    // 0 - not even hovering
    // 1 - touching
    var amount = ( this.dist - this.innerRadius) / ( this.outerRadius - this.innerRadius );
    this._hovering( amount );

  }


  //TOUCHING
  if( this.touched === true ){
    this._touching();
  }


  if( this.hovered === false ){
    this._idling();
  }


  if( this.transitioning == true ){

  }


}



Link.prototype._hovering = function( amount ){


  this.shell.scale.x = this.dist;
  this.shell.scale.y = this.dist;
  this.shell.scale.z = this.dist;

  this.shell.material.color.setHSL( amount * 30  , 1 , .8 );
  this.body.material.color.setRGB( amount , 1 - amount , 0);

  this.oscillator.frequency.value = this.id * 40 + 40 * amount;

  this.gain.gain.value = amount * .1;

  this.hovering( amount );


}

Link.prototype._touching = function(){

  var time = G.time.value - this.touchStartTime;
  this.touching( time );

}

Link.prototype._idling = function(){
  this.idling();
}


Link.prototype._hoverOver = function(){

  this.shell.material.opacity = .3;
  this.hovered = true;

  this.hoverOver();

  this.gain.gain.value = .3;
  //this.oscillator.start();

}

Link.prototype._hoverOut = function(){

  this.shell.material.opacity = .1;
  this.body.material.color.setRGB( 1 , 0 , 0 );
  this.shell.scale.x = this.outerRadius;
  this.shell.scale.y = this.outerRadius;
  this.shell.scale.z = this.outerRadius;

  this.gain.gain.value = 0;
  this.hovered = false;

  this.hoverOut();

 // this.oscillator.stop();
  

}

Link.prototype._touchDown = function(){

  // gives us a speed at which we touched the object
  this.touchSpeed = this.oDist - this.dist;
  this.touched = true; 

  this.touchDown();

  window.location.href = this.link;
 

}

Link.prototype._touchUp = function(){

  this.touchStartTime = G.time.value;

  this.touched = false;

  this.touchUp();


}

Link.prototype.hovering   = function(){}
Link.prototype.touching   = function(){}
Link.prototype.idling     = function(){}

Link.prototype.hoverOver  = function(){}
Link.prototype.hoverOut   = function(){}
Link.prototype.touchUp    = function(){}
Link.prototype.touchDown  = function(){}

