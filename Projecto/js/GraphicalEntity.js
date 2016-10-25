class BoundingVolume extends THREE.Object3D{
	constructor(center,radius){
		super()
		this.center=center;
		this.radius=radius;
	}

	collided(delta,speed_x,speed_z,bv){
		var collided=this.limitsCheck(delta,speed_x,speed_z,bv);
		var squaredRadius=Math.pow(this.radius+bv.radius,2);

		for(var i=0;i<collidables.length;i++)
			if (squaredRadius<Math.pow((collidables[i].bVolume.position.x-this.position.x),2) + Math.pow((collidables[i].bVolume.position.z-this.position.z),2) && collidables[i]!=this)
				return true;
		return false;
	}
	limitsCheck(delta,speed_x,speed_z){
		var collision=false;
		console.log(this.center.x+speed_x*delta+this.radius)
		if(Math.abs(this.center.x+speed_x*delta+this.radius) > gameWidth/2||Math.abs(this.center.z+speed_z*delta+this.radius > gameHeight/2)){
			collision=true;
		}
		console.log(collision)
	}
}

class GraphicalEntity extends THREE.Object3D{


	constructor(speed_x, speed_z,x,y,z,radius){
		super()
		this.acceleration=0
		this.bVolume= new BoundingVolume(this.position,radius)
		this.position.set(x,y,z);
		this.speed_x=speed_x
		this.speed_z=speed_z
		this.collisionRadius=radius
		this.collision=false;
	}

	getSpeed(){
		return this.speed_x;
	}
	setSpeed(speed_x, speed_z){
		this.speed_x=speed_x;
		this.speed_z=speed_z;
	}
	update(delta){
		var collision=false;
		//if (this.bVolume.collided(delta,this.speed_x,this.speed_z)) collision = true;
		}

	action(){}

}


class Alien extends GraphicalEntity{
	constructor(x,y,z, material){

		super(0,0,x,y,z,20*0.72)
		this.setInitialMovement()
		this.material=material
		this.radius=20
		this.segments=25;
		this.addAlienBody(this.radius, this.segments);
		this.addAlienCockpit(this.radius/2, this.segments);
		scene.add(this)

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
		mesh= new THREE.Mesh(geometry, material)
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
		geometry= new THREE.SphereGeometry(radius, Segments, Segments, 0, Math.PI * 2, 5, 1.8)
		mesh= new THREE.Mesh(geometry, material)
		mesh.position.set(0,2,0)
		this.add(mesh);
	}

	update(delta){
		super.update(delta)


		var distanceAllowedSquared=Math.pow((2*this.radius*0.72),2)
		for (var i = 0; i < alienArray.length; i++){
			if ((distanceAllowedSquared>=Math.pow((alienArray[i].position.x-this.position.x),2) + Math.pow((alienArray[i].position.z-this.position.z),2)) && alienArray[i]!=this){
				this.speed_x=-this.speed_x;
				this.speed_z=-this.speed_z;

			}


		}
		this.position.x+=this.speed_x*delta
		this.position.z+=this.speed_z*delta
	}

	action(){
		this.position.x+=1
	}
}



class spaceShip extends GraphicalEntity{
	constructor(x,y,z){
		super(0,0, x,y,z,20)
		this.material1=new THREE.MeshBasicMaterial({ color: 0x0000ff, wireframe: wireBool});
		materialArray.push(this.material1)
		this.addShipBody();
		this.addShipTop();
		this.addShipFront();
		this.addShipWings();
		this.addShipTail();
		//addFancyStabilizers(ship);

		scene.add(this);
	}

	getAcceleration(){
		return this.acceleration
	}

	setAcceleration(acceleration){
		this.acceleration=acceleration
	}

	getPosition(){
		return this.position;
	}

	addShipBody(){
		//adds the ship body to the ship
		geometry = new THREE.BoxGeometry( 10, 10, 30);
		mesh = new THREE.Mesh(geometry, this.material1);

		this.add(mesh);

	}

	addShipTop(){
		//adds the shield cockpit to the ship

		geometry = new THREE.CylinderGeometry(3.5,4, 10, 10,10,  false, 0, Math.PI);
		material = new THREE.MeshBasicMaterial({ color: 0x00eeee, wireframe: wireBool});
		materialArray.push(material)

		mesh = new THREE.Mesh(geometry, material);

		mesh.rotation.set(-Math.PI, Math.PI/2, -Math.PI/2)
		mesh.position.set(0, 5, 0);

		this.add(mesh);

		geometry = new THREE.ConeGeometry(3.5,5, 10, 1, true, 0, Math.PI);
		mesh = new THREE.Mesh(geometry, material);

		mesh.position.set(0, 5, 7.5)
		mesh.rotation.set(Math.PI/2, Math.PI/2,0);

		this.add(mesh);

		geometry = new THREE.SphereGeometry(4,10, 10, 0,Math.PI, 0 ,Math.PI/2);
		material = new THREE.MeshBasicMaterial({ color: 0xaaaaaa, wireframe: wireBool});
		materialArray.push(material)

		mesh = new THREE.Mesh(geometry, material);

		mesh.rotation.x=-Math.PI/2;
		mesh.position.set(0, 5, -5)

		this.add(mesh);

	}

	addShipFront(){
		//adds an aerodynamic front to the ship
		geometry = new THREE.ConeGeometry( 7, 10, 4);
		mesh = new THREE.Mesh(geometry, this.material1);
		mesh.rotation.set(-Math.PI/2, Math.PI/4,0);
		mesh.position.z=-20;

		this.add(mesh);
	}

	addShipWings(){
		//adds both wings to the ship
		geometry = new THREE.Geometry();
		geometry.vertices.push( new THREE.Vector3( -10,  10, 0 ),
								new THREE.Vector3( -10, -5, 0 ),
								new THREE.Vector3(  5, -5, 0 ),
								new THREE.Vector3(  5, -10, 0),
								new THREE.Vector3( -10, -10, 0)
								);
		geometry.faces.push( new THREE.Face3( 0, 1, 2 ) );
		geometry.faces.push( new THREE.Face3( 2, 3, 4 ) );
		geometry.faces.push( new THREE.Face3( 2, 1, 4 ) );

		mesh = new THREE.Mesh( geometry, this.material1 ) ;
		mesh.rotation.x=-Math.PI/2
		mesh.position.set( 15, 0, 0)
		mesh.material.side=THREE.DoubleSide;

		var mesh2= mesh.clone()
		mesh2.rotation.y=Math.PI
		mesh2.position.set( -15, 0, 0)
		this.add(mesh2);
		this.add(mesh);
	}

	addFancyStabilizers(){
		//adds an ornament to the ship's wings
		geometry = new THREE.Geometry();
		geometry.vertices.push( new THREE.Vector3(  20, 2, 10 ),
								new THREE.Vector3( 20, 0, 5 ) ,
								new THREE.Vector3(  20, 0, 10));

		geometry.faces.push( new THREE.Face3( 0, 1, 2 ) );

		mesh = new THREE.Mesh( geometry, this.material1 ) ;
		mesh.material.side=THREE.DoubleSide;
		var mesh2= mesh.clone()

		mesh2.position.x-=40

		this.add(mesh);

		this.add(mesh2);
	}
	addShipTail(){
		//adds a booster to the ship

		geometry = new THREE.CylinderGeometry( 5, 7, 4, 4, 10, false);
		mesh = new THREE.Mesh(geometry, this.material1);

		mesh.position.z=17;
		mesh.rotation.set(Math.PI,Math.PI/2,Math.PI/2)

		this.add(mesh);
	}


	update(delta){
		super.update(delta)
		//new velocity ( v = v + at )
	this.speed_x+=this.acceleration*delta;
	//new position (x= x0 + vt )
	var newPosShip=this.position.x+this.speed_x*delta;

	//Field limits check
	if(newPosShip < -gameWidth/2+25)
		this.position.x=-gameWidth/2+25;
	else if(newPosShip > gameWidth/2-25)
		this.position.x=gameWidth/2-25;
	else
		this.position.x=newPosShip

	//"air" resistance for terminal speed
	this.speed_x*=0.95
	//ship.userData.velocity=ship.userData.velocity*(delta+0.93);

	//cute thing for ship rotation
	/*if (Math.abs(ship.position.x)>=gameWidth/2-25){
		ship.rotation.z=ship.rotation.z*0.95;
		followingCamera.rotation.z=-ship.rotation.z*0.95}
	else{
		ship.rotation.z=-ship.userData.velocity*Math.PI*0.002;
		followingCamera.rotation.z=-ship.rotation.z*0.95
		}*/


	if (Math.abs(this.speed_x)<3)
		this.speed_x=0;

	}

}

class Bullet extends GraphicalEntity{

	constructor(x,y,z,velx,velz){
		super(velx,velz, x,y,z,5)
		geometry = new THREE.SphereGeometry(5,10,10);
		material = new THREE.MeshBasicMaterial({ color: 0x00eeee, wireframe: wireBool});
		mesh = new THREE.Mesh(geometry, material);
		this.add(mesh);
		scene.add(this);
		this.radius=5
	}

	update(delta){
		var NewPosBullet= this.position.z + this.speed_z*delta;
		if(NewPosBullet<-195)
			scene.remove(this);
		else
			this.position.z = NewPosBullet;
	}


	}
