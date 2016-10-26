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
var clockBullet;
var materialArray=[]
var alienArray=[]
var BulletArray=[]
var collidables=[]
var B_up = true;
var clock;
var delta;
var followingCamera
var first=true;
var game;


function render(){
	'use strict';
	renderer.render(game.scene, camera);
}

function animate() {
	//animation function
	'use strict'
	game.updateElements();
//	cameraControls.update();
	render()
	requestAnimationFrame(animate);

}

function init(){
	//initial function, called upon page load
	'use strict';
	
	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);
	//game.js vv
	game=new Game(600,400)
	createFollowingCamera(90,window.innerWidth/window.innerHeight,25,600,game.ship);
	createCamera(0,100,0);
	//createScenery();
	//game.js ^^
	render();

	window.addEventListener("resize", onResize);
	window.addEventListener("keydown", onKeyDown);
	window.addEventListener("keyup", onKeyUp);

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
	camera.lookAt(game.scene.position);

	/*cameraControls = new THREE.TrackballControls( camera );
	cameraControls.target.set( 0, 0, 0 )*/
}

function createPerspectiveCamera(fov,ratio,near,far){
	camera = new THREE.PerspectiveCamera(fov,ratio,near,far);
	camera.position.set(0,300,200);
	camera.lookAt(game.scene.position);
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
								Key Events
---------------------------------------------------------------------------------
*/

function onKeyDown(e){
	'use strict';
	console.log(e.keyCode);
	switch (e.keyCode){

		case 65:
		case 97://pressed "A/a" toggled wireframes
		/*
			scene.traverse(function(node){			//we could also change the materials one by one.
				if (node instanceof THREE.Mesh) {	//We'd have to add every material to an array tho...
					node.material.wireframe=!wireBool;//PEDRO: MAY BE NECESSARY FOR COLLISIONS, DON'T KNOW YET
				}
			});
			wireBool=!wireBool*/
			for (var i = 0; i < game.materialArray.length; i++) {
				game.materialArray[i].wireframe=!wireBool
			}
			wireBool=!wireBool
			break;


		case 49: //pressed "1" Change camera (defaultCamera)
			createCamera(0,100,0);
			break;


		case 50://pressed "2" Change camera (default camera)
			createPerspectiveCamera(90,window.innerWidth/window.innerHeight,10,500);
			break;


		case 51://pressed "3" Change camera
			camera=followingCamera
			break;


		case 37://left arrow
			if(game.ship.getAcceleration()!=-500)
				game.ship.setAcceleration(-500);
			break;


		case 39://right arrow
			if(game.ship.getAcceleration()!=500)
				game.ship.setAcceleration(500);
			break;
		case 66://B
			delta=game.clockBullet.getDelta();
			if((delta>0.1 && B_up)||first){
				first=false;
				B_up=false;
				var bullet=new Bullet(game.ship.position.x,game.ship.position.y,game.ship.position.z-30,0,-200)
				game.collidables.push(bullet)
				game.scene.add(bullet)
				}
			break;
	}

}

function onKeyUp(e){
	'use strict';
	switch(e.keyCode){
		case 37://left arrow
			if(game.ship.getAcceleration()!=500)
				game.ship.setAcceleration(0);

			break;

		case 39://right arrow
			if(game.ship.getAcceleration()!=-500)
				game.ship.setAcceleration(0);
			break;
		 case 66:
		 	B_up=true;
		 	break;

	}
}


function onResize(){
	'use strict';

	var windowAspectRatio=window.innerHeight/window.innerWidth;
	renderer.setSize(window.innerWidth, window.innerHeight);
	if (camera instanceof THREE.OrthographicCamera){
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
		}
		
	}
	else if (camera instanceof THREE.PerspectiveCamera)
		camera.aspect=1/windowAspectRatio
		
	
	camera.updateProjectionMatrix();
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
