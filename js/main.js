// Import necessary libraries from the THREE.js framework
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
// To allow for the camera to move around the scene
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
// To allow for importing the .gltf file
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

// Initialize the scene where all 3D objects will be added
const scene = new THREE.Scene();
// Set up the camera with a perspective view
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// Variables to track mouse position for interactive globe movement
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

// Global variable to store the loaded 3D object
let object;

// Enable camera controls for user interaction
let controls;

// Specify the object to render (e.g., globe)
let objToRender = 'globe';

// Create a loader to import 3D models in .gltf format
const loader = new GLTFLoader();

// Load the specified 3D model and add it to the scene
loader.load(
  `./models/${objToRender}/scene.gltf`,
  function (gltf) {
    // If the file is loaded, add it to the scene
    object = gltf.scene;
    scene.add(object);
  },
  function (xhr) {
    // While it is loading, log the progress
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  },
  function (error) {
    // If there is an error, log it
    console.error(error);
  }
);

// Set up the renderer and configure its size and transparency
const renderer = new THREE.WebGLRenderer({ alpha: true }); // Alpha: true allows for the transparent background
renderer.setSize(window.innerWidth, window.innerHeight);

// Attach the renderer's output to the HTML container
document.getElementById("container3D").appendChild(renderer.domElement);

// Position the camera at an appropriate distance from the object
camera.position.z = objToRender === "globe" ? 25 : 500;

// Add lighting to the scene for better visibility of the 3D model
const topLight = new THREE.DirectionalLight(0xffffff, 1); // (color, intensity)
topLight.position.set(500, 500, 500) //top-left-ish
topLight.castShadow = true;
scene.add(topLight);

const ambientLight = new THREE.AmbientLight(0x333333, objToRender === "globe" ? 5 : 1);
scene.add(ambientLight);

// Add orbit controls to allow users to rotate and zoom the camera
if (objToRender === "globe") {
  controls = new OrbitControls(camera, renderer.domElement);
}

// Define the animation loop to continuously render the scene
function animate() {
  requestAnimationFrame(animate);
  // Here we could add some code to update the scene, adding some automatic movement
  renderer.render(scene, camera);
}

// Adjust the camera and renderer settings when the window is resized
window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Track mouse movements to enable interactive globe rotation
document.onmousemove = (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
}

// Start the rendering process
animate();