// Show slider radius value
const radiusInput = document.getElementById("radius");
const radiusLabel = document.getElementById("radius-value");

radiusLabel.textContent = `${radiusInput.value} km`;

radiusInput.addEventListener("input", () => {
  radiusLabel.textContent = `${radiusInput.value} km`;
});

// Modal window show and hide
const modals = document.querySelectorAll(".modal");
const helpButton = document.getElementById("help-button");
const helpModal = document.getElementById("help-window");

function showHelpModal() {
  modals.forEach((modal) => {
    helpModal.style.display = "block";
  });
}

function hideModal() {
  modals.forEach((modal) => {
    modal.style.display = "none";
  });
}

helpButton.addEventListener("click", showHelpModal);

modals.forEach((modal) => {
  modal.querySelector(".close").addEventListener("click", function () {
    hideModal();
  });

  window.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      hideModal();
    }
  });
});

// Hide form
const collapsible = document.getElementById("form-container");
const existingTable = document.getElementById("earthquakeTable");

function collapseForm() {
  collapsible.remove();
}
