import * as THREE from 'three';
import {OrbitControls} from 'three/addons/OrbitControls.js';
import {CubeGeometry} from './CubeGeometry.js';



// initialize the scene
{
	var renderer = new THREE.WebGLRenderer( {antialias:true} );
		document.body.appendChild( renderer.domElement );
		document.body.style.margin = 0;
		document.body.style.overflow = 'hidden';

	var scene = new THREE.Scene();
		scene.background = new THREE.Color( 'lightgray' );

	var camera = new THREE.PerspectiveCamera( 60, 1, 10, 1000 );
		camera.position.set( 0, 0, 250 );
		camera.lookAt( scene.position );

	var controls = new OrbitControls( camera, renderer.domElement );
		controls.enableDamping = true;

	var light = new THREE.DirectionalLight( 'white', 1 );
		light.target = scene;
		scene.add( light );

	var wall = new THREE.TextureLoader().load( "wall.jpg" );
		wall.wrapS = THREE.RepeatWrapping;
		wall.wrapT = THREE.RepeatWrapping;
		scene.background = wall;		
}



// process window resize events
{
	function onWindowResize( event )
	{
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();

		wall.repeat.set( window.innerWidth/100, window.innerHeight/100 );

		renderer.setSize( window.innerWidth, window.innerHeight, true );
	}			

	window.addEventListener( 'resize', onWindowResize, false );

	onWindowResize();
}
	
	

// create animation loop
{
	function animate( )
	{
		controls.update( );
		light.position.copy( camera.position );
		renderer.render( scene, camera );
	}

	renderer.setAnimationLoop( animate );
}



// create platon shapes
{
	var MAX_LEVEL = 5; // 1-based
	
	var SHAPE_CLASS = [
			THREE.TetrahedronGeometry,
			THREE.OctahedronGeometry,
			CubeGeometry,
			THREE.DodecahedronGeometry,
			THREE.IcosahedronGeometry,
		]
		
	var SHAPE = [ [], [], [], [], [] ];
	
	for( var type=0; type<5; type++ )
	for( var level=1; level<=MAX_LEVEL; level++ )
		SHAPE[type][level] = new SHAPE_CLASS[type]( 1, level-1 );
}



// primary platon
{
	var primaryMaterial = new THREE.MeshStandardMaterial( {
			color: 'Gray',
			metalness: 1,
			roughness: 0.5,
			flatShading: true,
		} );

	var secondaryMaterial = new THREE.MeshStandardMaterial( {
			color: 'Orange',
			metalness: 0,
			roughness: 0.2,
			flatShading: true,
			emissive: 'Orange',
			emissiveIntensity: 0.2,
		} )
		
	var primary = new THREE.Mesh( SHAPE[0][3], primaryMaterial );	
		primary.scale.set( 70, 70, 70 );
		scene.add( primary );

	var secondary = new THREE.Mesh( SHAPE[1][2], secondaryMaterial );	
		secondary.scale.set( 1, 1, 1 );
		primary.add( secondary );
}



// update platons
function updatePlatons( primaryOptions, secondaryOptions )
{
	primary.geometry = SHAPE[primaryOptions.type][primaryOptions.level];
	
	secondary.geometry = SHAPE[secondaryOptions.type][secondaryOptions.level];
	secondary.scale.set( 1+secondaryOptions.scale/100, 1+secondaryOptions.scale/100, 1+secondaryOptions.scale/100 );
}
	
	
export { MAX_LEVEL, updatePlatons };