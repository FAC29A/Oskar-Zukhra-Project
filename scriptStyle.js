// Show slider radius value
document.addEventListener("DOMContentLoaded", function () {
  const radiusInput = document.getElementById("radius");
  const radiusLabel = document.getElementById("radius-value");

  radiusLabel.textContent = `${radiusInput.value} km`;

  radiusInput.addEventListener("input", () => {
    radiusLabel.textContent = `${radiusInput.value} km`;
  });
});
