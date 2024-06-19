# StackAssist ThreeJS

Our version of StackAssist makes use of ThreeJS and OrbitControls in order to have a 3D representation of the pallet model, using a hardcoded Blender model to inspect stacking instructions which are split in a step by step for easier understanding. Additionally the user can choose from a different amount of orders and follow the location of the box needed to be stacked on the pallet.

## Getting started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

## Prerequisites

Ensure you have the following installed on your local machine:

- [Node.js](https://nodejs.org/en) (v14 or higher)
- [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
- [git](https://www.git-scm.com/downloads)

## Installation

1. Clone the repository

```git clone https://git.fhict.nl/I450970/stackassist-example.git```

2. Navigate to the project directory 

```cd stackassist-example```

3. Install the dependencies

```npm install```


## Running the application
 
To run the application in development mode

```npm run dev```

This command will start a local development server, typically accessible at `https://localhost:5173/`.

## Testing as a Progressive Web App(PWA)

To test the application as a PWA, follow these steps:

1. Build the project

```npm run build```

2. Serve the built project

```npm run serve```

The application will be hosted on an available port, most likely at `https://localhost:5173/`

# Deployment

You can also access the deployed version of the application on Netlify:

[Stack Assist on Netlify](https://boxes-stack-threejs.netlify.app/)

# Project Structure

The project's main components are organized as follows:

- `src/`: Contains the source code of the project.
- `components/`: Contains reusable components like `WebGL`, `Controller`, `Loader`, etc.
- `styles/`: Contains the CSS files for styling the application.
- `index.html`: The main HTML file.
- `main.js`: The entry point of the application.

## Component Explanation

- `ScreenFunctions.js`: Includes most screen functions that have something to do in the Pallet Screen - Progress Bar update based on steps, Wiggle animation when page loaded to showcase 360 degree rotation and updating card content based on step(Shows box location, name, amount)
- `Loader.js`: Loads 3D Model, Environment and the manifest for the PWA application only returning models when everything is loaded.
- `Controller.js`: Mouse events such as click, drag and mouse movement for Desktop and Mobile in order to make sure 3D ThreeJS model is functional and can be rotated.
- `Marquee.js`: Not fully used right now, but is a Parallax setup class that can handle scrolling text in case we add text in ThreeJS Model
- `WebGL.js`: Used for adding the 3D model to the screen with all the camera control functions, different models based on Order ID, splitting the Pallet 3D Model in a Step By Step with highlights and Next and Previous buttons. Also Screen scaling that will fix 3D Model based on the view of the device(Vertical or Landscape).
- `main.js`: Setting up PWA functionalities, getting Selected order from localStorage in order to load correct model and pass into `WebGL.js` for the 3D Model. Event listeners such as Previous and Next buttons, Resizing window or changing the view of the device(Vertical or Landscape) and loading model based on selectedOrder which will be stored to localStorage
- `orders.js`: Select event listener for order card and event listener for Start button when a card has been selected, will get selectedOrder variable ID from localStorage. 

## Additional important files

- `vite.config.js`: As Web app uses vite for a developmental environment, vite config is adding the settings for the PWA functionalities and can be used to import vite related plugins.
- `service.worker.js`: Essential for PWA application, will install it, save all files to localStorage so app can be tested without an internet connection and will fetch newly added data to be saved in localStorage in case it's updated from the "Admin" side.
- `manifest.json`: Although vite config acts as a manifest, if having to build the app and then serve, manifest.json is needed. Added because of manifest not working on Netlify when building and serving.
- `/public/model(2 or 3).glb` - 3D Models exported from blender as a .glb file which are what makes the pallet design change. 
- `/public/environment.hdr` - Environment for the pallet which is a white screen to make sure the pallet is fully lighted up and doesn't create any shadows based on ThreeJS camera point of view.

# Key Features

- **Three.js Integration**: Use of Three.js for 3D rendering and animations.
- **Progressive Web App**: Installable as an application on mobile devices, used from us for an easier testing experience.
- **Responsive Design**: Since potential clients work with different dimensions of their devices, we ensure it scales correctly on any device(mobile, tablet or desktop).
- **Interactive Controls**: Using OrbitControls, which is a ThreeJS add-on for an interactive and smooth orbit around the 3D Model.

# Contacts

**Project Members**

- Dimitar Gunchev
- Gabriela Simeonova
- Tsveta Pandurska
- Majid Al-Jahwari
- Abdullah Al Kindi

