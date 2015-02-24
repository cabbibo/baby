/*
 
   TODO: 
   
   - Cover edge case where touchable appears over finger. 
      AKA, don't touch if we haven't hovered yet


   INFO:
    
    - Both Shell and Body should have size of 1, so they can
      be scaled properly with inner and outer radius
*/

function Touchable( touchers , params ){

  this.touchers = touchers;

  this.params = params || {};
  
  this.params.outerRadius = this.params.outerRadius || .03;
  this.params.innerRadius = this.params.innerRadius || .01;

  var geo = new THREE.IcosahedronGeometry( 1 , 3 );
  var mat = new THREE.MeshBasicMaterial({ color: 0x999999 });
  
  this.params.body = this.params.body || new THREE.Mesh( geo , mat );  

  var geo = new THREE.IcosahedronGeometry( 1 , 2 );
  var mat = new THREE.MeshBasicMaterial({ wireframe: true , opacity: .1 , transparent: true });

  this.params.shell = this.params.shell || new THREE.Mesh( geo , mat );  


  // Util Vectors
  this.tv1 = new THREE.Vector3();
  this.touchVec = new THREE.Vector3();

  
  // STATE
  this.hovered = false;
  this.touched = false;
  this.playing = false;


  //Distance from touchers to object
  this.dist = 0;
  this.oDist = 0;


  // Passing along Params
  this.outerRadius = this.params.outerRadius;
  this.innerRadius = this.params.innerRadius;


  this.body     = this.params.body  
  this.position = this.body.position;

  this.shell    = this.params.shell;


  this.body.scale.x = this.innerRadius;
  this.body.scale.y = this.innerRadius;
  this.body.scale.z = this.innerRadius;

  this.ratio = this.outerRadius / this.innerRadius;
  
  this.shell.scale.x = this.ratio;
  this.shell.scale.y = this.ratio;
  this.shell.scale.z = this.ratio;

  this.body.add( this.shell );

}

Touchable.prototype.update = function(){


  // Figure out what the closest toucher is
  var l = 10000;
  for( var i = 0; i < this.touchers.length; i++ ){

    
    this.tv1.copy( this.touchers[i] );
    this.tv1.sub( this.body.position );

    var length = this.tv1.length();
    if( length < l ){
      l = length;
      this.touchVec.copy( this.touchers[i] );
    }

  }

  this.touchVec.sub( this.body.position );
 
  // Push along our distance
  this.oDist = this.dist;
  this.dist = this.touchVec.length();


  // State Calls
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


  //NOT DOING ANYTHING
  if( this.hovered === false ){
    this._idling();
  }


}



Touchable.prototype._hovering = function( amount ){



  this.shell.scale.x = amount * this.ratio;
  this.shell.scale.y = amount * this.ratio;
  this.shell.scale.z = amount * this.ratio;


  this.shell.material.color.setHSL( 1  , 1 , .8 );
  this.body.material.color.setRGB( amount , 1 - amount , 0);

  this.hovering( amount );


}

Touchable.prototype._touching = function(){

  var time = G.time.value - this.touchStartTime;
  this.touching( time );

}

Touchable.prototype._idling = function(){
  this.idling();
}


Touchable.prototype._hoverOver = function(){

  this.shell.material.opacity = .3;
  this.hovered = true;

  this.hoverOver();

}

Touchable.prototype._hoverOut = function(){

  this.shell.material.opacity = .1;
  
  this.body.material.color.setRGB( 1 , 0 , 0 );
  
  this.shell.scale.x = this.ratio;
  this.shell.scale.y = this.ratio;
  this.shell.scale.z = this.ratio;

  this.hovered = false;

  this.hoverOut();

}

Touchable.prototype._touchDown = function(){

  // gives us a speed at which we touched the object
  this.touchSpeed = this.oDist - this.dist;
  this.touched = true; 

  this.touchDown();
 

}

Touchable.prototype._touchUp = function(){

  this.touchStartTime = G.time.value;

  this.touched = false;

  this.touchUp();


}

Touchable.prototype.hovering   = function(){}
Touchable.prototype.touching   = function(){}
Touchable.prototype.idling     = function(){}

Touchable.prototype.hoverOver  = function(){}
Touchable.prototype.hoverOut   = function(){}
Touchable.prototype.touchUp    = function(){}
Touchable.prototype.touchDown  = function(){}

