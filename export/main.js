import "./style.css";

import gsap from "gsap";

import Loader, { RESOURCE_TYPE } from "./components/Loader";
import WebGL from "./components/WebGL";
import Controller from "./components/Controller";
import Marquee from "./components/Marquee";

class Application {
  constructor(attributes = {}) {
    this.$element = attributes.element;
    this.setupRefs();
  }

  load = async (manifest = []) => {
    this.loader = new Loader();
    this.resources = await this.loader.load(manifest);
    this.setupComponents();
    this.setupEventListeners();
  };

  setupRefs() {
    this.$refs = [...this.$element.querySelectorAll("[data-select]")].reduce((object, $node) => {
      object[$node.dataset.select] = $node;
      return object;
    }, {});
  }

  setupComponents() {
    this.components = {
      webgl: new WebGL({ element: this.$refs.canvas, resources: this.resources }),
      controller: new Controller({ element: this.$element }),
    };
  }

  setupEventListeners() {
    this.observer = new ResizeObserver(this.handleResize);
    this.observer.observe(this.$element);

    gsap.ticker.add(this.handleTick);

    this.components.controller.addEventListener("state", this.handleControllerChange);

    this.$refs.previous.addEventListener("click", this.handleClick);
    this.$refs.next.addEventListener("click", this.handleClick);
  }

  handleControllerChange = (state) => {
    this.components.webgl.state.interactive = state.active;
  };

  handleResize = () => {
    this.components.webgl.setSize(this.$element.clientWidth, this.$element.clientHeight);
  };

  handleTick = () => {
    this.components.webgl.update(this.components.controller.state.position);
    this.components.webgl.render();
  };

  handleClick = () => {
    this.components.webgl.transition();
  };
}

const application = new Application({ element: document.body });
application.load([
  {
    id: "environment",
    type: RESOURCE_TYPE.Environment,
    src: "/environment.hdr",
  },
  {
    id: "model",
    type: RESOURCE_TYPE.Model,
    src: "/model.glb",
  },
]);

// import { GLTFLoader, OrbitControls, RGBELoader } from "three/examples/jsm/Addons.js";
// import * as THREE from "three";
// import gsap from "gsap";

// class Application {
//   constructor(options = {}) {
//     this.state = {
//       dimensions: options.dimensions,
//     };

//     this.resources = {
//       ...options.resources,
//     };

//     this.element = options.element;
//     this.renderer = new THREE.WebGLRenderer({ canvas: this.element, antialias: true });
//     this.renderer.setClearColor(0x252525, 0);
//     this.renderer.setSize(this.state.dimensions.width, this.state.dimensions.height);
//     this.renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
//     this.camera = new THREE.PerspectiveCamera(45, this.state.dimensions.width / this.state.dimensions.height, 0.01, 1000);
//     this.camera.position.set(2, 2, 2);
//     this.camera.lookAt(new THREE.Vector3(0, 0, 0));
//     this.controls = new OrbitControls(this.camera, this.element);
//     this.scene = new THREE.Scene();
//     this.scene.environment = this.resources.environment;

//     // Sort children by name
//     this.resources.model.children = this.resources.model.children.sort((a, b) => {
//       return Number(a.userData.name) - Number(b.userData.name);
//     });

//     // console.log(this.resources.model.children);
//     // // // Add children one by one
//     // // children.forEach((child) => {
//     // //   console.log(child);
//     // //   // this.scene.add(child);
//     // // });
//     this.scene.add(this.resources.model);

//     const children = this.scene.children[0].children;
//     gsap.from(
//       children.map((child) => child.position),
//       { x: 0.0, y: (index) => (children.length - index) * -1, z: 0.0, stagger: -0.1, delay: 0.0 }
//     );
//     gsap.from(
//       this.scene.children[0].children.map((child) => child.scale),
//       { x: 0.0, y: 0.0, z: 0.0, stagger: -0.1, delay: 0.0 }
//     );
//   }

//   setSize(width, height) {
//     this.state.dimensions.width = width;
//     this.state.dimensions.height = height;
//     this.renderer.setSize(this.state.dimensions.width, this.state.dimensions.height);
//     this.camera.aspect = this.state.dimensions.width / this.state.dimensions.height;
//     this.camera.updateProjectionMatrix();
//   }

//   update() {
//     if (!this.isDragging) {
//       this.scene.rotation.y += 0.005;
//     }
//     this.controls.update();
//   }

//   render() {
//     this.renderer.render(this.scene, this.camera);
//   }

//   transition() {
//     const children = this.scene.children[0].children;
//     const position = children.map((child) => child.position);

//     this.tlTransition = new gsap.timeline();
//     this.tlTransition.to(position, { x: 0.0, y: -10.0, z: 0.0, stagger: -0.1 });
//     this.tlTransition.set(position, { x: 0.0, y: 10.0, z: 0.0 });
//     this.tlTransition.to(position, { x: 0.0, y: 0.0, z: 0.0, stagger: 0.1 });
//   }
// }

// const loaders = {
//   rgbe: new RGBELoader(),
//   gltf: new GLTFLoader(),
// };

// loaders.rgbe.load("./environment.hdr", (texture) => {
//   texture.mapping = THREE.EquirectangularReflectionMapping;

//   loaders.gltf.load("./model.glb", (model) => {
//     const resources = {
//       model: model.scene,
//       environment: texture,
//     };

//     const $canvas = document.querySelector('[data-select="canvas"]');
//     const $button = document.querySelector('[data-select="next"]');

//     const getDimensions = () => ({
//       width: window.innerWidth,
//       height: window.innerHeight,
//     });

//     const application = new Application({ element: $canvas, dimensions: getDimensions(), resources });

//     const handleResize = () => {
//       const dimensions = getDimensions();
//       application.setSize(dimensions.width, dimensions.height);
//       application.update();
//       application.render();
//     };

//     const handleTick = () => {
//       application.update();
//       application.render();
//     };

//     const handleClick = () => {
//       application.transition();
//     };

//     /**
//      *
//      * Events
//      */
//     window.addEventListener("resize", handleResize);
//     gsap.ticker.add(handleTick);
//     $button.addEventListener("click", handleClick);
//   });
// });
