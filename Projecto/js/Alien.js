class Alien extends GraphicalEntity{
	constructor(x,y,z, material){

		super(0,0,x,y,z,20*0.72, material)
		this.setInitialMovement()
		this.radius=20
		this.segments=25;
		this.addAlienBody(this.radius, this.segments);
		this.addAlienCockpit(this.radius/2, this.segments);

		//addAlienLandingGear(alien, radius)
	}


	setInitialMovement(){
		var angle=(Math.random()*2*Math.PI).toFixed(2)
		this.dirX=Math.cos(angle)
		this.dirZ=Math.sin(angle)
		var speed=30;
		super.setSpeed(speed*this.dirX, speed*this.dirZ)
	}

	addAlienBody(radius, Segments){
		'use strict'
		//top
		geometry= new THREE.SphereGeometry(radius, Segments, Segments,0, Math.PI * 2, 0, 0.8 )
		mesh= new THREE.Mesh(geometry, this.material)
		var mesh2=mesh.clone()
		mesh.position.set(0,-12.5,0)
		this.add(mesh);
		//bottom
		mesh2.rotation.x=Math.PI
		mesh2.position.set(0,12.5,0)
		this.add(mesh2);
		//mid
		geometry = new THREE.CylinderGeometry(radius*0.72, radius*0.72,3, Segments, 1, false, 0, 2*Math.PI)
		mesh=new THREE.Mesh(geometry, this.material)
		mesh.position.set(0,0,0)
		this.add(mesh)

	}

	addAlienCockpit(radius, Segments){
		'use strict'
		geometry= new THREE.SphereGeometry(radius, Segments, Segments, 0, Math.PI * 2, 5, 1.8)
		mesh= new THREE.Mesh(geometry, this.material)
		mesh.position.set(0,2,0)
		this.add(mesh);
	}


	processCollision(graphEnt){
		if (graphEnt instanceof Alien){
			this.speed_x=-this.speed_x;
			this.speed_z=-this.speed_z
		}
		else if (graphEnt instanceof Bullet){
			game.scene.remove(this)
			//game.collidables.splice(game.collidables.indexOf(this),1)
		}

	}


	calculatePos(delta){
		super.calculatePos(delta)
		if(this.limitsCheck("width")) 
			this.speed_x=-this.speed_x
		else if(this.limitsCheck("height")) {
			this.speed_z=-this.speed_z
		}
		else{
			this.position.set(this.tentativepos_x,yLineup,this.tentativepos_z)
		}
	}

	
}
