import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import "./style.css";

function main() {
  const canvas = document.querySelector("#webgl");
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });

  function makeScene(elem) {
    const scene = new THREE.Scene();

    const fov = 45;
    const aspect = 2; // the canvas default
    const near = 0.1;
    const far = 5;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 1, 2);
    camera.lookAt(0, 0, 0);

    {
      const color = 0xffffff;
      const intensity = 1;
      const light = new THREE.DirectionalLight(color, intensity);
      light.position.set(-1, 2, 4);
      scene.add(light);
    }

    return { scene, camera, elem };
  }

  function setupScene1() {
    const sceneInfo = makeScene(document.querySelector("#box"));

    const gltfLoader = new GLTFLoader();

    gltfLoader.load(
      "/Duck/glTF/Duck.gltf",
      (gltf) => {
        console.log(gltf.scene.children[0].children[1])
        sceneInfo.scene.add(gltf.scene)
      },
      () => {
        console.log("progress");
      },
      () => {
        console.log("error");
      }
    );

    // const geometry = new THREE.BoxGeometry(1, 1, 1);
    // const material = new THREE.MeshPhongMaterial({ color: "red" });
    // const mesh = new THREE.Mesh(geometry, material);
    // sceneInfo.scene.add(mesh);
    // sceneInfo.mesh = mesh;
    return sceneInfo;
  }

  function setupScene2() {
    const sceneInfo = makeScene(document.querySelector("#pyramid"));
    const radius = 0.8;
    const widthSegments = 50;
    const heightSegments = 10;
    const geometry = new THREE.SphereGeometry(
      radius,
      widthSegments,
      heightSegments
    );
    const material = new THREE.MeshPhongMaterial({
      color: "blue",
      flatShading: true,
    });
    const mesh = new THREE.Mesh(geometry, material);
    sceneInfo.scene.add(mesh);
    sceneInfo.mesh = mesh;
    return sceneInfo;
  }

  function setupScene3() {
    const sceneInfo = makeScene(document.querySelector("#sphere"));
    const geometry = new THREE.SphereGeometry(0.8, 50, 2);
    const material = new THREE.MeshPhongMaterial({
      color: "yellow",
      flatShading: true,
    });
    const mesh = new THREE.Mesh(geometry, material);
    sceneInfo.scene.add(mesh);
    sceneInfo.mesh = mesh;
    return sceneInfo;
  }

  const sceneInfo1 = setupScene1();
  const sceneInfo2 = setupScene2();
  const sceneInfo3 = setupScene3();

  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  function renderSceneInfo(sceneInfo) {
    const { scene, camera, elem } = sceneInfo;

    // get the viewport relative position of this element
    const { left, right, top, bottom, width, height } =
      elem.getBoundingClientRect();

    const isOffscreen =
      bottom < 0 ||
      top > renderer.domElement.clientHeight ||
      right < 0 ||
      left > renderer.domElement.clientWidth;

    if (isOffscreen) {
      return;
    }

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    const positiveYUpBottom = renderer.domElement.clientHeight - bottom;
    renderer.setScissor(left, positiveYUpBottom, width, height);
    renderer.setViewport(left, positiveYUpBottom, width, height);

    renderer.render(scene, camera);
  }

  function render(time) {
    time *= 0.001;

    resizeRendererToDisplaySize(renderer);

    renderer.setScissorTest(false);
    renderer.clear(true, true);
    renderer.setScissorTest(true);

    sceneInfo1.scene.position.y = -time * 0.1;
    sceneInfo2.mesh.rotation.y = time * 0.1;
    sceneInfo3.mesh.rotation.y = time * 0.1;

    renderSceneInfo(sceneInfo1);
    renderSceneInfo(sceneInfo2);
    renderSceneInfo(sceneInfo3);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main();
// Scene
// const scene = new THREE.Scene();

// // Object
// const geometry = new THREE.BoxGeometry(1, 1, 1);
// const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
// const mesh = new THREE.Mesh(geometry, material);
// scene.add(mesh);

// // Sizes
// const sizes = {
//   width: window.innerWidth ,
//   height: window.innerHeight,
// };

// // Camera
// const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
// camera.position.z = 3;
// scene.add(camera);

// // Renderer
// const renderer = new THREE.WebGLRenderer({
//     canvas: document.querySelector("canvas.webgl"),
//   });

// renderer.setSize(sizes.width, sizes.height);
// renderer.render(scene, camera);

// let i = 0;

// const update = () => {
//  // Update objects
//  mesh.rotation.y += 0.01
//  mesh.rotation.x += 0.01

//  // Render
//  renderer.render(scene, camera)

//   i += 1;
//   window.requestAnimationFrame(update);
// };
// window.requestAnimationFrame(update)

// const scrollContainer = document.getElementById("body")

// console.log(scrollContainer)

// scrollContainer.addEventListener("wheel", (evt) => {
//     evt.preventDefault();
//     scrollContainer.scrollLeft += evt.deltaY;
// });
