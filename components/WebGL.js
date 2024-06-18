import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import gsap from "gsap";
import { updateProgressBar, updateCardContent, initialWiggleAnimation } from "./ScreenFunctions";

class WebGL {
  constructor(attributes = {}) {
    this.state = {
      interactive: false,
      rotation: 0.0,
    };
    // Loading all resources and setting the camera with ThreeJS
    this.resources = attributes.resources;
    this.modelSrc = attributes.modelSrc;
    this.resources.environment.mapping = THREE.EquirectangularReflectionMapping;
    this.element = attributes.element;
    this.renderer = new THREE.WebGLRenderer({ canvas: this.element, antialias: true });
    this.renderer.setClearColor(0x252525, 0);
    this.renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
    this.camera = new THREE.PerspectiveCamera(45, 1, 1, 2000);
    this.scene = new THREE.Scene();
    this.scene.environment = this.resources.environment;

    // Orbit controls for moving the camera left/right
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.25;
    this.controls.rotateSpeed = 0.1; // Reduce rotation speed
    this.controls.screenSpacePanning = false;
    this.controls.maxPolarAngle = Math.PI / 2;
    this.controls.minDistance = 1;
    this.controls.maxDistance = 3;

    // Sorting of children elements by numbers, since they're 0 to 7/8 in blender file
    this.elements = new THREE.Group();
    this.resources.model.scene.children = this.resources.model.scene.children.sort((a, b) => Number(a.userData.name) - Number(b.userData.name));
    this.elements.add(this.resources.model.scene);
    this.scene.add(this.elements);

    // Loading model groups lines 57 and 68 based on model .glb file
    this.currentGroupIndex = 0;
    this.groups = this.modelSrc === '/model2.glb' ? this.getModel2Groups() : this.getModel1Groups();

    this.initialPositions = this.elements.children[0].children.map(child => child.position.clone());
    this.initialColors = this.elements.children[0].children.map(child => child.material.color.clone());
    // Beginning with each group based on model choice
    this.previousGroupIndexes = new Set();
    this.showGroup(this.currentGroupIndex, true);
    // Wiggle animation beginning
    initialWiggleAnimation(this.elements);

    this.adjustCameraAndControls(window.innerWidth, window.innerHeight);

    window.addEventListener('resize', () => this.setSize(window.innerWidth, window.innerHeight));
  }
  // Array of models split by children with names, icon and size/amount
  getModel1Groups() {
    return [
      { elements: [0], name: "Euro palette", icon: "fa-pallet", size: "80 x 120 x 14" },
      { elements: [0, 1], name: "AB-12-15", icon: "fa-location-dot", size: "x1" },
      { elements: [0, 1, 2, 3], name: "AB-12-23", icon: "fa-location-dot", size: "x2" },
      { elements: [0, 1, 2, 3, 4, 5], name: "AB-12-45", icon: "fa-location-dot", size: "x2" },
      { elements: [0, 1, 2, 3, 4, 5, 6], name: "AB-12-18", icon: "fa-location-dot", size: "x1" },
      { elements: [0, 1, 2, 3, 4, 5, 6, 7], name: "AB-12-34", icon: "fa-location-dot", size: "x1" },
    ];
  }
  // Array of models 2 
  getModel2Groups() {
    return [
      { elements: [0], name: "Euro palette", icon: "fa-pallet", size: "80 x 120 x 14" },
      { elements: [0, 1], name: "AB-16-11", icon: "fa-location-dot", size: "x1" },
      { elements: [0, 1, 2, 3], name: "AB-12-29", icon: "fa-location-dot", size: "x2" },
      { elements: [0, 1, 2, 3, 4], name: "AB-23-45", icon: "fa-location-dot", size: "x1" },
      { elements: [0, 1, 2, 3, 4, 5, 6], name: "AB-12-06", icon: "fa-location-dot", size: "x1" },
      { elements: [0, 1, 2, 3, 4, 5, 6, 7, 8], name: "AB-12-13", icon: "fa-location-dot", size: "x2" },
    ];
  }
  // Scaling for screen based on vertical or landscape view(Could also be tablet, phone, desktop)
  setSize(width, height) {
    this.renderer.setSize(width, height);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.adjustCameraAndControls(width, height);
  }
  // Adjusting camera distance based on landscape or vertical view
  adjustCameraAndControls(width, height) {
    if (width > height) {
      this.camera.position.set(2, 2, 1);
      this.camera.fov = 37;
    } else {
      this.camera.position.set(2, 2, 2);
      this.camera.fov = 65;
    }
    this.camera.updateProjectionMatrix();
    this.controls.update();
  }

  // Rotating pallet controls with GSAP and additional OrbitControls above
  update(rotation) {
    this.state.rotation = gsap.utils.interpolate(this.state.rotation, rotation, 0.1) * 0.1;
    this.scene.rotation.y = this.state.rotation;
    this.controls.update();
  }

  //  Rendering 3D model
  render() {
    this.renderer.render(this.scene, this.camera);
  }

  // Highlighting of newly added elements by next step in green
  highlight(child) {
    if (child && child.material) {
      child.material.color.set(0x00ff00);
    } else {
      console.warn('Cant highlight child:', child);
    }
  }
  // Removing highlight in case next button is pressed in order to highlight newly added child
  resetHighlights() {
    const children = this.elements.children[0].children;
    children.forEach((child, index) => {
      child.material.color.copy(this.initialColors[index]);
    });
  }

  // Show group 1 or 2 based on model.glb or model2.glb selected
  showGroup(groupIndex, initial = false) {
    const children = this.elements.children[0].children;
    const group = this.groups[groupIndex].elements;
    const newIndexes = new Set(group);

    if (!initial) {
      this.resetHighlights();
    }

    children.forEach((child, index) => {
      if (newIndexes.has(index)) {
        child.visible = true;
        if (!initial && !this.previousGroupIndexes.has(index) && index !== 0) {
          const targetY = this.initialPositions[index].y;
          child.position.y = targetY + 1;
          gsap.to(child.position, { y: targetY, duration: 1.5, ease: "power2.out" });
          gsap.fromTo(child.scale, { x: 1.2, y: 1.2, z: 1.2 }, { x: 1, y: 1, z: 1, duration: 1.5, ease: "power2.out" });
          this.highlight(child);
        } else if (initial) {
          child.position.copy(this.initialPositions[index]);
        }
      } else if (!initial && this.previousGroupIndexes.has(index) && index !== 0) {
        const targetY = this.initialPositions[index].y + 1;
        gsap.to(child.position, { y: targetY, duration: 1, ease: "power2.in", onComplete: () => { child.visible = false; } });
      } else {
        child.visible = false;
      }
    });

    if (!initial) {
      this.previousGroupIndexes.forEach(index => {
        if (!newIndexes.has(index) && index !== 0) {
          children[index].material.color.copy(this.initialColors[index]);
        }
      });
      group.forEach(index => {
        if (!this.previousGroupIndexes.has(index) && index !== 0) {
          this.highlight(children[index]);
        }
      });
    }

    this.previousGroupIndexes = newIndexes;
    updateProgressBar(this.currentGroupIndex, this.groups.length);
    updateCardContent(this.groups[groupIndex]);
  }

  // Next group shown when button pressed
  nextGroup() {
    if (this.currentGroupIndex < this.groups.length - 1) {
      this.currentGroupIndex++;
      this.showGroup(this.currentGroupIndex);
    }
  }

  // Previous group shown when button pressed
  previousGroup() {
    if (this.currentGroupIndex > 0) {
      this.currentGroupIndex--;
      this.showGroup(this.currentGroupIndex);
    }
  }
}

export default WebGL;
