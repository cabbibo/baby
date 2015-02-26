function TouchText( touchers , string ){
  
  
  var touch = new Touchable( touchers );

  var text = new PhysicsText( string , touchers , touch.body.position );

  
  touch.text = text;

  touch.textActive = false;

  touch.touchDown = function(){
  
    if( this.touchActive == false ){
      this.touchActive = true;
      this.text.activate( this.position );
    }else{
      this.touchActive = false;
      //this.text.kill();
    }
  
  }.bind(touch);

  

  return touch ;



}
