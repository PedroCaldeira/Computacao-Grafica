/*global THREE*/
var wireBool=true
var camera, scene, renderer;
//var cameraControls;
var geometry, mesh, material;
var gameHeight=400;
var gameWidth=600;
var aspectRatio=gameHeight/gameWidth;
var yLineup=30; //height of floating stuff above the field
var ship;
var bullet;
var alienArray=[]
var BulletArray=[]
var clock;
var delta;
var followingCamera



function render(){
	'use strict';
	renderer.render(scene, camera);
}

function animate() {
	//animation function
	'use strict'
	updateElements();
//	cameraControls.update();
	render()
	requestAnimationFrame(animate);

}

function init(){
	//initial function, called upon page load
	'use strict';
	clock= new THREE.Clock();
	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	createScene();
	createFollowingCamera(90,2,25,600,ship);
	createCamera(0,100,0);
	//createScenery();
	render();

	window.addEventListener("resize", onResize);
	window.addEventListener("keydown", onKeyDown);
	window.addEventListener("keyup", onKeyUp);

}


function updateElements(){
	delta=clock.getDelta();
	for (var i = 0; i < alienArray.length; i++) {
		alienArray[i].update(delta)
	}
	for (var i = 0; i < BulletArray.length; i++) {
		BulletArray[i].update(delta)
	}
	ship.update(delta)
}

/*
---------------------------------------------------------------------------------
									Scene Creation
---------------------------------------------------------------------------------
*/


function createScene(){
	//creates every object; main scene function
	'use strict';
	scene = new THREE.Scene();
	scene.add(new THREE.AxisHelper(10));

	createField(0, 0, 0);
	//Don't know if we should create them here or within the createField
	//Did what made more sense to me

	//createShip(0,yLineup,130);

	//createAliens(8,4);
	//createShields(4);

	//createLight();
}
/*
---------------------------------------------------------------------------------
									Field Creation
---------------------------------------------------------------------------------
*/

function createField(x, y, z){
	//creates a plane that represents "de" playing field
	'use strict';


	var field = new THREE.Object3D();

	material = new THREE.MeshBasicMaterial({ color: 0x4d4d4d, wireframe: wireBool});
	geometry = new THREE.PlaneGeometry(gameWidth, gameWidth*aspectRatio);

	mesh = new THREE.Mesh(geometry, material);
	mesh.position.set(0, 0, 0);// field centered

	field.add(mesh);
	scene.add(field);
	//so it gets perpendicular to y axis
	field.rotation.x= Math.PI/2;
	field.position.set(x,y,z);

	ship=new spaceShip(1,yLineup, 130)
	//createShip(0,yLineup,130);
	createAliens(5,3);
	createShields(4);


}

/*
---------------------------------------------------------------------------------
								Alien Creation
---------------------------------------------------------------------------------
*/

function createAliens(aliensPerRow, rows){
	//calculates the place of every alien and orders its construction
	var x= gameWidth/(aliensPerRow+1)
	var z= gameWidth*aspectRatio/2/(rows+1)
	material= new THREE.MeshBasicMaterial({color: 0xff0000,  wireframe: wireBool});

	for (var r=1; r<=rows; r++ ){
		for (var a=1;a<=aliensPerRow; a++){
			alienArray.push(new Alien(x*a-gameWidth/2, yLineup, (-gameWidth*aspectRatio/2)+z*r, material))
			//alienArray.push(createAlien2(x*a-gameWidth/2, yLineup, (-gameWidth*aspectRatio/2)+z*r))
		}

	}
}




function createCamera(x,y,z){
	'use strict';
	var windowAspectRatio=window.innerHeight/window.innerWidth;

	//if window height is thiner than the field aspect ratio or something that I can't express
	if(windowAspectRatio>aspectRatio){
		camera = new THREE.OrthographicCamera(-gameWidth/1.5,gameWidth/1.5,gameWidth*windowAspectRatio/1.5,-gameWidth*windowAspectRatio/1.5, 1, 1000 );
	}
	else{
		camera = new THREE.OrthographicCamera(-gameHeight/windowAspectRatio/1.5,gameHeight/windowAspectRatio/1.5,gameHeight/1.5,-gameHeight/1.5, 1, 1000 );
	}
	camera.position.set(x,y,z);
	camera.lookAt(scene.position);

	/*cameraControls = new THREE.TrackballControls( camera );
	cameraControls.target.set( 0, 0, 0 )*/
}

function createPerspectiveCamera(fov,ratio,near,far){
	camera = new THREE.PerspectiveCamera(fov,ratio,near,far);
	camera.position.set(0,300,200);
	camera.lookAt(scene.position);
}

function createFollowingCamera(fov,ratio,near,far,object){
	followingCamera = new THREE.PerspectiveCamera(fov,ratio,near,far);
	object.add(followingCamera)
	followingCamera.position.set(0,50,40)
	followingCamera.lookAt(new THREE.Vector3( 0,0,-60))
}

/*function createCamera2(){
	//auxiliary camera for modelling purposes, must be activated by the user
	'use strict'
	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 10000 );
	camera.position.z = 200;
	cameraControls = new THREE.TrackballControls( camera );
	cameraControls.target.set( 0, 0, 0 )
}*/


/*
---------------------------------------------------------------------------------
								Shield Creation
---------------------------------------------------------------------------------
*/

function createShields(nshields){
	var x= gameWidth/(nshields+1);
	for (var a=1;a<=nshields; a++)
		createShield(x*a-gameWidth/2, yLineup, 70);
}


function createShield(x,y,z){
	'use strict';
	var shield = new THREE.Object3D();
	material = new THREE.MeshBasicMaterial({color:0x00ff00, wireframe: wireBool});
	var wallDistance=40, wallThickness=15;
	addShieldWalls(shield,wallDistance, wallThickness);
	addShieldEdges(shield, wallDistance, wallThickness)
	addShieldRoof(shield, wallDistance, wallThickness);
	scene.add(shield);
	shield.position.set(x,y,z);
}


function addShieldWalls(object, distance, wallThickness){
	'use strict'
	geometry=new THREE.CubeGeometry(wallThickness,wallThickness,wallThickness*2);
	mesh=new THREE.Mesh(geometry, material);
	var mesh2=mesh.clone()
	mesh.position.set(-distance/2, 0, 0)
	mesh2.position.set(distance/2, 0, 0)
	object.add(mesh2)
	object.add(mesh);
}


function addShieldEdges(object, distance, wallThickness){
	'use strict'
	geometry=new THREE.CubeGeometry(Math.sqrt(2*wallThickness*wallThickness),wallThickness,Math.sqrt(2*wallThickness*wallThickness));
	mesh=new THREE.Mesh(geometry, material);
	mesh.rotation.y=Math.PI/4
	mesh.position.set(-distance/2+wallThickness/2, 0, -wallThickness)
	var mesh2=mesh.clone()
	mesh2.position.set(distance/2-wallThickness/2, 0, -wallThickness)
	object.add(mesh)
	object.add(mesh2)
}

function addShieldRoof(object, distance, wallThickness){
	'use strict'
	geometry=new THREE.CubeGeometry(distance-wallThickness,wallThickness,wallThickness);
	mesh=new THREE.Mesh(geometry, material);
	mesh.position.set(0, 0, -wallThickness*1.5)
	object.add(mesh)
}



/*
---------------------------------------------------------------------------------
								Key Events
---------------------------------------------------------------------------------
*/

function onKeyDown(e){
	'use strict';
	console.log(e.keyCode);
	switch (e.keyCode){

		case 65:
		case 97://pressed "A/a" toggled wireframes
			scene.traverse(function(node){			//we could also change the materials one by one.
				if (node instanceof THREE.Mesh) {	//We'd have to add every material to an array tho...
					node.material.wireframe=!wireBool;//PEDRO: MAY BE NECESSARY FOR COLLISIONS, DON'T KNOW YET
				}
			});
			wireBool=!wireBool
			break;


		case 49: //pressed "1" Change camera (defaultCamera)
			createCamera(0,100,0);
			break;


		case 50://pressed "2" Change camera (default camera)
			createPerspectiveCamera(90,2,10,500);
			break;


		case 51://pressed "3" Change camera
			camera=followingCamera
			break;


		case 37://left arrow
			if(ship.getAcceleration()!=-500)
				ship.setAcceleration(-500);
			break;


		case 39://right arrow
			if(ship.getAcceleration()!=500)
				ship.setAcceleration(500);
			break;
		case 66://B
			BulletArray.push(new Bullet(ship.position.x,ship.position.y,ship.position.z-25,0,-200))
			break;
	}

}

function onKeyUp(e){
	'use strict';
	switch(e.keyCode){
		case 37://left arrow
			if(ship.getAcceleration()!=500)
				ship.setAcceleration(0);

			break;

		case 39://right arrow
			if(ship.getAcceleration()!=-500)
				ship.setAcceleration(0);
			break;
	}
}


function onResize(){
	'use strict';

	var windowAspectRatio=window.innerHeight/window.innerWidth;
	renderer.setSize(window.innerWidth, window.innerHeight);

	if(window.innerWidth > 0 && window.innerHeight > 0){ //kinda dull check

		//if window height is thiner than the field aspect ratio
		if (windowAspectRatio<=aspectRatio){
			camera.left = -gameHeight/windowAspectRatio/1.5;
            camera.right = gameHeight/windowAspectRatio/1.5;;
            camera.top = gameHeight/1.5;
            camera.bottom = -gameHeight /1.5;

		}
		//otherwise
		else{
			camera.left = -gameWidth/1.5;
            camera.right = gameWidth/1.5;
            camera.top = gameWidth*windowAspectRatio/1.5;
            camera.bottom = -gameWidth*windowAspectRatio/1.5;


		}
		camera.updateProjectionMatrix();
	}
}


/*
---------------------------------------------------------------------------------
							Extra (nao é para a 1a entrega)
---------------------------------------------------------------------------------


/*
---------------------------------------------------------------------------------
								Lighting
---------------------------------------------------------------------------------

function createLight(){
	ambientLight = new THREE.AmbientLight(0xffffff);
    scene.add(ambientLight);
/*

	var spotLight = new THREE.SpotLight(0xffffff, 1, 100000, Math.PI/2, 0, 0);

	spotLight.position.set(250,100,0);
	spotLight.castShadow = true;

	spotLight.shadow.mapSize.width = 1024;
	spotLight.shadow.mapSize.height = 1024;

	spotLight.shadow.camera.near = 500;
	spotLight.shadow.camera.far = 4000;
	spotLight.shadow.camera.fov = 90;

	scene.add(spotLight);
	}
*/

/*
function createScenery(){
	var texture=THREE.ImageUtils.loadTexture("./stars.jpg");
	texture.wrapS=THREE.RepeatWrapping;
	texture.wrapT=THREE.RepeatWrapping;
	texture.repeat.set(6,6);
	material=new THREE.MeshBasicMaterial({map : texture, color : 0xffffff, wireframe: true });
	var world = new THREE.Mesh(new THREE.SphereGeometry(800, 64,64 ), material);
	world.material.side =THREE.DoubleSide;

	scene.add(world)

}
*/
