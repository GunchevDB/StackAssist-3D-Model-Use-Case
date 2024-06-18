import { EventDispatcher } from "three";

// Controller class to handle dragging events
class Controller extends EventDispatcher {
  constructor(attributes = {}) {
    super();

    this.state = {
      dragging: false, // Disable dragging 
      offset: 0,
      position: 0,
    };

    this.$element = attributes.element;
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Add touch(mobile) and mouse event listeners
    this.$element.addEventListener("touchstart", this.handleTouchStart);
    this.$element.addEventListener("touchmove", this.handleTouchMove);
    this.$element.addEventListener("touchend", this.handleTouchEnd);
    this.$element.addEventListener("mousedown", this.handleMouseDown);
    this.$element.addEventListener("mousemove", this.handleMouseMove);
    this.$element.addEventListener("mouseup", this.handleMouseUp);
  }

  // When trying to drag, enable dragging and correctly update positiong if dragging
  dragStart = (pixels) => {
    this.dispatchEvent({ type: "state", active: true });
    this.state.dragging = true;
    this.state.offset = pixels - this.state.position;
  };

  // Update the position if dragging
  dragging = (pixels) => {
    if (this.state.dragging) {
      this.state.position = pixels - this.state.offset;
    }
  };
  // Dispatch an event to deactivate dragging if stopped
  dragStop = () => {
    this.dispatchEvent({ type: "state", active: false });
    this.state.dragging = false;
  };
  // Handle the touch start event
  handleTouchStart = (event) => {
    this.dragStart(event.touches[0].clientX);
  };
  // Handle touch move event
  handleTouchMove = (event) => {
    this.dragging(event.touches[0].clientX);
  };
  // Handle touch end event
  handleTouchEnd = () => {
    this.dragStop();
  };
  // Mouse down event
  handleMouseDown = (event) => {
    this.dragStart(event.clientX);
  };
  // Mouse move event
  handleMouseMove = (event) => {
    this.dragging(event.clientX);
  };
  // Mouse up event
  handleMouseUp = (event) => {
    this.dragStop();
  };
}

export default Controller;