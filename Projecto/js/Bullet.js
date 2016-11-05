class Bullet extends GraphicalEntity{

	constructor(x,y,z,velx,velz,materials, flag){
		super(velx,velz, x,y,z,5, materials)
		this.modelBullet();
		super.changeMaterial(flag)
		
		
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
