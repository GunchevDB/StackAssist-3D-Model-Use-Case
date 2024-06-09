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
