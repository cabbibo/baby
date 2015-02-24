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


    function initThree(){

        var w = window.innerWidth;
        var h = window.innerHeight;

        clock = new THREE.Clock();

        camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, .01, 100 );
        //camera.position.z = .3;
        camera.lookAt( new THREE.Vector3() );


        renderer = new THREE.WebGLRenderer( { antialias: true } );

        renderer.autoClear = false;


        // FROM UTILS
        document.body.appendChild( renderer.domElement );
        window.addEventListener( 'resize', onWindowResize , false );
		    document.body.addEventListener( 'dblclick', onDoubleClick , false );

        //document.body.addEventListener("keydown", onKeyDown, true);


        if( VR == true ){

          controls = new THREE.VRControls( camera );

          effect = new THREE.VREffect( renderer );
          effect.setSize( window.innerWidth, window.innerHeight );

        }else{

          renderer.setSize( window.innerWidth, window.innerHeight );

        }


        scene = new THREE.Scene();




    }
