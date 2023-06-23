import * as THREE from './libs/three.module.min.js';
import {OrbitControls} from './libs/OrbitControls.js';
import {CubeGeometry} from './CubeGeometry.js';
import {RANGE} from './platon-ranges.js';
import { GLTFExporter } from './libs/GLTFExporter.js';



// initialize the scene
{
	var renderer = new THREE.WebGLRenderer( {antialias:true} );
		document.body.appendChild( renderer.domElement );
		document.body.style.margin = 0;
		document.body.style.overflow = 'hidden';

//	var wall = new THREE.TextureLoader().load( 'textures/wall.png' );
//		wall.wrapS = THREE.RepeatWrapping;
//		wall.wrapT = THREE.RepeatWrapping;

	var envMap = new THREE.CubeTextureLoader().load( [
			'textures/envMap.jpg', 'textures/envMap.jpg',
			'textures/envMap.jpg', 'textures/envMap.jpg',
			'textures/envMap.jpg', 'textures/envMap.jpg',
		] );

	var scene = new THREE.Scene();
//		scene.background = wall;	
		scene.background = new THREE.Color( 'white' );
		scene.backgroundIntensity = 1;

	var camera = new THREE.PerspectiveCamera( 60, 1, 20, 2000 );
		camera.position.set( 0, 0, 250 );
		camera.lookAt( scene.position );

	var controls = new OrbitControls( camera, renderer.domElement );
		controls.maxDistance = 1500;
		controls.minDistance = 150;
		controls.enableDamping = true;

	var light = new THREE.DirectionalLight( 'white' );
		light.target = scene;
		scene.add( light );


}



// process window resize events
{
	function onWindowResize( event )
	{
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();

//		wall.repeat.set( window.innerWidth/100, window.innerHeight/100 );

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
		
	var SHAPE_CLASS_NAME = [
			'THREE.TetrahedronGeometry',
			'THREE.OctahedronGeometry',
			'CubeGeometry',
			'THREE.DodecahedronGeometry',
			'THREE.IcosahedronGeometry',
		]
		
	var SHAPE = [ [], [], [], [], [] ];
	
	for( var type=0; type<5; type++ )
	for( var level=1; level<=MAX_LEVEL; level++ )
	{
		SHAPE[type][level] = new SHAPE_CLASS[type]( 1, level-1 );
	}
}



// primary platon
{
	var primaryMaterial = new THREE.MeshStandardMaterial( {
			flatShading: true,
			envMap: envMap,
		} );

	var secondaryMaterial = new THREE.MeshStandardMaterial( {
			flatShading: true,
			envMap: envMap,
		} )
		
	var tertiaryMaterial = new THREE.MeshStandardMaterial( {
			flatShading: true,
			envMap: envMap,
		} )
		
	var primary = new THREE.Mesh( SHAPE[0][3], primaryMaterial );	
		primary.scale.set( 70, 70, 70 );
		scene.add( primary );

	var secondary = new THREE.Mesh( SHAPE[1][2], secondaryMaterial );	
		secondary.scale.set( 1, 1, 1 );
		primary.add( secondary );

	var tertiary = new THREE.Mesh( SHAPE[1][2], tertiaryMaterial );	
		tertiary.scale.set( 1, 1, 1 );
		primary.add( tertiary );
}



// update platons
function updatePlatons( primaryOptions, secondaryOptions, tertiaryOptions/*, environmentOptions*/ )
{
	primary.geometry = SHAPE[primaryOptions.type][primaryOptions.level];
	primary.material.color.set( primaryOptions.color );
	primary.material.metalness = THREE.MathUtils.mapLinear( primaryOptions.gloss, -10, 10, 0, 1 );
	primary.material.roughness = 1-primary.material.metalness;
	
	secondary.geometry = SHAPE[secondaryOptions.type][secondaryOptions.level];
	secondary.material.color.set( secondaryOptions.color );
	secondary.material.metalness = THREE.MathUtils.mapLinear( secondaryOptions.gloss, -10, 10, 0, 1 );
	secondary.material.roughness = 1-secondary.material.metalness;
	
	tertiary.geometry = SHAPE[tertiaryOptions.type][tertiaryOptions.level];
	tertiary.material.color.set( tertiaryOptions.color );
	tertiary.material.metalness = THREE.MathUtils.mapLinear( tertiaryOptions.gloss, -10, 10, 0, 1 );
	tertiary.material.roughness = 1-tertiary.material.metalness;

	var range = RANGE[ `${primaryOptions.type}-${primaryOptions.level}-${secondaryOptions.type}-${secondaryOptions.level}` ];
	if( !range ) range = [1,2000];
	
	secondary.scale.setScalar( THREE.MathUtils.mapLinear( secondaryOptions.scale, 0, 100, range[0], range[1] ) / 1000 );

	range = RANGE[ `${primaryOptions.type}-${primaryOptions.level}-${tertiaryOptions.type}-${tertiaryOptions.level}` ];
	if( !range ) range = [1,2000];
	
	tertiary.scale.setScalar( THREE.MathUtils.mapLinear( tertiaryOptions.scale, 0, 100, range[0], range[1] ) / 1000 );
	
	/*scene.backgroundIntensity = [0,0.25,1,1.2,2][environmentOptions.background+2];*/
	
	/*light.intensity = [0.1,0.4,0.8,1.1,1.5][environmentOptions.light+2];
	
	primary.material.envMapIntensity = [0.2,0.4,0.6,0.8,1][environmentOptions.light+2];
	secondary.material.envMapIntensity = primary.material.envMapIntensity;*/
}
	
	

function removeEnvMap( )
{
	primaryMaterial.envMap = undefined;
	secondaryMaterial.envMap = undefined;
}
		

function restoreEnvMap( )
{
	primaryMaterial.envMap = envMap;
	secondaryMaterial.envMap = envMap;
}


function removeBackground( )
{
//	scene.background = new THREE.Color( 'white' );
}
		

function restoreBackground( )
{
//	scene.background = wall;
}


var exporter = new GLTFExporter();
var exporterLink = document.createElement('a');

function exportPlatonAsGLTF( fileName, binary )
{
	removeEnvMap( );
	
	exporter.parse(
		primary,
		(gltf) => {
					var type = binary ? 'application/octet-stream' : 'text/plain;charset=utf-8',
						data = binary ? gltf : JSON.stringify( gltf ),
						blob = new Blob( [data], {type: type} );
					
					exporterLink.href = URL.createObjectURL( blob );
					exporterLink.download = fileName;
					exporterLink.click();
					restoreEnvMap( );
				},
		(error) => { throw error },
		{binary: binary}
	);			
}

function exportPlatonAsJSON( fileName )
{
	removeEnvMap( );

	var type = 'text/plain;charset=utf-8',
		data = JSON.stringify( primary.toJSON() ),
		blob = new Blob( [data], {type: type} );
	
	exporterLink.href = URL.createObjectURL( blob );
	exporterLink.download = fileName;
	exporterLink.click();
	
	restoreEnvMap( );
}

function exportPlatonAsImage( fileName, mime )
{
	removeBackground( );
	renderer.render( scene, camera );
	
	var w = renderer.domElement.width,
		h = renderer.domElement.height;

	var canvas = document.createElement( 'canvas' );
		canvas.width = w;
		canvas.height = h;

	var context = canvas.getContext( '2d' );
		context.drawImage( renderer.domElement, 0, 0 ); 

	var data = context.getImageData( 0, 0, w, h ).data;
	
	var minX = w-1,
		maxX = 0,
		minY = h-1,
		maxY = 0;
	
	for( var y=0; y<h; y++ )
	for( var x=0; x<w; x++ )
	{
		var i = 4*(y*w+x);
		
		if( data[0] != data[i] || data[1] != data[i+1]  || data[2] != data[i+2] )
		{
			minX = Math.min( minX, x );
			maxX = Math.max( maxX, x );
			minY = Math.min( minY, y );
			maxY = Math.max( maxY, y );
		}
	}
	
	minX -= 8;
	minY -= 8;
	maxX += 8;
	maxY += 8;
	
	var canvas2 = document.createElement( 'canvas' );
		canvas2.width = maxX-minX;
		canvas2.height = maxY-minY;

	var context2 = canvas2.getContext( '2d' );
		context2.drawImage( canvas, minX, minY, maxX-minX, maxY-minY, 0, 0, maxX-minX, maxY-minY,  ); 

	exporterLink.href = canvas2.toDataURL( mime, 1.0 );
	exporterLink.download = fileName;
	exporterLink.click();
	
	restoreBackground( );
}

function exportPlatonAsJS( fileName, html, primaryOptions,  secondaryOptions, tertiaryOptions )
{
	var positionData1 = primary.geometry.getAttribute('position').array,
		positionData2 = secondary.geometry.getAttribute('position').array;
				
	var injected = ((primaryOptions.type!=2) && (secondaryOptions.type!=2) && (tertiaryOptions.type!=2)) ? '' :`
		class CubeGeometry extends THREE.PolyhedronGeometry
		{
			constructor( radius, level )
			
			{
				var vertices = [
						-1,-1,-1,    1,-1,-1,    1, 1,-1,    -1, 1,-1,
						-1,-1, 1,    1,-1, 1,    1, 1, 1,    -1, 1, 1,
					];

				var faces = [
						2,1,0,    0,3,2,	0,4,7,    7,3,0,
						0,1,5,    5,4,0,	1,2,6,    6,5,1,
						2,3,7,    7,6,2,	4,5,6,    6,7,4
					];

				super( vertices, faces, radius, level );
			}
		}
	`;
	
	var data = '';
	
	if( html )
		data += `<!DOCTYPE html>

<html>

<head>
	<meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
</head>
	
<body>
	<script async
		src="https://ga.jspm.io/npm:es-module-shims@1.5.1/dist/es-module-shims.js"
		crossorigin="anonymous">
	</script>
	
	<script type="importmap">
	  {
		"imports": {
		  "three": "https://unpkg.com/three@0.153.0/build/three.module.js",
		  "three/addons/": "https://unpkg.com/three@0.153.0/examples/jsm/"
		}
	  }
	</script>

	<script type="module">
		import * as THREE from "three";
		import { OrbitControls } from "three/addons/controls/OrbitControls.js";

		var renderer = new THREE.WebGLRenderer( {antialias:true} );
			renderer.setSize( innerWidth, innerHeight );
			renderer.setAnimationLoop( animationLoop );
			document.body.appendChild( renderer.domElement );
			document.body.style.margin = 0;
			document.body.style.overflow = 'hidden';

		var scene = new THREE.Scene();

		var camera = new THREE.PerspectiveCamera( 30, innerWidth/innerHeight );
			camera.position.set( 0, 3, 7 );
			camera.lookAt( scene.position );

		window.addEventListener( "resize", (event) => {
			camera.aspect = innerWidth/innerHeight;
			camera.updateProjectionMatrix( );
			renderer.setSize( innerWidth, innerHeight );
		});

		var controls = new OrbitControls( camera, renderer.domElement );
			controls.enableDamping = true;
			controls.autoRotate = true;

		var light = new THREE.DirectionalLight( 'white' );
			light.target = scene;
			scene.add( light );

		function animationLoop( t )
		{
			controls.update( );
			light.position.copy( camera.position );
			renderer.render( scene, camera );
		}
		
		
		
`;

	data += 
`		// Platon definition

		${injected}
		
		var platon = new THREE.Mesh(
				new ${SHAPE_CLASS_NAME[primaryOptions.type]}( 1, ${primaryOptions.level-1} ),
				new THREE.MeshStandardMaterial( {
						color: 0x${primary.material.color.getHexString()},
						metalness: ${primary.material.metalness},
						roughness: ${primary.material.roughness},
						flatShading: true } )
			);
			
		scene.add( platon );
		
		var subplaton1 = new THREE.Mesh(
				new ${SHAPE_CLASS_NAME[secondaryOptions.type]}( 1, ${secondaryOptions.level-1} ),
				new THREE.MeshStandardMaterial( {
						color: 0x${secondary.material.color.getHexString()},
						metalness: ${secondary.material.metalness},
						roughness: ${secondary.material.roughness},
						flatShading: true } )
			 );
			 subplaton1.scale.setScalar( ${Math.round(1000*secondary.scale.x)/1000} );
			
		var subplaton2 = new THREE.Mesh(
				new ${SHAPE_CLASS_NAME[tertiaryOptions.type]}( 1, ${tertiaryOptions.level-1} ),
				new THREE.MeshStandardMaterial( {
						color: 0x${tertiary.material.color.getHexString()},
						metalness: ${tertiary.material.metalness},
						roughness: ${tertiary.material.roughness},
						flatShading: true } )
			 );
			 subplaton2.scale.setScalar( ${Math.round(1000*tertiary.scale.x)/1000} );
			
		platon.add( subplaton1, subplaton2 );
`;

	if( html )
		data +=`			
		
	</script>
</body>
</html>`;

	var type = 'text/plain;charset=utf-8',
		blob = new Blob( [data], {type: type} );
	
	exporterLink.href = URL.createObjectURL( blob );
	exporterLink.download = fileName;
	exporterLink.click();

}



export { MAX_LEVEL, updatePlatons, exportPlatonAsGLTF, exportPlatonAsJSON, exportPlatonAsImage, exportPlatonAsJS };