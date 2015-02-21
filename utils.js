  // Resets the renderer to be the proper size
    function onWindowResize(){

      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      if( VR == true ){

        effect.setSize( window.innerWidth , window.innerHeight );
      }else{
        renderer.setSize( window.innerWidth, window.innerHeight );
      }


    }

	  function onKeyDown(event) {
	    event.preventDefault();

	    if (event.keyCode == 90) { // z
	    	controls.zeroSensor();
	    }
	  };

    function onDoubleClick() {
      effect.setFullScreen( true );
    }

    function onLoad(){

      loaded ++;
      
      if( loaded == neededToLoad ){
        init();
        animate();
      }

    }
