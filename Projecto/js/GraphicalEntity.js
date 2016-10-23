class GraphicalEntity extends THREE.Object3D{
	constructor(speed_x, speed_z, x,y,z){
		super()
		this.position.set(x,y,z);
		console.log(this.position)
		this.speed_x=speed_x
		this.speed_z=speed_z
	}

	getSpeed(){
		return this.speed_x;
	}
	setSpeed(speed_x, speed_z){
		this.speed_x=speed_x;
		this.speed_z=speed_z;
	}
	update(delta){}
}


class Alien extends GraphicalEntity{
	constructor(x,y,z, material){
		super(0,0, x,y,z)
		this.material=material
		
		var radius=20, segments=25;
		this.addAlienBody(radius, segments);
		this.addAlienCockpit(radius/2, segments);
		scene.add(this)

		//addAlienLandingGear(alien, radius)
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

	}
}


class spaceShip extends GraphicalEntity{
	constructor(x,y,z){
		super(0,0, x,y,z)
		this.acceleration=0
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
		material = new THREE.MeshBasicMaterial({ color: 0x0000ff, wireframe: wireBool});

		mesh = new THREE.Mesh(geometry, material);

		this.add(mesh);

	}

	addShipTop(){
		//adds the shield cockpit to the ship

		geometry = new THREE.CylinderGeometry(3.5,4, 10, 10,10,  false, 0, Math.PI);
		material = new THREE.MeshBasicMaterial({ color: 0x00eeee, wireframe: wireBool});
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
		mesh = new THREE.Mesh(geometry, material);

		mesh.rotation.x=-Math.PI/2;
		mesh.position.set(0, 5, -5)

		this.add(mesh);

	}

	addShipFront(){
		//adds an aerodynamic front to the ship
		geometry = new THREE.ConeGeometry( 7, 10, 4);
		material = new THREE.MeshBasicMaterial({ color: 0x0000ff, wireframe: wireBool});

		mesh = new THREE.Mesh(geometry, material);
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

		material = new THREE.MeshBasicMaterial({ color: 0x0000ff, wireframe: wireBool});

		mesh = new THREE.Mesh( geometry, material ) ;
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

		material = new THREE.MeshBasicMaterial({ color: 0x0000ff, wireframe: wireBool});

		mesh = new THREE.Mesh( geometry, material ) ;
		mesh.material.side=THREE.DoubleSide;
		var mesh2= mesh.clone()

		mesh2.position.x-=40

		this.add(mesh);

		this.add(mesh2);
	}
	addShipTail(){
		//adds a booster to the ship

		geometry = new THREE.CylinderGeometry( 5, 7, 4, 4, 10, false);
		material = new THREE.MeshBasicMaterial({ color: 0x0000ff, wireframe: wireBool});

		mesh = new THREE.Mesh(geometry, material);

		mesh.position.z=17;
		mesh.rotation.set(Math.PI,Math.PI/2,Math.PI/2)

		this.add(mesh);
	}


	update(delta){
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
		super(velx,velz, x,y,z)
		geometry = new THREE.SphereGeometry(5,10,10);
		material = new THREE.MeshBasicMaterial({ color: 0x00eeee, wireframe: wireBool});
		mesh = new THREE.Mesh(geometry, material);
		this.add(mesh);
		scene.add(this);
	}

	update(delta){
		var NewPosBullet= this.position.z + this.speed_z*delta;
		if(NewPosBullet<-195)
			scene.remove(this);
		else
			this.position.z = NewPosBullet;
	}


	}
