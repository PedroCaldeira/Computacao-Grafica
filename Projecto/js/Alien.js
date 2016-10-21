
class Alien extends GraphicalEntity{
	constructor(speed_x,speed_z, x,y,z, material){
		this.material=material
		super(speed_x,speed_z, x,y,z)
		var radius=20, segments=25;
		addAlienBody(radius, segments);
		addAlienCockpit(radius/2, segments);

		//addAlienLandingGear(alien, radius)
	}

	addAlienBody(radius, Segments){
		'use strict'
		//top
		var geometry= new THREE.SphereGeometry(radius, Segments, Segments,0, Math.PI * 2, 0, 0.8 )
		var mesh= new THREE.Mesh(geometry, material)
		var mesh2=mesh.clone()
		mesh.position.set(0,-12.5,0)
		this.add(mesh);
		//bottom
		mesh2.rotation.x=Math.PI
		mesh2.position.set(0,12.5,0)
		this.add(mesh2);
		//mid
		geometry = new THREE.CylinderGeometry(radius*0.72, radius*0.72,3, Segments, 1, false, 0, 2*Math.PI)
		mesh=new THREE.Mesh(geometry, material)
		mesh.position.set(0,0,0)
		this.add(mesh)

}

	addAlienCockpit(radius, Segments){
		'use strict'
		var geometry= new THREE.SphereGeometry(radius, Segments, Segments, 0, Math.PI * 2, 5, 1.8)
		var mesh= new THREE.Mesh(geometry, material)
		mesh.position.set(0,2,0)
		this.add(mesh);
	}
}
