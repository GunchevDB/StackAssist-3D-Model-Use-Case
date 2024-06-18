import "./style.css";

document.addEventListener("DOMContentLoaded", () => {
  const orderCards = document.querySelectorAll(".order-card");
  let selectedOrder = null;

  orderCards.forEach(card => {
    card.addEventListener("click", () => {
      orderCards.forEach(c => c.classList.remove("selected"));
      card.classList.add("selected");
      selectedOrder = card.dataset.order;
    });
  });

  const startButton = document.querySelector(".start-button");
  startButton.addEventListener("click", () => {
    if (selectedOrder) {
      window.location.href = `stack_screen.html?order=${selectedOrder}`;
    } else {
      alert("Please select an order first.");
    }
  });

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js').then((registration) => {
        console.log('Service Worker registered with scope:', registration.scope);
      }).catch((error) => {
        console.log('Service Worker registration failed:', error);
      });
    });
  }
});

const continueBtn = document.querySelector(".continuebtn");
continueBtn.addEventListener("click", () => {
    window.location.href = `stack_screen.html`;
});


const exitroundbtn = document.querySelector(".exitroundbtn");
exitroundbtn.addEventListener("click", () => {
    window.location.href = `index.html`;
});

const logoutbtn = document.querySelector(".logoutbtn");
logoutbtn.addEventListener("click", () => {
window.alert("Cannot log out; go back to work!")  
});
import "./style.css";

document.addEventListener("DOMContentLoaded", () => {
  const orderCards = document.querySelectorAll(".order-card");
  let selectedOrder = null; // Selected order variable

  // Add click event listeners to every order card, where the selected class is added and CSS changes the selected card to Blue background
  orderCards.forEach(card => {
    card.addEventListener("click", () => {
      orderCards.forEach(c => c.classList.remove("selected"));
      card.classList.add("selected");
      selectedOrder = card.dataset.order;
    });
  });
  // Event listener for click of start button, only when order has been selected
  const startButton = document.querySelector(".start-button");
  startButton.addEventListener("click", () => {
    if (selectedOrder) {
      // If order is selected, save to localStorage and put user to stacking screen with model based on order ID
      localStorage.setItem('selectedOrder', selectedOrder);
      window.location.href = 'stack_screen.html';
    } else {
      alert("Please select an order first.");
    }
  });
  // Register service worker for PWA functionality
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js').then((registration) => {
        console.log('Service Worker registered with scope:', registration.scope);
      }).catch((error) => {
        console.log('Service Worker registration failed:', error);
      });
    });
  }
});


