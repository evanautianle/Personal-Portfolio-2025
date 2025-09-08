// Import libraries
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

// Initialize scene and camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(20, 0, 1); // Adjusted camera position to move the globe higher in the view
camera.lookAt(0, 0, 0); // Ensure the camera is focused on the center of the scene

// Track mouse position
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

// Global variable for 3D object
let object;

// Enable camera controls
let controls;

// Specify object to render
let objToRender = 'globe';

// Load 3D model
const loader = new GLTFLoader();
loader.load(
  `./models/${objToRender}/scene.gltf`,
  function (gltf) {
    object = gltf.scene;
    scene.add(object);
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  },
  function (error) {
    console.error(error);
  }
);

// Load the satellite model
const satelliteLoader = new GLTFLoader();
let satellite;
let angle = Math.PI;
let tiltAngle = Math.PI / 6;
satelliteLoader.load(
  './models/satellite/scene.gltf',
  function (gltf) {
    satellite = gltf.scene;
    satellite.scale.set(0.5, 0.5, 0.5);
    const radius = 10;
    satellite.position.set(radius * Math.cos(angle), 0, radius * Math.sin(angle));
    scene.add(satellite);
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  },
  function (error) {
    console.error(error);
  }
);

// Set up renderer
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("container3D").appendChild(renderer.domElement);

// Simplify lighting setup
scene.clear();
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
scene.add(directionalLight);

// Add orbit controls
if (objToRender === "globe") {
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableZoom = false;
  controls.enableRotate = true;
  controls.minPolarAngle = Math.PI / 2;
  controls.maxPolarAngle = Math.PI / 2;
}

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  // Rotate the globe
  if (object) {
    object.rotation.y += 0.005; // Adjust rotation speed as needed
  }

  // Update satellite position to orbit the globe
  if (satellite) {
    angle += 0.01;
    const radius = 10;
    satellite.position.x = radius * Math.cos(angle);
    satellite.position.z = radius * Math.sin(angle);
    satellite.position.y = radius * Math.sin(tiltAngle) * Math.sin(angle);

    satellite.traverse((child) => {
      if (child.isMesh) {
        child.material.emissive = new THREE.Color(0xffffff);
        child.material.emissiveIntensity = 5;
      }
    });
  }

  renderer.render(scene, camera);
}

// Adjust on window resize
window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Track mouse movements
document.onmousemove = (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
};

// Start rendering
animate();