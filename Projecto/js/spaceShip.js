class spaceShip extends GraphicalEntity{
	constructor(x,y,z,materials){
		super(0,0, x,y,z,25, materials)
		//this.cockpitMaterial=this.materials["phongCockpit"]
		this.acceleration=0;
		this.doublematerial=this.materials["phongdouble"]
		this.ship=new THREE.Object3D();
		this.addShipBody(this.ship);
		//this.addShipTop(this.ship);
		this.addShipFront(this.ship);
		this.addShipWings(this.ship);
		this.addShipTail(this.ship);
		this.add(this.ship)

		//addFancyStabilizers(ship);
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

	addShipBody(obj){
		//adds the ship body to the ship
		var geometry = new THREE.Geometry();
		geometry.vertices.push(
								new THREE.Vector3(-5,-5,-15),new THREE.Vector3(-5,5,-15), new THREE.Vector3(5,5,-15), new THREE.Vector3(5,-5,-15),
								new THREE.Vector3(-5,-5,15), new THREE.Vector3(-5,5,15), new THREE.Vector3(5,5,15), new THREE.Vector3(5,-5,15)
		);
		geometry.faces.push(
			new THREE.Face3(0,1,2),new THREE.Face3(2,3,0),new THREE.Face3(1,0,4),new THREE.Face3(1,4,5),new THREE.Face3(2,1,5),new THREE.Face3(2,5,6),
			new THREE.Face3(3,2,6),new THREE.Face3(3,6,7),new THREE.Face3(5,4,6),new THREE.Face3(7,6,4),new THREE.Face3(7,4,3),new THREE.Face3(3,4,0)
		)
		geometry.computeFaceNormals();
		var mesh = new THREE.Mesh(geometry, this.material);
		obj.add(mesh);
	}
/*
	addShipTop(obj){
		//adds the shield cockpit to the ship

		var geometry = new THREE.CylinderGeometry(3.5,4, 10, 10,10,  false, 0, Math.PI);
		var mesh = new THREE.Mesh(geometry, this.cockpitMaterial);

		mesh.rotation.set(-Math.PI, Math.PI/2, -Math.PI/2)
		mesh.position.set(0, 5, 0);

		obj.add(mesh);

		geometry = new THREE.ConeGeometry(3.5,5, 10, 1, true, 0, Math.PI);
		mesh = new THREE.Mesh(geometry, this.cockpitMaterial);

		mesh.position.set(0, 5, 7.5)
		mesh.rotation.set(Math.PI/2, Math.PI/2,0);

		obj.add(mesh);

		geometry = new THREE.SphereGeometry(4,10, 10, 0,Math.PI, 0 ,Math.PI/2);
		mesh = new THREE.Mesh(geometry, this.cockpitMaterial);

		mesh.rotation.x=-Math.PI/2;
		mesh.position.set(0, 5, -5)

		obj.add(mesh);
	}
	*/

	addShipFront(obj){
		//adds an aerodynamic front to the ship
		var geometry = new THREE.Geometry();
		geometry.vertices.push(new THREE.Vector3(-5,-5,-15),new THREE.Vector3(-5,5,-15), new THREE.Vector3(5,5,-15), new THREE.Vector3(5,-5,-15), new THREE.Vector3(0,0,-25));
		geometry.faces.push(new THREE.Face3(0,1,4),new THREE.Face3(1,2,4),new THREE.Face3(2,3,4),new THREE.Face3(3,0,4));
		geometry.computeFaceNormals();
		this.spotLight= new THREE.SpotLight( 0x555555, 5, 300, 1.05, 0.25, 0.5 );
		this.spotLight.position.set( 0,10, -15 );
		this.spotLight.target.position.set(0,0,-100)
		obj.add(this.spotLight.target)


		var mesh = new THREE.Mesh(geometry, this.material);
		mesh.add(this.spotLight)
		obj.add(mesh);
	}

	addShipWings(obj){
		//adds both wings to the ship
		var geometry = new THREE.Geometry();
		geometry.vertices.push( new THREE.Vector3( -10,  10, 0 ),
								new THREE.Vector3( -10, -5, 0 ),
								new THREE.Vector3(  5, -5, 0 ),
								new THREE.Vector3(  5, -10, 0),
								new THREE.Vector3( -10, -10, 0)
								);
		geometry.faces.push( new THREE.Face3( 0, 1, 2 ) );
		geometry.faces.push( new THREE.Face3( 2, 3, 4 ) );
		geometry.faces.push( new THREE.Face3( 2, 1, 4 ) );
		geometry.computeFaceNormals()
		var mesh = new THREE.Mesh( geometry, this.doublematerial ) ;
		mesh.rotation.x=-Math.PI/2
		mesh.position.set( 15, 0, 0)

		var mesh2= mesh.clone()
		mesh2.rotation.y=Math.PI
		mesh2.position.set( -15, 0, 0)
		obj.add(mesh2);
		obj.add(mesh);
	}

	addFancyStabilizers(obj){
		//adds an ornament to the ship's wings
		var geometry = new THREE.Geometry();
		geometry.vertices.push( new THREE.Vector3(  20, 2, 10 ),
								new THREE.Vector3( 20, 0, 5 ) ,
								new THREE.Vector3(  20, 0, 10));

		geometry.faces.push( new THREE.Face3( 0, 1, 2 ) );

		var mesh = new THREE.Mesh( geometry, this.material ) ;
		var mesh2= mesh.clone()

		mesh2.position.x-=40

		obj.add(mesh);

		obj.add(mesh2);
	}
	addShipTail(obj){
		//adds a booster to the ship

		var geometry = new THREE.Geometry();
		geometry.vertices.push(
								new THREE.Vector3(0,5,15),new THREE.Vector3(5,0,15), new THREE.Vector3(0,-5,15), new THREE.Vector3(-5,0,15),
								new THREE.Vector3(0,7,19), new THREE.Vector3(7,0,19), new THREE.Vector3(0,-7,19), new THREE.Vector3(-7,0,19)
		);
		geometry.faces.push(
			new THREE.Face3(0,1,2),new THREE.Face3(2,3,0),new THREE.Face3(0,1,4),new THREE.Face3(4,1,5),new THREE.Face3(1,2,5),new THREE.Face3(2,5,6),
			new THREE.Face3(2,3,6),new THREE.Face3(3,6,7),new THREE.Face3(4,7,3),new THREE.Face3(4,3,0)
		)
		geometry.computeFaceNormals()
		var mesh = new THREE.Mesh(geometry, this.doublematerial);
		obj.add(mesh);
	}

	updateSpeed(delta){
		this.speed_x+=this.acceleration*delta;
		this.speed_x*=0.95
	}

	processCollision(graphEnt){
		console.log("cenas")
		if (graphEnt instanceof Alien){
			this.lifedecrease=true
		}
	}

	calculatePos(delta){
		this.updateSpeed(delta)
		super.calculatePos(delta)
		this.ship.rotation.z=-this.speed_x*Math.PI*0.002;
		if (this.limitsCheck("width"))
			this.tentativepos_x=(gameWidth/2-this.collisionRadius)* Math.sign(this.position.x)
		if (Math.abs(this.speed_x)<3)
			this.speed_x=0;
	}

	getShipGeometry(){
		return this.ship.clone()
	}

	changeMaterial(type){
		this.material=this.materials[type]
		//this.cockpitMaterial=this.materials[type+"Cockpit"];
		for (var i = 0; i < this.ship.children.length-2; i++) {
			this.ship.children[i].material=this.material
		}
		this.ship.children[this.ship.children.length-3].material=this.materials[type+"double"]

		this.ship.children[this.ship.children.length-2].material=this.materials[type+"double"]
		this.ship.children[this.ship.children.length-1].material=this.materials[type+"double"]

	}
	toggleSpotlight(){
		if (this.spotLight.intensity!=0)
			this.spotLight.intensity=0;
		else
			this.spotLight.intensity=5;
	}

}
