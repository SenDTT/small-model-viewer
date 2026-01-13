import * as THREE from 'three';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

let car;
let carSpeed = 0.08;

let camera, scene, renderer;

let targetPosition = new THREE.Vector3(40, 8, 20);
let targetLookAt = new THREE.Vector3(0, 3, 20);
const lerpSpeed = 0.003;

let streetLights = [];

init();

function init() {
    const container = document.getElementById('container');

    // camera (NO const)
    camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 20000);
    camera.position.set(-20, 1, -30);

    // scene (NO const)
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x101010);

    // road
    const road = new THREE.Mesh(
        new THREE.BoxGeometry(10, 0.1, 50),
        new THREE.MeshBasicMaterial({ color: 0x222222 })
    );
    road.position.set(0, 0, 20);
    scene.add(road);

    // dashed lines
    const dashGeo = new THREE.BoxGeometry(0.2, 0.02, 2);
    const dashMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

    for (let i = 0; i < 12; i++) {
        const dash = new THREE.Mesh(dashGeo, dashMat);
        dash.position.set(0, 0.06, 40 - i * 4);
        scene.add(dash);
    }

    for (let i = 0; i < 4; i++) {
        createStreetLight(-4.5, 9 + i * 10, false); // left side
        createStreetLight(4.5, 3 + i * 10);  // right side
    }

    // renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    renderer.setAnimationLoop(animate);

    loadCar();
}

function createStreetLight(x, z, isLeft = true) {
    const group = new THREE.Group();

    // pole
    const pole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.1, 0.1, 5, 16),
        new THREE.MeshStandardMaterial({ color: 0x555555 })
    );
    pole.position.y = 2.5;
    group.add(pole);

    const lampHeight = 0.4;

    // lamp (glow OFF initially)
    const lampMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffcc,
        emissive: 0xffeebb,
        emissiveIntensity: 0   // OFF
    });

    const lamp = new THREE.Mesh(
        new THREE.CylinderGeometry(0.1, 0.6, lampHeight, 16),
        lampMaterial
    );
    lamp.position.set(isLeft ? -0.5 : 0.5, 5, 0);
    group.add(lamp);

    // spotlight (OFF initially)
    const light = new THREE.SpotLight(0xfff2cc, 0, 40, Math.PI / 6, 0.4, 1);
    light.position.set(
        isLeft ? -0.5 : 0.5,
        lamp.position.y - lampHeight / 2 - 0.5,
        0
    );
    light.target.position.set(isLeft ? -1 : 1, -5, 20);
    group.add(light);
    group.add(light.target);

    group.position.set(x, 0, z);
    scene.add(group);

    // store reference
    streetLights.push({ light, lampMaterial });
}

function turnOnLightsSequentially() {
    streetLights.forEach((item, index) => {
        setTimeout(() => {
            item.light.intensity = 8;          // light ON
            item.lampMaterial.emissiveIntensity = 1.5; // lamp glow
        }, index * 700); // delay between lights (ms)
    });
}

function animate() {
    // smooth camera movement
    camera.position.lerp(targetPosition, lerpSpeed);
    camera.lookAt(targetLookAt);

    if (car) {
        car.position.z += carSpeed;

        // loop car back to start
        if (car.position.z > 50) {
            car.position.z = -20;
        }
    }

    turnOnLightsSequentially();

    renderer.render(scene, camera);
}

function loadCar() {
    const loader = new GLTFLoader();

    loader.load('/models/car.glb', (gltf) => {
        car = gltf.scene;

        car.scale.set(0.5, 0.5, 0.5);   // adjust as needed
        car.position.set(0, 0.05, -10); // start on road
        // car.rotation.y = Math.PI;       // face forward

        car.rotation.y = -20.3; // face forward
        car.position.x = -2;

        scene.add(car);
    });
}

