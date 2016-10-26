class Bullet extends GraphicalEntity{

	constructor(x,y,z,velx,velz){
		super(velx,velz, x,y,z,5)
		geometry = new THREE.SphereGeometry(5,10,10);
		material = new THREE.MeshBasicMaterial({ color: 0x00eeee, wireframe: wireBool});
		mesh = new THREE.Mesh(geometry, material);
		this.add(mesh);
		this.radius=5
	}

	calculatePos(delta){
		super.calculatePos(delta)
		if(this.position.z<-195){
			this.isAlive=false
			//game.collidables.remove(this)
		}
	}

	processCollision(graphEnt){
		if (graphEnt instanceof Alien){
			this.isAlive=false
		}
		if (graphEnt instanceof spaceShip){
			console.log("SCRUUB")
		}
	}


}
