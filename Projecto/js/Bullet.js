class Bullet extends GraphicalEntity{

	constructor(x,y,z,velx,velz, pmaterial, gmaterial, flag){
		super(velx,velz, x,y,z,5, pmaterial, gmaterial)
		this.modelBullet();
		this.changeMaterial(!flag)
		
		
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
	changeMaterial(flag){
		if (flag){
			this.material=this.gouraudMaterial
		}
		else{
			this.material=this.phongMaterial
		}
		for (var i = 0; i < this.children.length; i++) {
			//console.log(this.children[i])
			this.children[i].material=this.material
		}

	}


}
