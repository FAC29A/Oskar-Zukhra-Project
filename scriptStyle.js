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
  helpButton.style.animation = "none";
  helpButton.style.transform = "translateY(-45px)";

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
  helpButton.style.transform = "translateY(0)";
}

newSearch.addEventListener("click", showForm);

// Generate random value for shake effect
const root = document.documentElement;

function applyRandom(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  let random = Math.floor(Math.random() * (max - min + 1)) + min + "px";
  root.style.setProperty("--random-int", random);
  return random;
}

setInterval(function () {
  applyRandom(-7, 7);
}, 100);

// Function to add an icon to a header cell
function addIconToHeader(header, iconClass, iconColor, marginLeft) {
  const icon = document.createElement("i");
  icon.className = iconClass;
  icon.style.color = iconColor;
  icon.style.marginLeft = marginLeft;
  header.appendChild(icon);
}

