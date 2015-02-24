function Link( touchers , href, title){

  var link = new Touchable( touchers );
  
  link.href = href;

  link.touchDown = function(){
    window.location.href = this.href;
  }.bind(link );


  return link;


}
