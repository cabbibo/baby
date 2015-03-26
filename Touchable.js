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
 
  this.touchVec  = new THREE.Vector3();
  this.oTouchVec = new THREE.Vector3();

  this.touchVel  = new THREE.Vector3();

  this.distVec   = new THREE.Vector3();

  this.touchID  = 0;
  this.oTouchID = 0;

  
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

Touchable.prototype.update = function(){


  // Figure out what the closest toucher is
  var l = Infinity;

  // Setting out touchID , to make sure
  // we aren't jumping from one toucher
  // to another
  this.oTouchID = this.touchID;
  this.oTouchVec.copy( this.touchVec );

  for( var i = 0; i < this.touchers.length; i++ ){

    
    this.tv1.copy( this.touchers[i] );
    this.tv1.sub( this.body.position );

    var length = this.tv1.length();
    if( length < l ){
      l = length;
      this.touchID = i;
      this.touchVec.copy( this.touchers[i] );
    }

  }

  //this.touchVec.sub( this.body.position );

  this.distVec.copy( this.touchVec );
  this.distVec.sub( this.body.position );
 
  // Only do things if we are touching with the same
  // finger. This will help avoid cases where a new
  // finger comes out of nowhere, or there is general
  // janks. It also means that we can use the toucher
  // velocity, to define directional interaction.
  if( this.touchID == this.oTouchID ){

    // Push along our distance
    this.oDist = this.dist;
    this.dist = this.distVec.length();

    // Getting the velocity of the toucher that is closest
    this.tv1.copy( this.touchVec );
    this.tv1.sub( this.oTouchVec );

    this.touchVel.copy( this.tv1 );
    //this.touchVel.normalize();

    this.tv1.set( 0 , 0 , -1 );
    this.tv1.applyQuaternion( camera.quaternion );

    this.touchVel.normalize();
    //console.log( this.touchVel );

    // sees if we are moving in the same direction 
    // or opposite direction of camera to position vector
    this.oDirMatch = this.dirMatch;
    this.dirMatch  = this.tv1.dot( this.touchVel );

    if( this.dirMatch > 0 ){
     console.log( 'POS')
    }else{
     // console.log('____');
    }




    // State Calls
    if( this.dist <=  this.outerRadius && this.oDist > this.outerRadius ){
      if( this.dirMatch >  0 ){ this._hoverOver(); }
    }

    if( this.dist >=  this.outerRadius && this.oDist < this.outerRadius ){
      if( this.dirMatch <= 0 ){ this._hoverOut(); }
    }

    if( this.dist <=  this.innerRadius && this.oDist > this.innerRadius ){
      if( this.dirMatch >  0 ){ this._touchDown(); }
    }

    if( this.dist >=  this.innerRadius && this.oDist < this.innerRadius ){
      if( this.dirMatch <= 0 ){ this._touchUp(); }
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

  }else{

    console.log('CHANGS')

  }


}



Touchable.prototype._hovering = function( amount ){



  this.shell.scale.x = ( amount + ( 1/this.ratio) ) * this.ratio;
  this.shell.scale.y = ( amount + ( 1/this.ratio) ) * this.ratio;
  this.shell.scale.z = ( amount + ( 1/this.ratio) ) * this.ratio;


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

