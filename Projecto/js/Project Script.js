/*global THREE*/

var camera, scene, renderer;
var cameraControls;
var geometry, mesh, material;
var aspectRatio=window.innerHeight/window.innerWidth;
var VIEWSIZE=600;
var yLineup=30;
var ship;
var alienArray=[]

function render(){
	'use strict';
	renderer.render(scene, camera);
}

function createScene(){
	'use strict';
	scene = new THREE.Scene();
	scene.add(new THREE.AxisHelper(10));

	createField(0, 0, 0);

	createShip(0,20,130);

	createAliens(7,4);
	createShields(4);
	createLight();
}

function createField(x, y, z){
	'use strict';

	var field = new THREE.Object3D();
	material = new THREE.MeshLambertMaterial({ color: 0x4d4d4d, wireframe: true});
	geometry = new THREE.PlaneGeometry(VIEWSIZE, VIEWSIZE*aspectRatio);
	mesh = new THREE.Mesh(geometry, material);
	mesh.position.set(0, 0, 0);
	field.add(mesh);
	field.rotation.x=Math.PI/2
	scene.add(field);
	field.position.set(x,y,z);

}


function createShip(x,y,z){
	'use strict';

	ship = new THREE.Object3D();
	ship.userData = { velocity: 0, acceleration:0};
	material = new THREE.MeshLambertMaterial({ color: 0x0000ff, wireframe: true});
	addShipBody(ship, material);
	addShipTop(ship, material);
	addShipFront(ship, material);
	addShipWings(ship, material);
	addShipTail(ship, material);
	addFancyStabilizers(ship);
	scene.add(ship);
	ship.position.set(x,y,z);
}

function addShipBody(ship, material){
	geometry = new THREE.BoxGeometry( 10, 30, 10);

	mesh = new THREE.Mesh(geometry, material);

	ship.add(mesh);
	mesh.rotation.set(0,Math.PI/2,Math.PI/2)

}
function addShipTop(ship, material){
	geometry = new THREE.CylinderGeometry(3.5,4, 10, 10,10,  false, 0, Math.PI);
	material = new THREE.MeshLambertMaterial({ color: 0x00eeee, wireframe: true});
	mesh = new THREE.Mesh(geometry, material);
	mesh.rotation.set(-Math.PI, Math.PI/2, -Math.PI/2)
	mesh.position.set(0, 5, 0);
	ship.add(mesh);
	geometry = new THREE.ConeGeometry(3.5,5, 10, 1, true, 0, Math.PI);
	mesh = new THREE.Mesh(geometry, material);
	mesh.position.set(0, 5, 7.5)
	mesh.rotation.set(Math.PI/2, Math.PI/2,0);
	ship.add(mesh);
	geometry = new THREE.SphereGeometry(4,10, 10, 0,Math.PI, 0 ,Math.PI/2);
	material = new THREE.MeshLambertMaterial({ color: 0x000000, wireframe: true});
	mesh = new THREE.Mesh(geometry, material);
	mesh.rotation.x=-Math.PI/2;
	mesh.position.set(0, 5, -5)
	ship.add(mesh);

}
function addShipFront(ship, material){
	geometry = new THREE.ConeGeometry( 7, 10, 4);
	mesh = new THREE.Mesh(geometry, material);
	mesh.rotation.set(-Math.PI/2, Math.PI/4,0);
	mesh.position.z=-20;
	ship.add(mesh);
}
function addShipWings(ship, material){
	/*FIX ME I'M Broken*/
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

	geometry.computeFaceNormals();
	mesh = new THREE.Mesh( geometry, material ) ;
	mesh.rotation.x=-Math.PI/2
	mesh.position.set( 15, 0, 0)
	mesh.material.side=THREE.DoubleSide;
	var mesh2= mesh.clone()
	mesh2.rotation.y=Math.PI
	mesh2.position.set( -15, 0, 0)
	ship.add(mesh2);
	ship.add(mesh);
}

function addFancyStabilizers(ship){
	geometry = new THREE.Geometry();
	geometry.vertices.push( new THREE.Vector3(  20, 2, 10 ),
							new THREE.Vector3( 20, 0, 5 ) ,
							new THREE.Vector3(  20, 0, 10));

	geometry.faces.push( new THREE.Face3( 0, 1, 2 ) );
	mesh = new THREE.Mesh( geometry, material ) ;
	mesh.material.side=THREE.DoubleSide;
	var mesh2= mesh.clone()
	mesh2.position.x-=40
	ship.add(mesh);
	ship.add(mesh2);
}

function addShipTail(ship, material){
	geometry = new THREE.CylinderGeometry( 5, 7, 4, 4, 10, false);
	mesh = new THREE.Mesh(geometry, material);
	mesh.position.z=17;
	mesh.rotation.set(Math.PI,Math.PI/2,Math.PI/2)
	ship.add(mesh);
}


function createAlien2(x,y,z){
	'use strict'
	var alien= new THREE.Object3D();
	material= new THREE.MeshLambertMaterial({color: 0x00ffff,  wireframe: true});
	var radius=20, segments=25;
	addAlienBody(alien, radius, segments);
	addAlienCockpit(alien, radius/2, segments);

	scene.add(alien);
	alien.position.set(x,y,z);
	alien.rotation.x=Math.PI/2
	//alien.material.wireframe=false
	return alien

}

function addAlienCockpit(obj, radius, Segments){
	'use strict'
	geometry= new THREE.SphereGeometry(radius, Segments, Segments, 0, Math.PI * 2, 1.8, 1.6)
	mesh= new THREE.Mesh(geometry, material)
	mesh.position.set(0,10,0)
	obj.add(mesh);
}

function addAlienBody(obj, radius, Segments){
	'use strict'
	//top
	geometry= new THREE.SphereGeometry(radius, Segments, Segments,0, Math.PI * 2, 0, 0.8 )
	mesh= new THREE.Mesh(geometry, material)
	var mesh2=mesh.clone()
	mesh.position.set(0,0,0)
	obj.add(mesh);
	//bottom
	mesh2.rotation.x=Math.PI
	mesh2.position.set(0,25,0)
	obj.add(mesh2);
	//mid
	geometry = new THREE.CylinderGeometry(radius*0.72, radius*0.72,3, Segments, 1, false, 0, 2*Math.PI)
	mesh=new THREE.Mesh(geometry, material)
	mesh.position.set(0,12.5,0)
	obj.add(mesh)

}



function createShield(x,y,z){
	'use strict';
	var shield = new THREE.Object3D();
	material = new THREE.MeshLambertMaterial({color:0x00ff00, wireframe:true});
	var wallDistance=40, wallThickness=15;
	addShieldWalls(shield,wallDistance, wallThickness);
	addShieldEdges(shield, wallDistance, wallThickness)
	addShieldRoof(shield, wallDistance, wallThickness);
	scene.add(shield);
	shield.position.set(x,y,z);
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

function addShieldRoof(object, distance, wallThickness){
	'use strict'
	geometry=new THREE.CubeGeometry(distance-wallThickness,wallThickness,wallThickness);
	mesh=new THREE.Mesh(geometry, material);
	mesh.position.set(0, 0, -wallThickness*1.5)
	object.add(mesh)
}



function createCamera(x,y,z){
	'use strict';
	camera = new THREE.OrthographicCamera(-VIEWSIZE,VIEWSIZE,VIEWSIZE*aspectRatio,-VIEWSIZE*aspectRatio, 1, 1000 );
	camera.position.set(x,y,z);
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
	var x= VIEWSIZE/(aliensPerRow+1)
	var z= VIEWSIZE*aspectRatio/2/(rows+1)
	for (var r=1; r<=rows; r++ ){
		for (var a=1;a<=aliensPerRow; a++)
			alienArray.push(createAlien2(x*a-VIEWSIZE/2, yLineup, (-VIEWSIZE*aspectRatio/2)+z*r))

	}
}

function createShields(nshields){
	var x= VIEWSIZE/(nshields+1);
	for (var a=1;a<=nshields; a++)
		createShield(x*a-VIEWSIZE/2, yLineup, 70);
	}

/*
function createScenery(){
	var texture=THREE.ImageUtils.loadTexture("./stars.jpg");
	texture.wrapS=THREE.RepeatWrapping;
	texture.wrapT=THREE.RepeatWrapping;
	texture.repeat.set(6,6);
	material=new THREE.MeshLambertMaterial({map : texture, color : 0xffffff, wireframe: true });
	var world = new THREE.Mesh(new THREE.SphereGeometry(800, 64,64 ), material);
	world.material.side =THREE.DoubleSide;

	scene.add(world)

}
*/

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
*/
}

function onResize(){
	'use strict';
	aspectRatio=window.innerHeight/window.innerWidth;
	renderer.setSize(window.innerWidth, window.innerHeight);
	if(window.innerWidth > 0 && window.innerHeight > 0){

            camera.left = -VIEWSIZE;
            camera.right = VIEWSIZE;
            camera.top = VIEWSIZE*aspectRatio;
            camera.bottom = -VIEWSIZE*aspectRatio;
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
			createCamera(VIEWSIZE/2,0,0);
			break;
		case 50:
			createCamera(0,100,0);
			break;
		case 51:
			createCamera(0,0, VIEWSIZE*aspectRatio/2);
			break;
		case 52:
			createCamera2();
			break;
		case 37://left arrow
			if(ship.userData.acceleration!=-0.1)
				ship.userData.acceleration=-0.1;
			break;

		case 39://right arrow
			if(ship.userData.acceleration!=0.1)
				ship.userData.acceleration=0.1;
			break;
	}

}

function onKeyUp(e){
	'use strict';
	switch(e.keyCode){
		case 37://left arrow
			if(ship.userData.acceleration!=0.1)
				ship.userData.acceleration=0;

			break;

		case 39://right arrow
			if(ship.userData.acceleration!=-0.1)
				ship.userData.acceleration=0;
			break;
	}
}


function updateShip(){
	ship.userData.velocity+=ship.userData.acceleration; //aceleracao=(60)^2*aceleracao em unidades/segundo^2 e velociadade =60*unidades/segundo porque 60 frames=1segundo
	ship.position.x+=ship.userData.velocity;
	ship.userData.velocity=ship.userData.velocity*0.95;//resistencia na velocidade
	//ship.userData.acceleration=ship.userData.acceleration*0.98; //resistencia na aceleracao
	//ship.userData.acceleration-=0.05*(ship.userData.velocity)^2 Tentei usar esta formula da Resistencia do Ar mas deu merda para quase qualquer constante
	ship.rotation.z=-ship.userData.velocity*Math.PI*0.2;


}

function animate() {
'use strict'
	updateShip();
	cameraControls.update();
	render()
	requestAnimationFrame(animate);

}

function init(){
	'use strict';
	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	createScene();
	//createCamera(0,100,0);
	createCamera2();
	//createScenery();
	render();

	window.addEventListener("resize", onResize);
	window.addEventListener("keydown", onKeyDown);
	window.addEventListener("keyup", onKeyUp);

}
