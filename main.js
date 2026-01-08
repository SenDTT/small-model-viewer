import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

// first create a scene, a camera, and a renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

// create the renderer and add it to the document
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// create a cube and add it to the scene
const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );
// position the camera
camera.position.z = 5;

// create the animation loop
function animate() {
    // rotate the cube for some basic animation
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    // render the scene from the perspective of the camera
    renderer.render( scene, camera );
}
// start the animation loop, using setAnimationLoop for better performance
renderer.setAnimationLoop( animate );

// create the text
// const loader = new FontLoader();

// loader.load(
//   'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json',
//   (font) => {
//     const textGeometry = new TextGeometry('Hello, three.js!', {
//       font: font,
//       size: 1.5,
//       height: 0.3,
//       curveSegments: 12
//     });

//     textGeometry.center();

//     const textMaterial = new THREE.MeshBasicMaterial({
//       color: 0xffffff,
//       depthTest: false
//     });

//     const textMesh = new THREE.Mesh(textGeometry, textMaterial);
//     textMesh.position.set(0, 2, 1.5);

//     textMesh.onBeforeRender = () => {
//         textMesh.quaternion.copy(camera.quaternion);
//     };

//     scene.add(textMesh);
//   }
// );