import "./style.css";
import gsap from "gsap";
import Loader, { RESOURCE_TYPE } from "./components/Loader";
import WebGL from "./components/WebGL";
import Controller from "./components/Controller"; 

class Application {
  constructor(attributes = {}) {
    this.$element = attributes.element; // Root element of app
    this.setupRefs(); 
  }

  // Setting up PWA functionality, resources and setup components
  load = async (manifest = []) => {
    this.loader = new Loader();
    this.resources = await this.loader.load(manifest);
    this.setupComponents();
    this.setupEventListeners();
  };

  // Setting up references to HTML elements with data-select attribute
  setupRefs() {
    this.$refs = [...this.$element.querySelectorAll("[data-select]")].reduce((object, $node) => {
      object[$node.dataset.select] = $node;
      return object;
    }, {});
  }

  // Setting up application components by getting selectedOrder from local storage
  setupComponents() {
    const selectedOrder = localStorage.getItem('selectedOrder');
    const modelSrc = selectedOrder === '47719' ? '/model2.glb' : '/model.glb'; // As only 2 models done as of now, if not 47719, showcase model.glb

    // Initialise WebGL and Controller components
    this.components = {
      webgl: new WebGL({ element: this.$refs.canvas, resources: this.resources, modelSrc }),
      controller: new Controller({ element: this.$element }),
    };
  }

  // Setting up event listeners for the UI Interactions(Buttons mainly)
  setupEventListeners() {
    this.observer = new ResizeObserver(this.handleResize);
    this.observer.observe(this.$element);

    gsap.ticker.add(this.handleTick);
    // Add state listener when order card is selected
    this.components.controller.addEventListener("state", this.handleControllerChange);
    this.$refs.previous.addEventListener("click", this.handlePreviousClick);
    this.$refs.next.addEventListener("click", this.handleNextClick);
  }
  // Event handler for controller state changes
  handleControllerChange = (state) => {
    this.components.webgl.state.interactive = state.active;
  };
  // Event handler for resizing changes
  handleResize = () => {
    this.components.webgl.setSize(this.$element.clientWidth, this.$element.clientHeight);
  };
  // Event handler for animation updating
  handleTick = () => {
    this.components.webgl.update(this.components.controller.state.position);
    this.components.webgl.render();
  };
  // Event handler for previous button clicked
  handlePreviousClick = () => {
    this.components.webgl.previousGroup();
  };
  // Event handler for next button clicked
  handleNextClick = () => {
    this.components.webgl.nextGroup();
  };
}
// Initialize the Application class with the root HTML element
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
    src: localStorage.getItem('selectedOrder') === '47719' ? "/model2.glb" : "/model.glb", // Selecting model based on order selection
  },
]);
// Registering service worker for PWA functionality
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').then((registration) => {
      console.log('Service Worker registered with scope:', registration.scope);
    }).catch((error) => {
      console.log('Service Worker registration failed:', error);
    });
  });
}

const pausebtn = document.querySelector(".pause-button");
pausebtn.addEventListener("click", () => {
    window.location.href = `pause.html`;
  
});

