import * as THREE from 'three';
	
	
class CubeGeometry extends THREE.PolyhedronGeometry
{
	constructor( radius, level )
	{
		var vertices = [
				-1,-1,-1,    1,-1,-1,    1, 1,-1,    -1, 1,-1,
				-1,-1, 1,    1,-1, 1,    1, 1, 1,    -1, 1, 1,
			];

		var faces = [
				2,1,0,    0,3,2,
				0,4,7,    7,3,0,
				0,1,5,    5,4,0,
				1,2,6,    6,5,1,
				2,3,7,    7,6,2,
				4,5,6,    6,7,4
			];

		super( vertices, faces, radius, level );
	}
}
	
	
export { CubeGeometry };