import "./style.css";
import * as THREE from "three";

// Scene
const scene = new THREE.Scene();

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("canvas.webgl"),
  });
  
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);

let i = 0;

const update = () => {
 // Update objects
 mesh.rotation.y += 0.01
 mesh.rotation.x += 0.01

 // Render
 renderer.render(scene, camera)

  i += 1;
  window.requestAnimationFrame(update);
};
window.requestAnimationFrame(update)
