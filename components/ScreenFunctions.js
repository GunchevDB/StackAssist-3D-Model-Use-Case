import gsap from 'gsap';
import * as THREE from 'three';

// Updating progress bar progress based on group status and the length of the group. 
export function updateProgressBar(currentGroupIndex, groupsLength) {
      const progressBar = document.getElementById('progress-bar');
      const progress = ((currentGroupIndex + 1) / groupsLength) * 100; // multiplied by 100 for the percentage
      progressBar.style.width = `${progress}%`; // Basing width on the CSS using percentage from previous calculations
}
// Updating card content using the WebGL model Groups by icon, text and size/amount
export function updateCardContent(group) {
      const cardIcon = document.querySelector('.card__icon .fa');
      const cardText = document.querySelector('.card__text h3');
      const cardSize = document.querySelector('.card__size');
    
      cardIcon.className = `fa ${group.icon}`;
      cardText.textContent = group.name;
      cardSize.textContent = group.size;
}
// Wiggle animation of pallet as soon as it loads to showcase 360 degree rotation using GSAP
export function initialWiggleAnimation(elements) {
      const icon = document.getElementById('icon-360'); // Launch animation with 360 icon
      icon.style.opacity = 1;
    
      const timeline = gsap.timeline({
        onComplete: () => {
          icon.style.opacity = 0; // Hide icon upon animation completion
        }
      });
      // Rotating whole model by 15 degrees left and right for total of 2 seconds
      timeline.to(elements.rotation, { y: THREE.MathUtils.degToRad(15), duration: 0.5, ease: "power2.inOut" })
              .to(elements.rotation, { y: 0, duration: 0.5, ease: "power2.inOut" })
              .to(elements.rotation, { y: THREE.MathUtils.degToRad(-15), duration: 0.5, ease: "power2.inOut" })
              .to(elements.rotation, { y: 0, duration: 0.5, ease: "power2.inOut" });
}