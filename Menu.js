function Menu( links , touchables , title , params ){


  this.params = params || {};

  this.params.radius = this.params.radius || .12;
  this.params.crispness =  this.params.crispness || 30;


  this.labelMaker = new TextCreator( this.params.crispness );


  
  // The important part
  this.links = [];


  // STATE
  this.opened = false;

  // DEM TOUCHIES
  this.touchables = touchables;

  // Need to keep temporary touchers,
  // so we can transfer them into the 
  // space of the menu, and we can keep
  // the links nested!
  this.tmpTouch = [];

  for( var i = 0; i < this.touchables.length; i++ ){
    this.tmpTouch.push( new THREE.Vector3() );
  }

  // for tmp Touchess
  this.inverseBodyMatrix = new THREE.Matrix4();


  // The 'body' of this menu
  this.body = new THREE.Object3D();
  this.position = this.body.position;


  // Main button that opens and closes menu
  this.button = new Touchable( this.tmpTouch );

  this.button.touchDown = function(){

    if( this.opened === false ){
      this.open();
    }else{
      this.close();
    }

  }.bind( this );


  this.body.add( this.button.body );

  var textScale = 2 / this.params.crispness

  this.titleMesh = this.labelMaker.createMesh( title );
  this.titleMesh.scale.multiplyScalar( textScale );
  this.titleMesh.position.y = this.button.ratio * 1.3;

  this.button.body.add( this.titleMesh ); 

  for( var i = 0; i < links.length; i++ ){

    var theta = (.4 - ( i / links.length )) * Math.PI;
    var l = new Link( this.tmpTouch, links[i][0] , links[i][1] );
    this.links.push( l );

    var t = this.labelMaker.createMesh( links[i][1] );
 
    t.scale.multiplyScalar( textScale );
    console.log( 'TOTOAL' );
    console.log( t.totalWidth );
    t.position.x = t.totalWidth * textScale * .5 + l.ratio

    l.position.x = this.params.radius * Math.cos( theta );
    l.position.y = this.params.radius * Math.sin( theta );
    l.position.z = 0;

    l.body.add( t );
    l.titleMesh = t;
    //t.position.x = t.totalWidth / 20.;

  }


}

Menu.prototype.update = function(){


  this.body.updateMatrix();
  this.inverseBodyMatrix.getInverse( this.body.matrixWorld );
  for( var i = 0; i < this.touchables.length; i++ ){

    this.tmpTouch[i].copy( this.touchables[i] );
    this.tmpTouch[i].applyMatrix4( this.inverseBodyMatrix );
  
  } 

  this.button.update();

  if( this.opened === true ){
    for( var i = 0; i < this.links.length; i++ ){
      this.links[i].update();
    }
  }


}


Menu.prototype.open = function(){

  this.opened = true;

  for( var i = 0; i < this.links.length; i++ ){

    this.body.add( this.links[i].body );

  }

}

Menu.prototype.close = function(){

  this.opened = false;

  for( var i = 0; i < this.links.length; i++ ){

    this.body.remove( this.links[i].body );

  }

}
