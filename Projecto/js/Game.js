class Game{

	constructor(gameWidth, gameHeight){
		this.gameWidth=gameWidth
		this.gameHeight=gameHeight
		this.yLineup=30
		this.clock= new THREE.Clock();
		this.materialArray=[]
		this.collidables=[]
		this.clockBullet=new THREE.Clock();
		this.createScene();
	}

	createScene(){
		//creates every object; main scene function
		'use strict';
		this.scene = new THREE.Scene();
		this.scene.add(new THREE.AxisHelper(10));

		this.createField(0, 0, 0);
		//Don't know if we should create them here or within the createField
		//Did what made more sense to me

		//createShip(0,yLineup,130);

		//createAliens(8,4);
		//createShields(4);

		//createLight();
	}
	createField(x, y, z){
		//creates a plane that represents "de" playing field
		'use strict';


		this.field = new THREE.Object3D();

		this.material = new THREE.MeshBasicMaterial({ color: 0x4d4d4d, wireframe: wireBool});
		this.materialArray.push(this.material)
		this.geometry = new THREE.PlaneGeometry(this.gameWidth, this.gameHeight);

		this.mesh = new THREE.Mesh(this.geometry, this.material);
		this.mesh.position.set(0, 0, 0);// field centered

		this.field.add(this.mesh);
		this.scene.add(this.field);
		//so it gets perpendicular to y axis
		this.field.rotation.x= Math.PI/2;
		this.field.position.set(x,y,z);

		this.ship=new spaceShip(1,yLineup, 130)
		this.collidables.push(this.ship)
		//createShip(0,yLineup,130);
		this.createAliens(5,3);
		this.createShields(4);


	}


	createAliens(aliensPerRow, rows){
		//calculates the place of every alien and orders its construction
		var x= this.gameWidth/(aliensPerRow+1)
		var z= this.gameHeight/2/(rows+1)
		this.material= new THREE.MeshBasicMaterial({color: 0xff0000,  wireframe: wireBool});
		this.materialArray.push(this.material)
		for (var r=1; r<=rows; r++ ){
			for (var a=1;a<=aliensPerRow; a++){
				var alien=new Alien(x*a-this.gameWidth/2, this.yLineup, (-this.gameHeight/2)+z*r, this.material)
				this.collidables.push(this.alien)
				this.alienArray.push(this.alien)
			}

		}
	}

}