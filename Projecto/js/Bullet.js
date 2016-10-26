class Bullet extends GraphicalEntity{

	constructor(x,y,z,velx,velz, material){
		super(velx,velz, x,y,z,5, material)
		this.modelBullet();
		
		
	}

	modelBullet(){
		var geometry = new THREE.SphereGeometry(this.collisionRadius,10,10);
		var mesh = new THREE.Mesh(geometry, this.material);
		this.add(mesh);
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
