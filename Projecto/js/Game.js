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
		var material= new THREE.MeshBasicMaterial({color: 0xff0000,  wireframe: wireBool});
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
		var material = new THREE.MeshBasicMaterial({color:0x00ff00, wireframe: wireBool});
		this.materialArray.push(material)
		for (var a=1;a<=nshields; a++){
			var shield=new Shield(x*a-gameWidth/2, yLineup, 70, material)
			this.collidables.push(shield);
			this.scene.add(shield)
		}
	}


	updateElements(){
		var delta=this.clock.getDelta();

		for (var i = 0; i < this.collidables.length; i++) {
			this.collidables[i].calculatePos(delta)
		}
		for (var i = 0; i < this.collidables.length; i++) {
			for (var j = i+1; j < this.collidables.length; j++) 
				if (this.collidables[i].hasCollision(this.collidables[j])){
					this.collidables[i].processCollision(this.collidables[j])
					this.collidables[j].processCollision(this.collidables[i])
					this.collidables[i].tentativepos_x=this.collidables[i].position.x;
					this.collidables[i].tentativepos_z=this.collidables[i].position.z;
				}
			if (!this.collidables[i].isAlive){
				this.scene.remove(this.collidables[i])
				this.collidables.splice(i,1)
			}
			else{
				this.collidables[i].position.set(this.collidables[i].tentativepos_x,yLineup,this.collidables[i].tentativepos_z)
			}
		}


	}


}