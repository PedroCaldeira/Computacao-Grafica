class GraphicalEntity extends THREE.Object3D{


	constructor(speed_x, speed_z,x,y,z,radius, material){
		super()
		this.material=material
		this.position.set(x,y,z);
		this.speed_x=speed_x
		this.speed_z=speed_z
		this.collisionRadius=radius
		this.collision=false;
		this.tentativepos_x=x
		this.tentativepos_z=z
	}

	getSpeed(){
		return this.speed_x;
	}
	setSpeed(speed_x, speed_z){
		this.speed_x=speed_x;
		this.speed_z=speed_z;
	}
	update(delta){
		//calcular a nova posição sem actual -> pos tentative
		//ver se na nova posicao collide
			//se colidir Actualiza os speeds
		//actualizar posicao
		}

	hasCollision(graphEnt){
		var distanceSquared=Math.pow(this.collisionRadius+graphEnt.collisionRadius,2)
		if (distanceSquared>= Math.pow(this.position.x-graphEnt.position.x,2)+Math.pow(this.position.z-graphEnt.position.z,2))
			return true
		return false
	}

	processCollision(){}

	calculatePos(delta){
		this.tentativepos_x=this.position.x+this.speed_x*delta
		this.tentativepos_z=this.position.z+this.speed_z*delta
	}
	limitsCheck(side){
		if (side=="width"){
			if(Math.abs(this.tentativepos_x)+this.collisionRadius > gameWidth/2){
				return true;
			}

		}
		else if (side=="height"){
			if(Math.abs(this.tentativepos_z)+this.collisionRadius > gameHeight/2){
				return true;
			}
		}
		return false;

	}
}





