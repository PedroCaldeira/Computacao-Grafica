/*global THREE*/

var camera, scene, renderer;
var cameraControls; 
var geometry, mesh, material;
var WIDTH=450,HEIGHT=325;



function render(){
	
	'use strict';
	renderer.render(scene, camera);
}

function createField(x, y, z){
	'use strict';
	
	var field = new THREE.Object3D();

	material = new THREE.MeshLambertMaterial({ color: 0x4d4d4d, wireframe: true});
	geometry = new THREE.PlaneGeometry(WIDTH, HEIGHT);
	mesh = new THREE.Mesh(geometry, material);
	mesh.position.set(0, 0, 0);
	field.add(mesh);
	field.rotation.x=-Math.PI/2
	scene.add(field);

	field.position.x = x;
	field.position.y = y;
	field.position.z = z;

}

function createShip(x,y,z){
	'use strict';
	
	var ship = new THREE.Object3D();
	material = new THREE.MeshLambertMaterial({ color: 0xff00ff, wireframe: true});
	addShipBody(ship, material);
	addTurbos(ship, material);
	scene.add(ship);
	ship.position.x = x;
	ship.position.y = y;
	ship.position.z = z;
}

function addShipBody(ship, material){
	geometry = new THREE.BoxGeometry(30, 10, 20);
	mesh = new THREE.Mesh(geometry, material);
	ship.add(mesh)
}

function addTurbos(ship, material){
	var points = [];
	for ( var i = 0; i < 10; i ++ ) {
		points.push( new THREE.Vector2( Math.sin( i * 0.3 ) * 1 + 5, ( i - 5 ) * 0.5 ) );
	}
	
	geometry = new THREE.LatheGeometry(points);
	mesh = new THREE.Mesh( geometry, material );
	mesh.position.set(10,0,15);
	mesh.rotation.x= Math.PI*1.5;
	mesh.material.side = THREE.DoubleSide;
	ship.add(mesh);//TODO:CLONE MESH
	mesh = new THREE.Mesh( geometry, material );
	mesh.position.set(-10,0,15);
	mesh.rotation.x= Math.PI*1.5;
	ship.add(mesh);
}

function createAlien2(x,y,z){
	'use strict'
	var alien= new THREE.Object3D();
	material= new THREE.MeshLambertMaterial({color: 0x00ffff,  wireframe: true});
	var radius=20, segments=25;
	addAlienBody(alien,material, radius, segments);
	addAlienCockpit(alien,material, radius/2, segments);
	

	scene.add(alien);
	alien.position.x = x;
	alien.position.y = y;
	alien.position.z = z;
	alien.rotation.x=Math.PI/2
	
	
}

function addAlienCockpit(obj,material, radius, Segments){
	'use strict'
	geometry= new THREE.SphereGeometry(radius, Segments, Segments, 0, Math.PI * 2, 1.8, 1.6)
	mesh= new THREE.Mesh(geometry, material)
	mesh.position.set(0,10,0)
	obj.add(mesh);
}

function addAlienBody(obj,material, radius, Segments){
	'use strict'
	//top
	geometry= new THREE.SphereGeometry(radius, Segments, Segments,0, Math.PI * 2, 0, 0.8 )
	mesh= new THREE.Mesh(geometry, material)
	mesh.position.set(0,0,0)
	obj.add(mesh);
	//bottom
	geometry= new THREE.SphereGeometry(radius, Segments, Segments,0, Math.PI * 2, 2.32, 0.8 )
	mesh= new THREE.Mesh(geometry, material)
	mesh.position.set(0,25,0)
	obj.add(mesh);
	//mid
	geometry = new THREE.CylinderGeometry(radius*0.72, radius*0.72,3, Segments, 1, false, 0, 2*Math.PI)
	mesh=new THREE.Mesh(geometry, material)
	mesh.position.set(0,12.5,0)
	obj.add(mesh)

}

function createShield(x,y,z){
	'use strict'
	var shield= new THREE.Object3D();
	material= new THREE.MeshLambertMaterial({color: 0x00ff00,  wireframe:true});
	geometry= new THREE.CylinderGeometry(10,10,30);
	mesh = new THREE.Mesh(geometry, material);
	mesh.position.set(x,y,z);
	mesh.rotation.x = Math.PI / 2;
	mesh.rotation.z = Math.PI / 2;
	shield.add(mesh)
	scene.add(shield);
	shield.position.x = x;
	shield.position.y = y;
	shield.position.z = z;
}

function createCamera(x,y,z){

	'use strict';

	camera = new THREE.OrthographicCamera(window.innerWidth/ - 4, window.innerWidth/ 4, window.innerHeight/ 4 , window.innerHeight/ - 4, 1, 1000 );
	

	camera.position.x = x;
	camera.position.y = y;
	camera.position.z = z;
	camera.lookAt(scene.position);
}

function createCamera2(){
	'use strict'
	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 10000 );

	camera.position.z = 200;


	cameraControls = new THREE.TrackballControls( camera );
	cameraControls.target.set( 0, 0, 0 )
}

function createAliens(aliensPerRow, rows){
	var x= WIDTH/(aliensPerRow+1)
	var z= HEIGHT/2/(rows+1)
	for (var r=1; r<=rows; r++ ){
		for (var a=1;a<=aliensPerRow; a++)
			createAlien2(x*a-WIDTH/2, 30, (-HEIGHT/2)+z*r);
	}
}

function createScene(){
	'use strict';
	
	scene = new THREE.Scene();
	
	scene.add(new THREE.AxisHelper(10));
	
	createField(0, 0, 0);

	createShip(0,20,140);

	createAliens(7,4);
	

	createShield(-90,0,30);
	createShield(-30,0,30);
	createShield(30,0,30);
	createShield(90,0,30);
	createLight();

	
}

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

	scene.add(spotLight);*/

}

function onResize(){
	'use strict';
	renderer.setSize(window.innerWidth, window.innerHeight);
	if(window.innerHeight > 0 && window.innerHeight > 0){
		
            camera.left = -window.innerWidth/4;
            camera.right = window.innerWidth/4;
            camera.top = window.innerHeight/4;
            camera.bottom = -window.innerHeight/4 ;
			camera.updateProjectionMatrix();
	}
	
	
	
	
}

function onKeyDown(e){
	'use strict';
	console.log(e.keyCode);
	switch (e.keyCode){
		case 65:
		case 97:
			scene.traverse(function(node){
				if (node instanceof THREE.Mesh) {
					node.material.wireframe=!node.material.wireframe;
				}
			});
			break;
		case 49:
			createCamera(WIDTH/2,0,0);
			break;
		case 50:
			createCamera(0,100,0);
			break;
		case 51:
			createCamera(0,0,HEIGHT/2);
			break;
		case 52:
			createCamera2();
			break;
		case 37://left arrow
		
		
		
		case 39://right arrow
	}
	
}

function init(){
	'use strict';
	
	renderer = new THREE.WebGLRenderer({ antialias: true });
	
	renderer.setSize(window.innerWidth, window.innerHeight);
	
	document.body.appendChild(renderer.domElement);
	
	createScene();
	//createCamera(0,100,0);
	createCamera2();

	

	render();
	window.addEventListener("resize", onResize);
	window.addEventListener("keydown", onKeyDown);

}

function animate() {
'use strict'

	
	cameraControls.update();
	render()
	requestAnimationFrame(animate);

}
