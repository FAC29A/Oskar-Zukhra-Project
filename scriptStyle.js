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
const newSearch = document.getElementById("new-search-button");
const dividers = document.getElementsByClassName("divider");

function collapseForm() {
  collapsible.style.height = "0px";

  setTimeout(function () {
    collapsible.style.opacity = "0";
    newSearch.style.display = "block";
    collapsible.style.padding = "0";
  }, 1900);
}

function showForm() {
  collapsible.style.height = "350px";
  collapsible.style.opacity = "";
  newSearch.style.display = "none";
  collapsible.style.padding = "";
}

newSearch.addEventListener("click", showForm);
