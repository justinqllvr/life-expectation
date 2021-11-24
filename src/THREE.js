import * as THREE from "three";
import { Group } from "three";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as dat from "lil-gui";

export class Main {
  constructor() {
    this.canvas = document.querySelector("#webgl");
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
    });
    this.scroll = 0;

    this.gui = new dat.GUI();
    this.caracterFolder = this.gui.addFolder("Caracter");
    this.sphereFolder = this.gui.addFolder("Sphere");

    this.sceneInfo1 = this.setupScene1();
    this.sceneInfo2 = this.setupScene2();
    this.sceneInfo3 = this.setupScene3();
    this.render = this.render.bind(this);
    this.render();
  }

  updateScroll(progress) {
    this.scroll = progress;
  }

  makeScene(elem) {
    const scene = new THREE.Scene();

    const fov = 45;
    const aspect = 2; // the canvas default
    const near = 0.1;
    const far = 100;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 0, 2);
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

  setupScene1() {
    const sceneInfo = this.makeScene(document.querySelector("#box"));

    let model = null;
    const caracterGroup = new THREE.Group();
    const gltfLoader = new GLTFLoader();

    gltfLoader.load(
      "/Character/BaseCharacter-smooth.glb_2",
      (gltf) => {
        model = gltf.scene;
        console.log(gltf);

        console.log(model);

        // this.caracterFolder.add(model.position, 'x',- 3, 3, 0.01)
        model.position.y = -2.5;
        model.position.z = -2.2;
        // model.children[0].children[1].material.color.r = 1;
        // model.scale.x = 0.5;
        // model.scale.y = 0.5;
        // gltf.scene.children[0].children[1].scale.y = 0.1

        // const new_caracter = model.clone(true)
        // sceneInfo.scene.add(new_caracter);
      },
      () => {
        console.log("progress");
      },
      () => {
        console.log("error");
      }
    );

    setTimeout(() => {
      let developper = 0;
      for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 6; j++) {
          const new_caracter = model.clone();
          new_caracter.position.x = i * 5 - 15;
          new_caracter.position.y = j * 5 - 15;
          new_caracter.position.z = -30;
          if (developper + 1 < 14) {
            new_caracter.children[0].children[1].material.color.r = 255;
          } else {
            new_caracter.children[0].children[1].material.color.r = 0;
            new_caracter.children[0].children[1].material.color.r = 20;

          }
          console.log(developper)
          developper++;
          // this.caracterFolder.add(new_caracter.scale, 'x',- 3, 3, 0.01)
          // this.caracterFolder.add(new_caracter.scale, 'y',- 3, 3, 0.01)
          // this.caracterFolder.add(new_caracter.scale, 'z',- 3, 3, 0.01)

          caracterGroup.add(new_caracter);
        }
      }

      this.caracterFolder.add(caracterGroup.position, "z", -30, 30, 0.01);
      // this.caracterFolder.add(caracterGroup.position, 'y',- 3, 3, 0.01)
      // this.caracterFolder.add(caracterGroup.position, 'z',- 3, 3, 0.01)

      console.log(caracterGroup);
      sceneInfo.scene.add(caracterGroup);
    }, 1000);

    // const geometry = new THREE.BoxGeometry(1, 1, 1);
    // const material = new THREE.MeshPhongMaterial({ color: "red" });
    // const mesh = new THREE.Mesh(geometry, material);
    // sceneInfo.scene.add(mesh);
    // sceneInfo.mesh = mesh;
    return sceneInfo;
  }

  setupScene2() {
    const sceneInfo = this.makeScene(document.querySelector("#pyramid"));
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

    //DEBUG
    this.sphereFolder.add(mesh.rotation, "x", -3, 3, 0.01);
    return sceneInfo;
  }

  setupScene3() {
    const sceneInfo = this.makeScene(document.querySelector("#sphere"));
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

  resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  renderSceneInfo(sceneInfo) {
    const { scene, camera, elem } = sceneInfo;

    // get the viewport relative position of this element
    const { left, right, top, bottom, width, height } =
      elem.getBoundingClientRect();

    const isOffscreen =
      bottom < 0 ||
      top > this.renderer.domElement.clientHeight ||
      right < 0 ||
      left > this.renderer.domElement.clientWidth;

    if (isOffscreen) {
      return;
    }

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    const positiveYUpBottom = this.renderer.domElement.clientHeight - bottom;
    this.renderer.setScissor(left, positiveYUpBottom, width, height);
    this.renderer.setViewport(left, positiveYUpBottom, width, height);

    this.renderer.render(scene, camera);
  }

  render(time) {
    time *= 0.001;

    this.resizeRendererToDisplaySize(this.renderer);

    this.renderer.setScissorTest(false);
    this.renderer.clear(true, true);
    this.renderer.setScissorTest(true);

    this.renderSceneInfo(this.sceneInfo1);
    // this.renderSceneInfo(this.sceneInfo2);
    // this.renderSceneInfo(this.sceneInfo3);

    requestAnimationFrame(this.render);
  }
}
