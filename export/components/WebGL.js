import * as THREE from "three";
import gsap from "gsap";

class WebGL {
  constructor(attributes = {}) {
    this.state = {
      interactive: false,
      spin: 0.0,
      rotation: 0.0,
    };
    this.resources = attributes.resources;
    this.resources.environment.mapping = THREE.EquirectangularReflectionMapping;
    this.element = attributes.element;
    this.renderer = new THREE.WebGLRenderer({ canvas: this.element, antialias: true });
    this.renderer.setClearColor(0x252525, 0);
    this.renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
    this.camera = new THREE.PerspectiveCamera(45, 1, 0.01, 1000);
    this.camera.position.set(2, 2, 2);
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    this.scene = new THREE.Scene();
    this.scene.environment = this.resources.environment;

    // Sort children by name
    this.elements = new THREE.Group();
    this.resources.model.scene.children = this.resources.model.scene.children.sort((a, b) => Number(a.userData.name) - Number(b.userData.name));
    this.elements.add(this.resources.model.scene);
    this.scene.add(this.elements);

    this.transitionInit();
    this.timeline = this.transitionIn();

    // // And add element to scene
    // this.elements.forEach((element) => {
    //   console.log(element);
    //   this.scene.add(element);
    // });
    // this.elements.forEach((element) => {
    //   console.log(element);
    //   this.scene.add(element);
    // });

    // console.log(this.element);

    // console.log(this.resources.model.children);
    // // // Add children one by one
    // // children.forEach((child) => {
    // //   console.log(child);
    // //   // this.scene.add(child);
    // // });

    // const children = this.elements.children;
    // gsap.from(
    //   children.map((child) => child.position),
    //   { x: 0.0, y: (index) => (children.length - index) * -1, z: 0.0, stagger: -0.1, delay: 0.0 }
    // );
    // gsap.from(
    //   this.scene.children[0].children.map((child) => child.scale),
    //   { x: 0.0, y: 0.0, z: 0.0, stagger: -0.1, delay: 0.0 }
    // );
  }

  setSize(width, height) {
    this.renderer.setSize(width, height);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  update(rotation) {
    if (!this.state.interactive) {
      this.state.spin += 0.005;
    }

    this.state.rotation = gsap.utils.interpolate(this.state.rotation, rotation, 0.1) * 0.1;
    this.scene.rotation.y = this.state.rotation + this.state.spin;
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  transitionInit() {
    const children = this.elements.children[0].children;
    const position = children.map((child) => child.position);
    const scale = children.map((child) => child.scale);

    gsap.set(position, { x: 0.0, y: (index) => (children.length - index) * -1, z: 0.0 });
    gsap.set(scale, { x: 0.0, y: 0.0, z: 0.0 });
  }

  transitionIn() {
    const children = this.elements.children[0].children;
    const position = children.map((child) => child.position);
    const scale = children.map((child) => child.scale);
    const stagger = -0.1;
    const duration = 1.0;
    const ease = "power4.out";

    const timeline = gsap.timeline();
    timeline.to(position, { x: 0, y: 0, z: 0, stagger, duration, ease }, 0.0);
    timeline.to(scale, { x: 1, y: 1, z: 1, stagger, duration, ease }, 0.0);
    return timeline;
  }

  transitionOut() {
    const children = this.elements.children[0].children;
    const position = children.map((child) => child.position);
    const scale = children.map((child) => child.scale);
    const stagger = -0.1;
    const duration = 1.0;
    const ease = "power4.in";

    const timeline = gsap.timeline();
    timeline.to(position, { x: 0, y: 3, z: 0.0, stagger, duration, ease }, 0.0);
    // timeline.to(scale, { x: 0.0, y: 0.0, z: 0.0, stagger, duration, ease }, 0.0);
    return timeline;
  }

  transition() {
    const children = this.elements.children[0].children;
    const position = children.map((child) => child.position);
    const scale = children.map((child) => child.scale);

    // gsap.from(
    //   children.map((child) => child.position),
    //   { x: 0.0, y: (index) => (children.length - index) * -1, z: 0.0, stagger: -0.1, delay: 0.0 }
    // );
    // gsap.from(
    //   this.scene.children[0].children.map((child) => child.scale),
    //   { x: 0.0, y: 0.0, z: 0.0, stagger: -0.1, delay: 0.0 }
    // );

    if (this.timeline) {
      this.timeline.kill();
    }

    gsap.to(this.elements.rotation, { y: this.elements.rotation.y + Math.PI * 2, duration: 2.0 + this.elements.children.length * 0.2, ease: "power2.inOut" });

    this.timeline = new gsap.timeline();

    this.timeline.add(this.transitionOut());
    this.timeline.add(() => this.transitionInit());
    this.timeline.add(this.transitionIn());
  }
}

export default WebGL;
