class Game{
	//

	constructor(gameWidth, gameHeight){
		this.stars=[]	
		this.gameWidth=gameWidth
		this.gameHeight=gameHeight
		this.yLineup=30
		this.clock= new THREE.Clock();
		this.materialArray=[]
		this.collidables=[]
		this.clockBullet=new THREE.Clock();
		this.bulletMaterials={}
		this.createScene();
		cameraControls = new THREE.TrackballControls( this.debugCamera );
		cameraControls.target.set( 0, 0, 0 )
	}

	createScene(){
		//creates every object; main scene function
		'use strict';
		this.scene = new THREE.Scene();
		this.scene.add(new THREE.AxisHelper(10));
		this.initializeStuff();
		this.createField(0, 0, 0);
		this.createCameras();
		this.createLighting()

	}

	initializeStuff(){

		this.bulletMaterials["phong"] = new THREE.MeshPhongMaterial({ color: 0x00eeee, wireframe: true});
		this.bulletMaterials["gouraud"]= new THREE.MeshLambertMaterial({ color: 0x00eeee, wireframe: true});
		this.bulletMaterials["basic"]= new THREE.MeshBasicMaterial({ color: 0x00eeee, wireframe: true});
		for(var i in this.bulletMaterials){
			this.materialArray.push(this.bulletMaterials[i]);
		}
	}
	createField(x, y, z){
		//creates a plane that represents "de" playing field
		'use strict';

		var materials={}
		this.field = new THREE.Object3D();

		materials["phong"] = new THREE.MeshPhongMaterial({ color: 0x5c756b, wireframe: true, side: THREE.DoubleSide});
		materials["gouraud"] = new THREE.MeshLambertMaterial({ color: 0x5c756b, wireframe: true, side: THREE.DoubleSide});
		materials["basic"] = new THREE.MeshBasicMaterial({ color: 0x5c756b, wireframe: true, side: THREE.DoubleSide});
		for( var i in materials){
			this.materialArray.push(materials[i])
		}
		this.fieldMaterials=materials;
		var geometry = new THREE.PlaneGeometry(this.gameWidth, this.gameHeight);

		var mesh = new THREE.Mesh(geometry,materials["phong"]);
		mesh.position.set(0, 0, 0);// field centered

		this.field.add(mesh);
		this.scene.add(this.field);
		//so it gets perpendicular to y axis
		this.field.rotation.x= Math.PI/2;
		this.field.position.set(x,y,z);

		this.createShip(0,this.yLineup,130);

		
		this.createAliens(5,3);
		//this.createShields(4);
	}

	createShip(x,y,z){
		var materials={}
		materials["phong"]= new THREE.MeshPhongMaterial({ color: 0x0000ff, wireframe: true, side: THREE.DoubleSide})
		//var pcockpitMaterial= new THREE.MeshPhongMaterial({ color: 0x00ffff, wireframe: true, side: THREE.DoubleSide})
		materials["gouraud"]= new THREE.MeshLambertMaterial({ color: 0x0000ff, wireframe: true, side: THREE.DoubleSide})
		//var gcockpitMaterial= new THREE.MeshLambertMaterial({ color: 0x00ffff, wireframe: true, side: THREE.DoubleSide})
		materials["basic"]= new THREE.MeshBasicMaterial({ color: 0x0000ff, wireframe: true, side: THREE.DoubleSide})


		for( var i in materials){
			this.materialArray.push(materials[i])
		}

		this.ship=new spaceShip(x,y,z, materials)
		this.scene.add(this.ship)
		this.collidables.push(this.ship)
	}

	createAliens(aliensPerRow, rows){
		//calculates the place of every alien and orders its construction
		var x= this.gameWidth/(aliensPerRow+1)
		var z= this.gameHeight/2/(rows+1)
		var materials= {}
		materials["phong"]= new THREE.MeshPhongMaterial({color: 0xff0000,  wireframe: true, side: THREE.DoubleSide});
		materials["gouraud"]= new THREE.MeshLambertMaterial({color: 0xff0000,  wireframe: true, side: THREE.DoubleSide});
		materials["basic"]= new THREE.MeshBasicMaterial({color: 0xff0000,  wireframe: true, side: THREE.DoubleSide});
		materials["phongCockpit"]= new THREE.MeshPhongMaterial({color: 0x00ff00,  wireframe: true, side: THREE.DoubleSide});
		materials["gouraudCockpit"]= new THREE.MeshLambertMaterial({color: 0x00ff00,  wireframe: true, side: THREE.DoubleSide});
		materials["basicCockpit"]= new THREE.MeshBasicMaterial({color: 0x00ff00,  wireframe: true, side: THREE.DoubleSide});
		
		for( var i in materials){
			this.materialArray.push(materials[i])
		}

		for (var r=1; r<=rows; r++ ){
			for (var a=1;a<=aliensPerRow; a++){
				var alien=new Alien(x*a-this.gameWidth/2, this.yLineup, (-this.gameHeight/2)+z*r, materials)
				this.scene.add(alien)
				this.collidables.push(alien)
			}

		}
	}

/*	createShields(nshields){
		var x= this.gameWidth/(nshields+1);
		var material = new THREE.MeshBasicMaterial({color:0x00ff00, wireframe: true});
		this.materialArray.push(material)
		for (var a=1;a<=nshields; a++){
			var shield=new Shield(x*a-this.gameWidth/2, yLineup, 70, material)
			this.collidables.push(shield);
			this.scene.add(shield)
		}
	}
	*/

	wireChange(){
		for (var i = 0; i < this.materialArray.length; i++) {
			this.materialArray[i].wireframe=!this.materialArray[i].wireframe
		}
	}


	updateElements(){
		var delta=this.clock.getDelta();

		for (var i = 0; i < this.collidables.length; i++) {
			this.collidables[i].calculatePos(delta)
		}
		for (var i = 0; i < this.collidables.length; i++) {
			for (var j = i+1; j < this.collidables.length; j++){ 
				if (this.collidables[i].hasCollision(this.collidables[j])){
					this.collidables[i].processCollision(this.collidables[j])
					this.collidables[j].processCollision(this.collidables[i])
				}
			}
			if (!this.collidables[i].isAlive){
				this.scene.remove(this.collidables[i])
				this.collidables.splice(i,1)
				i-=1

			}
			else{
				this.collidables[i].position.set(this.collidables[i].tentativepos_x,this.yLineup,this.collidables[i].tentativepos_z)
			}
		}


	}

	createCameras(){
		this.initialCamera=this.createOrthographicCamera(0,100,0, this.gameWidth, this.gameHeight);
		this.perspectiveCamera =this.createPerspectiveCamera(90,window.innerWidth/window.innerHeight,10,500, 0, 300, 200);
		this.followingCamera= this.createPerspectiveCamera(90,window.innerWidth/window.innerHeight,25,600, 0, 50, 40);
		this.followingCamera.lookAt(new THREE.Vector3( 0,0,-60))
		this.ship.add(this.followingCamera)
		this.debugCamera=this.createPerspectiveCamera(90,window.innerWidth/window.innerHeight,25,600, 0, 0, 200);
		this.currentCamera=this.initialCamera;
	}

	createOrthographicCamera(x,y,z,Width,Height){
		'use strict';
		var windowAspectRatio=window.innerHeight/window.innerWidth;
		var camera;
		//if window height is thiner than the field aspect ratio or something that I can't express
		if(windowAspectRatio>aspectRatio){
			camera = new THREE.OrthographicCamera(-Width/1.5,Width/1.5,Width*windowAspectRatio/1.5,-Width*windowAspectRatio/1.5, 1, 1000 );
		}
		else{
			camera = new THREE.OrthographicCamera(-Height/windowAspectRatio/1.5,Height/windowAspectRatio/1.5,Height/1.5,-Height/1.5, 1, 1000 );
		}
		camera.position.set(x,y,z);
		camera.lookAt(this.scene.position);
		return camera		
	}

	createPerspectiveCamera(fov,ratio,near,far,x,y,z){
		var camera = new THREE.PerspectiveCamera(fov,ratio,near,far);
		camera.position.set(x,y,z);
		camera.lookAt(this.scene.position);
		return camera
		
	}
	changeCamera(cameraNumber){
		if (cameraNumber==1)
			this.currentCamera=this.initialCamera
		else if (cameraNumber==2)
			this.currentCamera=this.perspectiveCamera
		else if (cameraNumber==3)
			this.currentCamera=this.followingCamera
		else if (cameraNumber==4)
			this.currentCamera=this.debugCamera
	}

	createLighting(){
		this.createSun();
		this.createStars();
	}

	createSun(){
		this.sun= new THREE.DirectionalLight( 0xffffff, 0.8 );
		this.sun.position.set(200,200,0)
		this.sun.target= this.field;
		this.scene.add(this.sun)
	}

	createStars(){
		for(var i =0; i<6;i++){
			this.stars.push(new THREE.PointLight( 0xffffff, 0.1 ))
		}
		
		for(var i =0; i<6;i++){
			this.stars[i].position.set(Math.floor(Math.random()*gameWidth)- gameWidth/2,Math.floor(Math.random()*200)-100,Math.floor(Math.random()*gameHeight)- gameHeight/2)
			//var geometry = new THREE.SphereGeometry(4,10, 10);
			//var mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: 0x00eeee, wireframe: true}));
			//this.stars[i].add(mesh)
			this.stars[i].target=this.field;
			this.scene.add(this.stars[i])
		}
}

	shoot(illutype){
		var bullet=new Bullet(this.ship.position.x,this.ship.position.y,this.ship.position.z-30,0,-200, this.bulletMaterials, illutype)
		this.collidables.push(bullet)
		this.scene.add(bullet)
	}

	changeMaterials(type){
		this.field.children[0].material=this.fieldMaterials[type]
		for (var i = 0; i < this.collidables.length; i++) {
			this.collidables[i].changeMaterial(type)
			}
	}

	chichiCama(){
		if(this.sun.intensity!=0)
			this.sun.intensity=0;
		else
			this.sun.intensity=0.8
	}

//http://www.nestle-ea.com/asset-library/PublishingImages/our%20countries/Estrelitas.png
	chichiCamaEstrelitas(){
		for(var i=0;i<this.stars.length;i++){
			if(this.stars[i].intensity!=0)
				this.stars[i].intensity=0;
			else
				this.stars[i].intensity=0.1
		}
	}
}	