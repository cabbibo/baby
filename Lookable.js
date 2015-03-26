/*

   INFO:
    
    - Both Shell and Body should have size of 1, so they can
      be scaled properly with inner and outer radius
*/

function Lookable( camera , params ){

  this.camera = camera;

  this.params = params || {};
  
  this.params.outerRadius = this.params.outerRadius || .03;
  this.params.innerRadius = this.params.innerRadius || .01;

  var geo = new THREE.IcosahedronGeometry( 1 , 3 );
  var mat = new THREE.MeshBasicMaterial({ color: 0x999999 });
  
  this.params.body = this.params.body || new THREE.Mesh( geo , mat );  

  var geo = new THREE.IcosahedronGeometry( 1 , 2 );
  var mat = new THREE.MeshBasicMaterial({ wireframe: true , opacity: .1 , transparent: true });

  this.params.shell = this.params.shell || new THREE.Mesh( geo , mat );  

  this.params.speed = this.params.speed || 1000;

  
  // STATE
  this.hovered = false;
  this.touched = false;


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

Lookable.prototype.update = function(){



  // sees if we are moving in the same direction 
  // or opposite direction of camera to position vecto9r
   var dirMatch = this.tv1.dot( this.touchVec );


  // State Calls
  if( this.dist <=  this.outerRadius && this.oDist > this.outerRadius ){
    if( dirMatch >  0 ){ this._hoverOver(); }
  }

  if( this.dist >=  this.outerRadius && this.oDist < this.outerRadius ){
    if( dirMatch <= 0 ){ this._hoverOut(); }
  }

  if( this.dist <=  this.innerRadius && this.oDist > this.innerRadius ){
    if( dirMatch >  0 ){ this._touchDown(); }
  }

  if( this.dist >=  this.innerRadius && this.oDist < this.innerRadius ){
    if( dirMatch <= 0 ){ this._touchUp(); }
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



Lookable.prototype._hovering = function( amount ){



  this.shell.scale.x = ( amount + ( 1/this.ratio) ) * this.ratio;
  this.shell.scale.y = ( amount + ( 1/this.ratio) ) * this.ratio;
  this.shell.scale.z = ( amount + ( 1/this.ratio) ) * this.ratio;


  this.shell.material.color.setHSL( 1  , 1 , .8 );
  this.body.material.color.setRGB( amount , 1 - amount , 0);

  this.hovering( amount );


}

Lookable.prototype._touching = function(){

  var time = G.time.value - this.touchStartTime;
  this.touching( time );

}

Lookable.prototype._idling = function(){
  this.idling();
}


Lookable.prototype._hoverOver = function(){

  this.shell.material.opacity = .3;
  this.hovered = true;

  this.hoverOver();

}

Lookable.prototype._hoverOut = function(){

  this.shell.material.opacity = .1;
  
  this.body.material.color.setRGB( 1 , 0 , 0 );
  
  this.shell.scale.x = this.ratio;
  this.shell.scale.y = this.ratio;
  this.shell.scale.z = this.ratio;

  this.hovered = false;

  this.hoverOut();

}

Lookable.prototype._touchDown = function(){

  // gives us a speed at which we touched the object
  this.touchSpeed = this.oDist - this.dist;
  this.touched = true; 

  this.touchDown();
 

}

Lookable.prototype._touchUp = function(){

  this.touchStartTime = G.time.value;

  this.touched = false;

  this.touchUp();


}

Lookable.prototype.hovering   = function(){}
Lookable.prototype.touching   = function(){}
Lookable.prototype.idling     = function(){}

Lookable.prototype.hoverOver  = function(){}
Lookable.prototype.hoverOut   = function(){}
Lookable.prototype.touchUp    = function(){}
Lookable.prototype.touchDown  = function(){}

