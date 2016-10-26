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
		var NewPosBullet= this.position.z + this.speed_z*delta;
		if(NewPosBullet<-195){
			game.scene.remove(this);
			//game.collidables.remove(this)
		}
		else
			this.position.z = NewPosBullet;
	}

	processCollision(graphEnt){

	}


}
