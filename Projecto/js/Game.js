class Game{
	//

	constructor(gameWidth, gameHeight){
		this.initialCamera;
		this.perspectiveCamera;
		this.followingCamera;
		this.currentCamera;
		this.scene;
		this.field;
		this.gameWidth=gameWidth
		this.gameHeight=gameHeight
		this.yLineup=30
		this.clock= new THREE.Clock();
		this.materialArray=[]
		this.collidables=[]
		this.clockBullet=new THREE.Clock();
		this.createScene();
		this.bulletMaterial = new THREE.MeshBasicMaterial({ color: 0x00eeee, wireframe: true});
		this.materialArray.push(this.bulletMaterial);
	}

	createScene(){
		//creates every object; main scene function
		'use strict';
		this.scene = new THREE.Scene();
		this.scene.add(new THREE.AxisHelper(10));

		this.createField(0, 0, 0);
		this.createCameras();

	}
	createField(x, y, z){
		//creates a plane that represents "de" playing field
		'use strict';


		this.field = new THREE.Object3D();

		var material = new THREE.MeshBasicMaterial({ color: 0x5c756b, wireframe: true, side: THREE.DoubleSide});
		this.materialArray.push(material)
		var geometry = new THREE.PlaneGeometry(this.gameWidth, this.gameHeight);

		var mesh = new THREE.Mesh(geometry, material);
		mesh.position.set(0, 0, 0);// field centered

		this.field.add(mesh);
		this.scene.add(this.field);
		//so it gets perpendicular to y axis
		this.field.rotation.x= Math.PI/2;
		this.field.position.set(x,y,z);

		var mainMaterial= new THREE.MeshBasicMaterial({ color: 0x0000ff, wireframe: true})
		var cockpitMaterial= new THREE.MeshBasicMaterial({ color: 0x00ffff, wireframe: true})
		this.materialArray.push(mainMaterial)
		this.materialArray.push(cockpitMaterial)
		this.ship=new spaceShip(1,this.yLineup, 130, mainMaterial, cockpitMaterial)
		this.scene.add(this.ship)
		this.collidables.push(this.ship)
		//createShip(0,yLineup,130);
		this.createAliens(5,3);
		//this.createShields(4);
	}

	createAliens(aliensPerRow, rows){
		//calculates the place of every alien and orders its construction
		var x= this.gameWidth/(aliensPerRow+1)
		var z= this.gameHeight/2/(rows+1)
		var material= new THREE.MeshBasicMaterial({color: 0xff0000,  wireframe: true});
		this.materialArray.push(material)
		for (var r=1; r<=rows; r++ ){
			for (var a=1;a<=aliensPerRow; a++){
				var alien=new Alien(x*a-this.gameWidth/2, this.yLineup, (-this.gameHeight/2)+z*r, material)
				this.scene.add(alien)
				this.collidables.push(alien)
			}

		}
	}

	createShields(nshields){
		var x= this.gameWidth/(nshields+1);
		var material = new THREE.MeshBasicMaterial({color:0x00ff00, wireframe: true});
		this.materialArray.push(material)
		for (var a=1;a<=nshields; a++){
			var shield=new Shield(x*a-this.gameWidth/2, yLineup, 70, material)
			this.collidables.push(shield);
			this.scene.add(shield)
		}
	}

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
		this.createInitialCamera(0,100,0);
		this.createPerspectiveCamera(90,window.innerWidth/window.innerHeight,10,500);
		this.createFollowingCamera(90,window.innerWidth/window.innerHeight,25,600,this.ship);
		this.currentCamera=this.initialCamera;
	}

	createInitialCamera(x,y,z){
		'use strict';
		var windowAspectRatio=window.innerHeight/window.innerWidth;

		//if window height is thiner than the field aspect ratio or something that I can't express
		if(windowAspectRatio>aspectRatio){
			this.initialCamera = new THREE.OrthographicCamera(-this.gameWidth/1.5,this.gameWidth/1.5,this.gameWidth*windowAspectRatio/1.5,-this.gameWidth*windowAspectRatio/1.5, 1, 1000 );
		}
		else{
			this.initialCamera = new THREE.OrthographicCamera(-this.gameHeight/windowAspectRatio/1.5,this.gameHeight/windowAspectRatio/1.5,this.gameHeight/1.5,-this.gameHeight/1.5, 1, 1000 );
		}
		this.initialCamera.position.set(x,y,z);
		this.initialCamera.lookAt(this.scene.position);

		/*cameraControls = new THREE.TrackballControls( camera );
		cameraControls.target.set( 0, 0, 0 )*/
	}

	createPerspectiveCamera(fov,ratio,near,far){
		this.perspectiveCamera = new THREE.PerspectiveCamera(fov,ratio,near,far);
		this.perspectiveCamera.position.set(0,300,200);
		this.perspectiveCamera.lookAt(this.scene.position);
	}

	createFollowingCamera(fov,ratio,near,far,object){
		this.followingCamera = new THREE.PerspectiveCamera(fov,ratio,near,far);
		object.add(this.followingCamera)
		this.followingCamera.position.set(0,50,40)
		this.followingCamera.lookAt(new THREE.Vector3( 0,0,-60))
	}

	shoot(){	
		var bullet=new Bullet(this.ship.position.x,this.ship.position.y,this.ship.position.z-30,0,-200, this.bulletMaterial)
		this.collidables.push(bullet)
		this.scene.add(bullet)
	}
	}	