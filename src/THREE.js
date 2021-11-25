import * as THREE from "three";
import { Group, Material, MeshMatcapMaterial, TextureLoader } from "three";

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
    this.data = null;

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

  fetchData() {
    fetch("/data.json")
      .then((res) => res.json())
      .then((res) => {
        this.data = res;
        console.log(this.data);
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
            // console.log("dev : " + studientNumber);
            model.traverse((o) => {
              if (o.isMesh) o.material = newMaterial2;
            });
          } else {
            // console.log("designer :" + studientNumber);
            model.traverse((o) => {
              if (o.isMesh) o.material = newMaterial1;
            });
          }

          caracterGroup.add(new_caracter);
          studientNumber++;
        }
      }

      let scale = 1.3;
      caracterGroup.position.x = -19.863;
      caracterGroup.position.y = -22.321;
      caracterGroup.position.z = -50;
      caracterGroup.scale.x = scale;
      caracterGroup.scale.y = scale;
      caracterGroup.scale.z = scale;

      this.caracterFolder.add(caracterGroup.position, "z", -50, 50, 0.001);
      this.caracterFolder.add(caracterGroup.position, "x", -50, 50, 0.001);
      this.caracterFolder.add(caracterGroup.position, "y", -50, 50, 0.001);
      this.caracterFolder.add(caracterGroup.scale, "x", 1, 2, 0.01);
      this.caracterFolder.add(caracterGroup.scale, "y", 1, 2, 0.01);
      this.caracterFolder.add(caracterGroup.scale, "z", 1, 2, 0.01);

      // console.log(caracterGroup);
      sceneInfo.scene.add(caracterGroup);

      // var selectedObject = sceneInfo.scene.getObjectByName(caracterGroup.children[5].name)

      // console.log(
      //   caracterGroup.children.map(
      //     (child) => child.children[0].children[1].material.opacity
      //   )
      // );
    }, 500);

    // const geometry = new THREE.BoxGeometry(1, 1, 1);
    // const material = new THREE.MeshPhongMaterial({ color: "red" });
    // const mesh = new THREE.Mesh(geometry, material);
    // sceneInfo.scene.add(mesh);
    // console.log(caracterGroup);
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

    if (this.data && this.sceneInfo1.mesh) {
      const children = this.sceneInfo1.mesh.children;
      let designer = 14
      let developper = 0

      if (children.length === 36) {
        for (let i = 0; i < this.data.length; i++) {
          if (this.scroll > this.data[i].Durée_de_vie) {
            if(this.data[i].Role === "Designer") {
              children[designer].scale.x = 0;
              children[designer].scale.y = 0;
              children[designer].scale.z = 0; 
              designer++
            } else if (this.data[i].Role === "Développeur") {
              children[developper].scale.x = 0;
              children[developper].scale.y = 0;
              children[developper].scale.z = 0;
              developper++
            }
            // children[developper].scale.x = 0;
            // children[developper].scale.y = 0;
            // children[developper].scale.z = 0;
            // developper++
            // this.sceneInfo1.mesh.remove(
            //   children.filter((child) => child.name === `thoma_${i}`)[0]
            // );
          } else if (this.scroll < this.data[i].Durée_de_vie && children[i].scale.x === 0) {
            if(this.data[i].Role === "Designer") {
              children[designer].scale.x = 0;
              children[designer].scale.y = 0;
              children[designer].scale.z = 0; 
              designer--
            } else if (this.data[i].Role === "Développeur") {
              // console.log("object")
              children[developper].scale.x = 0;
              children[developper].scale.y = 0;
              children[developper].scale.z = 0;
              developper--
            }
            children[i].scale.x = 1
            children[i].scale.y = 1
            children[i].scale.z = 1
          }
        }
      }
    }

    this.renderSceneInfo(this.sceneInfo2);
    this.renderSceneInfo(this.sceneInfo3);

    requestAnimationFrame(this.render);
  }
}
