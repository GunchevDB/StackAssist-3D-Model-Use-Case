import * as THREE from "three";
import { GLTFLoader, RGBELoader } from "three/examples/jsm/Addons.js";

// Getting models, textures and environment of blender export
export const RESOURCE_TYPE = {
  Model: "Resource/Type/Model",
  Texture: "Resource/Type/Texture",
  Environment: "Resource/Type/Environment",
};

// Promisifying the loader to return a promise, which will run other functions 
// and return to it when all the elements are loaded, in case of big model file sizes
const promisify = (Loader, props = {}) => {
  return new Promise((resolve, reject) => {
    const loader = new Loader();
    loader.load(props.src, resolve, undefined, reject);
  });
};
// Loader class to load the different types of resources 
class Loader {
  loaders = {
    [RESOURCE_TYPE.Model]: (props) => promisify(GLTFLoader, props),
    [RESOURCE_TYPE.Environment]: (props) => promisify(RGBELoader, props),
    [RESOURCE_TYPE.Texture]: (props) => promisify(THREE.TextureLoader, props),
  };

  // Load the manifest of resources
  async load(manifest = []) {
    const payload = await Promise.all(manifest.map(({ id, type, ...props }) => this.loaders[type](props)));
    return manifest.reduce((object, value, index) => {
      object[value.id] = payload[index];
      return object;
    }, {});
  }
}

export default Loader;