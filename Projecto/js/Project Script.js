/*global THREE*/
var renderer;
//var cameraControls;
var gameHeight=400;
var gameWidth=600;
var aspectRatio=gameHeight/gameWidth;
var bullet;
var clockBullet;
var materialArray=[]
var collidables=[]
var B_up = true;
var delta;
var first=true;
var game;


function render(){
	'use strict';
	renderer.render(game.scene, game.currentCamera);
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
	//createScenery();
	//game.js ^^
	render();

	window.addEventListener("resize", onResize);
	window.addEventListener("keydown", onKeyDown);
	window.addEventListener("keyup", onKeyUp);

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
		case 97:
			game.wireChange()
			break;


		case 49: //pressed "1" Change game.currentCamera (defaultCamera)
			game.currentCamera=game.initialCamera;
			onResize();
			break;


		case 50://pressed "2" Change game.currentCamera (default game.currentCamera)
			game.currentCamera=game.perspectiveCamera;
			onResize();
			break;


		case 51://pressed "3" Change game.currentCamera
			game.currentCamera=game.followingCamera;
			onResize();
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
				game.shoot();
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
	if (game.currentCamera instanceof THREE.OrthographicCamera){
		if(window.innerWidth > 0 && window.innerHeight > 0){ //kinda dull check

			//if window height is thiner than the field aspect ratio
			if (windowAspectRatio<=aspectRatio){
				game.currentCamera.left = -gameHeight/windowAspectRatio/1.5;
	            game.currentCamera.right = gameHeight/windowAspectRatio/1.5;;
	            game.currentCamera.top = gameHeight/1.5;
	            game.currentCamera.bottom = -gameHeight /1.5;

			}
			//otherwise
			else{
				game.currentCamera.left = -gameWidth/1.5;
	            game.currentCamera.right = gameWidth/1.5;
	            game.currentCamera.top = gameWidth*windowAspectRatio/1.5;
	            game.currentCamera.bottom = -gameWidth*windowAspectRatio/1.5;
			}
		}
		
	}
	else if (game.currentCamera instanceof THREE.PerspectiveCamera)
		game.currentCamera.aspect=1/windowAspectRatio
		
	
	game.currentCamera.updateProjectionMatrix();
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

	spotLight.shadow.game.currentCamera.near = 500;
	spotLight.shadow.game.currentCamera.far = 4000;
	spotLight.shadow.game.currentCamera.fov = 90;

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
