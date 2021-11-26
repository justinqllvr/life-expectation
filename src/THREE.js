import * as THREE from "three";
import { Group, Material, MeshMatcapMaterial, TextureLoader } from "three";
import gsap from "gsap";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as dat from "lil-gui";

export class Main {
  constructor() {
    this.canvas = document.querySelector("#webgl");
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true,
    });
    this.scroll = 0;
    this.scroll1 = 0;
    this.data = null;

    this.numberDevelopper = this.setArrayNumber("developper");
    this.numberDesigner = this.setArrayNumber("designer");

    this.mouseX = 0;

    this.test = 0;

    this.deathArray = [];

    this.gui = new dat.GUI();
    this.caracterFolder = this.gui.addFolder("Caracter");
    this.sphereFolder = this.gui.addFolder("Sphere");

    this.sceneInfo1 = this.setupScene1();
    this.sceneInfo2 = this.setupScene2();
    this.sceneInfo3 = this.setupScene3();
    this.render = this.render.bind(this);
    this.fetchData();
    this.render();
  }

  updateScroll(progress) {
    this.scroll = progress * 80 + 20;
  }

  updateScroll1(progress) {
    this.scroll1 = progress;
  }

  setArrayNumber(role) {
    const arrayDevelopper = [];
    const arrayDesigner = [];

    if (role === "developper") {
      for (let i = 1; i <= 14; i++) {
        arrayDevelopper.push(i);
      }
      return arrayDevelopper.sort((a, b) => 0.5 - Math.random());
    } else {
      for (let i = 15; i <= 36; i++) {
        arrayDesigner.push(i);
      }
      return (this.arrayNumberDesigner = arrayDesigner.sort(
        (a, b) => 0.5 - Math.random()
      ));
    }
  }
  deathList() {
    return this.deathArray;
  }
  fetchData() {
    fetch("/data.json")
      .then((res) => res.json())
      .then((res) => {
        this.data = res;

        for (let i = 0; i < this.numberDevelopper.length; i++) {
          this.data.filter((person) => person.Role === "Développeur")[i].modele = this.numberDevelopper[i]
        }
        for (let i = 0; i < this.numberDesigner.length; i++) {
          this.data.filter((person) => person.Role === "Designer")[i].modele = this.numberDesigner[i]
        }
      });
  }

  makeScene(elem) {
    const scene = new THREE.Scene();

    const fov = 50;
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
      },
      () => {
        console.log("progress");
      },
      () => {
        console.log("error");
      }
    );

    setTimeout(() => {
      const newMaterial1 = new MeshMatcapMaterial({
        color: "white",
        transparent: true,
      });
      const newMaterial2 = new MeshMatcapMaterial({
        color: "grey",
        transparent: true,
        opacity: 0.5,
      });

      let studientNumber = 0;
      for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 6; j++) {
          const new_caracter = model.clone();
          new_caracter.position.x = i * 6;
          new_caracter.position.y = j * 6;
          new_caracter.name = `thoma_${studientNumber}`;

          if (studientNumber + 1 < 14) {
            model.traverse((o) => {
              if (o.isMesh) o.material = newMaterial2;
            });
          } else {
            model.traverse((o) => {
              if (o.isMesh) o.material = newMaterial1;
            });
          }

          caracterGroup.add(new_caracter);
          studientNumber++;
        }
      }

      let scale = 1.3;
      caracterGroup.position.x = -19.4;
      caracterGroup.position.y = -21.5;
      caracterGroup.position.z = -48.2;
      caracterGroup.scale.x = scale;
      caracterGroup.scale.y = scale;
      caracterGroup.scale.z = scale;

      this.caracterFolder.add(caracterGroup.position, "z", -60, 0, 0.001);
      this.caracterFolder.add(caracterGroup.position, "x", -50, 50, 0.001);
      this.caracterFolder.add(caracterGroup.position, "y", -50, 50, 0.001);
      this.caracterFolder.add(caracterGroup.scale, "x", 1, 2, 0.01);
      this.caracterFolder.add(caracterGroup.scale, "y", 1, 2, 0.01);
      this.caracterFolder.add(caracterGroup.scale, "z", 1, 2, 0.01);

      // console.log(caracterGroup);
      sceneInfo.scene.add(caracterGroup);
    }, 500);

    sceneInfo.mesh = caracterGroup;
    return sceneInfo;
  }

  setupScene2() {
    const sceneInfo = this.makeScene(document.querySelector("#black-model"));

    const blackMaterial = new MeshMatcapMaterial({ color: "#797979" });

    let model = null;
    const gltfLoader = new GLTFLoader();

    gltfLoader.load(
      "/Character/BaseCharacter-smooth.glb_2",
      (gltf) => {
        model = gltf.scene;
        model.position.y = -1.5;
        model.position.z = -3;
        model.rotation.y = -1;

        sceneInfo.scene.add(model);
      },
      () => {
        console.log("progress");
      },
      () => {
        console.log("error");
      }
    );

    return sceneInfo;
  }

  setupScene3() {
    const sceneInfo = this.makeScene(document.querySelector("#white-model"));

    // const texture = new THREE.TextureLoader().load("/Textures/4.png")
    // console.log(texture)
    // const whiteMaterial = new MeshMatcapMaterial({
    //   color: "white",
    //   matcap: texture,
    // });

    let model = null;
    const gltfLoader = new GLTFLoader();

    gltfLoader.load(
      "/Character/BaseCharacter-smooth.glb_2",
      (gltf) => {
        model = gltf.scene;
        model.position.y = -1.5;
        model.position.z = -3;
        model.children[0].children[1].material.color.r = 5;
        model.children[0].children[1].material.color.b = 5;
        model.children[0].children[1].material.color.g = 5;
        // model.traverse((o) => {
        //   if (o.isMesh) o.material = whiteMaterial;
        // });
        sceneInfo.scene.add(model);
      },
      () => {
        console.log("progress");
      },
      () => {
        console.log("error");
      }
    );

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
    // console.log(this.developper)

    if (this.data && this.sceneInfo1.mesh) {
      const children = this.sceneInfo1.mesh.children;
      if (children.length === 36) {
        for (let i = 0; i < this.data.length; i++) {
          let caracter = this.data[i].modele - 1;
          // console.log(caracter)

          if (
            this.scroll > this.data[i].Vie &&
            this.data[i].Role === "Développeur" &&
            children[caracter].scale.x === 1
          ) {
            gsap.to(children[caracter].scale, {
              x: 0,
              y: 0,
              z: 0,
            });
            this.deathArray.push(this.data[i].Pseudo);
          } else if (
            this.scroll > this.data[i].Vie &&
            this.data[i].Role === "Designer" &&
            children[caracter].scale.x === 1
          ) {
            gsap.to(children[caracter].scale, {
              x: 0,
              y: 0,
              z: 0,
            });

            this.deathArray.push(this.data[i].Pseudo);
          } else if (
            this.scroll < this.data[i].Vie &&
            this.data[i].Role === "Développeur" &&
            children[caracter].scale.x === 0
          ) {
            gsap.to(children[caracter].scale, {
              x: 1,
              y: 1,
              z: 1,
            });
            this.deathArray.splice(-1);
          } else if (
            this.scroll < this.data[i].Vie &&
            this.data[i].Role === "Designer" &&
            children[caracter].scale.x === 0
          ) {
            gsap.to(children[caracter].scale, {
              x: 1,
              y: 1,
              z: 1,
            });
            this.deathArray.splice(-1);
          }
        }
      }
    }

    //Render des modèles de la présentation
    this.renderSceneInfo(this.sceneInfo2);
    this.renderSceneInfo(this.sceneInfo3);

    if (
      this.sceneInfo2.scene.children.length == 2 &&
      this.sceneInfo3.scene.children.length == 2
    ) {
      this.sceneInfo2.scene.children[1].rotation.y = this.scroll1 * 2;
      this.sceneInfo3.scene.children[1].rotation.y = -this.scroll1 * 1.5;
    }
    this.renderSceneInfo(this.sceneInfo3);

    requestAnimationFrame(this.render);
  }
}
