/*global THREE*/

var camera, scene, renderer;

var geometry, mesh, material

function render(){
	
	'use strict';
	renderer.render(scene, camera);
}

var ball;
function createBall(x, y, z){
	
	ball = new THREE.Object3D();
	ball.userData = { jumping: true, step: 0 };
	material = new THREE.MeshBasicMaterial({color: 0xff0000, wireframe: true});
	geometry = new THREE.SphereGeometry(4, 10, 10);
	mesh = new THREE.Mesh(geometry, material);
	ball.add(mesh);
	ball.position.set(x, y, z);
	
	scene.add(ball);
}

function createTable(x, y, z){
	'use strict';
	
	var table = new THREE.Object3D();

	material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true});
	addTableTop(table, 0, 0, 0);
	addTableLeg(table, -25, 0, 8);
	addTableLeg(table, 25, 0, -8);
	addTableLeg(table, 25, 0, 8);
	addTableLeg(table, -25, 0, -8);
	
	scene.add(table);

	table.position.x = x;
	table.position.y = y;
	table.position.z = z;

}

function addTableTop(obj, x, y, z){
	'use strict';
	geometry = new THREE.CubeGeometry(60, 2, 20);
	mesh = new THREE.Mesh(geometry, material);
	mesh.position.set(x, y, z);
	obj.add(mesh);
}

function addTableLeg(obj, x, y, z){
	'use strict';
	
	geometry = new THREE.CubeGeometry(2, 6, 2);
	mesh = new THREE.Mesh(geometry, material);
	mesh.position.set(x, y - 3, z);
	obj.add(mesh);
}
	
function createCamera(){
	'use strict';

	camera = new THREE.OrthographicCamera( 70 / - 2, 70 / 2, 70 / 2, 70 / - 2, 1, 1000 );

	camera.position.x = 0;
	camera.position.y = 100;
	camera.position.z = 0;
	camera.lookAt(scene.position);
}

function createScene(){
	'use strict';
	
	scene = new THREE.Scene();
	
	scene.add(new THREE.AxisHelper(10));
	
	createTable(0, 0, 0);
	createBall(0, 0, 15);
}

function onResize(){
	'use strict';
	renderer.setSize(window.innerWidth, window.innerHeight);
	if(window.innerHeight > 0 && window.innerHeight > 0){
		camera.aspect = renderer.getSize().width / renderer.getSize().height;
		camera.updateProjectionMatrix();
	}
	
	
	render();
	
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
		
		case 83:
		case 115:
			ball.userData.jumping = !ball.userData.jumping;
			break;
	}
	render();
}
function animate(){
	'use strict';
	
	if (ball.userData.jumping){
		ball.userData.step += 0.10;
		ball.position.y = 30 * (Math.sin(ball.userData.step));
		ball.position.z = 15 * (Math.cos(ball.userData.step));
	}
	render();
	
	requestAnimationFrame(animate);
}

function init(){
	'use strict';
	
	renderer = new THREE.WebGLRenderer({ antialias: true });
	
	renderer.setSize(window.innerWidth, window.innerHeight);
	
	document.body.appendChild(renderer.domElement);
	
	createScene();
	createCamera();

	render();
	window.addEventListener("resize", onResize);
	window.addEventListener("keydown", onKeyDown);
}

