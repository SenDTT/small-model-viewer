import * as THREE from 'three';

import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'; 

// THREE.Cache.enabled = true;

let container;

let camera, cameraTarget, scene, renderer;

let gui;

let cube1, cube2;

// camera transition helpers
let targetPosition = new THREE.Vector4(20, 5, 1, 10);
let targetLookAt = new THREE.Vector3(0, 1, 0);
const lerpSpeed = 0.005;

const cameras = {
  cam1: {
    position: new THREE.Vector3(-14, -20, -15),
    lookAt: new THREE.Vector3(5, 20, 20),
  },
  cam2: {
    position: new THREE.Vector3(20, 15, 1),
    lookAt: new THREE.Vector3(2, -1, 2),
  },
  cam3: {
    position: new THREE.Vector3(15, 16, 20),
    lookAt: new THREE.Vector3(-5, -20, -20),
  },
};


init();

function init() {
    container = document.getElementById( 'container' );
    container.style.width = '100vw';
    container.style.height = '100vh';
    document.body.appendChild( container );

    // Create camera
    camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 1, 1500 );
    camera.position.set(0, 0, 20);
    camera.layers.disableAll();
    camera.layers.enable(1);
    camera.layers.enable(2);

    cameraTarget = new THREE.Vector3( 0, 150, 0 );
    cameraTarget.set(0, 0, 0);

    // Create scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0x111111 );
    scene.fog = new THREE.Fog( 0x000000, 250, 1400 );

    // lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));

    const dir = new THREE.DirectionalLight(0xffffff, 1);
    dir.position.set(5, 10, 7);
    scene.add(dir);

    // create cubes with different layers
    cube1 = new THREE.Mesh(
        new THREE.CylinderGeometry(1, 1.5, 2, 10),
        new THREE.MeshBasicMaterial({ 
            color: 0xff00ff, 
            wireframe: true, 
            opacity: 0.5,
        })
    );
    cube1.position.x = -5;
    cube1.position.y = -1.5;
    cube1.position.z = -3.5;
    cube1.layers.set(1);
    scene.add(cube1);

    cube2 = new THREE.Mesh(
        new THREE.TorusGeometry(1, 1, 10, 10),
        new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true, opacity: 0.5 })
    );
    cube2.position.x = 3;
    cube2.position.y = 1.5;
    cube2.position.z = 3;
    cube2.layers.set(2);
    scene.add(cube2);

    // Create renderer
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setAnimationLoop( animate );
    container.appendChild( renderer.domElement );

    // events

    container.style.touchAction = 'none';
    container.addEventListener( 'pointerdown', onPointerDown );
    document.addEventListener( 'wheel', onDocumentMouseWheel );

    function onPointerDown( event ) {
        event.preventDefault();
    }

    function onDocumentMouseWheel( event ) {
        camera.position.z += event.deltaY * 0.05;
    }

    // GUI
    gui = new GUI();

    setupCameraButtons();

    // Handle window resize
    window.addEventListener( 'resize', onWindowResize );

    window.addEventListener( 'keydown', ( event ) => {
        switch ( event.key ) {
            case '1':
                setCamera('cam1');
                break;
            case '2':
                setCamera('cam2');
                break;
            case '3':
                setCamera('cam3');
                break;
        }
    });

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

function setupCameraButtons() {
    let idx = 1;
    for ( const cam in cameras ) {
        gui.add( { setCamera: () => setCamera(cam) }, 'setCamera' ).name( `Set ${cam} (Press ${idx})` );
        idx++;
    }
}

function setCamera(name) {
  targetPosition.copy(cameras[name].position);
  targetLookAt.copy(cameras[name].lookAt);
}

function animate() {

    camera.lookAt( cameraTarget );

    camera.position.lerp(targetPosition, lerpSpeed);

    const currentLookAt = new THREE.Vector3();
    camera.getWorldDirection(currentLookAt);
    currentLookAt.add(camera.position);

    currentLookAt.lerp(targetLookAt, lerpSpeed);
    camera.lookAt(currentLookAt);

    renderer.clear();

    cube1.rotation.x += 0.001;
    cube1.rotation.y += 0.001;

    cube2.rotation.x += 0.001;
    cube2.rotation.y += 0.003;

    renderer.render( scene, camera );
}
