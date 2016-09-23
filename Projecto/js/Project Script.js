/*global THREE*/

var camera, scene, renderer;

var geometry, mesh, material;

function render(){
	
	'use strict';
	renderer.render(scene, camera);
}

function createField(x, y, z){
	'use strict';
	
	var field = new THREE.Object3D();

	material = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true});
	geometry = new THREE.CubeGeometry(300, 1, 200);
	mesh = new THREE.Mesh(geometry, material);
	mesh.position.set(0, 0, 0);
	field.add(mesh);
	
	scene.add(field);

	field.position.x = x;
	field.position.y = y;
	field.position.z = z;

}

function createShip(x,y,z){
	'use strict';
	
	var ship = new THREE.Object3D();

	material = new THREE.MeshBasicMaterial({ color: 0xff00ff, wireframe: true});
	geometry = new THREE.ConeGeometry(10,30);
	mesh = new THREE.Mesh(geometry, material);
	mesh.position.set(0, 0, 0);
	ship.add(mesh);
	
	scene.add(ship);

	ship.position.x = x;
	ship.position.y = y;
	ship.position.z = z;

	ship.rotateX(250);
}

function createCamera(){
	'use strict';

	camera = new THREE.OrthographicCamera(window.innerWidth/ - 4, window.innerWidth/ 4, window.innerHeight/ 4, window.innerHeight/ - 4, 1, 1000 );
	

	camera.position.x = 0;
	camera.position.y = 100;
	camera.position.z = 0;
	camera.lookAt(scene.position);
}

function createScene(){
	'use strict';
	
	scene = new THREE.Scene();
	
	scene.add(new THREE.AxisHelper(10));
	
	createField(0, 0, 0);
	createShip(0,0,80);
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
	}
	render();
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
