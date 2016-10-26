class Shield extends GraphicalEntity{
	constructor(x,y,z, material){
		super(0,0,x,y,z,20, material)
		'use strict';
		this.wallDistance=40;
		this.wallThickness=15;
		this.addShieldWalls(this, this.wallDistance, this.wallThickness);
		this.addShieldEdges(this, this.wallDistance, this.wallThickness)
		this.addShieldRoof (this, this.wallDistance, this.wallThickness);
		this.position.set(x,y,z);
	}

	addShieldWalls(object, distance, wallThickness){
		'use strict'
		var geometry=new THREE.CubeGeometry(wallThickness,wallThickness,wallThickness*2);
		var mesh=new THREE.Mesh(geometry, this.material);
		var mesh2=mesh.clone()
		mesh.position.set(-distance/2, 0, 0)
		mesh2.position.set(distance/2, 0, 0)
		object.add(mesh2)
		object.add(mesh);
	}


	addShieldEdges(object, distance, wallThickness){
		'use strict'
		var geometry=new THREE.CubeGeometry(Math.sqrt(2*wallThickness*wallThickness),wallThickness,Math.sqrt(2*wallThickness*wallThickness));
		var mesh=new THREE.Mesh(geometry, this.material);
		mesh.rotation.y=Math.PI/4
		mesh.position.set(-distance/2+wallThickness/2, 0, -wallThickness)
		var mesh2=mesh.clone()
		mesh2.position.set(distance/2-wallThickness/2, 0, -wallThickness)
		object.add(mesh)
		object.add(mesh2)
	}

	addShieldRoof(object, distance, wallThickness){
		'use strict'
		var geometry=new THREE.CubeGeometry(distance-wallThickness,wallThickness,wallThickness);
		var mesh=new THREE.Mesh(geometry, this.material);
		mesh.position.set(0, 0, -wallThickness*1.5)
		object.add(mesh)
}

}